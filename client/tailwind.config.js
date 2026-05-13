/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#a855f7",
        dark: "#0f172a",
        card: "rgba(255, 255, 255, 0.05)",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundColor: {
        'theme': 'var(--bg-primary)',
        'theme-secondary': 'var(--bg-secondary)',
        'theme-card': 'var(--bg-card)',
      },
      textColor: {
        'theme': 'var(--text-primary)',
        'theme-secondary': 'var(--text-secondary)',
      },
      borderColor: {
        'theme': 'var(--border-color)',
      },
    },
  },
  plugins: [],
}
