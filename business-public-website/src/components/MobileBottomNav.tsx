'use client';

export default function MobileBottomNav() {
  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bar-content">
        <a href="#services" className="mobile-bar-item">
          <span className="bar-icon">💼</span>
          <span className="bar-label">Services</span>
        </a>

        <a href="#calculator" className="mobile-bar-item">
          <span className="bar-icon">📈</span>
          <span className="bar-label">SIP Calc</span>
        </a>

        <a href="tel:+919876543210" className="mobile-bar-item highlight-item">
          <span className="bar-icon">📞</span>
          <span className="bar-label">Call Us</span>
        </a>

        <a
          href="https://wa.me/919876543210?text=Hello%20Sanchay%20Path!%20I%20would%20like%20to%20know%20more%20about%20your%20financial%20advisory%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-bar-item whatsapp-item"
        >
          <span className="bar-icon">💬</span>
          <span className="bar-label">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
