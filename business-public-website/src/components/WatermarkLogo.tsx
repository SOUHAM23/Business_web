'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function WatermarkLogo() {
  const [transform, setTransform] = useState('translate(-50%, -50%)');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth <= 768) return;
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (clientX - centerX) / 40;
      const moveY = (clientY - centerY) / 40;

      setTransform(`translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="watermark-container" style={{ transform }} aria-hidden="true">
      <Image
        src="/sanlogo.png"
        alt="Sanchay Path Watermark"
        width={800}
        height={800}
        priority
        className="watermark-logo"
      />
    </div>
  );
}
