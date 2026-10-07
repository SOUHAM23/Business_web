'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="header">
      <div className="container header-content">
        <Link href="/" className="brand-link" onClick={closeMenu}>
          <div className="brand-logo-wrapper">
            <Image
              src="/sanlogo.png"
              alt="Sanchay Path Logo"
              width={42}
              height={42}
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

          <a
            href="#contact-form"
            className="btn btn-gold-solid desktop-cta"
            onClick={(e) => {
              closeMenu();
              e.preventDefault();
              document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Book Call
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
        <div id="mobile-menu-drawer" className="mobile-menu-overlay">
          <nav className="mobile-nav-links">
            <Link href="#about" className="mobile-nav-item" onClick={closeMenu}>
              <span>About Sukanta Dutta</span>
            </Link>
            <Link href="#services" className="mobile-nav-item" onClick={closeMenu}>
              <span>Core Advisory Services</span>
            </Link>
            <Link href="#calculator" className="mobile-nav-item" onClick={closeMenu}>
              <span>Goal SIP Calculator</span>
            </Link>
            <Link href="#why-us" className="mobile-nav-item" onClick={closeMenu}>
              <span>6-Step Strategy & Vision</span>
            </Link>
            <a
              href="#contact-form"
              className="mobile-nav-item"
              onClick={(e) => {
                closeMenu();
                e.preventDefault();
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Direct Consultation</span>
            </a>
            <a
              href="#contact-form"
              className="btn btn-gold-solid mobile-menu-cta"
              onClick={(e) => {
                closeMenu();
                e.preventDefault();
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Schedule Free Consultation →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
