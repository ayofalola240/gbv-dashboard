/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}' // Make sure this matches your project structure
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#008751',
        'light-green': '#d0f0e0',
        'dark-green': '#00572e',
        'primary-white': '#FFFFFF',
        'light-grey': '#f4f6f8', // For backgrounds
        'text-dark': '#333333',
        'text-light': '#FFFFFF',
        'border-color': '#e0e0e0'
      },
      fontFamily: {
        // You can define a primary font here if desired
        // sans: ['Inter', 'sans-serif'], // Example
      }
    }
  },
  plugins: []
};
