import {
  defineConfig,
  transformerVariantGroup,
  presetUno,
  presetIcons,
} from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';
import { colors } from '@unocss/preset-mini';

function range(size, startAt = 0) {
  return Array.from(Array(size).keys()).map((i) => i + startAt);
}

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerVariantGroup()],
  extractors: [extractorSvelte],
  safelist: [
    ...range(20).map((i) => `gap-${i}`),
    ...range(20).map((i) => `gap-x-${i}`),
    ...range(20).map((i) => `gap-y-${i}`),
    ...['center', 'stretch', 'baseline', 'start', 'end'].map(
      (v) => `items-${v}`,
    ),
  ],
  theme: {
    colors: {
      brand: colors.blue,
      surface: colors.white,
      typo: colors.gray,
      success: colors.green,
      brandDark: colors.sky,
      surfaceDark: colors.gray[800],
      typoDark: colors.gray[200],
    },
  },
  shortcuts: {
    'grid-calc': 'gap-[1px] grid-cols-calc grid-rows-calc grid-areas-calc',
    'outline-brand':
      'outline-none focus-visible:outline-brand-600 @dark:focus-visible:outline-brand-dark-400',
    'outline-brand-within':
      'outline-none focus-within:outline-brand-600 @dark:focus-within:outline-brand-dark-400',
  },
  rules: [
    [
      /^bg-image-\$([a-z][a-z-]*)$/,
      ([_, varName]) => ({ 'background-image': `var(--${varName})` }),
    ],
    [
      /^grid-area-\$([a-z][a-z-]*)$/,
      ([_, varName]) => ({ 'grid-area': `var(--${varName})` }),
    ],
    [/^grid-area-\[([^\]]+)\]$/, ([_, area]) => ({ 'grid-area': area })],
    [
      'grid-cols-calc',
      { 'grid-template-columns': 'repeat(4, minmax(calc(25% - 1px), 4rem))' },
    ],
    [
      'grid-rows-calc',
      {
        'grid-template-rows': 'repeat(6, minmax(calc((100% - 6px) / 6), 4rem))',
      },
    ],
    [
      'grid-areas-calc',
      {
        'grid-template-areas': `
        'output output output output'
        'reset reset divide times'
        'b7 b8 b9 minus'
        'b4 b5 b6 plus'
        'b1 b2 b3 eq'
        'b0 b0 dot eq'`,
      },
    ],
  ],
});
