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
const WelcomeScreen = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-8">
    <div className="relative">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
        <svg className="w-12 h-12 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </div>
      {/* Floating decoration */}
      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-500/30 animate-ping" style={{ animationDelay: '0.5s' }} />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome to NEXORA</h2>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
        Select a conversation from the sidebar to start chatting. Your messages are end-to-end encrypted.
      </p>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs text-slate-500">All systems operational</span>
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

  const currentUserId = userData?.user?._id || "me";
  const currentUserName = userData?.user?.name || userData?.user?.userName || userData?.userName || "You";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const serverUrl =
          import.meta.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
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
  }, []);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const handleSelectConversation = useCallback((id) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
    // Load mock messages for the selected conversation
    setMessages(generateMessages(currentUserId));
  }, [currentUserId]);

  const handleSendMessage = useCallback((text) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      senderId: currentUserId,
      senderName: currentUserName,
      status: "sent",
      reactions: [],
    };
    setMessages((prev) => [...prev, newMessage]);
  }, [currentUserId, currentUserName]);

  const handleLogout = async () => {
    try {
      const serverUrl =
        import.meta.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
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
    <div className="h-screen w-full flex bg-[#060918] overflow-hidden font-inter">
      {/* ════ LEFT SIDEBAR ════ */}
      <ChatSidebar
        user={{ userName: currentUserName, email: userData?.user?.email, image: userData?.user?.image, name: userData?.user?.name }}
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
          <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/10 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-purple-500/10 transition-all"
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
            className="absolute left-3 top-3 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-purple-500/10 transition-all md:hidden z-10"
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
            isLoading={false}
          />
        ) : (
          <WelcomeScreen />
        )}

        {/* Composer */}
        {activeConversation && (
          <MessageComposer
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
          className="fixed left-4 top-4 p-2.5 rounded-xl bg-[#111840] border border-purple-500/20 text-slate-300 shadow-lg md:hidden z-10"
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ChatLayout;
