/**
 * BlackRoad.io SaaS API
 * Handles authentication, subscriptions, and agent management
 */

export interface Env {
  BLACKROAD_SAAS: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  JWT_SECRET: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route requests
      if (url.pathname === '/health') {
        return jsonResponse({ status: 'healthy', timestamp: Date.now() });
      }

      if (url.pathname === '/api/auth/signup' && request.method === 'POST') {
        return handleSignup(request, env);
      }

      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        return handleLogin(request, env);
      }

      if (url.pathname === '/api/user/me' && request.method === 'GET') {
        return handleGetUser(request, env);
      }

      if (url.pathname === '/api/subscription/create-checkout' && request.method === 'POST') {
        return handleCreateCheckout(request, env);
      }

      if (url.pathname === '/api/subscription/portal' && request.method === 'POST') {
        return handleBillingPortal(request, env);
      }

      if (url.pathname === '/api/webhooks/stripe' && request.method === 'POST') {
        return handleStripeWebhook(request, env);
      }

      if (url.pathname.startsWith('/api/agents')) {
        return handleAgents(request, env, url);
      }

      if (url.pathname.startsWith('/api/messages')) {
        return handleMessages(request, env, url);
      }

      if (url.pathname.startsWith('/api/presence')) {
        return handlePresence(request, env, url);
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (error: any) {
      console.error('API Error:', error);
      return jsonResponse({ error: error.message }, 500);
    }
  },
};

// Helper: JSON response with CORS
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Helper: Generate user ID
function generateId(): string {
  return crypto.randomUUID();
}

// Helper: Hash API key
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Handler: Signup
async function handleSignup(request: Request, env: Env): Promise<Response> {
  const { email, name, plan = 'free' } = await request.json();

  if (!email || !name) {
    return jsonResponse({ error: 'Email and name required' }, 400);
  }

  const userId = generateId();
  const now = Math.floor(Date.now() / 1000);

  try {
    // Create user
    await env.BLACKROAD_SAAS.prepare(
      'INSERT INTO users (id, email, name, created_at) VALUES (?, ?, ?, ?)'
    )
      .bind(userId, email, name, now)
      .run();

    // Create free subscription
    const subId = generateId();
    await env.BLACKROAD_SAAS.prepare(
      'INSERT INTO subscriptions (id, user_id, tier, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(subId, userId, 'free', 'active', now, now)
      .run();

    if (plan === 'free') {
      return jsonResponse({
        success: true,
        userId,
        message: 'Account created successfully'
      });
    }

    // For paid plans, create Stripe checkout session
    if (plan === 'pro') {
      const checkoutUrl = await createStripeCheckout(env, userId, email, 'pro');
      return jsonResponse({ success: true, userId, checkoutUrl });
    }

    return jsonResponse({ error: 'Invalid plan' }, 400);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      return jsonResponse({ error: 'Email already exists' }, 409);
    }
    throw error;
  }
}

// Handler: Login
async function handleLogin(request: Request, env: Env): Promise<Response> {
  const { email, password } = await request.json();

  if (!email) {
    return jsonResponse({ error: 'Email required' }, 400);
  }

  const result = await env.BLACKROAD_SAAS.prepare(
    'SELECT * FROM users WHERE email = ?'
  )
    .bind(email)
    .first();

  if (!result) {
    return jsonResponse({ error: 'Invalid credentials' }, 401);
  }

  // Update last login
  await env.BLACKROAD_SAAS.prepare(
    'UPDATE users SET last_login = ? WHERE id = ?'
  )
    .bind(Math.floor(Date.now() / 1000), result.id)
    .run();

  // Generate JWT token
  const token = await generateJWT({
    userId: result.id,
    email: result.email
  }, env.JWT_SECRET);

  return jsonResponse({
    success: true,
    user: {
      id: result.id,
      email: result.email,
      name: result.name,
    },
    token,
  });
}

