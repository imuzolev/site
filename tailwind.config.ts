import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#0E0E0E",
          800: "#141414",
          700: "#202020",
        },
        cyan: {
          DEFAULT: "#00D1FF",
          glow: "#00D1FF",
        },
        teal: {
          DEFAULT: "#00FFE5",
        },
        violet: {
          DEFAULT: "#8B5CF6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        ultra: "0.35em",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, #050505 90%)",
        "radial-glow":
          "radial-gradient(circle at center, rgba(0,209,255,0.18), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "grid-pan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 -40px" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "grid-pan": "grid-pan 8s linear infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
