'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://blackroad-api.amundsonalexa.workers.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('br_token', data.token);
        localStorage.setItem('br_user', JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your BlackRoad account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link href="/signup">Sign up</Link>
          </p>
          <Link href="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--black);
          padding: var(--space-xl);
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 21px;
          padding: var(--space-2xl);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .login-header h1 {
          font-size: 34px;
          font-weight: 700;
          margin-bottom: var(--space-sm);
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-header p {
          opacity: 0.7;
          font-size: 16px;
        }

        .error-message {
          background: rgba(255, 29, 108, 0.1);
          border: 1px solid rgba(255, 29, 108, 0.3);
          color: var(--hot-pink);
          padding: var(--space-md);
          border-radius: 8px;
          margin-bottom: var(--space-lg);
          font-size: 14px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          opacity: 0.9;
        }

        .form-group input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: var(--space-md);
          font-size: 16px;
          color: var(--white);
          transition: all 0.3s var(--ease);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--hot-pink);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(255, 29, 108, 0.1);
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .login-btn {
          background: var(--gradient-brand);
          color: var(--white);
          border: none;
          padding: var(--space-md) var(--space-xl);
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s var(--ease-spring);
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 29, 108, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: var(--space-xl);
          text-align: center;
        }

        .login-footer p {
          font-size: 14px;
          opacity: 0.7;
          margin-bottom: var(--space-sm);
        }

        .login-footer a {
          color: var(--hot-pink);
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.3s var(--ease);
        }

        .login-footer a:hover {
          opacity: 0.8;
        }

        .forgot-link {
          font-size: 14px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
