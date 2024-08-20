module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-.*-[1-9]00/,
    },
    {
      pattern: /border-.*-700/,
    },
  ],
  plugins: [],
};
