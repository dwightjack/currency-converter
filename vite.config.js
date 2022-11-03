import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import WindiCSS from 'vite-plugin-windicss';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    WindiCSS(),
    VitePWA({ registerType: 'autoUpdate' }),
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
  ],
});
