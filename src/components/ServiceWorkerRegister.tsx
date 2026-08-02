'use client';

import { useEffect } from 'react';

/** Registers /public/sw.js on mount so static awareness content is available offline (PWA). */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Non-fatal — the app still works fully online without the SW.
      });
    }
  }, []);
  return null;
}