// Helper: Generate JWT
async function generateJWT(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + 86400 * 30 }; // 30 days

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(claims));
  const message = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${message}.${encodedSignature}`;
}

// Handler: Get user
async function handleGetUser(request: Request, env: Env): Promise<Response> {
  // In production, extract user ID from JWT
  const userId = request.headers.get('X-User-ID');

  if (!userId) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const user = await env.BLACKROAD_SAAS.prepare(
    'SELECT u.*, s.tier, s.status FROM users u LEFT JOIN subscriptions s ON u.id = s.user_id WHERE u.id = ?'
  )
    .bind(userId)
    .first();

  if (!user) {
    return jsonResponse({ error: 'User not found' }, 404);
  }

  return jsonResponse({ user });
}

// Handler: Create Stripe checkout
async function handleCreateCheckout(request: Request, env: Env): Promise<Response> {
  const { userId, plan } = await request.json();
  const user = await env.BLACKROAD_SAAS.prepare('SELECT email FROM users WHERE id = ?').bind(userId).first();

  if (!user) {
    return jsonResponse({ error: 'User not found' }, 404);
  }

  const checkoutUrl = await createStripeCheckout(env, userId, user.email as string, plan);
  return jsonResponse({ checkoutUrl });
}

// Helper: Create Stripe checkout session
async function createStripeCheckout(env: Env, userId: string, email: string, plan: string): Promise<string> {
  const priceId = plan === 'pro'
    ? 'price_1SjYNiChUUSEbzyhuaR57Blg' // BlackRoad Pro: $49/mo with 14-day trial (LIVE)
    : plan === 'enterprise'
    ? 'price_1SjYOCChUUSEbzyhzhzchK3g' // BlackRoad Enterprise: $299/mo with 14-day trial (LIVE)
    : '';

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'mode': 'subscription',
      'customer_email': email,
      'client_reference_id': userId,
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': 'https://blackroad.io/success',
      'cancel_url': 'https://blackroad.io/cancel',
      'metadata[user_id]': userId,
    }),
  });

  const session = await response.json();
  return session.url;
}

// Handler: Billing portal
async function handleBillingPortal(request: Request, env: Env): Promise<Response> {
  const { customerId } = await request.json();

  const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'customer': customerId,
      'return_url': 'https://blackroad.io/dashboard',
    }),
  });

  const session = await response.json();
  return jsonResponse({ url: session.url });
}

// Handler: Stripe webhooks
async function handleStripeWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return jsonResponse({ error: 'No signature' }, 400);
  }

  // In production, verify webhook signature here

  const event = JSON.parse(body);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object, env);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object, env);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object, env);
      break;
  }

  return jsonResponse({ received: true });
}

async function handleCheckoutCompleted(session: any, env: Env) {
  const userId = session.metadata.user_id || session.client_reference_id;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  // Update user with Stripe customer ID
  await env.BLACKROAD_SAAS.prepare(
    'UPDATE users SET stripe_customer_id = ? WHERE id = ?'
  )
    .bind(customerId, userId)
    .run();

  // Update subscription to pro
  await env.BLACKROAD_SAAS.prepare(
    'UPDATE subscriptions SET tier = ?, status = ?, stripe_subscription_id = ?, updated_at = ? WHERE user_id = ?'
  )
    .bind('pro', 'active', subscriptionId, Math.floor(Date.now() / 1000), userId)
    .run();
}

async function handleSubscriptionUpdated(subscription: any, env: Env) {
  await env.BLACKROAD_SAAS.prepare(
    'UPDATE subscriptions SET status = ?, current_period_start = ?, current_period_end = ?, updated_at = ? WHERE stripe_subscription_id = ?'
  )
    .bind(
      subscription.status,
      subscription.current_period_start,
      subscription.current_period_end,
      Math.floor(Date.now() / 1000),
      subscription.id
    )
    .run();
}

async function handleSubscriptionCanceled(subscription: any, env: Env) {
  await env.BLACKROAD_SAAS.prepare(
    'UPDATE subscriptions SET status = ?, updated_at = ? WHERE stripe_subscription_id = ?'
  )
    .bind('canceled', Math.floor(Date.now() / 1000), subscription.id)
    .run();
}

// Handler: Agents CRUD
async function handleAgents(request: Request, env: Env, url: URL): Promise<Response> {
  const userId = request.headers.get('X-User-ID');

  if (!userId) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  if (request.method === 'GET') {
    // List user's agents
    const agents = await env.BLACKROAD_SAAS.prepare(
      'SELECT * FROM agent_deployments WHERE user_id = ? ORDER BY created_at DESC'
    )
      .bind(userId)
      .all();

    return jsonResponse({ agents: agents.results });
  }

  if (request.method === 'POST') {
    // Create new agent
    const { name, type, config } = await request.json();
    const agentId = generateId();
    const now = Math.floor(Date.now() / 1000);

    await env.BLACKROAD_SAAS.prepare(
      'INSERT INTO agent_deployments (id, user_id, name, type, status, config, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(agentId, userId, name, type, 'running', JSON.stringify(config), now, now)
      .run();

    return jsonResponse({ success: true, agentId }, 201);
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}

// Handler: Messages
async function handleMessages(request: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname.replace('/api/messages', '');
  
  // GET /api/messages/channels - List all channels
  if (path === '/channels' && request.method === 'GET') {
    const channels = await env.BLACKROAD_SAAS.prepare(
      'SELECT * FROM channels ORDER BY created_at DESC'
    ).all();
    return jsonResponse({ channels: channels.results });
  }
  
  // POST /api/messages/channels - Create new channel
  if (path === '/channels' && request.method === 'POST') {
    const { name, type = 'public' } = await request.json();
    const userId = request.headers.get('X-User-ID') || 'system';
    
    const channelId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    await env.BLACKROAD_SAAS.prepare(
      'INSERT INTO channels (id, name, type, created_by, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(channelId, name, type, userId, now).run();
    
    return jsonResponse({ success: true, channelId });
  }
  
  // GET /api/messages/channel/:id - Get messages from channel
  if (path.match(/^\/channel\/[^\/]+$/) && request.method === 'GET') {
    const channelId = path.split('/').pop();
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const before = url.searchParams.get('before');
    
    let query = 'SELECT * FROM messages WHERE channel_id = ?';
    const params: any[] = [channelId];
    
    if (before) {
      query += ' AND created_at < ?';
      params.push(parseInt(before));
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    const messages = await env.BLACKROAD_SAAS.prepare(query)
      .bind(...params)
      .all();
    
    return jsonResponse({ messages: messages.results.reverse() });
  }
  
  // POST /api/messages/send - Send a message
  if (path === '/send' && request.method === 'POST') {
    const { channelId, content, agentId } = await request.json();
    const userId = request.headers.get('X-User-ID');
    
    if (!channelId || !content) {
      return jsonResponse({ error: 'Channel ID and content required' }, 400);
    }
    
    const messageId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    await env.BLACKROAD_SAAS.prepare(
      'INSERT INTO messages (id, channel_id, user_id, agent_id, content, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(messageId, channelId, userId, agentId, content, now).run();
    
    return jsonResponse({ success: true, messageId, timestamp: now });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}

// Handler: Presence
async function handlePresence(request: Request, env: Env, url: URL): Promise<Response> {
  // GET /api/presence - Get all online users/agents
  if (url.pathname === '/api/presence' && request.method === 'GET') {
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
    
    const presence = await env.BLACKROAD_SAAS.prepare(
      'SELECT * FROM presence WHERE last_seen > ? ORDER BY last_seen DESC'
    ).bind(fiveMinutesAgo).all();
    
    return jsonResponse({ presence: presence.results });
  }
  
  // POST /api/presence/update - Update user/agent status
  if (url.pathname === '/api/presence/update' && request.method === 'POST') {
    const { userId, agentId, status = 'online', activity } = await request.json();
    const now = Math.floor(Date.now() / 1000);
    
    await env.BLACKROAD_SAAS.prepare(`
      INSERT INTO presence (user_id, agent_id, status, last_seen, current_activity) 
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (user_id, agent_id) DO UPDATE SET 
        status = excluded.status,
        last_seen = excluded.last_seen,
        current_activity = excluded.current_activity
    `).bind(userId, agentId, status, now, activity).run();
    
    return jsonResponse({ success: true });
  }
  
  return jsonResponse({ error: 'Not found' }, 404);
}
