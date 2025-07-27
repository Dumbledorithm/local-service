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
          "primary": "#000000",
          "secondary": "#14b8a6",
          "accent": "#10b981",
          "neutral": "#f3f4f6",
          "base-100": "#ffffff",
        },
        serviceprodark: {
          "primary": "#000000",           // Black
          "primary-content": "#ffffff",   // White text on black buttons
          "secondary": "#4b5563",         // A softer grey for secondary text
          "accent": "#f97316",            // Vibrant Orange
          "neutral": "#f3f4f6",           // Light grey background
          "base-100": "#ffffff",          // White card/page backgrounds
        },
      },
    ],
  },
}