/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pm-text-1": "#fff",
        "pm-naranja": "#f1a252",
        "pm-azul": "#5688a9",
        "pm-azulFuerte": "#265770",
      },
    },
    fontFamily: {
      harmonia: ["HarmoniaSans", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
