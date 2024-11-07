import { mount } from 'svelte';
import App from './App.svelte';
import '@fontsource-variable/inter';
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

mount(App, { target: document.body });
