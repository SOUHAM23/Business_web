'use client';

import { useState } from 'react';

export default function AboutUsSection() {
  const [mobileExpanded, setMobileExpanded] = useState(false);

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
          <div className="trust-badge-pill" style={{ marginBottom: '1rem' }}>
            <span className="pulse-dot" />
            <span>AMFI-Registered Mutual Fund Distributor • ARN: 347438</span>
          </div>
          <h2 className="section-title">About Sanchay Path</h2>
          <p className="section-subtitle bengali-subtitle">
            সমৃদ্ধির নতুন দিশারি
          </p>
        </div>

        {/* Story Intro Card with Full Liquid Glass Styling */}
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

        {/* Mobile-Only Toggle Button for Progressive Disclosure */}
        <div className="about-toggle-wrapper">
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            aria-expanded={mobileExpanded}
            aria-controls="about-strategy-details"
            className="btn btn-outline about-toggle-btn"
          >
            <span>{mobileExpanded ? 'Hide Strategy Details ↑' : 'Read Our 6-Step Strategy & Advisory Process ↓'}</span>
          </button>
        </div>

        {/* Our Approach: 6-Step Animated Strategy Flowchart Roadmap */}
        <div
          id="about-strategy-details"
          className={`about-strategy-wrapper ${mobileExpanded ? 'mobile-visible' : ''}`}
        >
          <div className="strategy-header">
            <span className="section-tag" style={{ margin: '0 auto 0.75rem auto' }}>
              ⚡ Proven Advisory Roadmap
            </span>
            <h3 className="strategy-title">
              Our Approach: Strategy Before Product
            </h3>
            <p className="strategy-subtitle">
              We believe financial planning should begin with understanding the person—not the product. Your financial journey should be personalized—not one-size-fits-all.
            </p>
          </div>

          {/* Animated Flowchart Diagram Container */}
          <div className="flowchart-container">
            {/* Animated Glow Line Track (Desktop) */}
            <div className="flowchart-glow-line" />

            {/* Step Nodes, Cards & Connectors */}
            <div className="flowchart-steps">
              {steps.map((step, index) => (
                <div key={step.num} className="flowchart-step-wrapper">
                  <div className="flowchart-step-item">
                    {/* Node Circle */}
                    <div className="flowchart-node-wrapper">
                      <div className="flowchart-node">
                        <span className="node-number">{step.num}</span>
                        <div className="node-pulse-ring" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="flowchart-arrow-connector desktop-only-arrow">
                          <svg
                            className="connector-arrow-svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Flowcard Content */}
                    <div className="flowchart-card">
                      <span className="flow-step-label">Step 0{step.num}</span>
                      <h4 className="flow-card-title">{step.title}</h4>
                      <p className="flow-card-desc">{step.desc}</p>
                    </div>
                  </div>

                  {/* Vertical Mobile Downward Connecting Stem */}
                  {index < steps.length - 1 && (
                    <div className="flowchart-vertical-connector mobile-only-connector">
                      <div className="flow-stem-line" />
                      <div className="flow-stem-arrow">
                        <svg
                          className="stem-arrow-svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
