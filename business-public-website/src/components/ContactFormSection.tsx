'use client';

import { useState } from 'react';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'SIP & Mutual Funds',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedbackMsg('');

    if (formData.phone.length !== 10) {
      setStatus('error');
      setFeedbackMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedbackMsg(data.message || 'Thank you! Your enquiry has been received.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'SIP & Mutual Funds',
          message: '',
        });
      } else {
        setStatus('error');
        setFeedbackMsg(data.error || 'Failed to submit request. Please check your inputs.');
      }
    } catch (err) {
      setStatus('error');
      setFeedbackMsg('Network connection error. Please try again.');
    }
  };

  return (
    <div className="contact-section-container">
      <div className="contact-grid-card">
        {/* Left Side: Value Props & Contact Info */}
        <div className="contact-info-column">
          <span className="section-tag">💬 Get Personalized Advice</span>
          <h2 className="contact-heading">Ready to Secure Your Financial Freedom?</h2>
          <p className="contact-desc">
            Schedule a confidential 1-on-1 session with our certified financial wealth managers. We analyze your current assets, risk appetite, and tax profile to craft a customized wealth roadmap.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <strong>Zero Bias Advisory</strong>
                <p>Objective mutual fund & insurance recommendations with your best interests first.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div>
                <strong>Strict Confidentiality</strong>
                <p>Your privacy and financial records are protected by enterprise-grade RLS security.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <strong>100% Tax-Optimized</strong>
                <p>Maximized compounding with efficient tax planning strategies.</p>
              </div>
            </div>
          </div>

          <div className="direct-contact-bar" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', maxWidth: '100%' }}>
            <div className="contact-chip" style={{ fontSize: '0.85rem', display: 'flex', flexWrap: 'wrap', whiteSpace: 'normal', wordBreak: 'break-word', width: '100%' }}>
              <span>📍 Office Address:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                House of PADA Sova, Uttar Kowgachi Feeder Road, Shyamnagar, North 24 Parganas, West Bengal, Pin-743127
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
              <div className="contact-chip">
                <span>📞 Mobile:</span>
                <a href="tel:+918910464642">+91 89104 64642</a>
              </div>
              <div className="contact-chip">
                <span>✉️ Email:</span>
                <a href="mailto:contact@sanchaypath.com">contact@sanchaypath.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="contact-form-column">
          <div className="form-card-wrapper" id="contact-form">
            <h3 className="form-heading">Book Confidential Consultation</h3>
            <p className="form-subheading">Fill in your details for a call from an advisor within 24 hours.</p>

            {status === 'success' && (
              <div className="alert-box alert-success-box" role="alert">
                ✅ {feedbackMsg}
              </div>
            )}

            {status === 'error' && (
              <div className="alert-box alert-danger-box" role="alert">
                ❌ {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="custom-form">
              <div className="form-field-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-control"
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="phone">Mobile Number (10 Digits) *</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="e.g. 8910464642"
                  value={formData.phone}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: numericValue });
                  }}
                  className="input-control"
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="email">Email Address (Optional)</label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-control"
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="service">Service Category *</label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="input-control select-control"
                >
                  <option value="SIP & Mutual Funds">SIP & Mutual Funds</option>
                  <option value="Insurance Solutions">Insurance Solutions</option>
                  <option value="Loans & Credit Advisory">Loans & Credit Advisory</option>
                  <option value="Retirement Planning">Retirement Planning</option>
                  <option value="Portfolio Management (PMS / AIF)">Portfolio Management (PMS / AIF)</option>
                  <option value="Child Education & Marriage Fund">Child Education & Marriage Fund</option>
                  <option value="Tax Planning & ELSS">Tax Planning & ELSS</option>
                  <option value="Corporate Treasury & Group Cover">Corporate Treasury & Group Cover</option>
                  <option value="General Advisory Enquiry">General Advisory Enquiry</option>
                </select>
              </div>

              <div className="form-field-group">
                <label htmlFor="message">Financial Goal / Notes (Optional)</label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Briefly state your financial investment goal..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-control textarea-control"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-gold-solid"
              >
                {status === 'loading' ? 'Submitting Request...' : 'Request Financial Callback'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
