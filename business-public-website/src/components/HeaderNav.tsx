'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-content">
        <Link href="/" className="brand-link" onClick={closeMenu}>
          <div className="brand-logo-wrapper">
            <Image
              src="/Logo.png"
              alt="Sanchay Path Logo"
              width={32}
              height={32}
              className="brand-logo-img"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-name">Sanchay Path</span>
            <span className="brand-tagline">
              সমৃদ্ধির নতুন দিশারি
            </span>
          </div>
        </Link>

        {/* Desktop & Mobile Actions */}
        <div className="header-right-group">
          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link href="#about" className="nav-link-item">About Us</Link>
            <Link href="#services" className="nav-link-item">Services</Link>
            <Link href="#calculator" className="nav-link-item">SIP Calculator</Link>
            <Link href="#why-us" className="nav-link-item">Why Us</Link>
            <Link href="#contact" className="nav-link-item">Contact</Link>
          </nav>

          <ThemeToggle />

          <a href="#contact" className="btn btn-gold-solid desktop-cta" onClick={closeMenu}>
            Book Call
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-nav-links">
            <Link href="#about" className="mobile-nav-item" onClick={closeMenu}>
              <span>👤</span> About Sukanta Dutta
            </Link>
            <Link href="#services" className="mobile-nav-item" onClick={closeMenu}>
              <span>💼</span> Core Advisory Services
            </Link>
            <Link href="#calculator" className="mobile-nav-item" onClick={closeMenu}>
              <span>📈</span> Goal SIP Calculator
            </Link>
            <Link href="#why-us" className="mobile-nav-item" onClick={closeMenu}>
              <span>🎯</span> 6-Step Strategy & Vision
            </Link>
            <Link href="#contact" className="mobile-nav-item" onClick={closeMenu}>
              <span>📞</span> Direct Consultation
            </Link>
            <a href="#contact" className="btn btn-gold-solid mobile-menu-cta" onClick={closeMenu}>
              Schedule Free Consultation →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

