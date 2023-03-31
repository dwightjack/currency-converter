import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { VitePWA } from 'vite-plugin-pwa';
import Unocss from 'unocss/vite';
import presetWind from '@unocss/preset-wind';
import { extractorSvelte } from '@unocss/core';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import { theme } from './config/theme';

function range(size, startAt = 0) {
  return Array.from(Array(size).keys()).map((i) => i + startAt);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss({
      presets: [presetWind()],
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
      theme,
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
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CurrConv',
        short_name: 'CurrConv',
        theme_color: '#dbeafe',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
  ],
});
