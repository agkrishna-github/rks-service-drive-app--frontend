/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      lg: { max: "2023px" },

      md: { max: "720px" },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
