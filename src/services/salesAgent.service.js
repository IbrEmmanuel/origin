/**
 * Origin Sales Agent — AgentOS native client.
 * POST /agents/{id}/runs (SSE) + GET /sessions/{id}/runs for resume.
 *
 * Chat hits Fly staging AgentOS directly so those runs show up in Fly logs.
 * (The old /api/agent Vercel proxy still targeted production when Vercel env
 * overrode VITE_SALES_AGENT_URL — that is why Fly only showed /app/health.)
 */
const FLY_STAGING = 'https://staging-ai-agent.fly.dev';
const fromEnv = String(import.meta.env.VITE_SALES_AGENT_URL || '').replace(/\/$/, '');
const BASE = fromEnv.includes('fly.dev') ? fromEnv : FLY_STAGING;
const AGENT_ID = import.meta.env.VITE_SALES_AGENT_ID || 'sales-agent';
const STORAGE_KEY = 'origin_sales_chat_v1';

export function salesAgentBaseUrl() {
  return BASE;
}

export function salesAgentId() {
  return AGENT_ID;
}

export function loadChatState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.sessionId) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveChatState({ sessionId, messages }) {
  if (!sessionId) return;
  const payload = {
    sessionId,
    messages: (messages || [])
      .filter((m) => m && !m.streaming && (m.text || m.html))
      .map((m) => ({
        role: m.role,
        text: m.text || '',
        time: m.time || '',
      })),
    updatedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function clearChatState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function currentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.email || user.id || null;
  } catch {
    return null;
  }
}

/**
 * Load prior runs for a session (AgentOS), same pattern as Agno UI.
 * @returns {Promise<Array<{ role: string, text: string, time: string }>>}
 */
export async function fetchSessionMessages(sessionId) {
  if (!sessionId) return [];

  const qs = new URLSearchParams({ type: 'agent' });
  const userId = currentUserId();
  if (userId) qs.set('user_id', String(userId));

  const res = await fetch(`${BASE}/sessions/${encodeURIComponent(sessionId)}/runs?${qs}`);
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`Could not load session (${res.status})`);
  }

  const runs = await res.json();
  const list = Array.isArray(runs) ? runs : runs?.data || [];
  list.sort((a, b) => {
    const ta = Date.parse(a.created_at || 0) || a.created_at || 0;
    const tb = Date.parse(b.created_at || 0) || b.created_at || 0;
    return ta - tb;
  });

  const messages = [];
  for (const run of list) {
    const userText = stripChannel(run.run_input || run.input || '');
    const botText = typeof run.content === 'string' ? run.content : '';
    const time = formatRunTime(run.created_at);
    if (userText) messages.push({ role: 'user', text: userText, time });
    if (botText) messages.push({ role: 'assistant', text: botText, time });
  }
  return messages;
}

function stripChannel(text) {
  return String(text || '').replace(/^\[channel=[^\]]*\]\s*/i, '').trim();
}

function formatRunTime(createdAt) {
  if (!createdAt) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const d = typeof createdAt === 'number' ? new Date(createdAt * (createdAt < 2e10 ? 1000 : 1)) : new Date(createdAt);
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Stream a sales-agent run via AgentOS SSE.
 */
export async function streamSalesChat({
  sessionId,
  message,
  channel = 'webapp',
  signal,
  onEvent,
} = {}) {
  const form = new FormData();
  form.append('message', channel ? `[channel=${channel}]\n${message}` : message);
  form.append('stream', 'true');
  if (sessionId) form.append('session_id', sessionId);
  const userId = currentUserId();
  if (userId) form.append('user_id', String(userId));

  const res = await fetch(`${BASE}/agents/${encodeURIComponent(AGENT_ID)}/runs`, {
    method: 'POST',
    body: form,
    signal,
  });

  if (!res.ok) {
    let detail = `Agent run failed (${res.status})`;
    try {
      const err = await res.json();
      detail = err.detail || err.error || detail;
      if (Array.isArray(detail)) detail = detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  const ctype = res.headers.get('content-type') || '';
  if (!ctype.includes('text/event-stream') && !ctype.includes('text/plain')) {
    const data = await res.json();
    const reply = extractContent(data) || '';
    onEvent?.({ event: 'RunCompleted', content: reply, ...data });
    return {
      reply,
      sessionId: data.session_id || sessionId,
      runId: data.run_id || null,
    };
  }

  return readAgentSse(res.body, { sessionId, onEvent });
}

export async function sendSalesChat(opts) {
  return streamSalesChat(opts);
}

function extractContent(payload) {
  if (!payload) return '';
  if (typeof payload.content === 'string') return payload.content;
  if (typeof payload === 'string') return payload;
  return '';
}

async function readAgentSse(body, { sessionId, onEvent }) {
  if (!body) throw new Error('Empty stream from AgentOS');

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let reply = '';
  let runId = null;
  let resolvedSession = sessionId;

  const flushBlock = (raw) => {
    const block = raw.trim();
    if (!block || block.startsWith(':')) return;

    let eventName = '';
    const dataLines = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) eventName = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
    }
    if (!dataLines.length) return;

    let payload;
    try {
      payload = JSON.parse(dataLines.join('\n'));
    } catch {
      return;
    }

    const event = eventName || payload.event || 'message';
    const evt = { ...payload, event };

    if (evt.run_id) runId = evt.run_id;
    if (evt.session_id) resolvedSession = evt.session_id;

    if (event === 'RunContent') {
      const chunk = extractContent(evt);
      if (chunk) reply += chunk;
    } else if (event === 'RunCompleted') {
      const final = extractContent(evt);
      if (final) reply = final;
    } else if (event === 'RunError') {
      const msg = extractContent(evt) || evt.error || 'Agent run error';
      const err = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      err.event = evt;
      throw err;
    }

    onEvent?.(evt);
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) flushBlock(part);
  }
  if (buffer.trim()) flushBlock(buffer);

  return { reply, sessionId: resolvedSession, runId };
}
