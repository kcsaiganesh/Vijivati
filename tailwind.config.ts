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
        montserrat: ["Montserrat"],
      },
      colors: {
        text: "#0a0a0a",
        background: "#b7e4c7",
        primary: " #DAE7D1",
        secondary: "#78B54E",
        cta: "#D2FF22",
        light: "#d8f3dc",
        dark: "#081c15",
      },
    },
  },
  plugins: [],
};
export default config;
