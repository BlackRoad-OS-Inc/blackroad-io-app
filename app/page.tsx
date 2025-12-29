'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Scroll Progress
    const handleScroll = () => {
      const progress = document.getElementById('scrollProgress');
      if (progress) {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progress.style.width = (scrollTop / scrollHeight) * 100 + '%';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --black: #000000;
          --white: #FFFFFF;
          --amber: #F5A623;
          --orange: #F26522;
          --hot-pink: #FF1D6C;
          --magenta: #E91E63;
          --electric-blue: #2979FF;
          --sky-blue: #448AFF;
          --violet: #9C27B0;
          --deep-purple: #5E35B1;

          --gradient-brand: linear-gradient(135deg, var(--amber) 0%, var(--hot-pink) 38.2%, var(--violet) 61.8%, var(--electric-blue) 100%);

          --phi: 1.618;
          --space-xs: 8px;
          --space-sm: 13px;
          --space-md: 21px;
          --space-lg: 34px;
          --space-xl: 55px;
          --space-2xl: 89px;
          --space-3xl: 144px;

          --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
          --ease-out: cubic-bezier(0, 0, 0.2, 1);
          --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          background: var(--black);
          color: var(--white);
          overflow-x: hidden;
          line-height: 1.618;
          -webkit-font-smoothing: antialiased;
        }

        /* ========== SCROLL PROGRESS ========== */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: var(--gradient-brand);
          z-index: 9999;
          width: 0%;
        }

        /* ========== NAVIGATION ========== */
        nav {
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

        .nav-logo-mark .road-dashes {
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

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
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

        /* ========== HERO ========== */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          padding: var(--space-3xl) var(--space-xl);
        }

        /* Animated Background Grid */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 55px 55px;
          animation: grid-move 20s linear infinite;
          opacity: 0.5;
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(55px, 55px); }
        }

        /* Floating Particles */
        .particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          animation: particle-float linear infinite;
          opacity: 0;
        }

        @keyframes particle-float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .particle:nth-child(1) { left: 5%; width: 4px; height: 4px; background: var(--hot-pink); animation-duration: 15s; animation-delay: 0s; }
        .particle:nth-child(2) { left: 15%; width: 6px; height: 6px; background: var(--amber); animation-duration: 18s; animation-delay: -2s; }
        .particle:nth-child(3) { left: 25%; width: 3px; height: 3px; background: var(--electric-blue); animation-duration: 12s; animation-delay: -4s; }
        .particle:nth-child(4) { left: 35%; width: 5px; height: 5px; background: var(--violet); animation-duration: 20s; animation-delay: -1s; }
        .particle:nth-child(5) { left: 45%; width: 4px; height: 4px; background: var(--hot-pink); animation-duration: 16s; animation-delay: -3s; }
        .particle:nth-child(6) { left: 55%; width: 7px; height: 7px; background: var(--amber); animation-duration: 22s; animation-delay: -5s; }
        .particle:nth-child(7) { left: 65%; width: 3px; height: 3px; background: var(--electric-blue); animation-duration: 14s; animation-delay: -2s; }
        .particle:nth-child(8) { left: 75%; width: 5px; height: 5px; background: var(--violet); animation-duration: 19s; animation-delay: -4s; }
        .particle:nth-child(9) { left: 85%; width: 4px; height: 4px; background: var(--hot-pink); animation-duration: 17s; animation-delay: -1s; }
        .particle:nth-child(10) { left: 95%; width: 6px; height: 6px; background: var(--amber); animation-duration: 21s; animation-delay: -3s; }
        .particle:nth-child(11) { left: 10%; width: 5px; height: 5px; background: var(--electric-blue); animation-duration: 13s; animation-delay: -6s; }
        .particle:nth-child(12) { left: 30%; width: 4px; height: 4px; background: var(--violet); animation-duration: 24s; animation-delay: -7s; }
        .particle:nth-child(13) { left: 50%; width: 6px; height: 6px; background: var(--hot-pink); animation-duration: 11s; animation-delay: -8s; }
        .particle:nth-child(14) { left: 70%; width: 3px; height: 3px; background: var(--amber); animation-duration: 23s; animation-delay: -9s; }
        .particle:nth-child(15) { left: 90%; width: 5px; height: 5px; background: var(--electric-blue); animation-duration: 15s; animation-delay: -10s; }

        /* Glowing Orbs */
        .orbs {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: var(--hot-pink);
          opacity: 0.12;
          top: -200px;
          right: -100px;
          animation: orb-drift-1 25s ease-in-out infinite;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: var(--electric-blue);
          opacity: 0.1;
          bottom: -150px;
          left: -100px;
          animation: orb-drift-2 30s ease-in-out infinite;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: var(--amber);
          opacity: 0.08;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: orb-pulse 8s ease-in-out infinite;
        }

        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-100px, 80px); }
        }

        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(80px, -60px); }
        }

        @keyframes orb-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.08; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.12; }
        }

        /* Hero Content */
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 900px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-xs) var(--space-md);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          margin-bottom: var(--space-lg);
          animation: fade-up 0.8s var(--ease-out) 0.2s both;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--hot-pink);
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-title {
          font-size: clamp(48px, 8vw, 89px);
          font-weight: 600;
          line-height: 1.05;
          margin-bottom: var(--space-md);
          animation: fade-up 0.8s var(--ease-out) 0.4s both;
        }

        .hero-title-gradient {
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 18px;
          font-weight: 400;
          opacity: 0.7;
          max-width: 600px;
          margin: 0 auto var(--space-lg);
          animation: fade-up 0.8s var(--ease-out) 0.6s both;
        }

        .hero-actions {
          display: flex;
          gap: var(--space-sm);
          justify-content: center;
          flex-wrap: wrap;
          animation: fade-up 0.8s var(--ease-out) 0.8s both;
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

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-lg);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          border-radius: 8px;
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

        .btn-primary span {
          position: relative;
          z-index: 1;
        }

        .btn-primary:hover {
          color: var(--white);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(255, 29, 108, 0.4);
        }

        .btn-primary:hover::before {
          opacity: 1;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--hot-pink);
          transform: translateY(-3px);
        }

        /* Scroll Indicator */
        .scroll-hint {
          position: absolute;
          bottom: var(--space-lg);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          opacity: 0.5;
          animation: fade-up 0.8s var(--ease-out) 1.2s both;
        }

        .scroll-hint-text {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .scroll-hint-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--white), transparent);
          animation: scroll-pulse 2s ease-in-out infinite;
        }

        @keyframes scroll-pulse {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50% { transform: scaleY(0.5); opacity: 1; }
        }

        /* ========== SECTION STYLES ========== */
        section {
          padding: var(--space-3xl) var(--space-xl);
          position: relative;
        }

        .section-header {
          max-width: 700px;
          margin-bottom: var(--space-xl);
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
          font-size: clamp(32px, 5vw, 55px);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: var(--space-sm);
        }

        .section-desc {
          font-size: 16px;
          opacity: 0.7;
          line-height: 1.7;
        }

        /* ========== FEATURES SECTION ========== */
        .features {
          background: linear-gradient(180deg, var(--black) 0%, rgba(20, 20, 20, 1) 100%);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-md);
        }

        .feature-card {
          padding: var(--space-lg);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: all 0.4s var(--ease);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-brand);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s var(--ease);
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 29, 108, 0.1);
          border-radius: 12px;
          margin-bottom: var(--space-sm);
          font-size: 24px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--space-xs);
        }

        .feature-desc {
          font-size: 14px;
          opacity: 0.6;
          line-height: 1.7;
        }

        /* ========== STATS SECTION ========== */
        .stats {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: var(--space-2xl) var(--space-xl);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-lg);
          text-align: center;
        }

        .stat-value {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-xs);
        }

        .stat-label {
          font-size: 13px;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ========== CTA SECTION ========== */
        .cta {
          background: linear-gradient(180deg, var(--black) 0%, rgba(20, 20, 20, 1) 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          background: var(--gradient-brand);
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.15;
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
          font-size: clamp(32px, 5vw, 55px);
          font-weight: 600;
          margin-bottom: var(--space-sm);
        }

        .cta-desc {
          font-size: 18px;
          opacity: 0.7;
          max-width: 500px;
          margin: 0 auto var(--space-lg);
        }

        /* ========== FOOTER ========== */
        footer {
          padding: var(--space-2xl) var(--space-xl);
          background: var(--black);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-main {
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr);
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
          }
        }

        .footer-brand {
          max-width: 280px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
          text-decoration: none;
          color: var(--white);
        }

        .footer-logo-mark {
          width: 36px;
          height: 36px;
        }

        .footer-logo-text {
          font-size: 15px;
          font-weight: 500;
        }

        .footer-tagline {
          font-size: 14px;
          opacity: 0.5;
          line-height: 1.7;
        }

        .footer-column h4 {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: var(--space-md);
          opacity: 0.7;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: var(--space-xs);
        }

        .footer-links a {
          font-size: 14px;
          color: var(--white);
          text-decoration: none;
          opacity: 0.5;
          transition: all 0.3s var(--ease);
        }

        .footer-links a:hover {
          opacity: 1;
          color: var(--hot-pink);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .footer-copy {
          font-size: 13px;
          opacity: 0.4;
        }

        .footer-socials {
          display: flex;
          gap: var(--space-sm);
        }

        .footer-social {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          color: var(--white);
          text-decoration: none;
          opacity: 0.5;
          transition: all 0.3s var(--ease-spring);
        }

        .footer-social:hover {
          opacity: 1;
          background: var(--hot-pink);
          transform: translateY(-3px);
        }
      `}</style>

      {/* Scroll Progress */}
      <div className="scroll-progress" id="scrollProgress"></div>

      {/* ========== NAVIGATION ========== */}
      <nav>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="44" stroke="#FF1D6C" strokeWidth="6"/>
              <g className="road-dashes">
                <rect x="47" y="4" width="6" height="12" fill="#000" rx="2"/>
                <rect x="47" y="84" width="6" height="12" fill="#000" rx="2"/>
                <rect x="84" y="47" width="12" height="6" fill="#000" rx="2"/>
                <rect x="4" y="47" width="12" height="6" fill="#000" rx="2"/>
                <rect x="75" y="18" width="6" height="10" fill="#000" rx="2" transform="rotate(45 78 23)"/>
                <rect x="19" y="72" width="6" height="10" fill="#000" rx="2" transform="rotate(45 22 77)"/>
                <rect x="72" y="72" width="6" height="10" fill="#000" rx="2" transform="rotate(-45 75 77)"/>
                <rect x="22" y="18" width="6" height="10" fill="#000" rx="2" transform="rotate(-45 25 23)"/>
              </g>
              <path d="M50 10C27.9 10 10 27.9 10 50H90C90 27.9 72.1 10 50 10Z" fill="#F5A623"/>
              <path d="M10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50H10Z" fill="#2979FF"/>
              <circle cx="50" cy="50" r="14" fill="#000"/>
            </svg>
          </div>
          <span className="nav-logo-text">BlackRoad OS</span>
        </Link>

        <ul className="nav-links">
          <li><Link href="#features">Features</Link></li>
          <li><Link href="#pricing">Pricing</Link></li>
          <li><Link href="/docs">Docs</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
        </ul>

        <Link href="/signup" className="nav-cta">Start Free</Link>
      </nav>

      {/* ========== HERO ========== */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Now Available</span>
          </div>

          <h1 className="hero-title">
            Build the Future with<br/>
            <span className="hero-title-gradient">Infinite Agents</span>
          </h1>

          <p className="hero-desc">
            Deploy, orchestrate, and scale AI agents across your infrastructure. Start free, scale infinitely.
          </p>

          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary"><span>Start Free</span></Link>
            <Link href="/pricing" className="btn btn-secondary">View Pricing</Link>
          </div>
        </div>

        <div className="scroll-hint">
          <span className="scroll-hint-text">Scroll</span>
          <div className="scroll-hint-line"></div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="features" id="features">
        <div className="section-header">
          <span className="section-label">Platform</span>
          <h2 className="section-title">Everything you need to orchestrate agents</h2>
          <p className="section-desc">From deployment to monitoring, BlackRoad OS provides the complete infrastructure for AI agent management.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Instant Deployment</h3>
            <p className="feature-desc">Deploy agents in seconds with our CLI or web interface. No complex setup required.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3 className="feature-title">Agent Orchestration</h3>
            <p className="feature-desc">Coordinate multiple agents with our composable architecture. Build complex workflows easily.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Real-time Monitoring</h3>
            <p className="feature-desc">Track performance, usage, and health metrics across all your agents in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 className="feature-title">Global Edge Network</h3>
            <p className="feature-desc">Run agents on Cloudflare's global network for low latency and high availability.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3 className="feature-title">Enterprise Security</h3>
            <p className="feature-desc">Built-in encryption, authentication, and compliance features for enterprise deployments.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">♾️</div>
            <h3 className="feature-title">Infinite Scale</h3>
            <p className="feature-desc">From 1 to 10,000+ agents. Scale seamlessly with usage-based pricing.</p>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">10K+</div>
            <div className="stat-label">Agents Deployed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">50ms</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">∞</div>
            <div className="stat-label">Possibilities</div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="cta" id="cta">
        <div className="cta-orb"></div>
        <div className="cta-content">
          <h2 className="cta-title">Ready to build the future?</h2>
          <p className="cta-desc">Start deploying AI agents today. Free tier available. No credit card required.</p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary"><span>Start Free Today</span></Link>
            <Link href="/pricing" className="btn btn-secondary">See Pricing Plans</Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-mark">
                <svg viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="44" stroke="#FF1D6C" strokeWidth="6"/>
                  <path d="M50 10C27.9 10 10 27.9 10 50H90C90 27.9 72.1 10 50 10Z" fill="#F5A623"/>
                  <path d="M10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50H10Z" fill="#2979FF"/>
                  <circle cx="50" cy="50" r="14" fill="#000"/>
                </svg>
              </div>
              <span className="footer-logo-text">BlackRoad OS</span>
            </Link>
            <p className="footer-tagline">Composable agent orchestration platform. Build, deploy, and scale AI agents.</p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/changelog">Changelog</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link href="/docs">Docs</Link></li>
              <li><Link href="/api">API Reference</Link></li>
              <li><Link href="/support">Support</Link></li>
              <li><Link href="/status">Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2025 BlackRoad OS · All rights reserved</p>
          <div className="footer-socials">
            <Link href="https://github.com/blackboxprogramming" className="footer-social">✦</Link>
            <Link href="#" className="footer-social">◆</Link>
            <Link href="#" className="footer-social">●</Link>
            <Link href="#" className="footer-social">■</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
