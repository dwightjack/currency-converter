import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import Unocss from 'unocss/vite';
import { colors } from '@unocss/preset-mini';

/* global process */

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      const replacements = {
        lightTheme: '#dbeafe',
        darkTheme: colors.gray[800],
      };
      return html.replaceAll(
        /\{\{([^}]+?)\}\}/g,
        (_, match) => replacements[match],
      );
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    htmlPlugin(),
    Unocss(),
    VitePWA({
      registerType: 'autoUpdate',
      disable: !!process.env.VITE_IS_TEST,
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
    svelte(),
  ],
});
