'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CodexItem {
  id: string;
  name: string;
  type: 'component' | 'function' | 'module' | 'template';
  repo: string;
  language: string;
  lines: number;
  description: string;
  tags: string[];
}

const SAMPLE_ITEMS: CodexItem[] = [
  { id: '1', name: 'QuantumStateManager', type: 'component', repo: 'blackroad-quantum', language: 'TypeScript', lines: 324, description: 'Manages quantum state transitions and entanglement', tags: ['quantum', 'physics', 'state'] },
  { id: '2', name: 'AgentOrchestrator', type: 'module', repo: 'blackroad-os-core', language: 'TypeScript', lines: 567, description: 'Orchestrates multi-agent deployments and coordination', tags: ['agents', 'orchestration', 'core'] },
  { id: '3', name: 'MemorySync', type: 'function', repo: 'memory-system', language: 'Bash', lines: 123, description: 'Synchronizes memory state across distributed agents', tags: ['memory', 'sync', 'distributed'] },
  { id: '4', name: 'InfinityHasher', type: 'component', repo: 'blackroad-security', language: 'TypeScript', lines: 234, description: 'PS-SHA-∞ infinite cascade hashing algorithm', tags: ['security', 'crypto', 'hashing'] },
  { id: '5', name: 'GradientButton', type: 'component', repo: 'blackroad-os-brand', language: 'React', lines: 89, description: 'Official brand gradient button component', tags: ['ui', 'brand', 'component'] },
  { id: '6', name: 'TrafficLight', type: 'module', repo: 'blackroad-devtools', language: 'Bash', lines: 156, description: 'Project status traffic light system (red/yellow/green)', tags: ['devtools', 'status', 'workflow'] },
  { id: '7', name: 'CodexVerification', type: 'function', repo: 'blackroad-codex', language: 'Bash', lines: 445, description: 'Verifies codex integrity and component counts', tags: ['codex', 'verification', 'integrity'] },
  { id: '8', name: 'WaveFunction', type: 'component', repo: 'blackroad-quantum', language: 'TypeScript', lines: 278, description: 'Quantum wave function visualization', tags: ['quantum', 'visualization', 'physics'] },
  { id: '9', name: 'TaskMarketplace', type: 'module', repo: 'memory-system', language: 'Bash', lines: 334, description: 'Distributed task marketplace for Claude agents', tags: ['tasks', 'marketplace', 'collaboration'] },
  { id: '10', name: 'FibonacciSpacing', type: 'template', repo: 'blackroad-os-brand', language: 'CSS', lines: 67, description: 'Fibonacci-based spacing system template', tags: ['design', 'spacing', 'fibonacci'] },
];

