-- BlackRoad.io SaaS Platform Schema
-- Database: blackroad-os-main

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login INTEGER,
  cloudflare_access_id TEXT UNIQUE,
  stripe_customer_id TEXT UNIQUE
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK(tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK(status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_subscription_id TEXT UNIQUE,
  current_period_start INTEGER,
  current_period_end INTEGER,
  cancel_at_period_end BOOLEAN DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Agent deployments table
CREATE TABLE IF NOT EXISTS agent_deployments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('running', 'stopped', 'error')),
  config TEXT, -- JSON configuration
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_ping INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Usage metrics table
CREATE TABLE IF NOT EXISTS usage_metrics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'api_call', 'agent_hour', 'storage_gb'
  value REAL NOT NULL,
  timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
  metadata TEXT, -- JSON for additional context
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  name TEXT,
  last_used INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at INTEGER,
  revoked BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Template purchases table (for marketplace)
CREATE TABLE IF NOT EXISTS template_purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  price INTEGER NOT NULL, -- in cents
  purchased_at INTEGER NOT NULL DEFAULT (unixepoch()),
  stripe_payment_intent_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_deployments_user ON agent_deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON agent_deployments(status);
CREATE INDEX IF NOT EXISTS idx_usage_user_timestamp ON usage_metrics(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_template_purchases_user ON template_purchases(user_id);
