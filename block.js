/* JNR PDF Studio — shared UI helpers and PWA update handling */
(() => {
  // Existing tap behavior retained.
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-tap-highlight-color: transparent !important;
      -webkit-touch-callout: none !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  document.addEventListener('touchstart', function () {
    // Reserved for optional touch-only behavior.
  }, { passive: true });

  if (!('serviceWorker' in navigator)) return;

  let reloadScheduled = false;

  // A controller change means the newly activated worker now controls this page.
  // Reload at most once per page lifecycle to display the deployed HTML/assets.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadScheduled) return;
    reloadScheduled = true;
    window.location.reload();
  });

  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'JNR_SW_ACTIVATED') {
      console.info('[JNR PDF Studio] Updated worker active:', event.data.version || 'latest');
    }
  });
})();
