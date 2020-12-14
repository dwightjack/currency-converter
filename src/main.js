import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'world',
  },
});

if (!__DEV__) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}
