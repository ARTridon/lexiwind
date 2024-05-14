/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'lexiwind-',
  corePlugins: {
    preflight: false,
  },
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './*.html',
  ],
  theme: {},
  plugins: [],
};
