'use client';

import Image from 'next/image';
import HeaderNav from '@/components/HeaderNav';
import HeroPortrait from '@/components/HeroPortrait';
import SipCalculator from '@/components/SipCalculator';
import ContactFormSection from '@/components/ContactFormSection';
import FounderVisionSection from '@/components/FounderVisionSection';
import AboutUsSection from '@/components/AboutUsSection';
import ServicesSection from '@/components/ServicesSection';
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

        {/* Services Section Component */}
        <ServicesSection />

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
            <a
              href="https://maps.app.goo.gl/GfvnXzcKhiHrCjuK8?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>📍 Office Address & Service Region (View Location ↗)</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
                <strong>House of PADA Sova</strong>, Uttar Kowgachi Feeder Road, Shyamnagar, North 24 Parganas, West Bengal, Pin-743127<br />
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Serving Barrackpore Sub-Division & Globally 🌐</span>
              </p>
            </a>
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
