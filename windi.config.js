import { defineConfig } from 'windicss/helpers';
import plugin from 'windicss/plugin';

function range(size, startAt = 0) {
  return Array.from(Array(size).keys()).map((i) => i + startAt);
}

export default defineConfig({
  extract: {
    include: ['src/**/*.svelte'],
  },
  safelist: [
    range(20).map((i) => `gap-${i}`),
    range(20).map((i) => `gap-x-${i}`),
    range(20).map((i) => `gap-y-${i}`),
    ['center', 'stretch', 'baseline', 'start', 'end'].map((v) => `items-${v}`),
  ],
  plugins: [
    plugin(({ addDynamic }) => {
      addDynamic('aspect', ({ Utility }) => {
        return Utility.handler
          .handleFraction((str) => str)
          .handleNumber(0, undefined, 'float')
          .createProperty('aspect-ratio');
      });
      addDynamic('bg-image', ({ Utility }) => {
        return Utility.handler
          .handleVariable()
          .createProperty('background-image');
      });
    }),
  ],
});
