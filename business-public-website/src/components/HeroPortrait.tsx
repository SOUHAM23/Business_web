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

        {/* Floating High-Contrast Advisor Name Badge */}
        <div className="portrait-floating-badge">
          <span className="badge-title">{PROFILE_IMAGES[activeIdx].caption}</span>
          <span className="badge-subtitle">{PROFILE_IMAGES[activeIdx].sub}</span>
        </div>
      </div>
    </div>
  );
}
