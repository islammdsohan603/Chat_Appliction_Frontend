import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import RouteTransitionWrapper from "./components/ui/RouteTransitionWrapper";
import {
  AuthSkeleton,
  ChatSkeleton,
  ProfileSkeleton,
} from "./components/ui/PageSkeletons";

/* ── Route Guards ── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((s) => s.user);
  const location = useLocation();

  if (isLoading) {
    if (location.pathname.startsWith("/profile")) {
      return <ProfileSkeleton />;
    }
    return <ChatSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((s) => s.user);
  const location = useLocation();

  if (isLoading) {
    return <AuthSkeleton type={location.pathname === "/login" ? "login" : "signup"} />;
  }
  if (isAuthenticated) return <Navigate to="/chat" replace />;

  return children;
};

/* ── App Root ── */
function App() {
  // Initialize user fetch on app load
  useCurrentUser();

  return (
    <>
      <RouteTransitionWrapper>
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
      </RouteTransitionWrapper>

      <ToastContainer
        theme="dark"
        position="bottom-right"
        toastClassName="!bg-[#111840] !border !border-purple-500/20 !text-slate-200"
      />
    </>
  );
}

export default App;
