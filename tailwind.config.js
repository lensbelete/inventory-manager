/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cool: {
          /** Primary label text */
          DEFAULT: "#e8eef4",
          /** App canvas — mid slate (not OLED black; reads softer) */
          bg: "#2c3d4a",
          deep: "#1e2c36",
          /** Cards — clearly brighter than canvas for hierarchy */
          surface: "#3d5161",
          elevated: "#4a6274",
          border: "#5f778a",
          line: "#546878",
          muted: "#aabdc8",
          subtle: "#8499a8",
          /** Vibrant teal — snaps against slate */
          accent: "#41d9ec",
          accentSoft: "#2fc2d8",
          ink: "#152830",
          ok: "#58e0a8",
          warn: "#f0cf7a",
          tabUsers: "#5eeefa",
          tabProducts: "#c4b4ff",
          tabHistory: "#ffd88a",
          tabInactive: "#8a9da8",
          tabBar: "#344652",
          tabBarBorder: "#5f778a",
        },
      },
    },
  },
  plugins: [],
};
