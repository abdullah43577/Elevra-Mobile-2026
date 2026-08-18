/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic tokens — named for their role, resolved from the CSS
        // variables in src/global.css, which swap under .dark:root. Prefer
        // these over the raw ramps below: a screen written with them works in
        // both schemes with no dark: variants. The ramps stay because the
        // semantic values are *defined from* them.
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          muted: "rgb(var(--surface-muted) / <alpha-value>)",
        },
        // Not named "hairline" — that is already a borderWidth utility and the
        // two would collide on `border-hairline`.
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "rgb(var(--foreground) / <alpha-value>)",
          muted: "rgb(var(--foreground-muted) / <alpha-value>)",
          subtle: "rgb(var(--foreground-subtle) / <alpha-value>)",
          inverse: "rgb(var(--foreground-inverse) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          muted: "rgb(var(--accent-muted) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--danger) / <alpha-value>)",
          muted: "rgb(var(--danger-muted) / <alpha-value>)",
          solid: "rgb(var(--danger-solid) / <alpha-value>)",
        },

        primary: {
          50: "#F7F7F9",
          100: "#EDEDF1",
          200: "#D8D8DF",
          300: "#B7B7C2",
          400: "#86868F",
          500: "#17171C",
          600: "#101014",
          700: "#0B0B0E",
          800: "#08080A",
          900: "#050506",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#EFEDFE",
          100: "#E1DCFD",
          200: "#C3B8FB",
          300: "#A091F7",
          400: "#7D6BF0",
          500: "#5B47E8",
          600: "#4B39D6",
          700: "#3C2CB0",
          800: "#2D2086",
          900: "#1F165F",
          foreground: "#ffffff",
        },
        tertiary: {
          50: "#F9F9FB",
          100: "#F1F1F4",
          200: "#E3E3E8",
          300: "#C8C8D1",
          400: "#9A9AA5",
          500: "#6B6B76",
          600: "#54545E",
          700: "#3D3D45",
          800: "#2A2A30",
          900: "#1B1B1F",
          foreground: "#ffffff",
        },
        error: {
          50: "#FBEAEA",
          100: "#F5D3D1",
          200: "#E9A9A4",
          300: "#DC7D76",
          400: "#CB554B",
          500: "#B93A32",
          600: "#9A2E27",
          700: "#7A241F",
          800: "#591A17",
          900: "#3D1210",
          foreground: "#ffffff",
        },
        neutral: {
          50: "#FAFAFB",
          100: "#F3F3F6",
          200: "#EAEAEE",
          300: "#D5D5DE",
          400: "#B4B4BF",
          500: "#7D7D8A",
          600: "#63636E",
          700: "#47474F",
          800: "#2B2B31",
          900: "#17171A",
        },
        content: {
          note: "#5B47E8",
          recording: "#D6653D",
          resume: "#0F9B7A",
          application: "#2E6FD1",
          profile: "#B23A6B",
          letter: "#A8761C",
          interview: "#1B7A99",
        },
      },

      borderWidth: {
        hairline: "0.5px",
      },

      borderRadius: {
        squircle: "10px",
      },

      fontFamily: {
        "bricolage-extralight": ["BricolageGrotesque-ExtraLight"],
        "bricolage-light": ["BricolageGrotesque-Light"],
        bricolage: ["BricolageGrotesque-Regular"],
        "bricolage-medium": ["BricolageGrotesque-Medium"],
        "bricolage-semibold": ["BricolageGrotesque-SemiBold"],
        "bricolage-bold": ["BricolageGrotesque-Bold"],
        "bricolage-extrabold": ["BricolageGrotesque-ExtraBold"],
      },
    },
  },
  plugins: [],
};
