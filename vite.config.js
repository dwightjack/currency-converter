import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import Unocss from 'unocss/vite';
import { colors } from '@unocss/preset-mini';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/* global process */

const darkManifestPlugin = (darkColor) => {
  let outDir;
  return {
    name: 'dark-manifest',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const src = join(outDir, 'manifest.webmanifest');
      const dest = join(outDir, 'manifest-dark.webmanifest');
      const manifest = JSON.parse(await readFile(src, 'utf-8'));
      manifest.theme_color = darkColor;
      manifest.background_color = darkColor;
      await writeFile(dest, JSON.stringify(manifest));
    },
    transformIndexHtml() {
      return [
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: '/manifest-dark.webmanifest',
            media: '(prefers-color-scheme: dark)',
          },
          injectTo: 'head',
        },
      ];
    },
  };
};

// const htmlPlugin = () => {
//   return {
//     name: 'html-transform',
//     transformIndexHtml(html) {
//       const replacements = {
//         darkTheme: colors.cyan[900],
//       };
//       return html.replaceAll(
//         /\{\{([^}]+?)\}\}/g,
//         (_, match) => replacements[match],
//       );
//     },
//   };
// };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // htmlPlugin(),
    Unocss(),
    VitePWA({
      registerType: 'autoUpdate',
      disable: !!process.env.VITE_IS_TEST,
      manifest: {
        name: 'CurrConv',
        short_name: 'CurrConv',
        theme_color: colors.sky[50],
        background_color: '#ff0000',
        icons: [
          { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
          {
            src: '/icon-mask.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
          { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/symbols.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\/api\/rates.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // <== 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    svelte(),
    darkManifestPlugin(colors.cyan[900]),
  ],
});
