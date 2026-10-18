JNR PDF Studio registration integration

Included:
- index.html: your uploaded homepage with stronger Service Worker registration added.
- block.js: retains the tap-highlight behavior and adds a safe one-time reload when the new Service Worker takes control.

Deploy both files to the website root. Keep /sw.js and /manifest.json at the same root as well.
The registration uses scope "/" and updateViaCache "none", then checks for updates on load, online, focus, and when the page becomes visible.

Important:
- Service Worker requires HTTPS (Vercel HTTPS is suitable) or localhost.
- This does not itself make an old deployed sw.js fresh; ensure the latest sw.js is deployed.
- CDN/server cache headers still matter. Configure /sw.js to revalidate (for example Cache-Control: no-cache, must-revalidate).
- If your project has other code in block.js that was not included in the uploaded file, merge rather than overwrite it.
