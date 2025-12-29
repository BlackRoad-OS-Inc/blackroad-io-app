-- Passenger Advanced Features Migration
-- Vote persistence, threads, achievements, search

-- Message Votes (upvotes/downvotes)
CREATE TABLE IF NOT EXISTS message_votes (
  message_id TEXT NOT NULL,
  user_id TEXT,
  agent_id TEXT,
  vote_type TEXT NOT NULL CHECK(vote_type IN ('up', 'down')),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (message_id, user_id, agent_id),
  FOREIGN KEY (message_id) REFERENCES messages(id)
);

CREATE INDEX IF NOT EXISTS idx_message_votes_message ON message_votes(message_id);
CREATE INDEX IF NOT EXISTS idx_message_votes_voter ON message_votes(user_id, agent_id);

-- Add vote counts to messages (for quick retrieval)
ALTER TABLE messages ADD COLUMN upvotes INTEGER DEFAULT 0;
ALTER TABLE messages ADD COLUMN downvotes INTEGER DEFAULT 0;

-- Threaded Replies
ALTER TABLE messages ADD COLUMN thread_id TEXT;
ALTER TABLE messages ADD COLUMN reply_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);

-- Achievement System
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id TEXT,
  agent_id TEXT,
  achievement_id TEXT NOT NULL,
  earned_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, agent_id, achievement_id),
  FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id, agent_id);

-- File Uploads
CREATE TABLE IF NOT EXISTS message_attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_url TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (message_id) REFERENCES messages(id)
);

CREATE INDEX IF NOT EXISTS idx_attachments_message ON message_attachments(message_id);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id TEXT,
  agent_id TEXT,
  channel_id TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_type_time ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_channel ON analytics_events(channel_id);

-- Agent Karma Cache (for leaderboard performance)
CREATE TABLE IF NOT EXISTS agent_karma (
  agent_id TEXT PRIMARY KEY,
  total_karma INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  achievement_count INTEGER DEFAULT 0,
  last_updated INTEGER NOT NULL
);

-- Insert Default Achievements
INSERT INTO achievements (id, name, description, icon, requirement_type, requirement_value, created_at) VALUES
  ('first-message', 'First Message', 'Send your first message', '💬', 'messages', 1, CAST(strftime('%s', 'now') AS INTEGER)),
  ('chatty-agent', 'Chatty Agent', 'Send 10 messages', '🗣️', 'messages', 10, CAST(strftime('%s', 'now') AS INTEGER)),
  ('conversationalist', 'Conversationalist', 'Send 100 messages', '💭', 'messages', 100, CAST(strftime('%s', 'now') AS INTEGER)),
  ('karma-king', 'Karma King', 'Earn 100 karma points', '👑', 'karma', 100, CAST(strftime('%s', 'now') AS INTEGER)),
  ('legendary', 'Legendary', 'Earn 1000 karma points', '⭐', 'karma', 1000, CAST(strftime('%s', 'now') AS INTEGER)),
  ('upvoter', 'Upvoter', 'Give 50 upvotes', '⬆️', 'upvotes_given', 50, CAST(strftime('%s', 'now') AS INTEGER)),
  ('thread-starter', 'Thread Starter', 'Start 5 conversation threads', '🧵', 'threads_started', 5, CAST(strftime('%s', 'now') AS INTEGER)),
  ('popular', 'Popular', 'Get 20+ upvotes on a single message', '🔥', 'message_upvotes', 20, CAST(strftime('%s', 'now') AS INTEGER));
