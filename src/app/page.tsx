import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import WatermarkLogo from '@/components/WatermarkLogo';
import NotifyForm from '@/components/NotifyForm';
import StatusCard from '@/components/StatusCard';

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Background Watermark Logo with Parallax */}
      <WatermarkLogo />

      {/* Ambient Glow Effects */}
      <div className="ambient-glow glow-1" aria-hidden="true" />
      <div className="ambient-glow glow-2" aria-hidden="true" />

      {/* Navigation Header */}
      <header className="header">
        <div className="container header-content">
          <div className="brand-mini">
            <div className="mini-logo-container">
              <Image
                src="/Logo.png"
                alt="Sanchay Path Logo"
                width={34}
                height={34}
                className="mini-logo"
              />
            </div>
            <span className="brand-title">Sanchay Path</span>
          </div>

          <div className="header-actions">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <main className="main-wrapper">
        <div className="container">
          <div className="glass-card">
            
            {/* Live Operational Badge */}
            <div className="status-badge">
              <span className="pulse-dot" />
              <span className="status-text">Site Running &bull; Work Under Progress</span>
            </div>

            {/* Central Main Logo Display */}
            <div className="hero-logo-wrapper">
              <div className="logo-glow" />
              <div className="hero-logo-container">
                <Image
                  src="/Logo.png"
                  alt="Sanchay Path - Invest Today, Grow Tomorrow"
                  width={170}
                  height={170}
                  priority
                  className="hero-logo"
                />
              </div>
            </div>

            {/* Titles & Tagline */}
            <h1 className="main-title">Crafting a Smarter Financial Future</h1>
            <p className="tagline">Invest Today, Grow Tomorrow.</p>

            <p className="description">
              Our website is live, fully operational, and currently undergoing exciting enhancements. We are preparing a seamless financial web experience for you.
            </p>

            {/* Development Progress Indicator */}
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Platform Development Progress</span>
                <span className="progress-percent">85%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Newsletter Notification Input */}
            <NotifyForm />

            {/* Action Cards Grid */}
            <div className="action-grid">
              <a href="mailto:info@sanchaypath.com" className="action-card">
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="action-info">
                  <span className="action-title">Get in Touch</span>
                  <span className="action-sub">info@sanchaypath.com</span>
                </div>
              </a>

              <StatusCard />
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>&copy; {currentYear} Sanchay Path. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
