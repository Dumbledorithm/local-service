/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
        display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
        logo: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        serviceproblue: {
          "primary": "#3b82f6",
          "secondary": "#14b8a6",
          "accent": "#10b981",
          "neutral": "#f3f4f6",
          "base-100": "#ffffff",
        },
      },
    ],
  },
}