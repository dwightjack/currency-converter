import App from './App.svelte';
import '@fontsource-variable/inter';
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

new App({
  target: document.body,
});
