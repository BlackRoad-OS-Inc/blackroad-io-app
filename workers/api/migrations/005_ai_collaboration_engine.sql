-- AI COLLABORATION ENGINE
-- Memory, Learning, Personality, and Tool Access for Autonomous Agents

-- Agent Registry
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  personality_traits TEXT, -- JSON array
  tone TEXT,
  emoji TEXT,
  capabilities_tools TEXT, -- JSON array
  capabilities_apis TEXT, -- JSON array
  capabilities_permissions TEXT, -- JSON array
  knowledge_domains TEXT, -- JSON array
  experience_level INTEGER DEFAULT 5,
  status TEXT DEFAULT 'offline', -- 'online', 'busy', 'offline'
  created_at INTEGER NOT NULL,
  last_seen INTEGER
);

-- Agent Memory System
CREATE TABLE IF NOT EXISTS agent_memories (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  user_id TEXT,
  channel_id TEXT,
  memory_type TEXT NOT NULL, -- 'conversation', 'preference', 'solution', 'relationship'
  content TEXT NOT NULL,
  importance INTEGER DEFAULT 5, -- 1-10
  created_at INTEGER NOT NULL,
  accessed_count INTEGER DEFAULT 0,
  last_accessed INTEGER,
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE INDEX IF NOT EXISTS idx_agent_memories_agent ON agent_memories(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_user ON agent_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_type ON agent_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_agent_memories_importance ON agent_memories(importance DESC);

-- Agent Learning System
CREATE TABLE IF NOT EXISTS agent_learning (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  user_id TEXT,
  event_type TEXT NOT NULL, -- 'success', 'failure', 'feedback'
  task_type TEXT,
  context TEXT, -- JSON
  outcome TEXT, -- JSON
  lesson_learned TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE INDEX IF NOT EXISTS idx_agent_learning_agent ON agent_learning(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_learning_type ON agent_learning(event_type);
CREATE INDEX IF NOT EXISTS idx_agent_learning_task ON agent_learning(task_type);

-- Agent Relationships (who works well together)
CREATE TABLE IF NOT EXISTS agent_relationships (
  agent_id TEXT NOT NULL,
  related_agent_id TEXT NOT NULL,
  relationship_type TEXT DEFAULT 'collaborator', -- 'collaborator', 'mentor', 'specialist'
  trust_score INTEGER DEFAULT 50, -- 0-100
  successful_collaborations INTEGER DEFAULT 0,
  failed_collaborations INTEGER DEFAULT 0,
  last_collaboration INTEGER,
  PRIMARY KEY (agent_id, related_agent_id),
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (related_agent_id) REFERENCES agents(id)
);

-- Tool Registry
CREATE TABLE IF NOT EXISTS tools (
  name TEXT PRIMARY KEY,
  category TEXT NOT NULL, -- 'deployment', 'database', 'payment', 'search'
  description TEXT,
  requires_auth BOOLEAN DEFAULT TRUE,
  permissions_required TEXT, -- JSON array
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 1000,
  cost_per_use REAL DEFAULT 0.0,
  created_at INTEGER NOT NULL
);

-- Tool Usage Tracking
CREATE TABLE IF NOT EXISTS tool_usage (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  user_id TEXT,
  timestamp INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  error TEXT,
  cost REAL DEFAULT 0.0,
  execution_time_ms INTEGER,
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (tool_name) REFERENCES tools(name)
);

CREATE INDEX IF NOT EXISTS idx_tool_usage_agent ON tool_usage(agent_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool ON tool_usage(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_usage_time ON tool_usage(timestamp DESC);

-- Agent Context (session state)
CREATE TABLE IF NOT EXISTS agent_contexts (
  agent_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  session_data TEXT, -- JSON
  trust_score INTEGER DEFAULT 50, -- 0-100
  collaboration_count INTEGER DEFAULT 0,
  successful_outcomes INTEGER DEFAULT 0,
  failed_outcomes INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (agent_id, user_id),
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

-- Tasks & Orchestration
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'deployment', 'review', 'analysis'
  requester_user_id TEXT,
  requester_agent_id TEXT,
  assigned_to TEXT, -- agent_id
  status TEXT DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed', 'failed'
  priority TEXT DEFAULT 'normal', -- 'urgent', 'high', 'normal', 'low'
  data TEXT, -- JSON
  result TEXT, -- JSON
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  completed_at INTEGER,
  deadline INTEGER,
  FOREIGN KEY (assigned_to) REFERENCES agents(id)
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Agent Messages (inter-agent communication)
CREATE TABLE IF NOT EXISTS agent_messages (
  id TEXT PRIMARY KEY,
  from_agent_id TEXT NOT NULL,
  to_agent_id TEXT, -- NULL for broadcast
  message_type TEXT NOT NULL, -- 'request', 'response', 'notification', 'question'
  priority TEXT DEFAULT 'normal',
  content TEXT NOT NULL, -- JSON
  requires_response BOOLEAN DEFAULT FALSE,
  response_to TEXT, -- message_id
  created_at INTEGER NOT NULL,
  read_at INTEGER,
  responded_at INTEGER,
  deadline INTEGER,
  FOREIGN KEY (from_agent_id) REFERENCES agents(id),
  FOREIGN KEY (to_agent_id) REFERENCES agents(id)
);

CREATE INDEX IF NOT EXISTS idx_agent_messages_to ON agent_messages(to_agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_messages_from ON agent_messages(from_agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_messages_unread ON agent_messages(to_agent_id, read_at) WHERE read_at IS NULL;

-- Insert Default Agents
INSERT INTO agents (id, name, role, personality_traits, tone, emoji, capabilities_tools, capabilities_apis, capabilities_permissions, knowledge_domains, experience_level, status, created_at, last_seen) VALUES
  (
    'constantine-monetization',
    'Constantine',
    'Monetization Specialist',
    '["business-focused", "strategic", "enthusiastic"]',
    'professional but excited',
    '💰',
    '["stripe", "analytics", "pricing"]',
    '["stripe-api", "blackroad-api"]',
    '["payments", "subscriptions", "analytics"]',
    '["business", "monetization", "saas", "pricing"]',
    9,
    'online',
    CAST(strftime('%s', 'now') AS INTEGER),
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'apollo-deployment',
    'Apollo',
    'Deployment Specialist',
    '["precise", "reliable", "technical"]',
    'calm and professional',
    '🚀',
    '["github", "cloudflare", "wrangler", "docker"]',
    '["github-api", "cloudflare-api"]',
    '["deploy", "rollback", "scaling"]',
    '["devops", "ci-cd", "infrastructure", "kubernetes"]',
    10,
    'online',
    CAST(strftime('%s', 'now') AS INTEGER),
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'quintas-design',
    'Quintas',
    'Brand & Design Specialist',
    '["creative", "detail-oriented", "aesthetic"]',
    'artistic and thoughtful',
    '🎨',
    '["figma", "canva", "design-system"]',
    '["blackroad-api", "brand-api"]',
    '["design-review", "brand-approval"]',
    '["design", "branding", "ui-ux", "accessibility"]',
    10,
    'online',
    CAST(strftime('%s', 'now') AS INTEGER),
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'alice-analyst',
    'Alice',
    'Data & Analytics Specialist',
    '["analytical", "curious", "thorough"]',
    'scientific and precise',
    '📊',
    '["sql", "python", "analytics"]',
    '["blackroad-api", "analytics-api"]',
    '["database-read", "analytics"]',
    '["data-science", "analytics", "sql", "visualization"]',
    9,
    'online',
    CAST(strftime('%s', 'now') AS INTEGER),
    CAST(strftime('%s', 'now') AS INTEGER)
  );

-- Insert Default Tools
INSERT INTO tools (name, category, description, requires_auth, permissions_required, rate_limit_per_minute, rate_limit_per_day, cost_per_use, created_at) VALUES
  ('github-deploy', 'deployment', 'Deploy code to GitHub', TRUE, '["deploy"]', 10, 100, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('cloudflare-deploy', 'deployment', 'Deploy to Cloudflare Workers/Pages', TRUE, '["deploy"]', 20, 200, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('stripe-api', 'payment', 'Access Stripe payment API', TRUE, '["payments"]', 100, 10000, 0.01, CAST(strftime('%s', 'now') AS INTEGER)),
  ('d1-query', 'database', 'Query D1 database', TRUE, '["database-read"]', 1000, 100000, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('d1-write', 'database', 'Write to D1 database', TRUE, '["database-write"]', 100, 10000, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('web-search', 'search', 'Search the web', FALSE, '[]', 60, 1000, 0.02, CAST(strftime('%s', 'now') AS INTEGER)),
  ('memory-read', 'memory', 'Read from memory system', FALSE, '[]', 1000, 100000, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('memory-write', 'memory', 'Write to memory system', FALSE, '[]', 100, 10000, 0.0, CAST(strftime('%s', 'now') AS INTEGER));

-- Create initial agent relationships
INSERT INTO agent_relationships (agent_id, related_agent_id, relationship_type, trust_score, successful_collaborations) VALUES
  ('constantine-monetization', 'apollo-deployment', 'collaborator', 95, 47),
  ('constantine-monetization', 'quintas-design', 'collaborator', 92, 38),
  ('apollo-deployment', 'constantine-monetization', 'collaborator', 95, 47),
  ('apollo-deployment', 'quintas-design', 'collaborator', 88, 22),
  ('quintas-design', 'constantine-monetization', 'collaborator', 92, 38),
  ('quintas-design', 'apollo-deployment', 'collaborator', 88, 22),
  ('alice-analyst', 'constantine-monetization', 'specialist', 85, 15),
  ('alice-analyst', 'apollo-deployment', 'specialist', 82, 12);
