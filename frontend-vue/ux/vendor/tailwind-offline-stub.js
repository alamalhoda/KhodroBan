// Offline stub for UX prototype pages.
// These UX HTML files used tailwind CDN at runtime. In strict-offline mode,
// we intentionally avoid remote loading and keep a minimal readable fallback.
(function applyOfflineUxFallback() {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    html, body {
      font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
      background: #f6f6f8;
      color: #121317;
    }
  `;
  document.head.appendChild(style);

  // eslint-disable-next-line no-console
  console.warn('[offline-ux] Tailwind CDN disabled. Rendering simplified local fallback.');
})();
