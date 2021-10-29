import App from './App.svelte';
import 'virtual:windi.css';

new App({
  target: document.body,
});

if (import.meta.env.DEV) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}
