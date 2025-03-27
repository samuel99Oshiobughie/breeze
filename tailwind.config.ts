import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: [
          'Inter', // Primary font
          '-apple-system', // Fallback for Apple devices
          'BlinkMacSystemFont', // Fallback for macOS
          'Segoe UI', // Fallback for Windows
          'Roboto', // Fallback for Android
          'Helvetica Neue', // Fallback for older systems
          'Arial', // Generic fallback
          'sans-serif', // Ultimate fallback
        ],
      },
      screens: {
        'proj-small': '450px',
        'slug-med': '890px',
        'note-sm': '570px'
      }
    },
  },
  plugins: [],
} satisfies Config;
