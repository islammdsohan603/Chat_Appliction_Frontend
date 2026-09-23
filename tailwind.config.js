/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./redux/**/*.{js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        nexora: {
          bg: "#060918",
          surface: "#0d1230",
          surface2: "#111840",
          border: "rgba(139,92,246,0.15)",
          accent: "#8b5cf6",
          "accent-2": "#06b6d4",
          pink: "#ec4899",
        },
      },
      keyframes: {
        orbFloat: {
          "0%, 100%": { transform: "translateY(-50%) scale(1) rotate(0deg)" },
          "33%": { transform: "translateY(-48%) scale(1.08) rotate(3deg)" },
          "66%": { transform: "translateY(-52%) scale(0.95) rotate(-2deg)" },
        },
        particleDrift: {
          "0%": { transform: "translateY(0) translateX(0) scale(1)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100vh) translateX(40px) scale(0.5)", opacity: "0" },
        },
        cardReveal: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        errorShake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        typingDot: {
          "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.3" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        messageIn: {
          from: { opacity: "0", transform: "translateY(8px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        onlinePulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.6)", opacity: "0" },
        },
        heroFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        heroFloat2: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(-1deg)" },
        },
        scaleIn: {
          from: { transform: "scale(0.8)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        orbFloat: "orbFloat 12s ease-in-out infinite",
        particleDrift: "particleDrift linear infinite",
        cardReveal: "cardReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        errorShake: "errorShake 0.4s ease",
        fadeIn: "fadeIn 0.5s ease forwards",
        slideUp: "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        slideInRight: "slideInRight 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        slideInLeft: "slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "typing-dot": "typingDot 1.4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        messageIn: "messageIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        onlinePulse: "onlinePulse 2s ease-out infinite",
        heroFloat: "heroFloat 4s ease-in-out infinite",
        heroFloat2: "heroFloat2 5s ease-in-out infinite",
        scaleIn: "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        gradientShift: "gradientShift 4s ease infinite",
      },
      backgroundSize: {
        shimmer: "400% 100%",
      },
    },
  },
  plugins: [],
};
