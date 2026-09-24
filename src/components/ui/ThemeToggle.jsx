/**
 * ThemeToggle — Accessible, animated theme switch button.
 * Toggles between Dark Mode ('dark' class on <html>) and Light Mode.
 * Persists user preference in localStorage and synchronizes across the app.
 */
import { useState, useEffect } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

const ThemeToggle = ({ className = "", showLabel = false }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    // Check if class already exists on documentElement, otherwise default to dark for NEXORA
    return document.documentElement.classList.contains("dark") || true;
  });

  useEffect(() => {
    const applyTheme = (dark) => {
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
    };

    // Initial check from localStorage
    const saved = localStorage.getItem("theme") || "dark";
    applyTheme(saved === "dark");

    // Listen to external theme changes (e.g. from Settings or another toggle)
    const handleStorage = (e) => {
      if (e.key === "theme") {
        applyTheme(e.newValue === "dark");
      }
    };
    const handleCustom = (e) => {
      applyTheme(e.detail?.theme === "dark");
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("nexoraThemeChange", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("nexoraThemeChange", handleCustom);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeStr = newTheme ? "dark" : "light";

    if (newTheme) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    localStorage.setItem("theme", themeStr);
    window.dispatchEvent(new CustomEvent("nexoraThemeChange", { detail: { theme: themeStr } }));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`group relative flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 ${
        isDark
          ? "bg-[#111840]/80 border-purple-500/25 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          : "bg-white/80 border-purple-300/40 text-purple-700 hover:text-purple-900 hover:bg-purple-50 hover:border-purple-400 shadow-[0_2px_8px_rgba(139,92,246,0.1)]"
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <HiOutlineSun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-300" />
        ) : (
          <HiOutlineMoon className="w-5 h-5 transition-transform duration-300 -rotate-12 hover:rotate-0 text-indigo-600" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
