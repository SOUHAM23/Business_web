'use client';

import { useState } from 'react';

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

  return (
    <div className="sip-calculator-wrapper">
      <div className="calc-header-badge">
        <span className="badge-sparkle">✨ Interactive Investment Planner</span>
      </div>

      <div className="calc-title-group">
        <h2 className="calc-main-heading">Visualize Your Wealth Compounding</h2>
        <p className="calc-sub-heading">See how disciplined monthly investments create exponential long-term capital wealth.</p>
      </div>

      <div className="calc-card-grid">
        {/* Sliders Input Column */}
        <div className="calc-controls-card">
          <div className="range-control-group">
            <div className="control-label-row">
              <label htmlFor="sip-amount">Monthly SIP Investment</label>
              <span className="value-pill">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
            </div>
            <input
              id="sip-amount"
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="styled-slider"
            />
            <div className="slider-limits">
              <span>₹1,000</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          <div className="range-control-group">
            <div className="control-label-row">
              <label htmlFor="sip-rate">Expected Return Rate (p.a.)</label>
              <span className="value-pill green-pill">{expectedRate}%</span>
            </div>
            <input
              id="sip-rate"
              type="range"
              min="5"
              max="25"
              step="0.5"
              value={expectedRate}
              onChange={(e) => setExpectedRate(Number(e.target.value))}
              className="styled-slider"
            />
            <div className="slider-limits">
              <span>5%</span>
              <span>25%</span>
            </div>
          </div>

          <div className="range-control-group">
            <div className="control-label-row">
              <label htmlFor="sip-duration">Investment Duration</label>
              <span className="value-pill gold-pill">{timePeriodYears} Years</span>
            </div>
            <input
              id="sip-duration"
              type="range"
              min="1"
              max="35"
              step="1"
              value={timePeriodYears}
              onChange={(e) => setTimePeriodYears(Number(e.target.value))}
              className="styled-slider"
            />
            <div className="slider-limits">
              <span>1 Year</span>
              <span>35 Years</span>
            </div>
          </div>
        </div>

        {/* Visual Results & Growth Bar Column */}
        <div className="calc-results-card">
          <h3 className="results-card-title">Projected Portfolio Breakdown</h3>

          {/* Visual Dual Growth Bar */}
          <div className="growth-bar-container">
            <div className="growth-bar-track">
              <div
                className="growth-fill invested-fill"
                style={{ width: `${investedPct}%` }}
                title={`Invested: ${investedPct}%`}
              />
              <div
                className="growth-fill gain-fill"
                style={{ width: `${gainPct}%` }}
                title={`Capital Gain: ${gainPct}%`}
              />
            </div>

            <div className="growth-legend">
              <div className="legend-item">
                <span className="legend-dot dot-invested" />
                <span>Invested Capital ({investedPct}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-gain" />
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
            <a href="#contact" className="btn btn-gold-shimmer">Start This SIP Now →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
