'use client';

import { useState } from 'react';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Scroll Progress */}
      <div className="scroll-progress" id="scrollProgress"></div>

      {/* Navigation */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="44" stroke="#FF1D6C" strokeWidth="6"/>
              <g className="road-dashes">
                <rect x="47" y="4" width="6" height="12" fill="#000" rx="2"/>
                <rect x="47" y="84" width="6" height="12" fill="#000" rx="2"/>
                <rect x="84" y="47" width="12" height="6" fill="#000" rx="2"/>
                <rect x="4" y="47" width="12" height="6" fill="#000" rx="2"/>
              </g>
              <path d="M50 10C27.9 10 10 27.9 10 50H90C90 27.9 72.1 10 50 10Z" fill="#F5A623"/>
              <path d="M10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50H10Z" fill="#2979FF"/>
              <circle cx="50" cy="50" r="14" fill="#000"/>
            </svg>
          </div>
          <span className="nav-logo-text">BlackRoad OS</span>
        </a>

        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/docs">Docs</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>

        <a href="/signup" className="nav-cta">Get Started</a>
      </nav>

      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-grid"></div>

        <div className="page-hero-content">
          <span className="page-hero-label">Simple Pricing</span>
          <h1 className="page-hero-title">Deploy AI agents at scale</h1>
          <p className="page-hero-desc">Start free. Scale when you need. Enterprise support when you grow.</p>

          <div className="billing-toggle">
            <span className={`billing-option ${billingPeriod === 'monthly' ? 'active' : ''}`}>Monthly</span>
            <div
              className={`toggle-switch ${billingPeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            ></div>
            <span className={`billing-option ${billingPeriod === 'yearly' ? 'active' : ''}`}>Annually</span>
            {billingPeriod === 'yearly' && <span className="billing-badge">SAVE 20%</span>}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing">
        <div className="pricing-grid">
          {/* Free Tier */}
          <div className="pricing-card">
            <div className="pricing-tier">Starter</div>
            <h3 className="pricing-name">Free</h3>
            <p className="pricing-desc">Perfect for developers exploring AI agent deployment</p>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">0</span>
              <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li>1 agent deployment</li>
              <li>1,000 API calls/month</li>
              <li>Community support</li>
              <li>Basic templates</li>
              <li className="disabled">Priority support</li>
              <li className="disabled">Custom domains</li>
              <li className="disabled">Advanced analytics</li>
            </ul>
            <a href="/signup?plan=free" className="btn btn-secondary">Start Free</a>
          </div>

          {/* Pro Tier */}
          <div className="pricing-card featured">
            <span className="pricing-badge">POPULAR</span>
            <div className="pricing-tier">Professional</div>
            <h3 className="pricing-name">Pro</h3>
            <p className="pricing-desc">For teams building production AI applications</p>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">{billingPeriod === 'monthly' ? '49' : '39'}</span>
              <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li>10 agent deployments</li>
              <li>100,000 API calls/month</li>
              <li>Priority support</li>
              <li>All templates</li>
              <li>Custom domains</li>
              <li>Advanced analytics</li>
              <li className="disabled">Dedicated infrastructure</li>
              <li className="disabled">SLA guarantee</li>
            </ul>
            <a href="/signup?plan=pro" className="btn btn-primary"><span>Start 14-day Trial</span></a>
          </div>

          {/* Enterprise Tier */}
          <div className="pricing-card">
            <div className="pricing-tier">Enterprise</div>
            <h3 className="pricing-name">Enterprise</h3>
            <p className="pricing-desc">For organizations requiring dedicated support and infrastructure</p>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">{billingPeriod === 'monthly' ? '299' : '239'}</span>
              <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li>Unlimited deployments</li>
              <li>Unlimited API calls</li>
              <li>24/7 dedicated support</li>
              <li>All templates + custom</li>
              <li>Custom domains</li>
              <li>Advanced analytics</li>
              <li>Dedicated infrastructure</li>
              <li>99.9% SLA guarantee</li>
            </ul>
            <a href="mailto:blackroad.systems@gmail.com?subject=Enterprise%20Plan" className="btn btn-secondary">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison">
        <div className="section-header">
          <span className="section-label">Feature Comparison</span>
          <h2 className="section-title">Choose the plan that fits your needs</h2>
          <p className="section-desc">Compare features across all tiers to find the perfect match</p>
        </div>

        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th>Pro</th>
              <th>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Agent Deployments</td>
              <td>1</td>
              <td>10</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td>API Calls/Month</td>
              <td>1,000</td>
              <td>100,000</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td>Custom Domains</td>
              <td><span className="comparison-x">—</span></td>
              <td><span className="comparison-check">✓</span></td>
              <td><span className="comparison-check">✓</span></td>
            </tr>
            <tr>
              <td>Advanced Analytics</td>
              <td><span className="comparison-x">—</span></td>
              <td><span className="comparison-check">✓</span></td>
              <td><span className="comparison-check">✓</span></td>
            </tr>
            <tr>
              <td>Support</td>
              <td>Community</td>
              <td>Priority</td>
              <td>24/7 Dedicated</td>
            </tr>
            <tr>
              <td>SLA Guarantee</td>
              <td><span className="comparison-x">—</span></td>
              <td><span className="comparison-x">—</span></td>
              <td><span className="comparison-check">✓</span></td>
            </tr>
            <tr>
              <td>Dedicated Infrastructure</td>
              <td><span className="comparison-x">—</span></td>
              <td><span className="comparison-x">—</span></td>
              <td><span className="comparison-check">✓</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="section-header">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">Everything you need to know about BlackRoad pricing</p>
        </div>

        <div className="faq-grid">
          <div className={`faq-item ${openFaq === 0 ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(0)}>
              <span>How does the 14-day trial work?</span>
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer">
              <p className="faq-answer-content">Start your Pro trial with full access to all Pro features for 14 days. No credit card required. After the trial, you'll be prompted to subscribe or downgrade to the free tier.</p>
            </div>
          </div>

          <div className={`faq-item ${openFaq === 1 ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(1)}>
              <span>Can I change plans at any time?</span>
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer">
              <p className="faq-answer-content">Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we'll prorate any remaining time on your current plan.</p>
            </div>
          </div>

          <div className={`faq-item ${openFaq === 2 ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(2)}>
              <span>What happens if I exceed my API limits?</span>
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer">
              <p className="faq-answer-content">We'll send you a notification when you reach 80% of your limit. If you exceed your limit, API calls will be rate-limited until the next billing cycle, or you can upgrade to a higher tier.</p>
            </div>
          </div>

          <div className={`faq-item ${openFaq === 3 ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(3)}>
              <span>Do you offer refunds?</span>
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer">
              <p className="faq-answer-content">Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund within 30 days of your initial purchase.</p>
            </div>
          </div>

          <div className={`faq-item ${openFaq === 4 ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(4)}>
              <span>What payment methods do you accept?</span>
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer">
              <p className="faq-answer-content">We accept all major credit cards (Visa, Mastercard, Amex) through Stripe. Enterprise customers can also pay via invoice and ACH transfer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-orb"></div>
        <div className="cta-content">
          <h2 className="cta-title">Still have questions?</h2>
          <p className="cta-desc">Our team is here to help you find the perfect plan for your needs.</p>
          <a href="mailto:blackroad.systems@gmail.com" className="cta-link">Contact Sales →</a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo">
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke="#FF1D6C" strokeWidth="6"/>
            <path d="M50 10C27.9 10 10 27.9 10 50H90C90 27.9 72.1 10 50 10Z" fill="#F5A623"/>
            <path d="M10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50H10Z" fill="#2979FF"/>
            <circle cx="50" cy="50" r="14" fill="#000"/>
          </svg>
        </div>
        <p className="footer-text">BlackRoad OS · 2025 · Built for the future</p>
      </footer>

      <style jsx>{`
        /* Scroll Progress */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: var(--gradient-brand);
          z-index: 9999;
          width: 0%;
          animation: scroll-progress 1s ease-out;
        }

        @keyframes scroll-progress {
          from { width: 0%; }
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: var(--space-md) var(--space-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: saturate(180%) blur(20px);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          text-decoration: none;
          color: var(--white);
        }

        .nav-logo-mark {
          width: 36px;
          height: 36px;
        }

        .nav-logo-mark :global(.road-dashes) {
          animation: logo-spin 20s linear infinite;
          transform-origin: 50px 50px;
        }

        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .nav-logo-text {
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .nav-links {
          display: flex;
          gap: var(--space-lg);
          list-style: none;
        }

        .nav-links a {
          color: var(--white);
          text-decoration: none;
          font-size: 14px;
          opacity: 0.7;
          transition: opacity 0.3s var(--ease);
        }

        .nav-links a:hover {
          opacity: 1;
        }

        .nav-cta {
          padding: var(--space-xs) var(--space-md);
          background: var(--white);
          color: var(--black);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s var(--ease-spring);
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 29, 108, 0.3);
        }

        /* Page Hero */
        .page-hero {
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          padding: var(--space-3xl) var(--space-xl) var(--space-xl);
        }

        .page-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 55px 55px;
          opacity: 0.5;
        }

        .page-hero-content {
          position: relative;
          z-index: 10;
          max-width: 700px;
        }

        .page-hero-label {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--hot-pink);
          margin-bottom: var(--space-md);
          animation: fade-up 0.8s var(--ease-out) 0.2s both;
        }

        .page-hero-title {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: var(--space-md);
          animation: fade-up 0.8s var(--ease-out) 0.4s both;
        }

        .page-hero-desc {
          font-size: 18px;
          opacity: 0.7;
          animation: fade-up 0.8s var(--ease-out) 0.6s both;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Billing Toggle */
        .billing-toggle {
          display: flex;
          align-items: center;
          justify-center;
          gap: var(--space-md);
          margin-top: var(--space-lg);
          animation: fade-up 0.8s var(--ease-out) 0.8s both;
        }

        .billing-option {
          font-size: 14px;
          opacity: 0.5;
          transition: opacity 0.3s var(--ease);
        }

        .billing-option.active {
          opacity: 1;
        }

        .toggle-switch {
          width: 56px;
          height: 28px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s var(--ease);
        }

        .toggle-switch::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: var(--white);
          border-radius: 50%;
          transition: transform 0.3s var(--ease-spring);
        }

        .toggle-switch.active {
          background: var(--hot-pink);
        }

        .toggle-switch.active::before {
          transform: translateX(28px);
        }

        .billing-badge {
          font-size: 11px;
          padding: 4px 10px;
          background: rgba(255, 29, 108, 0.2);
          color: var(--hot-pink);
          border-radius: 100px;
          letter-spacing: 0.05em;
        }

        /* Pricing Section */
        .pricing {
          padding: var(--space-2xl) var(--space-xl);
          background: var(--black);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-md);
          max-width: 1100px;
          margin: 0 auto;
        }

        .pricing-card {
          padding: var(--space-lg);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          position: relative;
          transition: all 0.4s var(--ease);
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .pricing-card.featured {
          background: linear-gradient(180deg, rgba(255, 29, 108, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
          border-color: var(--hot-pink);
        }

        .pricing-card.featured::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-brand);
          border-radius: 24px 24px 0 0;
        }

        .pricing-badge {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          font-size: 11px;
          padding: 4px 12px;
          background: var(--gradient-brand);
          color: var(--white);
          border-radius: 100px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .pricing-tier {
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--hot-pink);
          margin-bottom: var(--space-xs);
        }

        .pricing-name {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: var(--space-sm);
        }

        .pricing-desc {
          font-size: 14px;
          opacity: 0.6;
          margin-bottom: var(--space-lg);
          line-height: 1.6;
        }

        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: var(--space-xs);
          margin-bottom: var(--space-lg);
        }

        .pricing-currency {
          font-size: 24px;
          font-weight: 600;
          opacity: 0.7;
        }

        .pricing-amount {
          font-size: 56px;
          font-weight: 700;
          line-height: 1;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pricing-period {
          font-size: 14px;
          opacity: 0.5;
        }

        .pricing-features {
          list-style: none;
          margin-bottom: var(--space-lg);
        }

        .pricing-features li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm);
          font-size: 14px;
          margin-bottom: var(--space-sm);
          opacity: 0.8;
        }

        .pricing-features li::before {
          content: '✓';
          color: var(--hot-pink);
          font-weight: 600;
          flex-shrink: 0;
        }

        .pricing-features li.disabled {
          opacity: 0.4;
        }

        .pricing-features li.disabled::before {
          content: '—';
          color: inherit;
        }

        .btn {
          display: block;
          width: 100%;
          padding: var(--space-sm) var(--space-lg);
          font-size: 15px;
          font-weight: 500;
          text-align: center;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.4s var(--ease-spring);
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: var(--white);
          color: var(--black);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-brand);
          opacity: 0;
          transition: opacity 0.4s var(--ease);
        }

        .btn-primary :global(span) {
          position: relative;
          z-index: 1;
        }

        .btn-primary:hover {
          color: var(--white);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255, 29, 108, 0.4);
        }

        .btn-primary:hover::before {
          opacity: 1;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--hot-pink);
          transform: translateY(-2px);
        }

        /* Comparison Section */
        .comparison {
          padding: var(--space-2xl) var(--space-xl);
          background: linear-gradient(180deg, var(--black) 0%, rgba(20, 20, 20, 1) 100%);
        }

        .section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto var(--space-xl);
        }

        .section-label {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--hot-pink);
          margin-bottom: var(--space-sm);
          display: block;
        }

        .section-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: var(--space-sm);
        }

        .section-desc {
          font-size: 16px;
          opacity: 0.7;
        }

        .comparison-table {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          border-collapse: collapse;
        }

        .comparison-table th,
        .comparison-table td {
          padding: var(--space-md);
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .comparison-table th {
          font-size: 14px;
          font-weight: 600;
          color: var(--hot-pink);
          background: rgba(255, 255, 255, 0.03);
        }

        .comparison-table th:first-child,
        .comparison-table td:first-child {
          text-align: left;
        }

        .comparison-table td {
          font-size: 14px;
          opacity: 0.8;
        }

        .comparison-table td:first-child {
          font-weight: 500;
          opacity: 1;
        }

        .comparison-check {
          color: var(--hot-pink);
          font-size: 18px;
        }

        .comparison-x {
          opacity: 0.3;
        }

        /* FAQ Section */
        .faq {
          padding: var(--space-2xl) var(--space-xl);
          background: var(--black);
        }

        .faq-grid {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) 0;
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          color: var(--white);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s var(--ease);
        }

        .faq-question:hover {
          color: var(--hot-pink);
        }

        .faq-icon {
          font-size: 24px;
          opacity: 0.5;
          transition: transform 0.3s var(--ease);
        }

        .faq-item.open .faq-icon {
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s var(--ease);
        }

        .faq-item.open .faq-answer {
          max-height: 300px;
        }

        .faq-answer-content {
          padding-bottom: var(--space-md);
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.8;
        }

        /* CTA Section */
        .cta {
          padding: var(--space-2xl) var(--space-xl);
          background: linear-gradient(180deg, rgba(20, 20, 20, 1) 0%, var(--black) 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          background: var(--gradient-brand);
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 10;
        }

        .cta-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 600;
          margin-bottom: var(--space-sm);
        }

        .cta-desc {
          font-size: 16px;
          opacity: 0.7;
          max-width: 450px;
          margin: 0 auto var(--space-md);
        }

        .cta-link {
          color: var(--hot-pink);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: opacity 0.3s var(--ease);
        }

        .cta-link:hover {
          opacity: 0.8;
        }

        /* Footer */
        footer {
          padding: var(--space-xl) var(--space-xl);
          background: var(--black);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .footer-logo {
          width: 48px;
          height: 48px;
          margin: 0 auto var(--space-sm);
        }

        .footer-text {
          font-size: 14px;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .comparison-table {
            font-size: 12px;
          }

          .comparison-table th,
          .comparison-table td {
            padding: var(--space-xs);
          }
        }
      `}</style>

      <script dangerouslySetInnerHTML={{__html: `
        // Scroll Progress
        if (typeof window !== 'undefined') {
          window.addEventListener('scroll', () => {
            const progress = document.getElementById('scrollProgress');
            if (progress) {
              const scrollTop = document.documentElement.scrollTop;
              const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
              progress.style.width = (scrollTop / scrollHeight) * 100 + '%';
            }
          });
        }
      `}} />
    </>
  );
}
