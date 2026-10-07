'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import '@/styles/calculator.css';

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [expectedRate, setExpectedRate] = useState<number>(13.5);
  const [timePeriodYears, setTimePeriodYears] = useState<number>(15);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const applyPreset = (amount: number, rate: number, years: number) => {
    setMonthlyInvestment(amount);
    setExpectedRate(rate);
    setTimePeriodYears(years);
  };

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

  const pieChartData = [
    { name: 'Invested Principal', value: Math.round(investedAmount), color: '#3b82f6' },
    { name: 'Estimated Returns', value: Math.round(estimatedReturns), color: '#10b981' },
  ];

  const barChartData = [
    { name: 'Invested', amount: Math.round(investedAmount), color: '#3b82f6' },
    { name: 'Returns', amount: Math.round(estimatedReturns), color: '#10b981' },
    { name: 'Total Corpus', amount: Math.round(totalValue), color: '#f59e0b' },
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
          <div className="preset-bar">
            <span className="preset-title">Quick Strategy Presets:</span>
            <div className="preset-buttons">
              <button
                type="button"
                className={`preset-chip ${monthlyInvestment === 5000 && timePeriodYears === 10 ? 'active' : ''}`}
                onClick={() => applyPreset(5000, 13.5, 10)}
              >
                Starter (5K/mo • 10y)
              </button>
              <button
                type="button"
                className={`preset-chip ${monthlyInvestment === 15000 && timePeriodYears === 15 ? 'active' : ''}`}
                onClick={() => applyPreset(15000, 14.0, 15)}
              >
                Wealth (15K/mo • 15y)
              </button>
              <button
                type="button"
                className={`preset-chip ${monthlyInvestment === 30000 && timePeriodYears === 20 ? 'active' : ''}`}
                onClick={() => applyPreset(30000, 14.5, 20)}
              >
                Freedom (30K/mo • 20y)
              </button>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <label htmlFor="sip-amount" className="slider-label-title">Monthly SIP Investment</label>
              <div className="input-pill-field">
                <span className="input-unit">₹</span>
                <input
                  id="sip-amount-input"
                  type="number"
                  value={monthlyInvestment || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMonthlyInvestment(isNaN(val) ? 0 : val);
                  }}
                  className="calc-input-box"
                  min="500"
                  max="1000000"
                  step="500"
                />
              </div>
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
              <div className="input-pill-field green-field">
                <input
                  id="sip-rate-input"
                  type="number"
                  value={expectedRate || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setExpectedRate(isNaN(val) ? 0 : val);
                  }}
                  className="calc-input-box"
                  min="1"
                  max="40"
                  step="0.5"
                />
                <span className="input-unit">%</span>
              </div>
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
              <div className="input-pill-field gold-field">
                <input
                  id="sip-duration-input"
                  type="number"
                  value={timePeriodYears || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTimePeriodYears(isNaN(val) ? 0 : val);
                  }}
                  className="calc-input-box"
                  min="1"
                  max="50"
                  step="1"
                />
                <span className="input-unit">Yrs</span>
              </div>
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

        {/* Recharts Pie / Bar Chart & Breakdown Column */}
        <div className="calc-results-card">
          <div className="chart-header-row">
            <h3 className="results-card-title">Projected Portfolio Breakdown</h3>
            <div className="chart-toggle-pills" role="tablist" aria-label="Chart View Options">
              <button
                type="button"
                className={`chart-toggle-btn ${chartType === 'pie' ? 'active' : ''}`}
                onClick={() => setChartType('pie')}
                aria-selected={chartType === 'pie'}
                role="tab"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
                Donut
              </button>
              <button
                type="button"
                className={`chart-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
                onClick={() => setChartType('bar')}
                aria-selected={chartType === 'bar'}
                role="tab"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Bar
              </button>
            </div>
          </div>

          {/* Dynamic Recharts Visualization */}
          <div className="pie-chart-wrapper">
            {chartType === 'pie' ? (
              <div className="pie-chart-container">
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      animationDuration={500}
                    >
                      {pieChartData.map((entry) => (
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
            ) : (
              <div className="bar-chart-container" style={{ width: '100%', height: 210 }}>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={barChartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(v) => (v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`)}
                    />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#f59e0b',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                      }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} animationDuration={500}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`bar-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Pie / Bar Chart Legend */}
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
