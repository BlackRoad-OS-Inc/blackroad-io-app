'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Success() {
  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = '/dashboard';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Welcome to BlackRoad Pro! Your subscription is now active.
        </p>
        <p className="success-redirect">
          Redirecting to dashboard in 5 seconds...
        </p>
        <Link href="/dashboard" className="success-btn">
          Go to Dashboard Now
        </Link>
      </div>

      <style jsx>{`
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--black);
          padding: var(--space-xl);
        }

        .success-container {
          text-align: center;
          max-width: 500px;
        }

        .success-icon {
          font-size: 80px;
          margin-bottom: var(--space-lg);
          animation: bounce 1s ease-in-out;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .success-title {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: var(--space-md);
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .success-message {
          font-size: 18px;
          opacity: 0.8;
          margin-bottom: var(--space-sm);
        }

        .success-redirect {
          font-size: 14px;
          opacity: 0.5;
          margin-bottom: var(--space-xl);
        }

        .success-btn {
          display: inline-block;
          padding: var(--space-md) var(--space-xl);
          background: var(--gradient-brand);
          color: var(--white);
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s var(--ease-spring);
        }

        .success-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 29, 108, 0.4);
        }
      `}</style>
    </div>
  );
}
