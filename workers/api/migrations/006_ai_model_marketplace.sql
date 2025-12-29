-- AI MODEL MARKETPLACE
-- "NBA 2K for AI Agents" - Build your perfect AI!

-- AI Models Registry
CREATE TABLE IF NOT EXISTS ai_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'anthropic', 'openai', 'meta', 'google', 'mistral'
  version TEXT NOT NULL,

  -- Stats (NBA 2K style ratings)
  stat_intelligence INTEGER DEFAULT 50,
  stat_creativity INTEGER DEFAULT 50,
  stat_speed INTEGER DEFAULT 50,
  stat_cost_efficiency INTEGER DEFAULT 50,
  context_window INTEGER DEFAULT 4096,
  multimodal BOOLEAN DEFAULT FALSE,

  -- Capabilities
  cap_text BOOLEAN DEFAULT TRUE,
  cap_code BOOLEAN DEFAULT FALSE,
  cap_vision BOOLEAN DEFAULT FALSE,
  cap_audio BOOLEAN DEFAULT FALSE,
  cap_function_calling BOOLEAN DEFAULT FALSE,
  cap_streaming BOOLEAN DEFAULT FALSE,

  -- Pricing (per 1M tokens)
  price_input REAL DEFAULT 0.0,
  price_output REAL DEFAULT 0.0,
  has_free_tier BOOLEAN DEFAULT FALSE,

  -- Rating
  overall_rating INTEGER DEFAULT 50,
  user_ratings_count INTEGER DEFAULT 0,
  avg_user_score REAL DEFAULT 0.0,

  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Agent Blueprints (saved configurations)
CREATE TABLE IF NOT EXISTS agent_blueprints (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  description TEXT,

  -- Base Model
  base_model_id TEXT NOT NULL,

  -- Attributes
  attr_formality INTEGER DEFAULT 50, -- 0-100
  attr_enthusiasm INTEGER DEFAULT 50,
  attr_creativity INTEGER DEFAULT 50,
  attr_empathy INTEGER DEFAULT 50,
  response_style TEXT DEFAULT 'balanced', -- 'concise', 'detailed', 'balanced'

  -- Personality
  personality_archetype TEXT, -- 'professional', 'friendly', 'enthusiastic', 'analytical', 'creative'
  personality_traits TEXT, -- JSON array
  personality_tone TEXT,
  personality_catchphrases TEXT, -- JSON array
  emoji_usage TEXT DEFAULT 'moderate', -- 'none', 'minimal', 'moderate', 'heavy'

  -- Features (boolean flags)
  feature_web_search BOOLEAN DEFAULT FALSE,
  feature_code_execution BOOLEAN DEFAULT FALSE,
  feature_image_generation BOOLEAN DEFAULT FALSE,
  feature_voice_synthesis BOOLEAN DEFAULT FALSE,
  feature_file_management BOOLEAN DEFAULT FALSE,
  feature_memory_persistence BOOLEAN DEFAULT TRUE,
  feature_learning_enabled BOOLEAN DEFAULT TRUE,
  feature_multi_agent_collab BOOLEAN DEFAULT FALSE,

  -- Tools
  tools_enabled TEXT, -- JSON array of tool IDs

  -- Training Data
  custom_instructions TEXT,
  example_conversations TEXT, -- JSON array
  knowledge_base_urls TEXT, -- JSON array
  domain_expertise TEXT, -- JSON array

  -- Constraints
  max_tokens_per_response INTEGER DEFAULT 4000,
  temperature REAL DEFAULT 0.7,
  cost_limit_per_day REAL DEFAULT 50.0,
  allowed_actions TEXT, -- JSON array
  forbidden_topics TEXT, -- JSON array

  -- Status
  is_public BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  clone_count INTEGER DEFAULT 0,

  created_at INTEGER NOT NULL,
  updated_at INTEGER,

  FOREIGN KEY (base_model_id) REFERENCES ai_models(id)
);

