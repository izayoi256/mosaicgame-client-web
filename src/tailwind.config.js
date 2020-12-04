const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    './src/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '70': '17.5rem',
      },
      colors: {
        theme: colors.green,
      },
      transitionProperty: {
        all: 'all',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      opacity: ['hover', 'disabled'],
    },
  },
  plugins: [],
}
