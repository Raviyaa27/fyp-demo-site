/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1b2432',
        paper: '#f7f9fc',
        line: '#dde4ee',
        accent: '#1d4ed8',
        region1: '#2563eb',
        region2: '#059669',
        region3: '#d97706',
        region4: '#7c3aed',
        global: '#be123c',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
