'use client';

import { useState, useRef, useEffect } from 'react';

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  ctaText: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'sip-mutual-funds',
    icon: '📈',
    title: 'SIP & Mutual Funds',
    shortDesc: 'Disciplined systematic investment plans and goal-oriented equity & debt fund allocation.',
    fullDesc: 'Build long-term wealth through tailored equity, debt, and index mutual fund portfolios. We analyze your financial risk tolerance and horizon to curate top-performing funds with disciplined monthly SIP execution.',
    features: [
      'Goal-based asset allocation',
      'Index & Multi-cap diversification',
      'Regular portfolio rebalancing',
      'Tax-efficient fund selection',
    ],
    ctaText: 'Explore Mutual Funds',
  },
  {
    id: 'insurance-solutions',
    icon: '🛡️',
    title: 'Insurance Solutions',
    shortDesc: 'Comprehensive risk protection covering term life, health insurance, and emergency liquidity.',
    fullDesc: 'Safeguard your family financial security against life uncertainties. We help you choose optimal high-cover term life policies, cashless family health plans, and critical illness safeguards.',
    features: [
      'High-cover term life policies',
      'Cashless health & family cover',
      'Critical illness protection',
      'Claim assistance support',
    ],
    ctaText: 'Get Protection Plan',
  },
  {
    id: 'loans-credit',
    icon: '🏦',
    title: 'Loans & Credit Advisory',
    shortDesc: 'Low-interest capital sourcing for home purchases, business expansion, and LAP refinancing.',
    fullDesc: 'Access competitive credit facilities with transparent terms. From home loans and commercial property capital to debt consolidation, we assist you in securing optimal interest rates.',
    features: [
      'Competitive interest rates',
      'Loan against property (LAP)',
      'Debt restructuring guidance',
      'Hassle-free documentation',
    ],
    ctaText: 'Consult Loan Advisor',
  },
  {
    id: 'retirement-planning',
    icon: '🏖️',
    title: 'Retirement Planning',
    shortDesc: 'Pension fund build-up and capital preservation strategies for worry-free post-retirement living.',
    fullDesc: 'Ensure financial independence during your golden years. We design inflation-indexed retirement models combining guaranteed annuities, SWP (Systematic Withdrawal Plans), and capital preservation.',
    features: [
      'Guaranteed annuity options',
      'Tax-efficient withdrawal plans',
      'Wealth preservation framework',
      'Inflation-adjusted retirement pension',
    ],
    ctaText: 'Plan Retirement',
  },
  {
    id: 'portfolio-management',
    icon: '💼',
    title: 'Portfolio Management (PMS/AIF)',
    shortDesc: 'Dedicated high-net-worth portfolio management, specialized PMS schemes, and alternative assets.',
    fullDesc: 'Bespoke wealth management for high-net-worth individuals and corporate entities seeking targeted sector exposure, private equity access, and active fund management.',
    features: [
      'Customized HNI portfolios',
      'Alternative investment funds (AIF)',
      'Direct stock & sector focus',
      'Dedicated fund manager oversight',
    ],
    ctaText: 'Explore PMS / AIF',
  },
  {
    id: 'child-education',
    icon: '🎓',
    title: 'Child Education & Marriage Fund',
    shortDesc: 'Targeted long-term wealth compounding for child future higher education and life milestones.',
    fullDesc: 'Secure your child higher education and career dreams against rising education inflation. Dedicated target-date fund allocation ensuring capital availability when needed.',
    features: [
      'Inflation-adjusted target planning',
      'Milestone-based fund lock-in',
      'Secure corpus creation',
      'Guaranteed target fulfillment',
    ],
    ctaText: 'Plan Child Future',
  },
  {
    id: 'tax-planning',
    icon: '📊',
    title: 'Tax Planning & ELSS',
    shortDesc: 'Section 80C tax-saving mutual funds combined with capital gain tax minimization strategies.',
    fullDesc: 'Optimize your annual tax liability while growing capital. Utilize ELSS (Equity Linked Savings Schemes) with the shortest 3-year lock-in and tax-loss harvesting.',
    features: [
      'ELSS tax-saver schemes',
      'Shortest 3-year lock-in option',
      'Capital gains harvesting',
      'Section 80C tax deduction optimization',
    ],
    ctaText: 'Save Taxes Now',
  },
  {
    id: 'corporate-treasury',
    icon: '🏢',
    title: 'Corporate Treasury & Group Cover',
    shortDesc: 'Custom corporate surplus cash management, employee gratuity funds & group mediclaim protection.',
    fullDesc: 'Customized financial solutions for enterprises and SMBs, including liquid fund treasury optimization, group mediclaim cover, keyman insurance, and employee retirement benefits.',
    features: [
      'Corporate liquid fund management',
      'Group health & life policies',
      'Executive wealth retention',
      'Gratuity & superannuation management',
    ],
    ctaText: 'Corporate Advisory',
  },
];

