/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#06080d',
          900: '#090c13',
          850: '#0e121c',
          800: '#141a27',
          700: '#1e2638',
          600: '#2a344d',
          500: '#435172',
          400: '#7584a6',
          300: '#a3b1ce',
          200: '#d0daf0',
          100: '#eef2fc',
        },
        signal: {
          cyan: '#00d4aa',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#10b981',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
