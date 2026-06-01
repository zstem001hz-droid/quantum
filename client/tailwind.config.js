/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: "#0d0f1a",
          surface: "#161929",
          surface2: "#1e2235",
          input: "#1a2e58",
          border: "#2a2f4a",
          text: "#f0f2ff",
          muted: "#6b7490",
          accent: "#6366f1",
          "accent-hover": "#4f46e5",
        },
        status: {
          todo: "#60a5fa",
          "todo-bg": "#1e3a5f",
          progress: "#f59e0b",
          "progress-bg": "#2d1f00",
          complete: "#10b981",
          "complete-bg": "#052e1a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "spin-reverse": "spin 6s linear infinite reverse",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
