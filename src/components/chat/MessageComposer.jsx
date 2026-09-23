/**
 * MessageComposer — Bottom input bar for composing and sending messages.
 *
 * Props:
 *  - onSend: (text: string) => void
 *  - disabled: boolean
 *  - placeholder: string
 */
import { useState, useRef, useCallback } from "react";
import {
  HiOutlineFaceSmile,
  HiOutlinePaperClip,
  HiOutlineMicrophone,
  HiOutlinePaperAirplane,
  HiOutlineXMark,
} from "react-icons/hi2";

const MessageComposer = ({
  onSend,
  disabled = false,
  placeholder = "Type a message…",
}) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed);
    setText("");
    textareaRef.current?.focus();
  }, [text, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto-resize textarea
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  const clearText = () => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="px-4 py-3 border-t border-purple-500/10 bg-[#0d1230]/80 backdrop-blur-sm">
      <div
        className={`flex items-end gap-2 p-2 rounded-2xl border transition-all duration-300 ${
          isFocused
            ? "border-purple-500/50 bg-[#111840] shadow-[0_0_0_4px_rgba(139,92,246,0.08)]"
            : "border-purple-500/15 bg-[#111840]/60"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Emoji button */}
        <button
          type="button"
          aria-label="Add emoji"
          className="p-2 rounded-xl text-slate-400/60 hover:text-purple-400 hover:bg-purple-500/10 transition-all shrink-0"
        >
          <HiOutlineFaceSmile className="w-5 h-5" />
        </button>

        {/* Attachment button */}
        <button
          type="button"
          aria-label="Attach file"
          className="p-2 rounded-xl text-slate-400/60 hover:text-purple-400 hover:bg-purple-500/10 transition-all shrink-0"
        >
          <HiOutlinePaperClip className="w-5 h-5" />
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            id="message-input"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-label="Message input"
            className="w-full bg-transparent text-slate-200 text-sm placeholder:text-slate-500/60 resize-none outline-none leading-relaxed py-1.5 max-h-[120px] overflow-y-auto no-scrollbar"
            style={{ height: "auto" }}
          />
          {text.length > 0 && (
            <button
              type="button"
              onClick={clearText}
              aria-label="Clear message"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-500/60 hover:text-slate-300 transition-colors"
            >
              <HiOutlineXMark className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Voice / Send button */}
        {canSend ? (
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send message"
            className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white hover:from-purple-400 hover:to-violet-500 hover:shadow-[0_4px_16px_rgba(139,92,246,0.4)] transition-all shrink-0 active:scale-95"
          >
            <HiOutlinePaperAirplane className="w-4 h-4 rotate-45" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Voice message"
            className="p-2 rounded-xl text-slate-400/60 hover:text-purple-400 hover:bg-purple-500/10 transition-all shrink-0"
          >
            <HiOutlineMicrophone className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hint text */}
      <p className="text-[10px] text-slate-600 text-center mt-1.5">
        Press <kbd className="px-1 py-0.5 rounded bg-slate-700/50 text-slate-500 font-mono text-[10px]">Enter</kbd> to send
        {" · "}
        <kbd className="px-1 py-0.5 rounded bg-slate-700/50 text-slate-500 font-mono text-[10px]">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};

export default MessageComposer;
