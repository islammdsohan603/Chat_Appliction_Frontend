import { useRef, useEffect, useCallback } from "react";
import { useAiChat } from "../../customHooks/useAiChat";
import {
  FiSend,
  FiImage,
  FiUser,
  FiCpu,
  FiSquare,
  FiPlus,
  FiTrash2,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

/**
 * Production-ready AI Chatbot Component for Nexora AI
 * Features:
 * - Single, unified input bar at the bottom
 * - Multimodal image attachment with live preview & in-bubble display
 * - Automatic database persistence of user prompt, image, and AI responses under conversations
 * - Real-time SSE streaming with Gemini 2.5 Flash
 */
export const AiChatBox = ({
  conversationId = null,
  activeConversation = null,
  onSessionCreated,
  onConversationUpdated,
  onNewChat,
  onDeleteConversation,
  systemInstruction = "You are Nexora AI, a brilliant, helpful, and concise AI assistant.",
  model = "gemini-2.5-flash",
  className = "",
}) => {
  const {
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
  } = useAiChat({
    conversationId,
    systemInstruction,
    model,
    onSessionCreated,
    onConversationUpdated,
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom on new tokens or messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-adjust textarea height
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 24), 160)}px`;
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    adjustHeight();
  };

  // Handle image selection & convert to base64
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        previewUrl,
        base64: reader.result,
      });
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if ((!input.trim() && !selectedImage) || isLoading || isStreaming) return;

    sendMessage();

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full max-w-4xl mx-auto rounded-2xl bg-white/90 dark:bg-[#0a0f2a]/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl overflow-hidden font-inter ${className}`}
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-500/10 bg-white/40 dark:bg-[#111840]/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-0.5 shadow-md shadow-purple-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0d1230] rounded-[10px] flex items-center justify-center">
              <FiCpu className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                {activeConversation?.title || "Nexora AI"}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 flex items-center gap-1 shrink-0">
                <IoSparkles className="w-2.5 h-2.5" />
                Gemini
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {isStreaming
                ? "Streaming response..."
                : isLoading
                ? "Thinking..."
                : "Real-time AI Chat & Vision"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {conversationId && (
            <button
              type="button"
              onClick={onNewChat}
              title="Start a new chat"
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 transition-all text-xs flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          {conversationId && onDeleteConversation && (
            <button
              type="button"
              onClick={() => onDeleteConversation(conversationId)}
              title="Delete this conversation"
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs cursor-pointer"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Message View ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {isHistoryLoading ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            Loading conversation history...
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg">
              <IoSparkles className="w-7 h-7 text-purple-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                How can I assist you today?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Type a prompt, attach an image for visual analysis, and receive instant, real-time streamed responses.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md pt-2">
              {[
                "Explain quantum computing simply",
                "How do Server-Sent Events (SSE) work?",
                "Analyze code architecture for clean apps",
                "Brainstorm 3 tech startup ideas",
              ].map((starter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="text-left text-xs p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/15 hover:border-purple-500/30 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  {starter} →
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md">
                    <FiCpu className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-purple-900/20"
                      : "bg-white dark:bg-[#111840] border border-purple-500/15 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm"
                  }`}
                >
                  {/* Uploaded Image Display */}
                  {msg.imageUrl && (
                    <div className="mb-2.5 overflow-hidden rounded-xl border border-white/20 dark:border-purple-500/20">
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded preview"
                        className="max-h-64 w-full object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content || (msg.isStreaming ? (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                        Generating response...
                      </span>
                    ) : null)}

                    {/* Real-time Blinking Cursor */}
                    {msg.isStreaming && msg.content && (
                      <span className="inline-block w-2 h-4 ml-0.5 bg-purple-400 animate-pulse align-middle" />
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-300">
                    <FiUser className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Error notification banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Single Unified Input Bar at the Bottom ── */}
      <div className="p-3 sm:p-4 border-t border-purple-500/10 bg-white/60 dark:bg-[#0d1230]/70 backdrop-blur-md shrink-0">
        {/* Hidden Image File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Selected Image Attachment Preview Chip */}
        {selectedImage && (
          <div className="mb-2.5 inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-purple-50 dark:bg-[#171e4a] border border-purple-300/50 dark:border-purple-500/30 shadow-xs animate-in fade-in zoom-in-95 duration-150">
            <img
              src={selectedImage.previewUrl}
              alt="Attachment thumbnail"
              className="w-8 h-8 rounded-lg object-cover border border-purple-500/30"
            />
            <div className="flex flex-col min-w-0 max-w-[160px] sm:max-w-[220px]">
              <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                {selectedImage.name}
              </span>
              <span className="text-[10px] text-slate-400">{selectedImage.size}</span>
            </div>
            <button
              type="button"
              onClick={removeSelectedImage}
              title="Remove image"
              className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-1 cursor-pointer"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Unified Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(e);
          }}
          className="relative flex items-center rounded-2xl bg-white/90 dark:bg-[#111840]/90 border border-purple-500/25 focus-within:border-purple-500/60 shadow-inner transition-all px-2 py-1.5"
        >
          {/* Image Upload Action Trigger */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach an image"
            disabled={isLoading || isStreaming}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-500/15 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            <FiImage className="w-5 h-5" />
          </button>

          {/* Prompt Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "AI is streaming response..."
                : selectedImage
                ? "Add a prompt or question about this image..."
                : "Ask anything (Press Enter to send)..."
            }
            disabled={isLoading || isStreaming}
            className="flex-1 bg-transparent px-2.5 py-1 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm outline-none resize-none leading-relaxed min-h-[24px] max-h-[160px] overflow-y-auto no-scrollbar"
          />

          {/* Action Trigger: Send or Stop Button */}
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {isStreaming || isLoading ? (
              <button
                type="button"
                onClick={stop}
                title="Stop generating"
                className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <FiSquare className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() && !selectedImage}
                title="Send message"
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  input.trim() || selectedImage
                    ? "bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/30 hover:scale-105 active:scale-95"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50"
                }`}
              >
                <FiSend className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiChatBox;
