/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          cream: "#FAF9F6",
          orange: "#FF9553",
          mint: "#7CE1D8",
          lavender: "#A78BFA",
          ink: "#0A0A0A",
        },
        fontFamily: {
          display: ["'Bebas Neue'", "sans-serif"],
          body: ["'Karla'", "sans-serif"],
        },
        boxShadow: {
          retro: "3px 3px 0 #000",
          retroMd: "5px 5px 0 #000",
        },
      },
    },
    plugins: [],
  };
  