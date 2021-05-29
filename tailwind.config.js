// tailwind.config.js
module.exports = {
  purge: {
    content: [
      './src/**/*.svelte',
      // may also want to include base index.html
    ],
    options: {
      safelist: [/^(?!(|.*?:)cursor-move).+-move$/, /^gap-([x-y]-|)\d+$/],
    },
    preserveHtmlElements: false,
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      ringWidth: ['focus-visible'],
    },
  },
};
