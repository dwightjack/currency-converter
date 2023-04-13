import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { VitePWA } from 'vite-plugin-pwa';
import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss(),
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
