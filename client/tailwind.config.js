/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-thin": {
          "::-webkit-scrollbar": {
            width: "8px",
          },
          "::-webkit-scrollbar-track": {
            background: "#2d2d2d",
          },
          "::-webkit-scrollbar-thumb": {
            background: "#888",
            "border-radius": "10px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        },
      });
    }),
  ],
};
