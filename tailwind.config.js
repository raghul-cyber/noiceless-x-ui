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
          950: '#040a07', // Deep Obsidian Void
          900: '#08140e', // Primary Dark Jade Panel
          850: '#0c1e15', // Chassis Surface
          800: '#10281c', // Elevated Module
          700: '#143526', // Boundary Seam
          600: '#1e4a36', // Structural Border
          500: '#28634a', // Emerald Accent Low
          400: '#4b7a63', // Muted Sage
          300: '#8ba695', // Tactical Secondary Slate
          200: '#c5d8cc', // Secondary Text
          100: '#f0fdf4', // Crisp Primary Text
        },
        pine: {
          void: '#020604',
          canvas: '#040a07',
          panel: '#08140e',
          surface: '#0a1a12',
          elevated: '#0e2419',
          border: '#143526',
          borderBright: '#1f4f39',
        },
        signal: {
          mint: '#00e599',
          cyan: '#00e599', // Unified with vibrant tactical mint
          amber: '#f59e0b',
          red: '#ff3b5c',
          green: '#10b981',
          blue: '#38bdf8',
        },
        tactical: {
          mint: '#00e599',
          amber: '#f59e0b',
          crimson: '#ff3b5c',
          slate: '#8ba695',
          dim: '#41574b',
          light: '#f0fdf4',
        }
      },
      boxShadow: {
        'tactile-mint': '0 0 12px rgba(0, 229, 153, 0.3)',
        'tactile-glow': '0 0 20px rgba(0, 229, 153, 0.2)',
        'tactile-amber': '0 0 12px rgba(245, 158, 11, 0.25)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
