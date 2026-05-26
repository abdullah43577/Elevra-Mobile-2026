/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f3f3f5",
          500: "#121212",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#eef2ff",
          500: "#2a62ff",
          900: "#001d63",
          foreground: "#ffffff",
        },
        tertiary: {
          50: "#f9f9fb",
          500: "#6b6b6b",
          900: "#1d1d1d",
          foreground: "#ffffff",
        },
        error: {
          50: "#f9dedc",
          500: "#b3261e",
          900: "#410e0b",
          foreground: "#ffffff",
        },
        neutral: {
          50: "#f9f9fb",
          100: "#f3f3f5",
          200: "#eeeeef",
          300: "#d9dadc",
          400: "#c4c6cf",
          500: "#74777f",
          700: "#44474e",
          900: "#121212",
        },
      },
      fontFamily: {
        roboto: [
          "Roboto-Regular",
          "Roboto-Medium",
          "Roboto-Bold",
          "Roboto-SemiBold",
        ],
      },
    },
  },
  plugins: [],
};
