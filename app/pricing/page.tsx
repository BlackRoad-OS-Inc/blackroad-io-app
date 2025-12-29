'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRICING_TIERS = [
  {
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Perfect for testing and small projects',
    features: [
      '1 agent deployment',
      '1,000 API calls/month',
      'Community support',
      'Basic templates',
      '24hr data retention'
    ],
    cta: 'Start Free',
    href: '/signup',
    highlighted: false
  },
  {
    name: 'Pro',
    price: 49,
    interval: 'month',
    description: 'For professional developers and teams',
    features: [
      '10 agent deployments',
      '100,000 API calls/month',
      'Priority support',
      'All premium templates',
      '30-day data retention',
      'Custom integrations',
      'Advanced analytics'
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    highlighted: true,
    stripePriceId: 'price_pro_monthly' // Replace with actual Stripe price ID
  },
  {
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    description: 'For organizations at scale',
    features: [
      'Unlimited agent deployments',
      'Unlimited API calls',
      'Dedicated support',
      'Custom templates',
      'Unlimited data retention',
      'SLA guarantees',
      'On-premise deployment option',
      'Custom contracts'
    ],
    cta: 'Contact Sales',
    href: '/contact',
    highlighted: false
  }
];

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-br-orange via-br-red to-br-purple bg-clip-text text-transparent">
            BlackRoad
          </Link>
          <nav className="flex gap-6">
            <Link href="/docs" className="text-gray-300 hover:text-white transition">Docs</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-br-orange via-br-red to-br-purple bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          Deploy AI agents at scale. Pay only for what you use. No hidden fees.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={billingInterval === 'monthly' ? 'text-white font-semibold' : 'text-gray-400'}>
            Monthly
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'annual' : 'monthly')}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-700 transition"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-br-purple transition ${
                billingInterval === 'annual' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={billingInterval === 'annual' ? 'text-white font-semibold' : 'text-gray-400'}>
            Annual
            <span className="ml-2 text-sm text-green-400">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => {
            const price = billingInterval === 'annual' && tier.price > 0
              ? Math.round(tier.price * 0.8)
              : tier.price;

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-br-purple/20 to-transparent border-2 border-br-purple'
                    : 'bg-gray-900 border border-gray-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-br-purple px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-black">${price}</span>
                    {tier.price > 0 && (
                      <span className="text-gray-400 ml-2">
                        /{billingInterval === 'annual' ? 'month' : tier.interval}
                      </span>
                    )}
                    {tier.price === 0 && (
                      <span className="text-gray-400 ml-2">/{tier.interval}</span>
                    )}
                  </div>

                  <Link
                    href={tier.href}
                    className={`block w-full py-3 rounded-lg font-semibold text-center transition mb-8 ${
                      tier.highlighted
                        ? 'bg-br-purple hover:bg-opacity-80 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {tier.cta}
                  </Link>

                  <ul className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-br-purple mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto text-left">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards via Stripe. Enterprise customers can pay via invoice.</p>
            </div>

            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-400">Yes! Upgrade or downgrade anytime. Changes take effect immediately with prorated billing.</p>
            </div>

            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-semibold mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-400">We'll notify you when you approach limits. You can upgrade or purchase additional capacity.</p>
            </div>

            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">Yes! Pro plan includes a 14-day free trial. No credit card required to start.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-400">
          <p>© 2025 BlackRoad OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
