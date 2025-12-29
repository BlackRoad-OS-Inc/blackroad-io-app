'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  status: 'deploying' | 'running' | 'stopped';
  requests: number;
  uptime: number;
  memory: number;
}

export default function AgentPlayground() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentName, setAgentName] = useState('');
  const [deployCount, setDeployCount] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        requests: agent.status === 'running' ? agent.requests + Math.floor(Math.random() * 10) : agent.requests,
        uptime: agent.status === 'running' ? agent.uptime + 1 : agent.uptime,
        memory: agent.status === 'running' ? 45 + Math.random() * 20 : agent.memory
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const deployAgent = () => {
    if (!agentName.trim()) return;

    setIsDeploying(true);
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: agentName,
      status: 'deploying',
      requests: 0,
      uptime: 0,
      memory: 0
    };

    setAgents(prev => [...prev, newAgent]);
    setDeployCount(prev => prev + 1);
    setAgentName('');

    // Simulate deployment process
    setTimeout(() => {
      setAgents(prev => prev.map(a =>
        a.id === newAgent.id ? { ...a, status: 'running' as const, memory: 50 } : a
      ));
      setIsDeploying(false);
    }, 2000);
  };

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'running' ? 'stopped' as const : 'running' as const }
        : a
    ));
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    if (selectedAgent?.id === id) setSelectedAgent(null);
  };

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
          <span className="nav-logo-text">Agent Playground</span>
        </Link>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/docs">Docs</Link></li>
        </ul>

        <Link href="/signup" className="nav-cta">Deploy Live</Link>
      </nav>

      <div className="playground">
        {/* Background Effects */}
        <div className="playground-grid"></div>
        <div className="playground-orb playground-orb-1"></div>
        <div className="playground-orb playground-orb-2"></div>

        {/* Header */}
        <header className="playground-header">
          <h1 className="playground-title">AI Agent Playground</h1>
          <p className="playground-subtitle">Deploy, monitor, and scale AI agents in real-time</p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{agents.length}</div>
              <div className="stat-label">Active Agents</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{deployCount}</div>
              <div className="stat-label">Total Deployed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{agents.reduce((sum, a) => sum + a.requests, 0)}</div>
              <div className="stat-label">Total Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{agents.filter(a => a.status === 'running').length}</div>
              <div className="stat-label">Running Now</div>
            </div>
          </div>
        </header>

        {/* Deploy Section */}
        <section className="deploy-section">
          <div className="deploy-card">
            <h2 className="deploy-title">Deploy New Agent</h2>
            <div className="deploy-form">
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && deployAgent()}
                placeholder="Enter agent name..."
                className="deploy-input"
                disabled={isDeploying}
              />
              <button
                onClick={deployAgent}
                disabled={isDeploying || !agentName.trim()}
                className="deploy-btn"
              >
                {isDeploying ? (
                  <>
                    <span className="spinner"></span>
                    Deploying...
                  </>
                ) : (
                  <>
                    <span className="deploy-icon">🚀</span>
                    Deploy Agent
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="agents-section">
          <h2 className="section-title">Your Agents</h2>
          {agents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤖</div>
              <p className="empty-text">No agents deployed yet</p>
              <p className="empty-subtext">Deploy your first agent to get started</p>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`agent-card ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="agent-header">
                    <div className="agent-info">
                      <h3 className="agent-name">{agent.name}</h3>
                      <span className={`agent-status status-${agent.status}`}>
                        {agent.status === 'deploying' && '⏳ Deploying'}
                        {agent.status === 'running' && '✓ Running'}
                        {agent.status === 'stopped' && '⏸ Stopped'}
                      </span>
                    </div>
                    <div className="agent-actions">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleAgent(agent.id); }}
                        className="agent-action-btn"
                        title={agent.status === 'running' ? 'Stop' : 'Start'}
                      >
                        {agent.status === 'running' ? '⏸' : '▶️'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteAgent(agent.id); }}
                        className="agent-action-btn danger"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="agent-metrics">
                    <div className="metric">
                      <span className="metric-label">Requests</span>
                      <span className="metric-value">{agent.requests.toLocaleString()}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Uptime</span>
                      <span className="metric-value">{Math.floor(agent.uptime / 60)}m {agent.uptime % 60}s</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Memory</span>
                      <span className="metric-value">{agent.memory.toFixed(1)} MB</span>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="agent-chart">
                    <div
                      className="chart-bar"
                      style={{ width: `${Math.min((agent.requests / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Agent Details */}
        {selectedAgent && (
          <section className="details-section">
            <h2 className="section-title">Agent Details: {selectedAgent.name}</h2>
            <div className="details-grid">
              <div className="detail-card">
                <h3 className="detail-title">Performance</h3>
                <div className="detail-metrics">
                  <div className="detail-metric">
                    <span className="detail-label">Total Requests</span>
                    <span className="detail-value gradient-text">{selectedAgent.requests}</span>
                  </div>
                  <div className="detail-metric">
                    <span className="detail-label">Avg Response Time</span>
                    <span className="detail-value">~{(45 + Math.random() * 30).toFixed(0)}ms</span>
                  </div>
                  <div className="detail-metric">
                    <span className="detail-label">Success Rate</span>
                    <span className="detail-value">99.{Math.floor(90 + Math.random() * 9)}%</span>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <h3 className="detail-title">Resources</h3>
                <div className="detail-metrics">
                  <div className="detail-metric">
                    <span className="detail-label">CPU Usage</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${35 + Math.random() * 25}%` }}></div>
                    </div>
                  </div>
                  <div className="detail-metric">
                    <span className="detail-label">Memory Usage</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${selectedAgent.memory}%` }}></div>
                    </div>
                  </div>
                  <div className="detail-metric">
                    <span className="detail-label">Network I/O</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${20 + Math.random() * 40}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <h3 className="detail-title">Configuration</h3>
                <div className="config-list">
                  <div className="config-item">
                    <span className="config-key">Model:</span>
                    <span className="config-value">claude-sonnet-4-5</span>
                  </div>
                  <div className="config-item">
                    <span className="config-key">Region:</span>
                    <span className="config-value">us-west-1</span>
                  </div>
                  <div className="config-item">
                    <span className="config-key">Instance:</span>
                    <span className="config-value">Standard</span>
                  </div>
                  <div className="config-item">
                    <span className="config-key">Auto-scale:</span>
                    <span className="config-value">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .playground {
          min-height: 100vh;
          padding-top: 100px;
          position: relative;
          overflow: hidden;
        }

        .playground-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 55px 55px;
          opacity: 0.5;
          z-index: -1;
        }

        .playground-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.1;
          z-index: -1;
          pointer-events: none;
        }

        .playground-orb-1 {
          width: 600px;
          height: 600px;
          background: var(--gradient-brand);
          top: -200px;
          right: -200px;
          animation: orb-float-1 20s ease-in-out infinite;
        }

        .playground-orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, var(--electric-blue) 0%, var(--violet) 100%);
          bottom: -150px;
          left: -150px;
          animation: orb-float-2 25s ease-in-out infinite;
        }

        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 50px) scale(1.1); }
        }

        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -50px) scale(1.1); }
        }

        .playground-header {
          text-align: center;
          padding: var(--space-2xl) var(--space-xl);
          max-width: 1200px;
          margin: 0 auto;
        }

        .playground-title {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 700;
          margin-bottom: var(--space-md);
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .playground-subtitle {
          font-size: 18px;
          opacity: 0.7;
          margin-bottom: var(--space-2xl);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
          max-width: 900px;
          margin: 0 auto;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: var(--space-lg);
          text-align: center;
          transition: all 0.3s var(--ease);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-value {
          font-size: 48px;
          font-weight: 700;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-xs);
        }

        .stat-label {
          font-size: 13px;
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .deploy-section {
          padding: var(--space-xl);
          max-width: 800px;
          margin: 0 auto;
        }

        .deploy-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: var(--space-xl);
        }

        .deploy-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .deploy-form {
          display: flex;
          gap: var(--space-md);
        }

        .deploy-input {
          flex: 1;
          padding: var(--space-md) var(--space-lg);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--white);
          font-size: 16px;
          outline: none;
          transition: all 0.3s var(--ease);
        }

        .deploy-input:focus {
          border-color: var(--hot-pink);
          background: rgba(255, 255, 255, 0.08);
        }

        .deploy-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .deploy-btn {
          padding: var(--space-md) var(--space-xl);
          background: var(--gradient-brand);
          border: none;
          border-radius: 12px;
          color: var(--white);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          transition: all 0.3s var(--ease-spring);
          white-space: nowrap;
        }

        .deploy-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255, 29, 108, 0.4);
        }

        .deploy-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .deploy-icon {
          font-size: 20px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: var(--white);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .agents-section {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: var(--space-xl);
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: var(--space-3xl) var(--space-xl);
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: var(--space-lg);
          opacity: 0.3;
        }

        .empty-text {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: var(--space-xs);
        }

        .empty-subtext {
          font-size: 14px;
          opacity: 0.5;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-md);
        }

        .agent-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: var(--space-lg);
          cursor: pointer;
          transition: all 0.3s var(--ease);
        }

        .agent-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .agent-card.selected {
          border-color: var(--hot-pink);
          background: rgba(255, 29, 108, 0.1);
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-md);
        }

        .agent-info {
          flex: 1;
        }

        .agent-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--space-xs);
        }

        .agent-status {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 100px;
          display: inline-block;
        }

        .status-deploying {
          background: rgba(245, 166, 35, 0.2);
          color: var(--amber);
        }

        .status-running {
          background: rgba(41, 121, 255, 0.2);
          color: var(--electric-blue);
        }

        .status-stopped {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
        }

        .agent-actions {
          display: flex;
          gap: var(--space-xs);
        }

        .agent-action-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s var(--ease);
          font-size: 14px;
        }

        .agent-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .agent-action-btn.danger:hover {
          background: rgba(255, 29, 108, 0.2);
          border-color: var(--hot-pink);
        }

        .agent-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label {
          font-size: 11px;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
        }

        .agent-chart {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .chart-bar {
          height: 100%;
          background: var(--gradient-brand);
          transition: width 0.5s var(--ease);
        }

        .details-section {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 1400px;
          margin: 0 auto;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--space-md);
        }

        .detail-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: var(--space-lg);
        }

        .detail-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--space-lg);
        }

        .detail-metrics {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .detail-metric {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .detail-label {
          font-size: 13px;
          opacity: 0.6;
        }

        .detail-value {
          font-size: 24px;
          font-weight: 600;
        }

        .gradient-text {
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-brand);
          border-radius: 4px;
          transition: width 0.5s var(--ease);
        }

        .config-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .config-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-sm);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }

        .config-key {
          font-size: 13px;
          opacity: 0.6;
        }

        .config-value {
          font-size: 14px;
          font-weight: 500;
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

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .deploy-form {
            flex-direction: column;
          }

          .agents-grid {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