export default function CodexExplorer() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CodexItem | null>(null);

  const filteredItems = SAMPLE_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: 8789,
    components: 3245,
    functions: 2134,
    modules: 1876,
    templates: 1534
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
          <span className="nav-logo-text">Codex Explorer</span>
        </Link>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/playground">Playground</Link></li>
          <li><Link href="/quantum">Quantum</Link></li>
        </ul>

        <Link href="/signup" className="nav-cta">Get Started</Link>
      </nav>

      <div className="codex">
        <div className="codex-grid"></div>

        <div className="codex-container">
          {/* Header */}
          <header className="codex-header">
            <h1 className="codex-title">Codex Explorer</h1>
            <p className="codex-subtitle">Browse {stats.total.toLocaleString()} components across the BlackRoad ecosystem</p>
          </header>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-value">{stats.total.toLocaleString()}</div>
              <div className="stat-label">Total Components</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚛️</div>
              <div className="stat-value">{stats.components.toLocaleString()}</div>
              <div className="stat-label">Components</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">{stats.functions.toLocaleString()}</div>
              <div className="stat-label">Functions</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎨</div>
              <div className="stat-value">{stats.templates.toLocaleString()}</div>
              <div className="stat-label">Templates</div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search components, functions, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button onClick={() => setSearch('')} className="search-clear">✕</button>
              )}
            </div>

            <div className="filter-tabs">
              {['all', 'component', 'function', 'module', 'template'].map(type => (
                <button
                  key={type}
                  className={`filter-tab ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {type !== 'all' && ` (${SAMPLE_ITEMS.filter(i => i.type === type).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                {filteredItems.length} {filteredItems.length === 1 ? 'Result' : 'Results'}
              </h2>
            </div>

            <div className="results-layout">
              {/* List */}
              <div className="results-list">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`result-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="result-header">
                      <div className="result-icon">
                        {item.type === 'component' && '⚛️'}
                        {item.type === 'function' && '⚡'}
                        {item.type === 'module' && '📦'}
                        {item.type === 'template' && '🎨'}
                      </div>
                      <div className="result-info">
                        <h3 className="result-name">{item.name}</h3>
                        <p className="result-repo">{item.repo}</p>
                      </div>
                      <span className="result-language">{item.language}</span>
                    </div>
                    <p className="result-description">{item.description}</p>
                    <div className="result-meta">
                      <span className="result-lines">{item.lines} lines</span>
                      <div className="result-tags">
                        {item.tags.map(tag => (
                          <span key={tag} className="result-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview */}
              {selectedItem && (
                <div className="preview-panel">
                  <div className="preview-header">
                    <h3 className="preview-title">{selectedItem.name}</h3>
                    <button className="preview-close" onClick={() => setSelectedItem(null)}>✕</button>
                  </div>

                  <div className="preview-meta">
                    <div className="preview-meta-item">
                      <span className="preview-meta-label">Type:</span>
                      <span className="preview-meta-value">{selectedItem.type}</span>
                    </div>
                    <div className="preview-meta-item">
                      <span className="preview-meta-label">Repository:</span>
                      <span className="preview-meta-value">{selectedItem.repo}</span>
                    </div>
                    <div className="preview-meta-item">
                      <span className="preview-meta-label">Language:</span>
                      <span className="preview-meta-value">{selectedItem.language}</span>
                    </div>
                    <div className="preview-meta-item">
                      <span className="preview-meta-label">Lines:</span>
                      <span className="preview-meta-value">{selectedItem.lines}</span>
                    </div>
                  </div>

                  <div className="preview-description">
                    <h4 className="preview-section-title">Description</h4>
                    <p>{selectedItem.description}</p>
                  </div>

                  <div className="preview-code">
                    <h4 className="preview-section-title">Code Preview</h4>
                    <div className="code-block">
                      <div className="code-header">
                        <span className="code-language">{selectedItem.language}</span>
                        <button className="code-copy">Copy</button>
                      </div>
                      <pre className="code-content">
{selectedItem.type === 'component' ? `export default function ${selectedItem.name}() {
  const [state, setState] = useState();

  useEffect(() => {
    // Component logic here
  }, []);

  return (
    <div className="${selectedItem.name.toLowerCase()}">
      {/* Component JSX */}
    </div>
  );
}` : selectedItem.type === 'function' ? `function ${selectedItem.name}(params) {
  // Function implementation
  const result = processData(params);
  return result;
}` : `// ${selectedItem.name} module
export const config = {
  enabled: true,
  options: {}
};`}
                      </pre>
                    </div>
                  </div>

                  <div className="preview-actions">
                    <button className="preview-btn primary">View on GitHub</button>
                    <button className="preview-btn secondary">Download</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .codex {
          min-height: 100vh;
          padding-top: 100px;
          position: relative;
          background: var(--black);
        }

        .codex-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 55px 55px;
          opacity: 0.5;
          z-index: -1;
        }

        .codex-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: var(--space-xl);
        }

        .codex-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .codex-title {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 700;
          margin-bottom: var(--space-md);
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .codex-subtitle {
          font-size: 18px;
          opacity: 0.7;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-2xl);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: var(--space-lg);
          text-align: center;
          transition: all 0.3s var(--ease);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-icon {
          font-size: 32px;
          margin-bottom: var(--space-sm);
        }

        .stat-value {
          font-size: 36px;
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

        .search-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: var(--space-md) var(--space-lg);
          margin-bottom: var(--space-lg);
        }

        .search-icon {
          font-size: 20px;
          opacity: 0.5;
        }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--white);
          font-size: 16px;
          outline: none;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .search-clear {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: var(--white);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s var(--ease);
        }

        .search-clear:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .filter-tabs {
          display: flex;
          gap: var(--space-xs);
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: var(--space-sm) var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--white);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s var(--ease);
        }

        .filter-tab:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .filter-tab.active {
          background: var(--gradient-brand);
          border-color: transparent;
        }

        .results-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: var(--space-xl);
        }

        .results-header {
          margin-bottom: var(--space-lg);
        }

        .results-title {
          font-size: 20px;
          font-weight: 600;
        }

        .results-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: var(--space-xl);
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          max-height: 800px;
          overflow-y: auto;
          padding-right: var(--space-sm);
        }

        .results-list::-webkit-scrollbar {
          width: 6px;
        }

        .results-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .results-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .result-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: var(--space-md);
          cursor: pointer;
          transition: all 0.3s var(--ease);
        }

        .result-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .result-item.selected {
          border-color: var(--hot-pink);
          background: rgba(255, 29, 108, 0.1);
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .result-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .result-info {
          flex: 1;
          min-width: 0;
        }

        .result-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .result-repo {
          font-size: 12px;
          opacity: 0.5;
        }

        .result-language {
          font-size: 12px;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .result-description {
          font-size: 14px;
          opacity: 0.7;
          margin-bottom: var(--space-sm);
          line-height: 1.5;
        }

        .result-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-xs);
        }

        .result-lines {
          font-size: 12px;
          opacity: 0.5;
        }

        .result-tags {
          display: flex;
          gap: var(--space-xs);
          flex-wrap: wrap;
        }

        .result-tag {
          font-size: 11px;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          opacity: 0.7;
        }

        .preview-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: var(--space-lg);
          max-height: 800px;
          overflow-y: auto;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .preview-title {
          font-size: 24px;
          font-weight: 600;
        }

        .preview-close {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--white);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s var(--ease);
        }

        .preview-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .preview-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .preview-meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-meta-label {
          font-size: 12px;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .preview-meta-value {
          font-size: 14px;
          font-weight: 500;
        }

        .preview-description {
          margin-bottom: var(--space-lg);
        }

        .preview-section-title {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.7;
          margin-bottom: var(--space-sm);
        }

        .preview-code {
          margin-bottom: var(--space-lg);
        }

        .code-block {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-sm) var(--space-md);
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .code-language {
          font-size: 12px;
          opacity: 0.7;
        }

        .code-copy {
          font-size: 12px;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 4px;
          color: var(--white);
          cursor: pointer;
          transition: all 0.2s var(--ease);
        }

        .code-copy:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .code-content {
          padding: var(--space-md);
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          line-height: 1.6;
          overflow-x: auto;
          margin: 0;
        }

        .preview-actions {
          display: flex;
          gap: var(--space-sm);
        }

        .preview-btn {
          flex: 1;
          padding: var(--space-sm) var(--space-lg);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s var(--ease-spring);
          border: none;
        }

        .preview-btn.primary {
          background: var(--gradient-brand);
          color: var(--white);
        }

        .preview-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 29, 108, 0.4);
        }

        .preview-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .preview-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.12);
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

        @media (max-width: 1200px) {
          .results-layout {
            grid-template-columns: 1fr;
          }

          .preview-panel {
            max-height: 600px;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .preview-meta {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
