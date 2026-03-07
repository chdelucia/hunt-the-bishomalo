/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#00ff5e",
        background: "#111827",
        panel: "#1f2937",
        border: "#374151",
        text: "#4ade80",
        "text-secondary": "#9ca3af",
        button: "#15803d",
        "button-hover": "#16a34a",
        "button-next": "#1d4ed8",
        "button-next-hover": "#2563eb",
        yellow: "#facc15",
        red: "#ef4444",
        blue: "#60a5fa",
        purple: "#a855f7",
        dark: "#1a202c",
        "accent-blue": "#007bff",
        "accent-blue-hover": "#1a70cc",
        "muted-gray": "#a0aec0",
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'monospace'],
      }
    },
  },
  plugins: [],
}
