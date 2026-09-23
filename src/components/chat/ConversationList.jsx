/**
 * ConversationList — Renders list of conversations or skeleton state.
 *
 * Props:
 *  - conversations: array
 *  - activeId: string
 *  - onSelect: (id: string) => void
 *  - isLoading: boolean
 *  - filter: 'all' | 'unread' | 'groups'
 */
import ConversationItem from "./ConversationItem";
import SkeletonLoader from "../ui/SkeletonLoader";

const ConversationList = ({
  conversations = [],
  activeId = null,
  onSelect,
  isLoading = false,
  filter = "all",
}) => {
  if (isLoading) {
    return <SkeletonLoader type="conversation" count={6} />;
  }

  const filtered = conversations.filter((c) => {
    if (filter === "unread") return c.unread > 0;
    if (filter === "groups") return c.isGroup;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400">
          {filter === "unread" ? "No unread messages" : filter === "groups" ? "No groups yet" : "No conversations yet"}
        </p>
        <p className="text-xs text-slate-600 mt-1">
          {filter === "all" ? "Start a new conversation" : ""}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-0.5 px-2"
      role="listbox"
      aria-label="Conversations"
    >
      {filtered.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
          onClick={() => onSelect?.(conversation.id)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