export default function ServicesSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatic Horizontal Auto-Scroll Slideshow Effect on Mobile
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) return;

      setActiveSlide((prev) => {
        const nextIndex = (prev + 1) % SERVICES_DATA.length;
        const cardWidth = scrollRef.current ? scrollRef.current.clientWidth * 0.82 : 280;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: nextIndex * cardWidth,
            behavior: 'smooth',
          });
        }
        return nextIndex;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / (clientWidth * 0.82));
      setActiveSlide(Math.min(Math.max(index, 0), SERVICES_DATA.length - 1));
    }
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.82;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveSlide(index);
  };

  const openServiceModal = (service: ServiceItem) => {
    setSelectedService(service);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeServiceModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedService]);

  const handleBookConsultation = (serviceTitle: string) => {
    closeServiceModal();
    const contactForm = document.getElementById('contact-form') || document.getElementById('contact');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
      const serviceSelect = document.getElementById('service') as HTMLSelectElement | null;
      if (serviceSelect) {
        const optionExists = Array.from(serviceSelect.options).some(opt => opt.value === serviceTitle);
        if (optionExists) {
          serviceSelect.value = serviceTitle;
        }
      }
    }
  };

  return (
    <section id="services" className="services-section">
      <div className="section-header">
        <h2 className="section-title">Core Wealth Solutions</h2>
        <p className="section-subtitle">
          Tailored financial strategies built around your life milestones and wealth preservation goals.
        </p>
      </div>

      {/* Horizontal Auto-Scroll Carousel Container for Mobile / Responsive Grid for Desktop */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="services-cards-grid"
      >
        {SERVICES_DATA.map((service, idx) => (
          <div
            key={service.id}
            className={`service-card-item service-card-${idx + 1}`}
          >
            <div>
              <div className="service-icon-box">{service.icon}</div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.shortDesc}</p>
              
              {/* Features List visible on desktop */}
              <ul className="service-features-list desktop-features">
                {service.features.slice(0, 3).map((feat, fIdx) => (
                  <li key={fIdx}>{feat}</li>
                ))}
              </ul>
            </div>

            <div className="service-card-actions">
              <button
                onClick={() => openServiceModal(service)}
                className="btn btn-outline service-btn"
                aria-label={`Learn more about ${service.title}`}
              >
                {service.ctaText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Active Slide Indicator Dots (Mobile Only) */}
      <div className="carousel-dots-wrapper" aria-hidden="true">
        {SERVICES_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`carousel-dot ${activeSlide === idx ? 'dot-active' : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Accessible Detail Modal / Bottom Sheet */}
      {selectedService && (
        <div
          className="service-modal-overlay"
          onClick={closeServiceModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="service-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeServiceModal}
              className="modal-close-btn"
              aria-label="Close details modal"
            >
              ✕
            </button>

            <div className="modal-header-row">
              <span className="modal-icon">{selectedService.icon}</span>
              <div>
                <h3 id="modal-title" className="modal-title">{selectedService.title}</h3>
                <span className="modal-badge">AMFI-Registered Advisory</span>
              </div>
            </div>

            <p className="modal-description">{selectedService.fullDesc}</p>

            <div className="modal-features-box">
              <h4>Key Solution Highlights:</h4>
              <ul>
                {selectedService.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <span className="check-mark">✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => handleBookConsultation(selectedService.title)}
                className="btn btn-gold-solid modal-cta"
              >
                Book Consultation for {selectedService.title} →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
