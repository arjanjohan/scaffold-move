/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#ffd016",
          "primary-content": "#212638",
          secondary: "#ffd016",
          "secondary-content": "#212638",
          accent: "#121615",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffdf63",
          "base-200": "#FFEA95",
          "base-300": "#FFF4C9",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

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
      // {
      //   dark: {
      //     primary: "#1b1f1e",
      //     "primary-content": "#ffffff",
      //     secondary: "#ffd016",
      //     "secondary-content": "#121615",
      //     accent: "#ffffff",
      //     "accent-content": "#F9FBFF",
      //     neutral: "#F9FBFF",
      //     "neutral-content": "#ffffff",
      //     yellow: "#ffd016",
      //     "base-100": "#1b1f1e",
      //     "base-200": "#121615",
      //     "base-300": "#ffd016",
      //     "base-content": "#ffffff",
      //     info: "#385183",
      //     success: "#34EEB6",
      //     warning: "#FFCF72",
      //     error: "#FF8863",

      //     "--rounded-btn": "9999rem",

      //     ".tooltip": {
      //       "--tooltip-tail": "6px",
      //       "--tooltip-color": "oklch(var(--p))",
      //     },
      //     ".link": {
      //       textUnderlineOffset: "2px",
      //     },
      //     ".link:hover": {
      //       opacity: "80%",
      //     },
      //   },
      // },
      {
        dark: {
          "primary": "#0D1117",               // Very dark grey (almost black) for primary
          "primary-content": "#C9D1D9",        // Light grey for primary content
          "secondary": "#161B22",              // Dark grey for secondary
          "secondary-content": "#C9D1D9",      // Light grey for secondary content
          "accent": "#06F7F7",                 // Bright blue accent
          "accent-content": "#0D1117",         // Dark grey for accent content
          "neutral": "#C9D1D9",                // Light grey for neutral
          "neutral-content": "#0D1117",        // Dark grey for neutral content
          "base-100": "#0D1117",               // Very dark grey for base-100
          "base-200": "#161B22",               // Dark grey for base-200
          "base-300": "#21262D",               // Medium dark grey for base-300
          "base-content": "#C9D1D9",           // Light grey for base content
          info: "#385183",
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
