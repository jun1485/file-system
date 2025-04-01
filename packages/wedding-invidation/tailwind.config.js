/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        secondary: "var(--secondary)",
        "card-bg": "var(--card-bg)",
        "muted-text": "var(--muted-text)",
        "border-color": "var(--border-color)",
      },
    },
  },
  plugins: [],
};
