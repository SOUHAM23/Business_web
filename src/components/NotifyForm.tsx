'use client';

import { useState, FormEvent } from 'react';

export default function NotifyForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you! You will be notified when we launch.');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="notify-form" noValidate>
      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for launch updates"
          aria-label="Email Address for launch notifications"
        />
        <button type="submit" className="submit-btn" disabled={status === 'loading'}>
          <span>{status === 'loading' ? 'Saving...' : 'Get Notified'}</span>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      {message && (
        <div className={`form-feedback ${status}`} aria-live="polite">
          {message}
        </div>
      )}
    </form>
  );
}
