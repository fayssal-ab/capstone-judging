/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Raleway", "sans-serif"],
      display: ["Playfair Display", "serif"],
      body: ["Raleway", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    extend: {
      colors: {
        // ── Page & surface backgrounds (light mode) ──
        void: {
          800: "#c2d1c8",   // card base (used at /40 → subtle tint)
          900: "#e9efeb",   // inputs, secondary surfaces
          950: "#f6f9f7",   // page background
        },
        // ── Text shades (dark-on-light) ──
        ink: {
          100: "#1a2e23",   // primary text
          200: "#2b4a39",
          300: "#3d6350",
          400: "#527d66",
          500: "#6e967f",   // secondary / muted text
          600: "#93b3a1",
          700: "#b5cfbf",
          800: "#d3e4da",   // subtle borders
          900: "#e4efe9",   // faintest borders / dividers
        },
        // ── Primary accent → AUI green ──
        ember: {
          400: "#10b981",   // bright accent (buttons, highlights)
          500: "#059669",   // main brand green
          600: "#047857",   // darker press state
        },
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(5,150,105,0.15)" },
          "50%":      { boxShadow: "0 0 30px rgba(5,150,105,0.25)" },
        },
      },
      animation: {
        "fade-in":  "fade-in 0.5s ease-out both",
        "slide-up": "slide-up 0.5s ease-out both",
        glow:       "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};