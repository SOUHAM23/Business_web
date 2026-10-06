'use client';

export default function AboutUsSection() {
  const steps = [
    { num: '1', title: 'Understand', desc: 'Financial goals, risk profile & commitments' },
    { num: '2', title: 'Plan', desc: 'Customized asset allocation & strategy' },
    { num: '3', title: 'Invest', desc: 'Disciplined SIPs & mutual fund allocation' },
    { num: '4', title: 'Protect', desc: 'Comprehensive life & health insurance risk cover' },
    { num: '5', title: 'Review', desc: 'Periodic portfolio monitoring & rebalancing' },
    { num: '6', title: 'Grow', desc: 'Long-term family wealth & prosperity' },
  ];

  return (
    <section id="about" style={{ padding: '4rem 0', background: 'var(--bg-surface-secondary)' }}>
      <div className="container">
        {/* Header Badge & Title */}
        <div className="section-header">
          <div className="trust-badge-pill" style={{ marginBottom: '1rem' }}>
            <span className="pulse-dot" />
            <span>AMFI-Registered Mutual Fund Distributor • ARN: 347438</span>
          </div>
          <h2 className="section-title">About Sanchay Path</h2>
          <p className="section-subtitle" style={{ fontSize: '1.15rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
            সমৃদ্ধির নতুন দিশারি
          </p>
        </div>

        {/* Story Intro Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: '3rem',
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Welcome to Sanchay Path | Sukanta Dutta (ARN: 347438)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.75', marginBottom: '1.25rem' }}>
            At Sanchay Path, we help individuals and families make informed, disciplined, and goal-oriented financial decisions. With <strong>15+ years of experience in Banking & Financial Services</strong>, we focus on helping clients plan for their important life milestones through a structured, transparent approach to Mutual Funds & SIPs, Goal-Based Financial Planning, Retirement Planning, Life Insurance, Health Insurance, and Family Protection.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid var(--border-glow)',
              padding: '0.6rem 1.2rem',
              borderRadius: '30px',
              fontSize: '0.88rem',
              color: 'var(--accent-gold)',
              fontWeight: 600,
            }}
          >
            <span>📍</span>
            <span>Serving Clients from Barrackpore Sub-Division, West Bengal, India & Globally 🌐</span>
          </div>
        </div>

        {/* Our Approach: 6-Step Strategy Stepper */}
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Our Approach: Strategy Before Product
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
              We believe financial planning should begin with understanding the person—not the product. Your financial journey should be personalized—not one-size-fits-all.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'var(--transition)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--grad-gold)',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.85rem',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {step.num}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
