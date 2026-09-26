import { useRef, useEffect } from "react";
import { useAiChat } from "../../customHooks/useAiChat";
import {
  HiOutlineSparkles,
  HiArrowUp,
  HiStop,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

/**
 * Production-ready AI Chat component with real-time streaming output (like ChatGPT).
 * Uses Google Gen AI SDK via backend SSE endpoint.
 */
export const AiChatBox = ({
  systemInstruction = "You are Nexora AI, a brilliant, helpful, and concise AI assistant.",
  model = "gemini-2.5-flash",
  className = "",
}) => {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    stop,
    isLoading,
    isStreaming,
    error,
    clearMessages,
  } = useAiChat({ systemInstruction, model });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom as tokens stream in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full max-w-4xl mx-auto rounded-2xl bg-white/80 dark:bg-[#0a0f2a]/90 backdrop-blur-xl border border-purple-500/20 shadow-2xl overflow-hidden font-inter ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/10 bg-white/40 dark:bg-[#111840]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-purple-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d1230] rounded-[10px] flex items-center justify-center">
              <HiOutlineSparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Nexora AI
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300">
                Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isStreaming
                ? "Streaming response..."
                : isLoading
                ? "Thinking..."
                : "Real-time AI Chat"}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearMessages}
            title="Clear chat"
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs flex items-center gap-1.5"
          >
            <HiOutlineTrash className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg">
              <HiOutlineSparkles className="w-8 h-8 text-purple-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                How can I assist you today?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Experience instant, real-time streamed responses powered by the Google Gen AI SDK.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md pt-2">
              {[
                "Explain quantum computing simply",
                "Write a clean React hook for SSE",
                "Brainstorm 3 startup ideas for 2026",
                "Debug a Node.js memory leak",
              ].map((starter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="text-left text-xs p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/15 hover:border-purple-500/30 text-slate-700 dark:text-slate-300 transition-all"
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
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md">
                    <HiOutlineSparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-purple-900/20"
                      : "bg-white dark:bg-[#111840] border border-purple-500/15 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content || (msg.isStreaming ? (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                        Thinking...
                      </span>
                    ) : null)}

                    {/* Blinking streaming cursor */}
                    {msg.isStreaming && msg.content && (
                      <span className="inline-block w-2 h-4 ml-0.5 bg-purple-400 animate-pulse align-middle" />
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/30 flex items-center justify-center shrink-0 text-xs font-bold text-purple-300">
                    You
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Error notification banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs">
            <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 border-t border-purple-500/10 bg-white/40 dark:bg-[#0d1230]/60 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "AI is streaming response..."
                : "Ask anything (Press Enter to send)..."
            }
            disabled={isLoading || isStreaming}
            className="w-full pl-4 pr-24 py-3 rounded-2xl bg-white/80 dark:bg-[#111840]/90 border border-purple-500/20 focus:border-purple-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm outline-none resize-none shadow-inner transition-all leading-normal"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {isStreaming || isLoading ? (
              <button
                type="button"
                onClick={stop}
                title="Stop generation"
                className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center transition-all shadow-xs"
              >
                <HiStop className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                title="Send message"
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  input.trim()
                    ? "bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/30 hover:scale-105 active:scale-95"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50"
                }`}
              >
                <HiArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiChatBox;
