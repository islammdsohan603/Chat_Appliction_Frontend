import { useState, useRef, useCallback, useEffect } from "react";

const DEFAULT_SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

/**
 * Custom hook for real-time streaming AI chat (similar to ChatGPT) using Server-Sent Events (SSE).
 *
 * @param {Object} options
 * @param {string} [options.endpoint] - API endpoint for streaming (default: /api/ai/chat/stream)
 * @param {Array} [options.initialMessages] - Initial conversation messages
 * @param {string} [options.systemInstruction] - Optional system instruction for the AI
 * @param {string} [options.model] - Gemini model identifier (default: "gemini-2.5-flash")
 * @param {Function} [options.onError] - Error callback
 * @param {Function} [options.onFinish] - Callback fired when stream finishes
 */
export const useAiChat = ({
  endpoint = `${DEFAULT_SERVER_URL}/api/ai/chat/stream`,
  initialMessages = [],
  systemInstruction,
  model = "gemini-2.5-flash",
  onError,
  onFinish,
} = {}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
   * Send a prompt and stream the AI response
   */
  const sendMessage = useCallback(
    async (promptOverride) => {
      const promptText = (promptOverride !== undefined ? promptOverride : input).trim();
      if (!promptText || isLoading || isStreaming) return;

      // Abort any ongoing request
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

      // Clear input and append messages
      setInput("");
      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: promptText,
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
          // User aborted the stream manually
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

        // Update assistant message to display error
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
    [endpoint, input, isLoading, isStreaming, messages, model, systemInstruction, onError, onFinish]
  );

  const clearMessages = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
  }, [stop]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    stop,
    isLoading,
    isStreaming,
    error,
    clearMessages,
    setMessages,
  };
};

export default useAiChat;
