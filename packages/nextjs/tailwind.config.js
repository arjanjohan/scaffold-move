/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors, based on the Movement brand kit (https://www.movementnetwork.xyz/brand-kit):
  // Movement Cyan #15EDEB with black #0A0A0A and white. Cyan fails as text on white (1.46:1),
  // so in light mode it's only a fill with black text, and links use a darkened teal (#0F847E, 4.5:1).
  daisyui: {
    themes: [
      {
        light: {
          primary: "#0A0A0A",
          "primary-content": "#15EDEB",
          secondary: "#15EDEB",
          "secondary-content": "#0A0A0A",
          accent: "#0F847E",
          "accent-content": "#FFFFFF",
          neutral: "#0A0A0A",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F5F5F5",
          "base-300": "#EAEAEA",
          "base-content": "#0A0A0A",
          info: "#0F847E",
          success: "#1B7F3B",
          warning: "#9D5A16",
          error: "#B84722",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#15EDEB",
          "primary-content": "#0A0A0A",
          secondary: "#15EDEB",
          "secondary-content": "#0A0A0A",
          accent: "#15EDEB",
          "accent-content": "#0A0A0A",
          neutral: "#FFFFFF",
          "neutral-content": "#0A0A0A",
          "base-100": "#141414",
          "base-200": "#0A0A0A",
          "base-300": "#262626",
          "base-content": "#FFFFFF",
          info: "#15EDEB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
