import Image from 'next/image';
import HeaderNav from '@/components/HeaderNav';
import SipCalculator from '@/components/SipCalculator';
import ContactFormSection from '@/components/ContactFormSection';
import Link from 'next/link';

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/919876543210?text=Hello%20Sanchay%20Path!%20I%20would%20like%20to%20know%20more%20about%20your%20financial%20advisory%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        title="Chat with Us on WhatsApp"
      >
        💬
      </a>

      {/* Responsive Header Navigation */}
      <HeaderNav />

      {/* Main Container */}
      <main className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="trust-badge-pill">
            <span className="pulse-dot" />
            <span>Certified Wealth Management & Financial Advisory</span>
          </div>

          <h1 className="hero-main-title">
            Crafting Wealth. <br />
            <span className="hero-gradient-text">Securing Your Future.</span>
          </h1>

          <p className="hero-subtext">
            Invest Today, Grow Tomorrow. Customized goal-based SIP mutual fund portfolios, comprehensive family insurance, and retirement models engineered for lasting prosperity.
          </p>

          <div className="hero-cta-group">
            <a href="#contact" className="btn btn-gold-solid">
              Schedule Free Consultation →
            </a>
            <a href="#calculator" className="btn btn-outline">
              Calculate SIP Growth
            </a>
          </div>

          {/* Stats Banner */}
          <div className="stats-banner">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Financial Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">₹500Cr+</span>
              <span className="stat-label">Assets Under Management</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Satisfied Client Families</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">Client Retention Rate</span>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <div className="section-header">
            <h2 className="section-title">Core Wealth Solutions</h2>
            <p className="section-subtitle">Tailored financial strategies built around your life milestones and wealth preservation goals.</p>
          </div>

          <div className="services-cards-grid">
            <div className="service-card-item">
              <div>
                <div className="service-icon-box">📈</div>
                <h3 className="service-card-title">SIP & Mutual Funds</h3>
                <p className="service-card-desc">
                  Disciplined systematic investment plans and goal-oriented equity & debt fund allocation.
                </p>
                <ul className="service-features-list">
                  <li>Goal-based asset allocation</li>
                  <li>Index & Multi-cap diversification</li>
                  <li>Regular portfolio rebalancing</li>
                </ul>
              </div>
              <a href="#contact" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Explore Mutual Funds</a>
            </div>

            <div className="service-card-item">
              <div>
                <div className="service-icon-box">🛡️</div>
                <h3 className="service-card-title">Insurance Solutions</h3>
                <p className="service-card-desc">
                  Comprehensive risk protection covering term life, health insurance, and emergency liquidity.
                </p>
                <ul className="service-features-list">
                  <li>High-cover term life policies</li>
                  <li>Cashless health & family cover</li>
                  <li>Critical illness protection</li>
                </ul>
              </div>
              <a href="#contact" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Get Protection Plan</a>
            </div>

            <div className="service-card-item">
              <div>
                <div className="service-icon-box">🏦</div>
                <h3 className="service-card-title">Loans & Credit Advisory</h3>
                <p className="service-card-desc">
                  Low-interest capital sourcing for home purchases, business expansion, and LAP refinancing.
                </p>
                <ul className="service-features-list">
                  <li>Competitive interest rates</li>
                  <li>Loan against property (LAP)</li>
                  <li>Debt restructuring guidance</li>
                </ul>
              </div>
              <a href="#contact" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Consult Loan Advisor</a>
            </div>

            <div className="service-card-item">
              <div>
                <div className="service-icon-box">🏖️</div>
                <h3 className="service-card-title">Retirement Planning</h3>
                <p className="service-card-desc">
                  Pension fund build-up and capital preservation strategies for worry-free post-retirement living.
                </p>
                <ul className="service-features-list">
                  <li>Guaranteed annuity options</li>
                  <li>Tax-efficient withdrawal plans</li>
                  <li>Wealth preservation framework</li>
                </ul>
              </div>
              <a href="#contact" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Plan Retirement</a>
            </div>
          </div>
        </section>

        {/* SIP Calculator Section */}
        <section id="calculator">
          <SipCalculator />
        </section>

        {/* Why Sanchay Path Section */}
        <section id="why-us" style={{ padding: '3rem 0' }}>
          <div className="section-header">
            <h2 className="section-title">Why Families Trust Sanchay Path</h2>
            <p className="section-subtitle">We partner with you every step of the journey to turn financial aspirations into reality.</p>
          </div>

          <div className="services-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="service-card-item" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div className="service-icon-box">🎯</div>
              <h3 className="service-card-title">Goal-Centric Approach</h3>
              <p className="service-card-desc">Every investment plan is custom-built for your specific family milestones like child education, home purchase, and retirement.</p>
            </div>

            <div className="service-card-item" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div className="service-icon-box">🔒</div>
              <h3 className="service-card-title">Enterprise Security</h3>
              <p className="service-card-desc">Your financial data and records are protected by enterprise-grade Row Level Security and zero-leak architecture.</p>
            </div>

            <div className="service-card-item" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div className="service-icon-box">📊</div>
              <h3 className="service-card-title">Transparent Tracking</h3>
              <p className="service-card-desc">Receive regular portfolio health reports and 12-hour sync reports so you always know where your money is growing.</p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact">
          <ContactFormSection />
        </section>

        {/* Office Info Footer Banner */}
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: '2rem', margin: '3rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>📍 Registered Office</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Suite 402, Financial Tower, MG Road, Bengaluru, Karnataka - 560001
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>📞 Advisory Helpline</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Phone: +91 98765 43210<br />
              Email: info@sanchaypath.com
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🕒 Office Hours</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Monday - Saturday: 9:30 AM - 6:30 PM<br />
              Sunday: Closed
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {currentYear} Sanchay Path Financial Services. All rights reserved.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Disclaimer: Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.
          </p>
        </div>
      </footer>
    </>
  );
}
