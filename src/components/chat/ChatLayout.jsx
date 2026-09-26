/**
 * ChatLayout — Three-panel chat application layout.
 * Desktop: Sidebar | Chat | Profile
 * Tablet: Sidebar | Chat (Profile as drawer)
 * Mobile: Single panel with navigation
 */
import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { clearUser } from "../../../redux/userSlice";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import ChatInput from "./ChatInput";
import ProfilePanel from "./ProfilePanel";
import { HiOutlineBars3 } from "react-icons/hi2";

/* ── Mock data — replace with real API calls ── */
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    name: "Alex Morgan",
    lastMessage: "Hey! Are you available for a call?",
    timestamp: new Date().toISOString(),
    unread: 3,
    status: "online",
    isGroup: false,
  },
  {
    id: "2",
    name: "Design Team",
    lastMessage: "Sarah: The mockups look great! 🎨",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    unread: 0,
    status: "online",
    isGroup: true,
  },
  {
    id: "3",
    name: "Sarah Chen",
    lastMessage: "I'll send the files shortly",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unread: 1,
    status: "away",
    isGroup: false,
  },
  {
    id: "4",
    name: "Dev Squad",
    lastMessage: "The build passed! ✅",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    unread: 0,
    status: "offline",
    isGroup: true,
  },
  {
    id: "5",
    name: "Marcus K.",
    lastMessage: "Sounds good to me",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    unread: 0,
    status: "offline",
    isGroup: false,
  },
];

const generateMessages = (currentUserId) => [
  {
    id: "m1",
    text: "Hey! How's the project going? 👋",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    senderId: "other",
    senderName: "Alex Morgan",
    status: "read",
    reactions: [],
  },
  {
    id: "m2",
    text: "It's going really well! Just finished the UI components.",
    timestamp: new Date(Date.now() - 3540000).toISOString(),
    senderId: currentUserId,
    senderName: "You",
    status: "read",
    reactions: [{ emoji: "👍", count: 1 }],
  },
  {
    id: "m3",
    text: "That's amazing! Can't wait to see the final result 🚀",
    timestamp: new Date(Date.now() - 3480000).toISOString(),
    senderId: "other",
    senderName: "Alex Morgan",
    status: "read",
    reactions: [],
  },
  {
    id: "m4",
    text: "The design looks super clean. Really professional!",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    senderId: "other",
    senderName: "Alex Morgan",
    status: "read",
    reactions: [],
  },
  {
    id: "m5",
    text: "Thanks! I went with a dark glassmorphism theme with purple-cyan accents.",
    timestamp: new Date(Date.now() - 1740000).toISOString(),
    senderId: currentUserId,
    senderName: "You",
    status: "read",
    reactions: [{ emoji: "🔥", count: 2 }],
  },
  {
    id: "m6",
    text: "Are you available for a quick call later?",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    senderId: "other",
    senderName: "Alex Morgan",
    status: "read",
    reactions: [],
  },
];

/* ═════════════════════════════════════════
   Empty / Welcome state when no chat selected
   ═════════════════════════════════════════ */
const WelcomeScreen = ({ onSendMessage }) => (
  <div className="flex-1 flex flex-col justify-between py-6 px-4 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar">
    <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-4 my-auto">
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/25 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        {/* Floating pulse */}
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-400/60 animate-ping" />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">What's on your mind today?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
          Ask questions, brainstorm with AI, or pick a conversation from the sidebar to start chatting.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-slate-500 dark:text-slate-400">All systems operational</span>
      </div>
    </div>

    {/* input on Welcome screen */}
    <div className="w-full mt-4">
      <ChatInput
        onSend={onSendMessage}
        placeholder="Ask anything or start a message…"
        showStarters
      />
    </div>
  </div>
);

/* ═════════════════════════════════════════
   Main ChatLayout
   ═════════════════════════════════════════ */
