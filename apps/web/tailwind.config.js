/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eff8ff", 100: "#dbeffe", 200: "#bae0fd",
          400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7",
          700: "#0369a1", 900: "#0c4a6e",
        },
        coral: { 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48" },
      },
    },
  },
  plugins: [],
}
