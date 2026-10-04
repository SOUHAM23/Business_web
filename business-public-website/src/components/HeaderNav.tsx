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
          <Image
            src="/Logo.png"
            alt="Sanchay Path Logo"
            width={38}
            height={38}
            style={{ objectFit: 'contain' }}
          />
          <span className="brand-name">Sanchay Path</span>
        </Link>

        {/* Desktop & Mobile Actions */}
        <div className="header-right-group">
          {/* Desktop Navigation */}
          <nav className="desktop-nav">
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
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-nav-links">
            <Link href="#services" className="mobile-nav-item" onClick={closeMenu}>💼 Services</Link>
            <Link href="#calculator" className="mobile-nav-item" onClick={closeMenu}>📈 SIP Calculator</Link>
            <Link href="#why-us" className="mobile-nav-item" onClick={closeMenu}>🎯 Why Sanchay Path</Link>
            <Link href="#contact" className="mobile-nav-item" onClick={closeMenu}>📞 Contact & Consultation</Link>
            <a href="#contact" className="btn btn-gold-solid mobile-menu-cta" onClick={closeMenu}>
              Schedule Free Consultation →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
