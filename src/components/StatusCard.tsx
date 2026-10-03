'use client';

import { useState } from 'react';

export default function StatusCard() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);
    setTimeout(() => setActive(false), 4000);
  };

  return (
    <div className="action-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="action-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div className="action-info">
        <span className="action-title">System Health</span>
        <span className="action-sub">
          {active ? '🟢 Uptime: 100% | Operational' : 'All Systems Operational'}
        </span>
      </div>
    </div>
  );
}
