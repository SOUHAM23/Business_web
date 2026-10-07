'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [expectedRate, setExpectedRate] = useState<number>(13.5);
  const [timePeriodYears, setTimePeriodYears] = useState<number>(15);

  const monthlyRate = expectedRate / 12 / 100;
  const totalMonths = timePeriodYears * 12;

  const investedAmount = monthlyInvestment * totalMonths;
  const estimatedReturns =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)) -
    investedAmount;
  const totalValue = investedAmount + estimatedReturns;

  const investedPct = Math.round((investedAmount / totalValue) * 100);
  const gainPct = 100 - investedPct;

  const chartData = [
    { name: 'Invested Principal', value: Math.round(investedAmount), color: '#3b82f6' },
    { name: 'Estimated Returns', value: Math.round(estimatedReturns), color: '#10b981' },
  ];

  return (
    <div className="sip-calculator-wrapper">
      <div className="calc-header-badge">
        <span className="badge-sparkle">✨ Interactive Investment Planner</span>
      </div>

      <div className="calc-title-group">
        <h2 className="calc-main-heading">Visualize Your Wealth Compounding</h2>
        <p className="calc-sub-heading">See how disciplined monthly investments create exponential long-term capital wealth.</p>
      </div>

      <div className="calc-grid">
        {/* Sliders Input Column */}
        <div className="calc-controls-col">
          <div className="slider-group">
            <div className="slider-label-row">
              <label htmlFor="sip-amount" className="slider-label-title">Monthly SIP Investment</label>
              <span className="slider-value-display">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
            </div>
            <input
              id="sip-amount"
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="range-input"
            />
            <div className="slider-limits">
              <span>₹1,000</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <label htmlFor="sip-rate" className="slider-label-title">Expected Return Rate (p.a.)</label>
              <span className="slider-value-display green-pill">{expectedRate}%</span>
            </div>
            <input
              id="sip-rate"
              type="range"
              min="5"
              max="25"
              step="0.5"
              value={expectedRate}
              onChange={(e) => setExpectedRate(Number(e.target.value))}
              className="range-input"
            />
            <div className="slider-limits">
              <span>5%</span>
              <span>25%</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <label htmlFor="sip-duration" className="slider-label-title">Investment Duration</label>
              <span className="slider-value-display gold-pill">{timePeriodYears} Years</span>
            </div>
            <input
              id="sip-duration"
              type="range"
              min="1"
              max="35"
              step="1"
              value={timePeriodYears}
              onChange={(e) => setTimePeriodYears(Number(e.target.value))}
              className="range-input"
            />
            <div className="slider-limits">
              <span>1 Year</span>
              <span>35 Years</span>
            </div>
          </div>
        </div>

        {/* Recharts Pie Chart & Breakdown Column */}
        <div className="calc-results-card">
          <h3 className="results-card-title">Projected Portfolio Breakdown</h3>

          {/* Professional Recharts Pie Chart */}
          <div className="pie-chart-wrapper">
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={500}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#f59e0b',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Inner Donut Center Metric */}
              <div className="pie-chart-center">
                <span className="pie-center-label">Returns</span>
                <span className="pie-center-val">{(totalValue / (investedAmount || 1)).toFixed(1)}x</span>
              </div>
            </div>

            {/* Pie Chart Color Legend */}
            <div className="growth-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#3b82f6' }} />
                <span>Invested Principal ({investedPct}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#10b981' }} />
                <span>Estimated Returns ({gainPct}%)</span>
              </div>
            </div>
          </div>

          {/* Summary Breakdown Metrics */}
          <div className="metrics-box-grid">
            <div className="metric-box">
              <span className="metric-label">Total Principal Invested</span>
              <span className="metric-val">₹{Math.round(investedAmount).toLocaleString('en-IN')}</span>
            </div>

            <div className="metric-box highlight-box">
              <span className="metric-label">Est. Capital Growth</span>
              <span className="metric-val green-text">+₹{Math.round(estimatedReturns).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="total-portfolio-banner">
            <div className="total-banner-info">
              <span className="total-label">Total Projected Corpus</span>
              <span className="total-amount">₹{Math.round(totalValue).toLocaleString('en-IN')}</span>
            </div>
            <a
              href="#contact-form"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('contact-form') || document.getElementById('contact');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn btn-gold-shimmer"
            >
              Start This SIP Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
