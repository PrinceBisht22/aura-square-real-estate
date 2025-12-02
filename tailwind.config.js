/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#081C3D',
        indigo: '#1C3FAA',
        teal: '#53B8A5',
        gold: '#F4B400',
        sand: '#F3E8D7',
        slate: '#5A6175',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        card: '0 16px 35px rgba(8, 28, 61, 0.08)',
      },
    },
  },
  plugins: [],
};
