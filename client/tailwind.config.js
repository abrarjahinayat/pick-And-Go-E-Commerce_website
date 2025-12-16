/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // ... your other paths
  ],
  theme: {
    extend: {
      fontFamily: {
        // This sets the default font (font-sans) to Poppins
        sans: ["var(--font-poppins)"], 
        // This creates a new utility class 'font-fjalla'
        fjalla: ["var(--font-fjalla)"], 
      },
    },
  },
  plugins: [],
};