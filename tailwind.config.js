/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      container: {
        padding: {
          DEFAULT: '0.5rem',
          sm: '0.5rem',
          lg: '4rem',
          xl: '6rem',
        },
        center: true,
      },
      backgroundImage: {
        'landing-pae': "url('/img/landing.jpg')",
      }
    },
  },
  plugins: [],
}
