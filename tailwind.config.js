/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cool: {
          DEFAULT: "#d0dae6",
          bg: "#0a0e14",
          deep: "#070a0f",
          surface: "#121a24",
          elevated: "#18212e",
          border: "#243140",
          line: "#2d3d4d",
          muted: "#7d8fa3",
          subtle: "#5a6b7c",
          accent: "#6b8496",
          accentSoft: "#5a7384",
          ink: "#1a2330",
          ok: "#5a7a6c",
          warn: "#7a6b55",
        },
      },
    },
  },
  plugins: [],
};
