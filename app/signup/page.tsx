'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get plan from URL params
    const params = new URLSearchParams(window.location.search);
    const urlPlan = params.get('plan');
    if (urlPlan) setPlan(urlPlan);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call API to create user and checkout session
      const response = await fetch('https://blackroad-api.amundsonalexa.workers.dev/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, plan })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      if (plan === 'free') {
        // Redirect to dashboard for free plan
        window.location.href = '/dashboard';
      } else {
        // Redirect to Stripe checkout for paid plans
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-br-orange via-br-red to-br-purple bg-clip-text text-transparent">
            BlackRoad
          </Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Create your account</h1>
          <p className="text-gray-400">
            Start deploying AI agents in minutes
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-br-purple transition"
              >
                <option value="free">Free - $0/month</option>
                <option value="pro">Pro - $49/month (14-day trial)</option>
                <option value="enterprise">Enterprise - Contact Sales</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-br-purple transition"
                placeholder="Jane Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-br-purple transition"
                placeholder="jane@example.com"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || plan === 'enterprise'}
              className="w-full py-3 bg-gradient-to-r from-br-purple to-br-blue hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition"
            >
              {loading ? (
                'Creating account...'
              ) : plan === 'enterprise' ? (
                'Contact Sales for Enterprise'
              ) : plan === 'pro' ? (
                'Start 14-Day Free Trial'
              ) : (
                'Create Free Account'
              )}
            </button>

            {plan === 'enterprise' && (
              <p className="text-center text-sm text-gray-400">
                <Link href="/contact" className="text-br-purple hover:underline">
                  Contact our sales team
                </Link> for enterprise pricing
              </p>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-br-purple hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Features List */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm font-semibold mb-3">What you'll get:</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-br-purple mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Deploy agents in seconds
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-br-purple mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access to template marketplace
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-br-purple mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Real-time monitoring dashboard
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-br-purple mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {plan === 'pro' ? 'Priority support' : 'Community support'}
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-400">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-gray-400">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
