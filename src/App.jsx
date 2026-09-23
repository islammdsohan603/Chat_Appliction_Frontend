import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./homepage/Home";
import Profile from "./homepage/Profile";
import ChatLayout from "./components/chat/ChatLayout";
import useCurrentUser from "./customHooks/getCurrentUser";

/* ── Route Guards ── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((s) => s.user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060918] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((s) => s.user);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/chat" replace />;

  return children;
};

/* ── App Root ── */
function App() {
  // Initialize user fetch on app load
  useCurrentUser();

  return (
    <>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Home />} />

        {/* Auth pages — redirect to /chat if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected pages */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        theme="dark"
        position="bottom-right"
        toastClassName="!bg-[#111840] !border !border-purple-500/20 !text-slate-200"
      />
    </>
  );
}

export default App;
