/*
 * Add this update handler to your existing block.js (or include it once).
 * Do not replace your current block.js if it contains other app features.
 */
(() => {
  if (!('serviceWorker' in navigator)) return;

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    // The newly activated worker now controls this page. Reload once so the
    // user sees the newly deployed HTML/CSS/JS rather than the old DOM.
    window.location.reload();
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'JNR_SW_ACTIVATED') {
      console.info('[JNR PDF Studio] Updated service worker:', event.data.version);
    }
  });
})();