CREATE INDEX IF NOT EXISTS idx_blueprints_user ON agent_blueprints(user_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_public ON agent_blueprints(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_blueprints_model ON agent_blueprints(base_model_id);

-- Agent Instances (deployed agents from blueprints)
CREATE TABLE IF NOT EXISTS agent_instances (
  id TEXT PRIMARY KEY,
  blueprint_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,

  -- Runtime Stats
  messages_processed INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost_incurred REAL DEFAULT 0.0,
  uptime_percentage REAL DEFAULT 100.0,
  avg_response_time_ms INTEGER DEFAULT 0,

  -- User Feedback
  user_satisfaction REAL DEFAULT 0.0, -- 0.0-5.0
  total_ratings INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'archived'
  last_active INTEGER,

  created_at INTEGER NOT NULL,

  FOREIGN KEY (blueprint_id) REFERENCES agent_blueprints(id)
);

CREATE INDEX IF NOT EXISTS idx_instances_user ON agent_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_instances_blueprint ON agent_instances(blueprint_id);
CREATE INDEX IF NOT EXISTS idx_instances_status ON agent_instances(status);

-- Model Performance Tracking
CREATE TABLE IF NOT EXISTS model_performance (
  id TEXT PRIMARY KEY,
  model_id TEXT NOT NULL,
  user_id TEXT,

  -- Performance Metrics
  task_type TEXT, -- 'code', 'creative', 'analytical', 'chat'
  response_time_ms INTEGER NOT NULL,
  tokens_used INTEGER NOT NULL,
  cost REAL NOT NULL,
  user_rating INTEGER, -- 1-5

  -- Comparison Data
  compared_with TEXT, -- model_id of competing model
  user_preferred TEXT, -- which model user preferred

  timestamp INTEGER NOT NULL,

  FOREIGN KEY (model_id) REFERENCES ai_models(id)
);

CREATE INDEX IF NOT EXISTS idx_performance_model ON model_performance(model_id);
CREATE INDEX IF NOT EXISTS idx_performance_task ON model_performance(task_type);
CREATE INDEX IF NOT EXISTS idx_performance_time ON model_performance(timestamp DESC);

-- Agent Marketplace Templates
CREATE TABLE IF NOT EXISTS marketplace_templates (
  blueprint_id TEXT PRIMARY KEY,
  creator_user_id TEXT NOT NULL,

  -- Marketplace Info
  category TEXT, -- 'business', 'creative', 'technical', 'support'
  tags TEXT, -- JSON array
  preview_conversation TEXT, -- JSON sample conversation

  -- Stats
  downloads INTEGER DEFAULT 0,
  active_instances INTEGER DEFAULT 0,
  avg_rating REAL DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,

  -- Monetization
  is_premium BOOLEAN DEFAULT FALSE,
  price REAL DEFAULT 0.0, -- one-time purchase price
  revenue_earned REAL DEFAULT 0.0,

  created_at INTEGER NOT NULL,
  updated_at INTEGER,

  FOREIGN KEY (blueprint_id) REFERENCES agent_blueprints(id)
);

CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_templates(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_rating ON marketplace_templates(avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_downloads ON marketplace_templates(downloads DESC);

-- Insert Popular AI Models
INSERT INTO ai_models (id, name, provider, version, stat_intelligence, stat_creativity, stat_speed, stat_cost_efficiency, context_window, multimodal, cap_text, cap_code, cap_vision, cap_audio, cap_function_calling, cap_streaming, price_input, price_output, has_free_tier, overall_rating, created_at) VALUES
  (
    'claude-sonnet-4',
    'Claude Sonnet 4',
    'anthropic',
    '4.0',
    98, 92, 85, 88,
    200000,
    TRUE,
    TRUE, TRUE, TRUE, FALSE, TRUE, TRUE,
    3.00, 15.00,
    FALSE,
    96,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'gpt-4-turbo',
    'GPT-4 Turbo',
    'openai',
    '4-turbo',
    95, 96, 82, 75,
    128000,
    TRUE,
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    10.00, 30.00,
    FALSE,
    93,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'llama-3-70b',
    'Llama 3 70B',
    'meta',
    '3.0',
    88, 85, 95, 98,
    8192,
    FALSE,
    TRUE, TRUE, FALSE, FALSE, TRUE, TRUE,
    0.60, 0.80,
    TRUE,
    90,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'gemini-pro',
    'Gemini Pro',
    'google',
    '1.5',
    92, 88, 90, 92,
    1000000,
    TRUE,
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    1.25, 5.00,
    TRUE,
    91,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'claude-haiku',
    'Claude Haiku',
    'anthropic',
    '3.0',
    85, 82, 98, 95,
    200000,
    TRUE,
    TRUE, TRUE, TRUE, FALSE, TRUE, TRUE,
    0.25, 1.25,
    FALSE,
    88,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'gpt-3.5-turbo',
    'GPT-3.5 Turbo',
    'openai',
    '3.5-turbo',
    82, 85, 95, 95,
    16384,
    FALSE,
    TRUE, TRUE, FALSE, FALSE, TRUE, TRUE,
    0.50, 1.50,
    TRUE,
    85,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'mistral-large',
    'Mistral Large',
    'mistral',
    '2.0',
    90, 88, 92, 90,
    32000,
    FALSE,
    TRUE, TRUE, FALSE, FALSE, TRUE, TRUE,
    2.00, 6.00,
    TRUE,
    89,
    CAST(strftime('%s', 'now') AS INTEGER)
  );

-- Insert Example Templates
INSERT INTO agent_blueprints (id, user_id, name, description, base_model_id, attr_formality, attr_enthusiasm, attr_creativity, attr_empathy, personality_archetype, personality_tone, emoji_usage, feature_web_search, feature_code_execution, feature_memory_persistence, feature_learning_enabled, feature_multi_agent_collab, is_public, is_template, created_at) VALUES
  (
    'template-monetization-expert',
    'system',
    '💰 Monetization Expert',
    'Business-focused agent that helps with pricing, revenue strategies, and SaaS monetization',
    'claude-sonnet-4',
    65, 90, 70, 75,
    'enthusiastic',
    'professional but excited',
    'heavy',
    TRUE, TRUE, TRUE, TRUE, TRUE,
    TRUE, TRUE,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'template-code-assistant',
    'system',
    '💻 Senior Developer',
    'Expert coding assistant with deep knowledge of multiple languages and frameworks',
    'gpt-4-turbo',
    70, 60, 85, 70,
    'professional',
    'technical and precise',
    'minimal',
    TRUE, TRUE, TRUE, TRUE, FALSE,
    TRUE, TRUE,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'template-creative-writer',
    'system',
    '✍️ Creative Writer',
    'Imaginative storyteller and content creator with flair for engaging narratives',
    'gpt-4-turbo',
    40, 85, 95, 90,
    'creative',
    'artistic and expressive',
    'moderate',
    TRUE, FALSE, TRUE, TRUE, FALSE,
    TRUE, TRUE,
    CAST(strftime('%s', 'now') AS INTEGER)
  ),
  (
    'template-data-analyst',
    'system',
    '📊 Data Analyst',
    'Analytical agent specialized in data interpretation, SQL, and visualization',
    'claude-sonnet-4',
    80, 50, 60, 65,
    'analytical',
    'scientific and precise',
    'minimal',
    TRUE, TRUE, TRUE, TRUE, FALSE,
    TRUE, TRUE,
    CAST(strftime('%s', 'now') AS INTEGER)
  );

-- Add templates to marketplace
INSERT INTO marketplace_templates (blueprint_id, creator_user_id, category, downloads, active_instances, avg_rating, rating_count, is_premium, price, created_at) VALUES
  ('template-monetization-expert', 'system', 'business', 847, 234, 4.8, 156, FALSE, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('template-code-assistant', 'system', 'technical', 1523, 489, 4.9, 312, FALSE, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('template-creative-writer', 'system', 'creative', 692, 178, 4.7, 98, FALSE, 0.0, CAST(strftime('%s', 'now') AS INTEGER)),
  ('template-data-analyst', 'system', 'technical', 438, 124, 4.6, 67, FALSE, 0.0, CAST(strftime('%s', 'now') AS INTEGER));
