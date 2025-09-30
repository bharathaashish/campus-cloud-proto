/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        gray: {
          50: 'var(--tw-bg-gray-50)',
          100: 'var(--tw-bg-gray-100)',
          200: 'var(--tw-bg-gray-200)',
          500: 'var(--tw-bg-gray-500)',
          600: 'var(--tw-bg-gray-600)',
          700: 'var(--tw-bg-gray-700)',
          800: 'var(--tw-bg-gray-800)',
          900: 'var(--tw-bg-gray-900)',
        },
        blue: {
          500: 'var(--tw-bg-blue-500)',
          600: 'var(--tw-bg-blue-600)',
        },
        red: {
          500: 'var(--tw-bg-red-500)',
          600: 'var(--tw-bg-red-600)',
        },
        green: {
          500: 'var(--tw-bg-green-500)',
          600: 'var(--tw-bg-green-600)',
        },
        orange: {
          50: 'var(--tw-bg-orange-50)',
          600: 'var(--tw-text-orange-600)',
        },
        white: 'var(--tw-bg-white)',
        black: 'var(--tw-text-black)',
      },
    },
  },
  plugins: [],
}
