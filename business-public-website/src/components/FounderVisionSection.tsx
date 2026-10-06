'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FounderVisionData {
  badge: string;
  quote: string;
  description: string;
  imageUrl: string;
  card1Icon: string;
  card1Title: string;
  card1Desc: string;
  card2Icon: string;
  card2Title: string;
  card2Desc: string;
  card3Icon: string;
  card3Title: string;
  card3Desc: string;
}

const DEFAULT_VISION_DATA: FounderVisionData = {
  badge: 'Sukanta Dutta | AMFI-Registered MFD (ARN: 347438)',
  quote: '"Financial planning begins with understanding the person—not the product."',
  description:
    'With 15+ years of experience in Banking & Financial Services, we focus on helping clients plan for their important financial goals through a structured, personalized approach to Mutual Funds & SIPs, Retirement, and Family Protection.',
  imageUrl: '/cropped_prof_image1.png',
  card1Icon: '🎯',
  card1Title: 'Goal-Centric SIP Allocation',
  card1Desc: 'Personalized equity & debt mutual fund portfolios matched to your specific family milestones.',
  card2Icon: '🔍',
  card2Title: 'Strategy Before Product',
  card2Desc: 'Evaluating your risk profile, income, and existing commitments before suggesting financial solutions.',
  card3Icon: '🔄',
  card3Title: 'Structured 6-Step Framework',
  card3Desc: 'Understand → Plan → Invest → Protect → Review → Grow for long-term wealth creation.',
};

export default function FounderVisionSection() {
  const [data, setData] = useState<FounderVisionData>(DEFAULT_VISION_DATA);

  useEffect(() => {
    async function fetchDynamicContent() {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const json = await res.json();
          if (json.content) {
            setData((prev) => ({
              ...prev,
              badge: json.content.founder_vision_badge || prev.badge,
              quote: json.content.founder_vision_quote || prev.quote,
              description: json.content.founder_vision_description || prev.description,
              imageUrl: json.content.founder_vision_image_url || prev.imageUrl,
              card1Icon: json.content.founder_vision_card1_icon || prev.card1Icon,
              card1Title: json.content.founder_vision_card1_title || prev.card1Title,
              card1Desc: json.content.founder_vision_card1_desc || prev.card1Desc,
              card2Icon: json.content.founder_vision_card2_icon || prev.card2Icon,
              card2Title: json.content.founder_vision_card2_title || prev.card2Title,
              card2Desc: json.content.founder_vision_card2_desc || prev.card2Desc,
              card3Icon: json.content.founder_vision_card3_icon || prev.card3Icon,
              card3Title: json.content.founder_vision_card3_title || prev.card3Title,
              card3Desc: json.content.founder_vision_card3_desc || prev.card3Desc,
            }));
          }
        }
      } catch (e) {
        // Fallback to default static data cleanly
      }
    }
    fetchDynamicContent();
  }, []);

  return (
    <section id="why-us" style={{ padding: '3rem 0' }}>
      <div className="section-header">
        <h2 className="section-title">Why Families Trust Sanchay Path</h2>
        <p className="section-subtitle">
          We partner with you every step of the journey to turn financial aspirations into reality.
        </p>
      </div>

      <div className="founder-story-card">
        <div className="founder-portrait-col">
          <div className="founder-portrait-glow" />
          <div className="founder-portrait-frame">
            <Image
              src={data.imageUrl}
              alt="Sukanta Dutta - Founder & Chief Financial Advisor"
              width={340}
              height={440}
              className="founder-portrait-img-waist"
            />
          </div>
        </div>

        <div className="founder-story-content">
          <div className="trust-badge-pill" style={{ margin: '0 0 1rem 0' }}>
            <span className="pulse-dot" />
            <span>{data.badge}</span>
          </div>

          <h3 className="founder-story-heading">{data.quote}</h3>

          <p className="founder-story-text">{data.description}</p>

          <div className="why-us-features-grid">
            <div className="why-us-feature-box">
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{data.card1Icon}</span>
              <div>
                <strong>{data.card1Title}</strong>
                <p>{data.card1Desc}</p>
              </div>
            </div>

            <div className="why-us-feature-box">
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{data.card2Icon}</span>
              <div>
                <strong>{data.card2Title}</strong>
                <p>{data.card2Desc}</p>
              </div>
            </div>

            <div className="why-us-feature-box">
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{data.card3Icon}</span>
              <div>
                <strong>{data.card3Title}</strong>
                <p>{data.card3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
