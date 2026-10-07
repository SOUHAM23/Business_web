'use client';

import { useState } from 'react';

export default function AboutUsSection() {
  const [showMore, setShowMore] = useState(false);

  const steps = [
    { num: '1', title: 'Understand', desc: 'Financial goals, risk profile & commitments' },
    { num: '2', title: 'Plan', desc: 'Customized asset allocation & strategy' },
    { num: '3', title: 'Invest', desc: 'Disciplined SIPs & mutual fund allocation' },
    { num: '4', title: 'Protect', desc: 'Comprehensive life & health insurance risk cover' },
    { num: '5', title: 'Review', desc: 'Periodic portfolio monitoring & rebalancing' },
    { num: '6', title: 'Grow', desc: 'Long-term family wealth & prosperity' },
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        {/* Header Badge & Title */}
        <div className="section-header">
          <div className="trust-badge-pill">
            <span className="pulse-dot" />
            <span>AMFI-Registered Mutual Fund Distributor • ARN: 347438</span>
          </div>
          <h2 className="section-title">About Sanchay Path</h2>
          <p className="section-subtitle bengali-subtitle">
            সমৃদ্ধির নতুন দিশারি
          </p>
        </div>

        {/* Story Intro Card */}
        <div className="about-intro-card">
          <h3 className="about-card-title">
            Welcome to Sanchay Path | Sukanta Dutta (ARN: 347438)
          </h3>
          <p className="about-intro-text">
            At Sanchay Path, we help individuals and families make informed, disciplined, and goal-oriented financial decisions. With <strong>15+ years of experience in Banking & Financial Services</strong>, we focus on helping clients plan for their important life milestones through a structured, transparent approach to Mutual Funds & SIPs, Goal-Based Financial Planning, Retirement Planning, Life Insurance, Health Insurance, and Family Protection.
          </p>
          <div className="about-location-pill">
            <span>📍</span>
            <span>Serving Clients from Barrackpore Sub-Division, West Bengal, India & Globally 🌐</span>
          </div>
        </div>

        {/* Accessible Toggle Button for Progressive Disclosure */}
        <div className="about-toggle-wrapper">
          <button
            onClick={() => setShowMore(!showMore)}
            aria-expanded={showMore}
            aria-controls="about-strategy-details"
            className="btn btn-outline about-toggle-btn"
          >
            <span>{showMore ? 'Show Less Strategy Details ↑' : 'Read Our 6-Step Strategy & Advisory Process ↓'}</span>
          </button>
        </div>

        {/* Our Approach: 6-Step Strategy Stepper (Expandable) */}
        {showMore && (
          <div id="about-strategy-details" className="about-strategy-wrapper">
            <div className="strategy-header">
              <h3 className="strategy-title">
                Our Approach: Strategy Before Product
              </h3>
              <p className="strategy-subtitle">
                We believe financial planning should begin with understanding the person—not the product. Your financial journey should be personalized—not one-size-fits-all.
              </p>
            </div>

            <div className="strategy-steps-grid">
              {steps.map((step) => (
                <div key={step.num} className="strategy-step-card">
                  <div className="step-num-badge">
                    {step.num}
                  </div>
                  <h4 className="step-card-title">
                    {step.title}
                  </h4>
                  <p className="step-card-desc">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
