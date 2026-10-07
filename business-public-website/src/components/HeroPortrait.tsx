'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const PROFILE_IMAGES = [
  {
    src: '/cropped_prof_image2.png',
    alt: 'Sukanta Dutta - AMFI Registered Mutual Fund Distributor',
    caption: 'Sukanta Dutta',
    sub: 'AMFI Registered MFD • ARN: 347438',
  },
  {
    src: '/cropped_prof_image1.png',
    alt: 'Sukanta Dutta - Chief Financial Advisor',
    caption: 'Sukanta Dutta',
    sub: '15+ Years Banking & Wealth Experience',
  },
];

export default function HeroPortrait() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PROFILE_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-portrait-wrapper">
      {/* Background Ambient Radial Glow */}
      <div className="hero-portrait-glow" />

      {/* Waist-Cropped Photo Frame Container */}
      <div className="hero-portrait-frame">
        <div className="portrait-image-stack">
          {PROFILE_IMAGES.map((img, idx) => (
            <div
              key={img.src}
              className={`portrait-slide ${idx === activeIdx ? 'slide-active' : ''}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={500}
                height={550}
                quality={100}
                className="portrait-img-waist"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Floating Glassmorphic Executive Advisor Credential Badge */}
        <div className="portrait-floating-badge">
          <div className="badge-icon-shield">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="badge-text-group">
            <span className="badge-title">{PROFILE_IMAGES[activeIdx].caption}</span>
            <span className="badge-subtitle">{PROFILE_IMAGES[activeIdx].sub}</span>
          </div>
          <div className="badge-verified-tag">
            <span>VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
