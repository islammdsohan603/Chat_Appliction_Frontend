/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        orbFloat: {
          "0%, 100%": { transform: "translateY(-50%) scale(1) rotate(0deg)" },
          "33%": { transform: "translateY(-48%) scale(1.08) rotate(3deg)" },
          "66%": { transform: "translateY(-52%) scale(0.95) rotate(-2deg)" },
        },
        particleDrift: {
          "0%": {
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: "0",
          },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": {
            transform: "translateY(-100vh) translateX(40px) scale(0.5)",
            opacity: "0",
          },
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
      },
      animation: {
        orbFloat: "orbFloat 12s ease-in-out infinite",
        particleDrift: "particleDrift linear infinite",
        cardReveal:
          "cardReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        errorShake: "errorShake 0.4s ease",
      },
    },
  },
  plugins: [],
};
