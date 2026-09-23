import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  AuthSkeleton,
  HomeSkeleton,
  ChatSkeleton,
  ProfileSkeleton,
} from "./PageSkeletons";

/**
 * RouteTransitionWrapper
 * Listens for route changes and displays a realistic skeleton loader
 * corresponding to the active route for ~1.2 seconds before showing real content.
 */
const RouteTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset loading state on route change or initial mount
    setIsLoading(true);
    setCurrentPath(location.pathname);
    setProgress(15);
    window.scrollTo({ top: 0, behavior: "instant" });

    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(pInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 250);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 150);
    }, 1200);

    return () => {
      clearInterval(pInterval);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  // Determine skeleton type by path
  const renderSkeleton = () => {
    const path = currentPath.toLowerCase();

    if (path === "/signup") {
      return <AuthSkeleton type="signup" />;
    }
    if (path === "/login") {
      return <AuthSkeleton type="login" />;
    }
    if (path.startsWith("/chat")) {
      return <ChatSkeleton />;
    }
    if (path.startsWith("/profile")) {
      return <ProfileSkeleton />;
    }
    if (path === "/" || path === "") {
      return <HomeSkeleton />;
    }
    return <HomeSkeleton />;
  };

  return (
    <>
      {/* Top Loading Progress Line */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-violet-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(139,92,246,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Render Skeleton or Main Content */}
      {isLoading ? (
        <div className="animate-fadeIn">{renderSkeleton()}</div>
      ) : (
        <div className="animate-fadeIn">{children}</div>
      )}
    </>
  );
};

export default RouteTransitionWrapper;
