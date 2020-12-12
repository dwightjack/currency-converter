// tailwind.config.js
const production = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV
module.exports = {
  purge: {
    content: [
      './src/**/*.svelte',
      // may also want to include base index.html
    ],
    css: ['./public/**/*.css'],
    enabled: production, // disable purge in dev
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      ringWidth: ['focus-visible'],
    },
  },
};
