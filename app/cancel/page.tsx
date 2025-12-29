'use client';

import Link from 'next/link';

export default function Cancel() {
  return (
    <div className="cancel-page">
      <div className="cancel-container">
        <div className="cancel-icon">❌</div>
        <h1 className="cancel-title">Payment Cancelled</h1>
        <p className="cancel-message">
          No worries! You can try again anytime.
        </p>
        <div className="cancel-actions">
          <Link href="/pricing" className="cancel-btn primary">
            View Pricing Again
          </Link>
          <Link href="/" className="cancel-btn secondary">
            Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .cancel-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--black);
          padding: var(--space-xl);
        }

        .cancel-container {
          text-align: center;
          max-width: 500px;
        }

        .cancel-icon {
          font-size: 80px;
          margin-bottom: var(--space-lg);
          opacity: 0.5;
        }

        .cancel-title {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: var(--space-md);
        }

        .cancel-message {
          font-size: 18px;
          opacity: 0.7;
          margin-bottom: var(--space-xl);
        }

        .cancel-actions {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
        }

        .cancel-btn {
          padding: var(--space-md) var(--space-xl);
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s var(--ease-spring);
        }

        .cancel-btn.primary {
          background: var(--gradient-brand);
          color: var(--white);
        }

        .cancel-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 29, 108, 0.4);
        }

        .cancel-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .cancel-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </div>
  );
}
