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
    'outline-brand':
      'outline-none focus-visible:outline-brand-600 @dark:focus-visible:outline-brand-dark-400',
    'outline-brand-within':
      'outline-none focus-within:outline-brand-600 @dark:focus-within:outline-brand-dark-400',
  },
  rules: [
    [/^aspect-(\d+\/\d+)$/, ([_, ratio]) => ({ 'aspect-ratio': ratio })],
    [
      /^bg-image-\$([a-z][a-z-]*)$/,
      ([_, varName]) => ({ 'background-image': `var(--${varName})` }),
    ],
    [
      /^grid-area-\$([a-z][a-z-]*)$/,
      ([_, varName]) => ({ 'grid-area': `var(--${varName})` }),
    ],
    [/^grid-area-\[([^\]]+)\]$/, ([_, area]) => ({ 'grid-area': area })],
  ],
});
