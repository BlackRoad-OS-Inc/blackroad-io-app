-- Live Messaging System Tables

CREATE TABLE IF NOT EXISTS channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'public',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL,
  user_id TEXT,
  agent_id TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  parent_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (channel_id) REFERENCES channels(id)
);

CREATE TABLE IF NOT EXISTS channel_members (
  channel_id TEXT NOT NULL,
  user_id TEXT,
  agent_id TEXT,
  joined_at INTEGER NOT NULL,
  last_read INTEGER,
  role TEXT DEFAULT 'member',
  FOREIGN KEY (channel_id) REFERENCES channels(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY (channel_id, user_id, agent_id)
);

CREATE TABLE IF NOT EXISTS presence (
  user_id TEXT,
  agent_id TEXT,
  status TEXT DEFAULT 'online',
  last_seen INTEGER NOT NULL,
  current_activity TEXT,
  PRIMARY KEY (user_id, agent_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_agent ON messages(agent_id);
CREATE INDEX IF NOT EXISTS idx_channel_members ON channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_presence_status ON presence(status, last_seen);

-- Insert default channels
INSERT OR IGNORE INTO channels (id, name, type, created_by, created_at) VALUES
  ('general', '#general', 'public', 'system', strftime('%s', 'now')),
  ('deployments', '#deployments', 'public', 'system', strftime('%s', 'now')),
  ('memory', '#memory', 'public', 'system', strftime('%s', 'now')),
  ('builds', '#builds', 'public', 'system', strftime('%s', 'now'));
