/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1e3b8a",
        "primary-light": "#3b5bdb",
        "primary-dark": "#0d6ebd",
        "background-light": "#f6f6f8",
        "background-dark": "#121620",
        "surface-dark": "#192833",
        "surface-glass": "rgba(25, 40, 51, 0.7)",
        "glass-border": "rgba(255, 255, 255, 0.08)",
        "glass-bg": "rgba(255, 255, 255, 0.7)",
        "glass-bg-dark": "rgba(18, 22, 32, 0.7)",
        "secondary-text": "#92b2c9",
        "success": "#0bda5b",
        "warning": "#ff9f1c",
        "danger": "#ff4d4d",
      },
      fontFamily: {
        "sans": ["Vazirmatn", "sans-serif"],
        "display": ["Vazirmatn", "sans-serif"],
        "body": ["Vazirmatn", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}