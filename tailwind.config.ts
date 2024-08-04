import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        text: "#0a0a0a",
        background: "#b7e4c7",
        primary: "#2d6a4f",
        secondary: "#52b788",
        cta: "#dddf00",
        light: "#d8f3dc",
        dark: "#081c15",
      },
    },
  },
  plugins: [],
};
export default config;
