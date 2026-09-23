/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mil: {
          950: '#050805', // Deep Ballistic Void
          900: '#090e09', // Primary Army Base Chassis
          850: '#0e150f', // Heavy Ballistic Armor Panel
          800: '#141f16', // Raised Equipment Bay
          750: '#1a281c', // Elevated Tactical Console
          700: '#223425', // Olive Drab Structural Seam
          600: '#2e4632', // Mil-Spec Riveted Border
          500: '#3d5c43', // Machined Bevel / Highlight Seam
          400: '#557b5c', // OD Green Accent Low
          300: '#7ea385', // Tactical Muted Sage
          200: '#b2ccb7', // Secondary Tactical Readout
          100: '#e8f2e6', // High-Contrast Tactical Text
          phosphor: '#22e565', // Military Night-Vision CRT Phosphor Green
          amber: '#f59e0b', // IFF Radar Warning Amber
          red: '#ef4444', // Threat / Armed Recording Alert Red
          blue: '#38bdf8', // Datalink SATCOM Cyan
        },
        studio: {
          950: '#050805',
          900: '#090e09',
          850: '#0e150f',
          800: '#141f16',
          700: '#223425',
          600: '#2e4632',
          500: '#3d5c43',
          400: '#557b5c',
          300: '#7ea385',
          200: '#b2ccb7',
          100: '#e8f2e6',
        },
        pine: {
          void: '#040704',
          canvas: '#060a07',
          panel: '#090e09',
          surface: '#0e150f',
          elevated: '#141f16',
          border: '#223425',
          borderBright: '#2e4632',
        },
        signal: {
          mint: '#22e565',
          cyan: '#22e565',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#22e565',
          blue: '#38bdf8',
        },
        tactical: {
          mint: '#22e565',
          amber: '#f59e0b',
          crimson: '#ef4444',
          slate: '#7ea385',
          dim: '#3d5c43',
          light: '#e8f2e6',
        }
      },
      boxShadow: {
        'mil-glow': '0 0 14px rgba(34, 229, 101, 0.35)',
        'mil-glow-sm': '0 0 8px rgba(34, 229, 101, 0.25)',
        'mil-amber-glow': '0 0 12px rgba(245, 158, 11, 0.3)',
        'mil-red-glow': '0 0 14px rgba(239, 68, 68, 0.35)',
        'tactile-mint': '0 0 12px rgba(34, 229, 101, 0.3)',
        'tactile-glow': '0 0 20px rgba(34, 229, 101, 0.2)',
        'tactile-amber': '0 0 12px rgba(245, 158, 11, 0.25)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Share Tech Mono"', 'ui-monospace', 'monospace'],
        stencil: ['"Chakra Petch"', '"JetBrains Mono"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