const ChatLayout = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const currentUser = userData?.user || userData || {};
  const currentUserId = currentUser._id || "me";
  const currentUserName = currentUser.name || currentUser.userName || "You";

  const serverUrl =
    import.meta.env.VITE_SERVER_URL ||
    import.meta.env.NEXT_PUBLIC_SERVER_URL ||
    "http://localhost:8000";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/all`, {
          withCredentials: true,
        });

        // Map users to conversation format
        const mappedUsers = response.data.map((u) => ({
          id: u._id,
          name: u.name || u.userName,
          lastMessage: "Start a conversation",
          timestamp: u.updatedAt,
          unread: 0,
          status: "offline",
          isGroup: false,
          avatar: u.image,
        }));

        setConversations(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [serverUrl]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // Fetch messages from database for selected conversation
  useEffect(() => {
    if (!activeConversationId) return;

    let isMounted = true;
    const fetchConversationMessages = async () => {
      setIsMessagesLoading(true);
      try {
        const response = await axios.get(
          `${serverUrl}/api/chat/${activeConversationId}`,
          { withCredentials: true }
        );

        if (!isMounted) return;

        const formatted = (response.data || []).map((msg) => ({
          id: msg._id,
          text: msg.message,
          attachments: msg.attachments || [],
          timestamp: msg.createdAt,
          senderId: msg.senderId,
          senderName:
            msg.senderId === currentUserId
              ? "You"
              : activeConversation?.name || "User",
          status: "sent",
          reactions: [],
        }));

        setMessages(formatted);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch messages from database:", error);
        toast.error("Failed to load conversation history");
      } finally {
        if (isMounted) {
          setIsMessagesLoading(false);
        }
      }
    };

    fetchConversationMessages();

    return () => {
      isMounted = false;
    };
  }, [activeConversationId, serverUrl, currentUserId, activeConversation?.name]);

  const handleSelectConversation = useCallback((id) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  }, []);

  const handleSendMessage = useCallback(
    async (payload) => {
      const textContent =
        typeof payload === "string" ? payload : payload?.text || "";
      const attachments =
        typeof payload === "object" ? payload?.attachments || [] : [];
      if (!textContent && attachments.length === 0) return;

      let targetReceiverId = activeConversationId;
      // If no active conversation is selected yet, select the first available user
      if (!targetReceiverId && conversations.length > 0) {
        targetReceiverId = conversations[0].id;
        setActiveConversationId(targetReceiverId);
      }

      if (!targetReceiverId) {
        toast.info("Please select a user from the sidebar to chat with.");
        return;
      }

      try {
        const response = await axios.post(
          `${serverUrl}/api/chat/send/${targetReceiverId}`,
          {
            message: textContent,
            attachments,
          },
          {
            withCredentials: true,
          }
        );

        const savedChat = response.data?.chat;
        const newMessage = {
          id: savedChat?._id || `msg-${Date.now()}`,
          text: savedChat?.message || textContent,
          attachments: savedChat?.attachments || attachments,
          webSearch: typeof payload === "object" ? payload?.webSearch : false,
          deepThink: typeof payload === "object" ? payload?.deepThink : false,
          timestamp: savedChat?.createdAt || new Date().toISOString(),
          senderId: currentUserId,
          senderName: currentUserName,
          status: "sent",
          reactions: [],
        };

        setMessages((prev) => [...prev, newMessage]);

        // Update preview in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetReceiverId
              ? {
                  ...c,
                  lastMessage: textContent || "Attachment",
                  timestamp: new Date().toISOString(),
                }
              : c
          )
        );
      } catch (error) {
        console.error("Failed to store chat message:", error);
        toast.error(
          error.response?.data?.message || "Failed to send chat message"
        );
      }
    },
    [
      activeConversationId,
      conversations,
      currentUserId,
      currentUserName,
      serverUrl,
    ]
  );

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
    } catch {
      // Logout anyway
    }
    dispatch(clearUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const contactInfo = activeConversation
    ? {
        name: activeConversation.name,
        userName: activeConversation.name.toLowerCase().replace(/\s+/g, ""),
        status: activeConversation.status,
        about: "Love building amazing products and collaborating with great teams! 💜",
      }
    : {};

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-[#060918] overflow-hidden font-inter transition-colors duration-200">
      {/* ════ LEFT SIDEBAR ════ */}
      <ChatSidebar
        user={{ userName: currentUserName, email: currentUser.email, image: currentUser.image, name: currentUser.name }}
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onLogout={handleLogout}
        isLoading={isLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ════ MAIN CHAT AREA ════ */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile top bar (when no chat selected) */}
        {!activeConversationId && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/10 bg-white/80 dark:bg-[#060918]/80 backdrop-blur-sm md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-500/10 transition-all"
            >
              <HiOutlineBars3 className="w-5 h-5" />
            </button>
            <span className="text-base font-bold gradient-text">NEXORA</span>
            <div className="w-9" />
          </div>
        )}

        {/* Chat header (when conversation selected) */}
        {activeConversation && (
          <ChatHeader
            contact={{
              name: activeConversation.name,
              status: activeConversation.status,
            }}
            onProfileToggle={() => setProfileOpen((v) => !v)}
            onBack={() => setActiveConversationId(null)}
            showBack
          />
        )}

        {/* Also show hamburger in desktop header for tablet */}
        {activeConversation && (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="absolute left-3 top-3 p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-500/10 transition-all md:hidden z-10"
            style={{ display: 'none' }}
          >
            <HiOutlineBars3 className="w-5 h-5" />
          </button>
        )}

        {/* Message area */}
        {activeConversation ? (
          <MessageList
            messages={messages}
            isTyping={isTyping}
            typingUser={activeConversation.name}
            currentUserId={currentUserId}
            isLoading={isMessagesLoading}
          />
        ) : (
          <WelcomeScreen onSendMessage={handleSendMessage} />
        )}

        {/* ChatGPT Style Floating Input for active chat */}
        {activeConversation && (
          <ChatInput
            onSend={handleSendMessage}
            placeholder={`Message ${activeConversation.name}…`}
          />
        )}
      </main>

      {/* ════ RIGHT PROFILE PANEL ════ */}
      {activeConversation && (
        <ProfilePanel
          contact={contactInfo}
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}

      {/* Mobile sidebar hamburger — always visible when closed */}
      {!sidebarOpen && !activeConversationId && (
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="fixed left-4 top-4 p-2.5 rounded-xl bg-white dark:bg-[#111840] border border-purple-300/40 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-lg md:hidden z-10"
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ChatLayout;
