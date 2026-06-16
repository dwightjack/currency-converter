// @ts-check
import {
  defineConfig,
  transformerVariantGroup,
  presetWind4,
  symbols,
} from 'unocss';
import { presetIcons } from '@unocss/preset-icons';
import extractorSvelte from '@unocss/extractor-svelte';
import { theme } from 'unocss/preset-wind4';

const preset = presetWind4({
  preflights: {
    reset: true,
  },
});

export default defineConfig({
  presets: [
    preset,
    presetIcons({
      extraProperties: {
        display: 'inline-block',
      },
    }),
  ],
  transformers: [transformerVariantGroup()],
  extractors: [extractorSvelte],
  variants: [
    {
      match: (matcher) => {
        if (!matcher.startsWith('hover:')) return matcher;
        return {
          matcher: matcher.slice(6),
          parent: '@media (hover) and (pointer: fine)',
          selector: (s) => `${s}:hover:not(:active)`,
        };
      },
      order: -1,
    },
    (matcher) => {
      if (!matcher.startsWith('picker:')) return matcher;
      return {
        // slice `picker:` prefix and passed to the next variants and rules
        matcher: matcher.slice(7),
        handle: (input, next) =>
          next({
            ...input,
            pseudo: `${input.pseudo}::picker(select)`,
            noMerge: true,
          }),
      };
    },
    (matcher) => {
      if (!matcher.startsWith('picker-icon:')) return matcher;
      return {
        matcher: matcher.slice(12),
        handle: (input, next) =>
          next({
            ...input,
            pseudo: `${input.pseudo}::picker-icon`,
            noMerge: true,
          }),
      };
    },
  ],
  theme: {
    font: {
      sans: `"Inter Variable", ${theme.font.sans}`,
    },
    colors: {
      brand: theme.colors.gray,
      surface: theme.colors.slate,
      success: theme.colors.green,
    },
    supports: {
      'custom-select':
        '(appearance: base-select) and selector(select::picker(select))',
    },
  },
  shortcuts: {
    'grid-calc': 'gap-[1px] grid-cols-calc grid-rows-calc grid-areas-calc',
    'outline-brand':
      'focus-visible:(outline-brand-600 outline-2) @dark:focus-visible:outline-sky-300',
    'outline-brand-within':
      'focus-within:(outline-brand-600 outline-2) @dark:focus-within:outline-sky-300',
  },
  rules: [
    [
      /^bg-image-\$([a-z][a-z-]*)$/,
      ([, varName]) => ({ 'background-image': `var(--${varName})` }),
    ],
    [
      /^grid-area-\$([a-z][a-z-]*)$/,
      ([, varName]) => ({ 'grid-area': `var(--${varName})` }),
    ],
    [/^grid-area-\[([^\]]+)\]$/, ([, area]) => ({ 'grid-area': area })],
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
    [
      'appearance-base-select',
      [
        {
          [symbols.parent]: '@supports (appearance: base-select)',
          appearance: 'base-select',
        },
        {
          [symbols.parent]: '@supports (appearance: base-select)',
          [symbols.selector]: (selector) => `${selector}::picker(select)`,
          appearance: 'base-select',
        },
      ],
      { noMerge: true },
    ],
  ],
});
