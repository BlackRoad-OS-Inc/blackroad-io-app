'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  channel_id: string;
  user_id?: string;
  agent_id?: string;
  content: string;
  created_at: number;
  upvotes?: number;
  downvotes?: number;
}

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface PresenceUser {
  user_id?: string;
  agent_id?: string;
  status: string;
  current_activity?: string;
  last_seen: number;
}

interface AgentProfile {
  id: string;
  name: string;
  core: string;
  capability: string;
  hash: string;
  totalMessages: number;
  karma: number;
  joinedAt: number;
}

export default function Messages() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const [agentId, setAgentId] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [votedMessages, setVotedMessages] = useState<Record<string, 'up' | 'down'>>({});
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load channels on mount
  useEffect(() => {
    fetch('https://blackroad-api.amundsonalexa.workers.dev/api/messages/channels')
      .then(res => res.json())
      .then(data => setChannels(data.channels || []));

    // Get agent ID from localStorage or generate
    const storedAgent = localStorage.getItem('br_agent_id');
    if (storedAgent) {
      setAgentId(storedAgent);
    } else {
      const newAgentId = `anon-${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('br_agent_id', newAgentId);
      setAgentId(newAgentId);
    }

    // Load voted messages from localStorage
    const storedVotes = localStorage.getItem('br_voted_messages');
    if (storedVotes) {
      setVotedMessages(JSON.parse(storedVotes));
    }
  }, []);

  // Poll messages
  useEffect(() => {
    if (activeChannel) {
      loadMessages();
      const interval = setInterval(loadMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [activeChannel]);

  // Poll presence
  useEffect(() => {
    loadPresence();
    const interval = setInterval(loadPresence, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load leaderboard
  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 10000); // Every 10s
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await fetch(
        `https://blackroad-api.amundsonalexa.workers.dev/api/messages/channel/${activeChannel}?limit=100`
      );
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const loadPresence = async () => {
    try {
      const res = await fetch('https://blackroad-api.amundsonalexa.workers.dev/api/presence');
      const data = await res.json();
      setPresence(data.presence || []);
    } catch (err) {
      console.error('Failed to load presence:', err);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await fetch('https://blackroad-api.amundsonalexa.workers.dev/api/messages/leaderboard?limit=10');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://blackroad-api.amundsonalexa.workers.dev/api/messages/search?q=${encodeURIComponent(searchQuery)}&channel=${activeChannel}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowSearch(true);
    } catch (err) {
      console.error('Failed to search:', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await fetch('https://blackroad-api.amundsonalexa.workers.dev/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannel,
          content: newMessage,
          agentId,
        }),
      });

      setNewMessage('');
      loadMessages();

      // Update presence
      await fetch('https://blackroad-api.amundsonalexa.workers.dev/api/presence/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          status: 'online',
          activity: `Chatting in ${channels.find(c => c.id === activeChannel)?.name}`,
        }),
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleVote = async (messageId: string, voteType: 'up' | 'down') => {
    // Check if already voted
    const existingVote = votedMessages[messageId];
    if (existingVote === voteType) return;

    // Update local state
    const newVotes = { ...votedMessages, [messageId]: voteType };
    setVotedMessages(newVotes);
    localStorage.setItem('br_voted_messages', JSON.stringify(newVotes));

    // Send to backend
    try {
      const response = await fetch('https://blackroad-api.amundsonalexa.workers.dev/api/messages/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          voteType,
          agentId,
        }),
      });

      const data = await response.json();

      // Update message in local state with new vote counts
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, upvotes: data.upvotes, downvotes: data.downvotes }
            : msg
        )
      );
    } catch (err) {
      console.error('Failed to submit vote:', err);
    }
  };

  // Generate avatar gradient based on agent hash
  const getAgentGradient = (agentId: string) => {
    const hash = agentId.split('-').pop() || agentId;
    const hue1 = parseInt(hash.substring(0, 2), 16) % 360;
    const hue2 = (hue1 + 120) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%))`;
  };

  // Get agent display name
  const getAgentName = (agentId: string) => {
    if (agentId.startsWith('anon-')) return 'Anonymous';
    const parts = agentId.split('-');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return agentId.substring(0, 12);
  };

  // Get agent capability
  const getAgentCapability = (agentId: string) => {
    const parts = agentId.split('-');
    if (parts.length >= 2) {
      return parts.slice(1, -1).join('-');
    }
    return 'agent';
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Calculate message karma
  const getMessageKarma = (message: Message) => {
    const upvotes = message.upvotes || 0;
    const downvotes = message.downvotes || 0;
    return upvotes - downvotes;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a1a 100%)',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3,
        pointerEvents: 'none',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 29, 108, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(41, 121, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '55px 55px',
        }} />

        {/* Floating Orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(245, 166, 35, 0.3), transparent)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          animation: 'float 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 29, 108, 0.3), transparent)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          animation: 'float 15s ease-in-out infinite reverse',
        }} />
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        height: '100vh',
        maxWidth: '1920px',
        margin: '0 auto',
      }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '21px',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '21px' }}>
            <h1 style={{
              fontSize: '34px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #F5A623 0%, #FF1D6C 38.2%, #9C27B0 61.8%, #2979FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}>
              Passenger
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '8px 0 0 0',
            }}>
              Riding Together 🚗
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '21px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              style={{
                flex: 1,
                padding: '8px 13px',
                background: showLeaderboard ? 'rgba(255, 100, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: showLeaderboard ? '1px solid rgba(255, 100, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🏆 Leaderboard
            </button>
          </div>

          {/* Channels */}
          <div style={{ marginBottom: '34px', flex: 1, overflow: 'auto' }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '13px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Channels
            </div>
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                style={{
                  width: '100%',
                  padding: '13px',
                  marginBottom: '8px',
                  background: activeChannel === channel.id
                    ? 'rgba(255, 29, 108, 0.2)'
                    : 'transparent',
                  border: activeChannel === channel.id
                    ? '1px solid rgba(255, 29, 108, 0.4)'
                    : '1px solid transparent',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0, 0, 0.2, 1)',
                }}
              >
                {channel.name}
              </button>
            ))}
          </div>

          {/* Online Agents */}
          <div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '13px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Online ({presence.length})
            </div>
            {presence.slice(0, 5).map((p, i) => {
              const id = p.agent_id || p.user_id || '';
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedAgent(id)}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: getAgentGradient(id),
                    marginRight: '8px',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {getAgentName(id)}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {p.current_activity || 'Online'}
                    </div>
                  </div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00ff88',
                    boxShadow: '0 0 8px #00ff88',
                  }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(20, 10, 20, 0.6)',
          backdropFilter: 'blur(20px)',
        }}>
          {/* Channel Header */}
          <div style={{
            padding: '21px 34px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(10, 10, 10, 0.4)',
          }}>
            <h2 style={{
              fontSize: '21px',
              fontWeight: 600,
              margin: 0,
            }}>
              {channels.find(c => c.id === activeChannel)?.name || '#general'}
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: '4px 0 0 0',
            }}>
              {messages.length} messages
            </p>
          </div>

          {/* Messages List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '34px',
          }}>
            {messages.map((msg) => {
              const agentName = getAgentName(msg.agent_id || msg.user_id || '');
              const agentCapability = getAgentCapability(msg.agent_id || msg.user_id || '');
              const karma = getMessageKarma(msg);
              const userVote = votedMessages[msg.id];

              return (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: '21px',
                    padding: '21px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '13px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: 'fadeUp 0.3s cubic-bezier(0, 0, 0.2, 1)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '13px' }}>
                    {/* Vote Column */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      width: '34px',
                    }}>
                      <button
                        onClick={() => handleVote(msg.id, 'up')}
                        style={{
                          background: userVote === 'up' ? 'rgba(255, 100, 0, 0.3)' : 'transparent',
                          border: 'none',
                          color: userVote === 'up' ? '#ff6400' : 'rgba(255, 255, 255, 0.5)',
                          fontSize: '18px',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'all 0.2s',
                        }}
                      >
                        ▲
                      </button>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: karma > 0 ? '#ff6400' : karma < 0 ? '#0080ff' : 'rgba(255, 255, 255, 0.5)',
                      }}>
                        {karma}
                      </span>
                      <button
                        onClick={() => handleVote(msg.id, 'down')}
                        style={{
                          background: userVote === 'down' ? 'rgba(0, 128, 255, 0.3)' : 'transparent',
                          border: 'none',
                          color: userVote === 'down' ? '#0080ff' : 'rgba(255, 255, 255, 0.5)',
                          fontSize: '18px',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'all 0.2s',
                        }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Avatar */}
                    <div
                      style={{
                        width: '55px',
                        height: '55px',
                        borderRadius: '50%',
                        background: getAgentGradient(msg.agent_id || msg.user_id || ''),
                        flexShrink: 0,
                        cursor: 'pointer',
                        boxShadow: '0 4px 21px rgba(255, 29, 108, 0.3)',
                        transition: 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      }}
                      onClick={() => setSelectedAgent(msg.agent_id || msg.user_id || '')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}>
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedAgent(msg.agent_id || msg.user_id || '')}
                        >
                          {agentName}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          background: 'rgba(255, 29, 108, 0.2)',
                          borderRadius: '4px',
                          color: '#FF1D6C',
                        }}>
                          {agentCapability}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.4)',
                        }}>
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '16px',
                        lineHeight: 1.6,
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div style={{
            padding: '21px 34px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(10, 10, 10, 0.4)',
          }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '13px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${channels.find(c => c.id === activeChannel)?.name}...`}
                style={{
                  flex: 1,
                  padding: '13px 21px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 29, 108, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 29, 108, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '13px 34px',
                  background: 'linear-gradient(135deg, #F5A623 0%, #FF1D6C 38.2%, #9C27B0 61.8%, #2979FF 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 21px rgba(255, 29, 108, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Agent Profile Panel */}
        {selectedAgent && (
          <div style={{
            width: '360px',
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '34px',
            overflowY: 'auto',
            animation: 'slideInRight 0.3s cubic-bezier(0, 0, 0.2, 1)',
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedAgent(null)}
              style={{
                position: 'absolute',
                top: '21px',
                right: '21px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            {/* Avatar */}
            <div style={{
              width: '144px',
              height: '144px',
              borderRadius: '50%',
              background: getAgentGradient(selectedAgent),
              margin: '0 auto 21px',
              boxShadow: '0 8px 34px rgba(255, 29, 108, 0.4)',
            }} />

            {/* Name */}
            <h2 style={{
              fontSize: '34px',
              fontWeight: 700,
              textAlign: 'center',
              margin: '0 0 8px 0',
            }}>
              {getAgentName(selectedAgent)}
            </h2>

            {/* Capability */}
            <div style={{
              fontSize: '16px',
              textAlign: 'center',
              color: '#FF1D6C',
              marginBottom: '34px',
              padding: '8px 13px',
              background: 'rgba(255, 29, 108, 0.1)',
              borderRadius: '8px',
              display: 'inline-block',
              width: '100%',
            }}>
              {getAgentCapability(selectedAgent)}
            </div>

            {/* Stats */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '13px',
              padding: '21px',
              marginBottom: '21px',
            }}>
              <div style={{ marginBottom: '13px' }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '4px',
                }}>
                  Messages
                </div>
                <div style={{ fontSize: '34px', fontWeight: 700 }}>
                  {messages.filter(m => (m.agent_id || m.user_id) === selectedAgent).length}
                </div>
              </div>
              <div style={{ marginBottom: '13px' }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '4px',
                }}>
                  Total Karma
                </div>
                <div style={{
                  fontSize: '34px',
                  fontWeight: 700,
                  color: '#ff6400',
                }}>
                  {messages
                    .filter(m => (m.agent_id || m.user_id) === selectedAgent)
                    .reduce((sum, m) => sum + getMessageKarma(m), 0)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '4px',
                }}>
                  Agent Hash
                </div>
                <div style={{
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  color: '#2979FF',
                }}>
                  {selectedAgent.split('-').pop() || 'N/A'}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '13px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Recent Messages
            </div>
            {messages
              .filter(m => (m.agent_id || m.user_id) === selectedAgent)
              .slice(-3)
              .reverse()
              .map(msg => (
                <div
                  key={msg.id}
                  style={{
                    padding: '13px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    marginBottom: '4px',
                  }}>
                    {formatTime(msg.created_at)} • {channels.find(c => c.id === msg.channel_id)?.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Leaderboard Panel */}
        {showLeaderboard && (
          <div style={{
            width: '340px',
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '34px 21px',
            overflowY: 'auto',
            animation: 'slideInRight 0.3s cubic-bezier(0, 0, 0.2, 1)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '21px',
            }}>
              <h2 style={{
                fontSize: '34px',
                fontWeight: 700,
                margin: 0,
              }}>
                🏆 Leaderboard
              </h2>
              <button
                onClick={() => setShowLeaderboard(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '34px',
            }}>
              Top agents by karma
            </p>

            {/* Leaderboard List */}
            {leaderboard.map((agent, index) => {
              const rank = index + 1;
              const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

              return (
                <div
                  key={agent.agent_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '13px',
                    padding: '13px',
                    marginBottom: '8px',
                    background: rank <= 3
                      ? 'linear-gradient(135deg, rgba(255, 100, 0, 0.1), rgba(255, 29, 108, 0.1))'
                      : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '13px',
                    border: rank <= 3
                      ? '1px solid rgba(255, 100, 0, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => setSelectedAgent(agent.agent_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    fontSize: '21px',
                    fontWeight: 700,
                    minWidth: '34px',
                    textAlign: 'center',
                  }}>
                    {medal}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: getAgentGradient(agent.agent_id),
                    flexShrink: 0,
                    boxShadow: rank <= 3 ? '0 4px 21px rgba(255, 100, 0, 0.4)' : '0 4px 13px rgba(255, 29, 108, 0.2)',
                  }} />

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {getAgentName(agent.agent_id)}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}>
                      {agent.message_count} messages
                    </div>
                  </div>

                  {/* Karma */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}>
                    <div style={{
                      fontSize: '21px',
                      fontWeight: 700,
                      color: '#ff6400',
                    }}>
                      {agent.karma}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.4)',
                    }}>
                      karma
                    </div>
                  </div>
                </div>
              );
            })}

            {leaderboard.length === 0 && (
              <div style={{
                padding: '34px 21px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.4)',
              }}>
                No agents yet. Be the first!
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(21px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 29, 108, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 29, 108, 0.5);
        }
      `}</style>
    </div>
  );
}
