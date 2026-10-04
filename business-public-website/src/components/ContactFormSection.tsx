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

          <div className="direct-contact-bar">
            <div className="contact-chip">
              <span>📞 Mobile:</span>
              <a href="tel:+919876543210">+91 98765 43210</a>
            </div>
            <div className="contact-chip">
              <span>✉️ Email:</span>
              <a href="mailto:info@sanchaypath.com">info@sanchaypath.com</a>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="contact-form-column">
          <div className="form-card-wrapper">
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
                <label htmlFor="phone">Mobile Number *</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  <option value="Retirement & Wealth Management">Retirement & Wealth Management</option>
                  <option value="General Enquiry">General Advisory Enquiry</option>
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
