'use client';

import Image from 'next/image';
import HeaderNav from '@/components/HeaderNav';
import HeroPortrait from '@/components/HeroPortrait';
import SipCalculator from '@/components/SipCalculator';
import ContactFormSection from '@/components/ContactFormSection';
import FounderVisionSection from '@/components/FounderVisionSection';
import AboutUsSection from '@/components/AboutUsSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/918910464642?text=Hello%20Sanchay%20Path!%20I%20would%20like%20to%20know%20more%20about%20your%20financial%20advisory%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        title="Chat with Us on WhatsApp"
      >
        💬
      </a>

      {/* Floating Scroll To Top Button */}
      <ScrollToTopButton />

      {/* Responsive Header Navigation */}
      <HeaderNav />

      {/* Main Container */}
      <main className="container">
        {/* Hero Section with Split Grid & Ambient Gradient Photo Blend */}
        <section className="hero-section">
          <div className="hero-grid">
            {/* Left Content Column */}
            <div className="hero-content">
              <h1 className="hero-main-title">
                Crafting Wealth. <br />
                <span className="hero-gradient-text">Securing Your Future.</span>
              </h1>

              <p className="hero-subtext">
                Invest Today, Grow Tomorrow. Customized goal-based SIP mutual fund portfolios, comprehensive family insurance, and retirement models engineered for lasting prosperity.
              </p>

              <div className="hero-cta-group">
                <a
                  href="#contact-form"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-gold-solid"
                >
                  Schedule Free Consultation →
                </a>
                <a href="#calculator" className="btn btn-outline">
                  Calculate SIP Growth 📈
                </a>
              </div>
            </div>

            {/* Right Photo Column with Auto-Crossfade Waist-Cropped Portrait */}
            <HeroPortrait />
          </div>

          {/* Stats Banner */}
          <div className="stats-banner">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Financial Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">₹10Cr+</span>
              <span className="stat-label">Assets Under Management</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Satisfied Client Families</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">Client Retention Rate</span>
            </div>
          </div>
        </section>

        {/* About Us & 6-Step Strategy Section */}
        <AboutUsSection />

        {/* Services Section */}
        <section id="services" className="services-section">
          <div className="section-header">
            <h2 className="section-title">Core Wealth Solutions</h2>
            <p className="section-subtitle">Tailored financial strategies built around your life milestones and wealth preservation goals.</p>
          </div>

          <div className="services-cards-grid">
            {/* Service 1 */}
            <div className="service-card-item service-card-1">
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
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Explore Mutual Funds
              </a>
            </div>

            {/* Service 2 */}
            <div className="service-card-item service-card-2">
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
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Get Protection Plan
              </a>
            </div>

            {/* Service 3 */}
            <div className="service-card-item service-card-3">
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
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Consult Loan Advisor
              </a>
            </div>

            {/* Service 4 */}
            <div className="service-card-item service-card-4">
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
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Plan Retirement
              </a>
            </div>

            {/* Service 5 */}
            <div className="service-card-item service-card-5">
              <div>
                <div className="service-icon-box">💼</div>
                <h3 className="service-card-title">Portfolio Management (PMS/AIF)</h3>
                <p className="service-card-desc">
                  Dedicated high-net-worth portfolio management, specialized PMS schemes, and alternative assets.
                </p>
                <ul className="service-features-list">
                  <li>Customized HNI portfolios</li>
                  <li>Alternative investment funds</li>
                  <li>Direct stock & sector focus</li>
                </ul>
              </div>
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Explore PMS / AIF
              </a>
            </div>

            {/* Service 6 */}
            <div className="service-card-item service-card-6">
              <div>
                <div className="service-icon-box">🎓</div>
                <h3 className="service-card-title">Child Education & Marriage Fund</h3>
                <p className="service-card-desc">
                  Targeted long-term wealth compounding for child future higher education and life milestones.
                </p>
                <ul className="service-features-list">
                  <li>Inflation-adjusted target planning</li>
                  <li>Milestone-based fund lock-in</li>
                  <li>Secure corpus creation</li>
                </ul>
              </div>
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Plan Child Future
              </a>
            </div>

            {/* Service 7 */}
            <div className="service-card-item service-card-7">
              <div>
                <div className="service-icon-box">📊</div>
                <h3 className="service-card-title">Tax Planning & ELSS</h3>
                <p className="service-card-desc">
                  Section 80C tax-saving mutual funds combined with capital gain tax minimization strategies.
                </p>
                <ul className="service-features-list">
                  <li>ELSS tax-saver schemes</li>
                  <li>Shortest 3-year lock-in option</li>
                  <li>Capital gains harvesting</li>
                </ul>
              </div>
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Save Taxes Now
              </a>
            </div>

            {/* Service 8 */}
            <div className="service-card-item service-card-8">
              <div>
                <div className="service-icon-box">🏢</div>
                <h3 className="service-card-title">Corporate Treasury & Group Cover</h3>
                <p className="service-card-desc">
                  Custom corporate surplus cash management, employee gratuity funds & group mediclaim protection.
                </p>
                <ul className="service-features-list">
                  <li>Corporate liquid fund management</li>
                  <li>Group health & life policies</li>
                  <li>Executive wealth retention</li>
                </ul>
              </div>
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Corporate Advisory
              </a>
            </div>
          </div>
        </section>

        {/* SIP Calculator Section */}
        <section id="calculator">
          <SipCalculator />
        </section>

        {/* Dynamic Founder Vision & Why Sanchay Path Section */}
        <FounderVisionSection />

        {/* Contact Form Section */}
        <section id="contact">
          <ContactFormSection />
        </section>

        {/* Service Locations & Advisory Contact Banner */}
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: '2rem', margin: '3rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', backdropFilter: 'blur(20px)' }}>
          <div>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>📍 Office Address & Service Region</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              <strong>House of PADA Sova</strong>, Uttar Kowgachi Feeder Road, Shyamnagar, North 24 Parganas, West Bengal, Pin-743127<br />
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)' }}>Serving Barrackpore Sub-Division & Globally 🌐</span>
            </p>
          </div>


          <div>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>📞 Advisory Helpline</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              <strong>Sukanta Dutta</strong> | AMFI-Registered MFD (ARN: 347438)<br />
              Email: contact@sanchaypath.com
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>🕒 Advisory Hours</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              Monday - Saturday: 9:30 AM - 6:30 PM (IST)<br />
              Sunday: By Appointment Only
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {currentYear} Sanchay Path | Sukanta Dutta | AMFI-Registered Mutual Fund Distributor (ARN: 347438). All rights reserved.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.5' }}>
            Disclaimer: Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Sanchay Path provides goal-based financial planning & mutual fund distribution services.
          </p>
        </div>
      </footer>
    </>
  );
}
