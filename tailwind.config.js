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
          main: "#121212",
          "on-primary": "#ffffff",
          "primary-container": "#f3f3f5",
          "on-primary-container": "#121212",
        },
        secondary: {
          main: "#2a62ff",
          "on-secondary": "#ffffff",
          "secondary-container": "#eef2ff",
          "on-secondary-container": "#001d63",
        },
        tertiary: {
          main: "#6b6b6b",
          "on-tertiary": "#ffffff",
          "tertiary-container": "#f9f9fb",
          "on-tertiary-container": "#1d1d1d",
        },
        error: {
          main: "#b3261e",
          "on-error": "#ffffff",
          "error-container": "#f9dedc",
          "on-error-container": "#410e0b",
        },
        neutral: {
          surface: "#f9f9fb",
          "surface-dim": "#d9dadc",
          "surface-bright": "#f9f9fb",
          "surface-container-lowest": "#ffffff",
          "surface-container-low": "#f3f3f5",
          "surface-container": "#eeeeef",
          "on-surface": "#121212",
          "on-surface-variant": "#44474e",
          outline: "#74777f",
          "outline-variant": "#c4c6cf",
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
