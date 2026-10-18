JNR PDF Studio — PWA update pack

Files:
- sw.js: replace the deployed /sw.js with this file.
- manifest.json: replace the deployed /manifest.json with this file.
- block-update-snippet.js: MERGE this snippet into your existing block.js; do not overwrite block.js if it contains other code.

Important:
1. Ensure index.html includes <link rel="manifest" href="/manifest.json">.
2. Register the worker from a page served over HTTPS (or localhost), with root scope:
   navigator.serviceWorker.register('/sw.js', { scope: '/' });
3. The worker uses network-first for HTML and same-origin GET assets. This prioritizes fresh deployments while keeping cached fallback for offline use.
4. Server/CDN cache headers matter too. For /sw.js and /index.html and other HTML pages, use Cache-Control: no-cache, must-revalidate (or no-store for HTML if appropriate). For versioned assets, long-lived immutable caching is fine.
5. File handlers are supported only by compatible installed Chromium-based PWAs and may require the user to enable/approve file-opening integration. They do not grant broad filesystem access.
6. Camera access must be requested by page code using getUserMedia() after a user action and requires HTTPS/user approval. Gallery/files should use <input type="file"> or the File System Access API where supported. A manifest cannot force-grant camera, gallery, or filesystem permissions.
7. If you deploy under a subpath instead of the domain root, update all leading-slash URLs and the service-worker scope.
