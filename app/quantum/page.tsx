'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function QuantumVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simulation, setSimulation] = useState<'wave' | 'entanglement' | 'superposition'>('wave');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [particles, setParticles] = useState(50);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const drawWaveFunction = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const amplitude = 80;
      const frequency = 0.02;

      // Draw multiple wave functions
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, `rgba(245, 166, 35, ${0.6 - i * 0.2})`);
        gradient.addColorStop(0.382, `rgba(255, 29, 108, ${0.6 - i * 0.2})`);
        gradient.addColorStop(0.618, `rgba(156, 39, 176, ${0.6 - i * 0.2})`);
        gradient.addColorStop(1, `rgba(41, 121, 255, ${0.6 - i * 0.2})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3 - i;

        for (let x = 0; x < canvas.width; x++) {
          const y = centerY + Math.sin((x + time + i * 100) * frequency) * amplitude * Math.cos(time * 0.001 + i);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const drawEntanglement = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numPairs = Math.floor(particles / 2);

      for (let i = 0; i < numPairs; i++) {
        const angle1 = (time * 0.001 + i) % (Math.PI * 2);
        const angle2 = angle1 + Math.PI;

        const radius = 150 + Math.sin(time * 0.002 + i) * 30;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;
        const x2 = centerX + Math.cos(angle2) * radius;
        const y2 = centerY + Math.sin(angle2) * radius;

        // Draw connection
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(245, 166, 35, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 29, 108, 0.3)');
        gradient.addColorStop(1, 'rgba(41, 121, 255, 0.3)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw particles
        [{ x: x1, y: y1 }, { x: x2, y: y2 }].forEach((pos, idx) => {
          const particleGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 8);
          particleGradient.addColorStop(0, idx === 0 ? 'rgba(245, 166, 35, 1)' : 'rgba(41, 121, 255, 1)');
          particleGradient.addColorStop(1, idx === 0 ? 'rgba(245, 166, 35, 0)' : 'rgba(41, 121, 255, 0)');

          ctx.fillStyle = particleGradient;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    const drawSuperposition = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < particles; i++) {
        const angle = (i / particles) * Math.PI * 2;
        const wobble = Math.sin(time * 0.003 + i) * 30;
        const radius = 120 + wobble;

        const x = centerX + Math.cos(angle + time * 0.0005) * radius;
        const y = centerY + Math.sin(angle + time * 0.0005) * radius;

        const size = 3 + Math.abs(Math.sin(time * 0.002 + i)) * 4;

        const hue = (i / particles) * 360;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);

        const colors = ['#F5A623', '#FF1D6C', '#9C27B0', '#2979FF'];
        const colorIdx = Math.floor((i / particles) * colors.length);

        gradient.addColorStop(0, colors[colorIdx]);
        gradient.addColorStop(1, colors[colorIdx] + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      if (isPlaying) {
        time += speed;

        switch (simulation) {
          case 'wave':
            drawWaveFunction();
            break;
          case 'entanglement':
            drawEntanglement();
            break;
          case 'superposition':
            drawSuperposition();
            break;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [simulation, isPlaying, speed, particles]);

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
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
          <span className="nav-logo-text">Quantum Visualizer</span>
        </Link>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/playground">Playground</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
        </ul>

        <Link href="/signup" className="nav-cta">Get Started</Link>
      </nav>

      <div className="quantum">
        <div className="quantum-grid"></div>

        <div className="quantum-container">
          <header className="quantum-header">
            <h1 className="quantum-title">Quantum Visualizer</h1>
            <p className="quantum-subtitle">Explore quantum phenomena through interactive simulations</p>
          </header>

          {/* Canvas */}
          <div className="canvas-container">
            <canvas ref={canvasRef} className="quantum-canvas"></canvas>
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="control-group">
              <label className="control-label">Simulation Type</label>
              <div className="sim-buttons">
                <button
                  className={`sim-btn ${simulation === 'wave' ? 'active' : ''}`}
                  onClick={() => setSimulation('wave')}
                >
                  Wave Function
                </button>
                <button
                  className={`sim-btn ${simulation === 'entanglement' ? 'active' : ''}`}
                  onClick={() => setSimulation('entanglement')}
                >
                  Entanglement
                </button>
                <button
                  className={`sim-btn ${simulation === 'superposition' ? 'active' : ''}`}
                  onClick={() => setSimulation('superposition')}
                >
                  Superposition
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Speed: {speed.toFixed(1)}x</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label className="control-label">Particles: {particles}</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={particles}
                onChange={(e) => setParticles(parseInt(e.target.value))}
                className="slider"
              />
            </div>

            <button
              className="play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸ Pause' : '▶️ Play'}
            </button>
          </div>

          {/* Info Cards */}
          <div className="info-cards">
            <div className="info-card">
              <h3 className="info-title">Wave Function</h3>
              <p className="info-text">
                Visualizes the probability amplitude of quantum states as they evolve through time and space.
              </p>
            </div>

            <div className="info-card">
              <h3 className="info-title">Quantum Entanglement</h3>
              <p className="info-text">
                Demonstrates correlated particle pairs that remain connected regardless of distance.
              </p>
            </div>

            <div className="info-card">
              <h3 className="info-title">Superposition</h3>
              <p className="info-text">
                Shows particles existing in multiple states simultaneously until measured.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .quantum {
          min-height: 100vh;
          padding-top: 100px;
          position: relative;
          overflow: hidden;
          background: var(--black);
        }

        .quantum-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 55px 55px;
          opacity: 0.5;
          z-index: -1;
        }

        .quantum-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-xl);
        }

        .quantum-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .quantum-title {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 700;
          margin-bottom: var(--space-md);
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .quantum-subtitle {
          font-size: 18px;
          opacity: 0.7;
        }

        .canvas-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: var(--space-lg);
          margin-bottom: var(--space-xl);
          min-height: 400px;
        }

        .quantum-canvas {
          width: 100%;
          height: 400px;
          border-radius: 16px;
        }

        .controls {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .control-group {
          margin-bottom: var(--space-lg);
        }

        .control-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          opacity: 0.7;
          margin-bottom: var(--space-sm);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sim-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--space-sm);
        }

        .sim-btn {
          padding: var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--white);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s var(--ease);
        }

        .sim-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .sim-btn.active {
          background: var(--gradient-brand);
          border-color: transparent;
        }

        .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--gradient-brand);
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--gradient-brand);
          cursor: pointer;
          border: none;
        }

        .play-btn {
          width: 100%;
          padding: var(--space-md);
          background: var(--gradient-brand);
          border: none;
          border-radius: 12px;
          color: var(--white);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s var(--ease-spring);
          margin-top: var(--space-md);
        }

        .play-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 29, 108, 0.4);
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-md);
        }

        .info-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: var(--space-lg);
          transition: all 0.3s var(--ease);
        }

        .info-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .info-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--space-sm);
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .info-text {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.6;
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

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .quantum-canvas {
            height: 300px;
          }

          .info-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
