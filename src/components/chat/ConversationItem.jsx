import { useState } from "react";
import UserAvatar from "../ui/UserAvatar";
import { HiOutlineChatBubbleLeftRight, HiOutlineTrash } from "react-icons/hi2";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const ConversationItem = ({
  conversation,
  isActive = false,
  onClick,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const id = conversation._id || conversation.id;
  const title = conversation.title || conversation.name || "Untitled Chat";
  const lastMessage = conversation.lastMessage || "No messages yet";
  const timestamp = conversation.updatedAt || conversation.createdAt || conversation.timestamp;
  const isAi = conversation.isAi !== false; // Default true for AI sessions unless specified

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete?.(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-purple-500/20 border border-purple-500/40 text-purple-900 dark:text-white font-medium shadow-[0_2px_12px_rgba(139,92,246,0.15)]"
          : "hover:bg-purple-500/8 border border-transparent hover:border-purple-500/15 text-slate-700 dark:text-slate-300"
      }`}
      aria-selected={isActive}
    >
      {/* Active accent pill */}
      {isActive && (
        <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-gradient-to-b from-purple-500 to-cyan-400" />
      )}

      {/* Avatar / Icon */}
      {conversation.avatar || !isAi ? (
        <UserAvatar
          name={title}
          src={conversation.avatar}
          size="sm"
          online={conversation.status === "online"}
        />
      ) : (
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isActive
              ? "bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/30"
              : "bg-purple-500/10 text-purple-600 dark:text-purple-300 group-hover:bg-purple-500/15"
          }`}
        >
          <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-xs sm:text-sm font-semibold truncate ${
              isActive
                ? "text-purple-900 dark:text-white"
                : "text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-white"
            }`}
          >
            {title}
          </span>
          <span
            className={`text-[10px] shrink-0 ml-1.5 transition-opacity ${
              isActive
                ? "text-purple-600 dark:text-purple-300 font-semibold"
                : "text-slate-400 dark:text-slate-500 group-hover:opacity-60"
            }`}
          >
            {formatTime(timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className="text-[11px] truncate text-slate-500 dark:text-slate-400 flex-1">
            {lastMessage}
          </p>
        </div>
      </div>

      {/* Delete button (visible on group-hover or active) */}
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete conversation"
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0 cursor-pointer"
        >
          <HiOutlineTrash className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default ConversationItem;
