import { useState, useRef, useCallback, useEffect } from "react";

const DEFAULT_SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

/**
 * Custom hook for real-time streaming AI chat (similar to ChatGPT) using Server-Sent Events (SSE)
 * with multimodal image attachment and automatic database history synchronization.
 */
export const useAiChat = ({
  endpoint = `${DEFAULT_SERVER_URL}/api/ai/chat/stream`,
  historyEndpoint = `${DEFAULT_SERVER_URL}/api/ai/history`,
  initialMessages = [],
  systemInstruction,
  model = "gemini-2.5-flash",
  onError,
  onFinish,
} = {}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // { file, previewUrl, base64 }
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Load chat history from database on mount
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const response = await fetch(historyEndpoint, {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item._id,
            role: item.role,
            content: item.prompt,
            imageUrl: item.imageUrl,
            createdAt: item.createdAt,
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.warn("Could not load AI chat history:", err);
      } finally {
        if (isMounted) {
          setIsHistoryLoading(false);
        }
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [historyEndpoint]);

  // Cleanup abort controller and image preview on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  /**
   * Stop current streaming generation
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  /**
   * Send a prompt and optional image, streaming the AI response
   */
  const sendMessage = useCallback(
    async (promptOverride, imageOverride) => {
      const promptText = (promptOverride !== undefined ? promptOverride : input).trim();
      const imagePayload = imageOverride !== undefined ? imageOverride : selectedImage;

      if ((!promptText && !imagePayload) || isLoading || isStreaming) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setError(null);
      setIsLoading(true);
      setIsStreaming(false);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: promptText,
        imageUrl: imagePayload?.base64 || imagePayload?.previewUrl || null,
        createdAt: new Date().toISOString(),
      };

      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantPlaceholder = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };

      // Clear input and attachments
      setInput("");
      setSelectedImage(null);
      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            prompt: promptText,
            imageUrl: imagePayload?.base64 || null,
            messages: [...messages, userMessage],
            systemInstruction,
            model,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("ReadableStream not supported by response.");
        }

        setIsLoading(false);
        setIsStreaming(true);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;

            const dataContent = trimmed.replace(/^data:\s*/, "");
            if (dataContent === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(dataContent);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulatedContent += parsed.text;
                const currentText = accumulatedContent;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: currentText, isStreaming: true }
                      : msg
                  )
                );
              }
            } catch (jsonErr) {
              if (jsonErr.message && jsonErr.message !== "Unexpected end of JSON input") {
                console.warn("SSE parse error:", jsonErr.message);
              }
            }
          }
        }

        // Finalize assistant message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent, isStreaming: false }
              : msg
          )
        );

        onFinish?.({
          id: assistantMessageId,
          role: "assistant",
          content: accumulatedContent,
        });
      } catch (err) {
        if (err.name === "AbortError") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          return;
        }

        console.error("AI Chat stream error:", err);
        const errMsg = err.message || "Something went wrong while generating response.";
        setError(errMsg);
        onError?.(err);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: accumulatedContent
                    ? `${msg.content}\n\n*[Generation stopped due to error: ${errMsg}]*`
                    : `⚠️ Error: ${errMsg}`,
                  isStreaming: false,
                  hasError: true,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [endpoint, input, selectedImage, isLoading, isStreaming, messages, model, systemInstruction, onError, onFinish]
  );

  /**
   * Clear messages both locally and from database
   */
  const clearMessages = useCallback(async () => {
    stop();
    setMessages([]);
    setError(null);
    setSelectedImage(null);

    try {
      await fetch(historyEndpoint, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to delete chat history:", err);
    }
  }, [stop, historyEndpoint]);

  return {
    messages,
    input,
    setInput,
    selectedImage,
    setSelectedImage,
    sendMessage,
    stop,
    isLoading,
    isStreaming,
    isHistoryLoading,
    error,
    clearMessages,
    setMessages,
  };
};

export default useAiChat;
