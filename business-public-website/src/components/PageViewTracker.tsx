'use client';

import { useEffect } from 'react';

export default function PageViewTracker() {
  useEffect(() => {
    try {
      const sessionKey = 'sp_session_tracked';
      const isNewSession = !sessionStorage.getItem(sessionKey);
      if (isNewSession) {
        sessionStorage.setItem(sessionKey, '1');
      }

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-new-session': isNewSession ? '1' : '0',
        },
      }).catch(() => {
        // Silent catch to preserve user page load performance
      });
    } catch (e) {
      // Ignore sessionStorage restriction errors
    }
  }, []);

  return null;
}
