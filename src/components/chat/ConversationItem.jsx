/**
 * ConversationItem — Single conversation row in the sidebar.
 *
 * Props:
 *  - conversation: { id, name, lastMessage, timestamp, unread, status, avatar }
 *  - isActive: boolean
 *  - onClick: () => void
 */
import UserAvatar from "../ui/UserAvatar";

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

const ConversationItem = ({ conversation, isActive = false, onClick }) => {
  const { name, lastMessage, timestamp, unread = 0, status, avatar } = conversation;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
        isActive
          ? "bg-purple-500/15 border border-purple-500/20"
          : "hover:bg-purple-500/8 border border-transparent hover:border-purple-500/10"
      }`}
      aria-selected={isActive}
      role="option"
    >
      <UserAvatar
        name={name}
        src={avatar}
        size="md"
        online={status === "online"}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-sm font-semibold truncate ${
              isActive
                ? "text-purple-900 dark:text-white font-bold"
                : "text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-white"
            }`}
          >
            {name}
          </span>
          <span
            className={`text-[10px] shrink-0 ml-2 ${
              unread > 0 ? "text-purple-600 dark:text-purple-400 font-semibold" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {formatTime(timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <p
            className={`text-xs truncate flex-1 ${
              unread > 0
                ? "text-slate-800 dark:text-slate-200 font-medium"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {lastMessage || "No messages yet"}
          </p>
          {unread > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-[10px] font-bold text-white px-1 shadow-[0_2px_8px_rgba(139,92,246,0.4)]">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
