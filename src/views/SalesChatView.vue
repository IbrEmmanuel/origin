<template>
  <div class="sales-chat-page">
    <div class="sc-top" ref="topRef">
    <header class="sc-header">
      <div class="sc-header-inner">
        <div class="sc-brand">
          <button type="button" class="sc-icon-btn" aria-label="Back" @click="goBack">
            <ArrowLeft class="sc-lucide" />
          </button>
          <img :src="logoUrl" alt="Origin Electric" class="sc-logo" />
          <div class="sc-titles">
            <div class="sc-title-row">
              <h1>
                <span class="sc-title-full">Solar Consultation</span>
                <span class="sc-title-short">Origin Customer Care</span>
              </h1>
              <span class="sc-pill">Ile-Ife</span>
            </div>
            <p class="sc-subtitle">Sales assistant · our team confirms quotes</p>
          </div>
        </div>
        <div class="sc-header-actions">
          <button
            v-if="messages.length"
            type="button"
            class="sc-icon-btn"
            aria-label="Start new chat"
            title="New chat"
            @click="startNewChat"
          >
            <RotateCcw class="sc-lucide" />
          </button>
          <a class="sc-icon-btn" :href="supportTel" aria-label="Call customer support">
            <Phone class="sc-lucide" />
          </a>
        </div>
      </div>
    </header>

    <div class="sc-status">
      <div class="sc-status-left">
        <span class="sc-dot" />
        <span class="sc-status-long">Osun State Solar Grid Desk</span>
        <span class="sc-status-short">Origin Desk</span>
      </div>
      <div class="sc-status-right">
        <ShieldCheck class="sc-lucide-xs" />
        <span>Support online</span>
      </div>
    </div>
    </div>

    <main class="sc-main" ref="logRef">
      <!-- Welcome -->
      <div v-if="showWelcome" class="sc-welcome">
        <div class="sc-time-badge">Today · {{ clock }}</div>
        <div class="sc-card sc-card-welcome">
          <div class="sc-welcome-head">
            <img :src="logoUrl" alt="Origin Electric" class="sc-logo-lg" />
            <div>
              <div class="sc-title-row">
                <span class="sc-name">Origin Sales Desk</span>
                <span class="sc-pill sc-pill-orange">Official</span>
              </div>
              <p class="sc-sub">Ile-Ife · Customer support agent</p>
            </div>
          </div>
          <p class="sc-body">
            <strong>Ẹ kú àbọ̀!</strong> Welcome to Origin Electric Ltd. I can help with batteries,
            hybrid inverters, and preliminary solar sizing — with product photos and links to view / add to cart.
          </p>
          <div v-if="chipsVisible" class="sc-chips">
            <button
              v-for="c in chips"
              :key="c.label"
              type="button"
              class="sc-chip sc-shine"
              @click="send(c.msg)"
            >
              <component :is="c.icon" class="sc-lucide-xs orange" />
              <span>{{ c.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <template v-for="(m, i) in messages" :key="i">
        <div v-if="m.role === 'user'" class="sc-row sc-row-user">
          <div class="sc-bubble-user">
            <p>{{ m.text }}</p>
          </div>
          <div class="sc-meta sc-meta-end">
            <span>{{ m.time }}</span>
            <CheckCheck class="sc-lucide-xs orange" />
          </div>
        </div>
        <div v-else class="sc-row sc-row-bot">
          <div class="sc-card">
            <div class="sc-eng-label">
              <span class="sc-dot-sm" />
              <span>Sales assistant</span>
            </div>
            <div
              v-if="m.streaming && !m.text"
              class="sc-thinking sc-thinking-inline"
              aria-live="polite"
              aria-label="Assistant is thinking"
            >
              <div class="sc-think-orb" aria-hidden="true">
                <span class="sc-think-ring" />
                <span class="sc-think-core" />
              </div>
              <div class="sc-think-copy">
                <span class="sc-think-title">{{ m.status || 'Working on it' }}</span>
                <span class="sc-think-dots"><i /><i /><i /></span>
              </div>
            </div>
            <template v-else>
              <div class="sc-md" v-html="m.html" />
              <span v-if="m.streaming" class="sc-stream-cursor" aria-hidden="true" />
            </template>
          </div>
          <div class="sc-meta">{{ m.time }} · Origin Electric</div>
        </div>
      </template>
    </main>

    <div class="sc-composer">
      <p class="sc-composer-hint">No final prices here — our team confirms all quotes.</p>
      <form class="sc-form" @submit.prevent="onSubmit">
        <div class="sc-input-wrap sc-shine">
          <textarea
            ref="inputRef"
            v-model="draft"
            class="sc-input"
            rows="1"
            placeholder="Ask about solar, batteries, inverters, or your load…"
            :disabled="loading"
            autocomplete="off"
            @keydown="onComposerKeydown"
            @input="autoGrow"
          />
        </div>
        <button type="submit" class="sc-send sc-shine" aria-label="Send" :disabled="loading || !draft.trim()">
          <Send class="sc-lucide" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { marked } from 'marked';
import {
  ArrowLeft,
  BatteryCharging,
  CheckCheck,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
  Zap,
} from 'lucide-vue-next';
import {
  clearChatState,
  fetchSessionMessages,
  loadChatState,
  saveChatState,
  streamSalesChat,
} from '@/services/salesAgent.service';
import logoUrl from '@/assets/logo.png';

marked.setOptions({
  breaks: true,
  gfm: true,
});

const STORE_BASE = 'https://www.originelectricltd.com';
const CTA_LABEL = 'View details / Add to cart';

const router = useRouter();
const sessionId = ref(crypto.randomUUID());
const draft = ref('');
const loading = ref(false);
const restoring = ref(false);
const messages = ref([]);
const chipsVisible = ref(true);
const showWelcome = ref(true);
const logRef = ref(null);
const inputRef = ref(null);
const topRef = ref(null);
let topResizeObserver = null;

const supportWhatsApp = import.meta.env.VITE_BOSS_WHATSAPP || '2347041880339';
const supportTel = computed(() => `tel:+${String(supportWhatsApp).replace(/\D/g, '')}`);

const clock = computed(() =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
);

const chips = [
  { icon: BatteryCharging, label: 'Find a battery', msg: 'Show me reliable 5kWh battery options' },
  { icon: Zap, label: 'Size my solar load', msg: 'Help me size a solar system for my home load' },
  { icon: MessageCircle, label: 'Talk to support', msg: 'I want to speak with customer support for an official quote' },
];

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function persist() {
  saveChatState({ sessionId: sessionId.value, messages: messages.value });
}

function hydrateMessages(list) {
  return (list || []).map((m) => {
    const text = m.text || '';
    return {
      role: m.role,
      text,
      html: m.role === 'assistant' ? toHtml(text) : '',
      time: m.time || timeNow(),
      streaming: false,
      status: '',
    };
  });
}

function startNewChat() {
  clearChatState();
  sessionId.value = crypto.randomUUID();
  messages.value = [];
  chipsVisible.value = true;
  showWelcome.value = true;
  draft.value = '';
  nextTick(autoGrow);
}

function appliancesToMarkdown(data) {
  return data
    .map((item) => {
      const name = item.name || 'Appliance';
      const watts = item.watts != null ? `${item.watts}W` : 'watts ?';
      const hours = item.hours_per_day != null ? `${item.hours_per_day} h/day` : 'hours ?';
      const qty = item.quantity != null ? ` ×${item.quantity}` : '';
      return `- **${name}**${qty}: ${watts}, ${hours}`;
    })
    .join('\n');
}

function tryParseAppliances(text) {
  const cleaned = String(text || '')
    .trim()
    .replace(/^```(?:json|javascript|js)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  try {
    const data = JSON.parse(cleaned);
    if (
      Array.isArray(data) &&
      data.length &&
      data.every((x) => x && typeof x === 'object' && (x.name || x.watts != null))
    ) {
      return data;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** True when fenced/pre content is really markdown, not source code. */
function looksLikeMarkdownNotCode(raw) {
  const text = String(raw || '').trim();
  if (!text) return false;
  if (tryParseAppliances(text)) return true;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return false;
  const mdish = lines.filter(
    (l) =>
      /^[-*+]\s+/.test(l) ||
      /^\d+\.\s+/.test(l) ||
      /^#{1,6}\s+\S/.test(l) ||
      /\*\*[^*]+\*\*/.test(l) ||
      /^>\s+\S/.test(l) ||
      /^\|.+\|/.test(l)
  );
  return mdish.length >= Math.max(1, Math.ceil(lines.length * 0.5));
}

function normalizeMarkdown(md) {
  let text = String(md || '').replace(/\r\n/g, '\n');
  if (!text.trim()) return '';

  // Unwrap fenced blocks that are really markdown / appliance JSON (not code)
  text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (full, body) => {
    const inner = String(body || '').trim();
    const appliances = tryParseAppliances(inner);
    if (appliances) return `\n\n${appliancesToMarkdown(appliances)}\n\n`;
    if (looksLikeMarkdownNotCode(inner)) return `\n\n${inner}\n\n`;
    return full;
  });

  // Bare JSON appliance arrays → markdown lists
  text = text.replace(/(\[[\s\S]*?\])/g, (block) => {
    const trimmed = block.trim();
    if (!(trimmed.startsWith('[') && trimmed.includes('{'))) return block;
    const appliances = tryParseAppliances(trimmed);
    if (appliances) return `\n\n${appliancesToMarkdown(appliances)}\n\n`;
    return block;
  });

  return text.trim();
}

function promoteFalseCodeBlocks(root) {
  if (!root) return;
  root.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code') || pre;
    const raw = (code.textContent || '').trim();
    if (!raw) return;

    const appliances = tryParseAppliances(raw);
    let md = null;
    if (appliances) md = appliancesToMarkdown(appliances);
    else if (looksLikeMarkdownNotCode(raw)) md = raw;
    if (!md) return;

    const html = marked.parse(md, { async: false });
    const holder = document.createElement('div');
    holder.innerHTML = typeof html === 'string' ? html : '';
    pre.replaceWith(...holder.childNodes);
  });
}

function syncTopOffset() {
  const el = topRef.value;
  const page = el?.closest?.('.sales-chat-page');
  if (!el || !page) return;
  const h = Math.ceil(el.getBoundingClientRect().height);
  if (h > 0) page.style.setProperty('--sc-top-h', `${h}px`);
}

function toHtml(md) {
  const source = normalizeMarkdown(md);
  const parsed = marked.parse(source || '', { async: false });
  const wrap = document.createElement('div');
  wrap.innerHTML = typeof parsed === 'string' ? parsed : String(parsed || '');
  promoteFalseCodeBlocks(wrap);
  enhanceLinks(wrap);
  return wrap.innerHTML;
}

function isProductHref(href) {
  return /\/product\/\d+/i.test(href || '') || /originelectricltd\.com\/product\//i.test(href || '');
}

function enhanceLinks(root) {
  if (!root) return;
  root.querySelectorAll?.('a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const product = isProductHref(href);

    [...a.querySelectorAll('img')].forEach((img) => {
      a.parentNode?.insertBefore(img, a);
    });

    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    if (product) {
      a.classList.add('sc-cta', 'sc-shine');
      a.textContent = CTA_LABEL;
      a.setAttribute('aria-label', CTA_LABEL);
      const m = href.match(/\/product\/(\d+)/i);
      if (m) {
        a.setAttribute('href', `${STORE_BASE}/product/${m[1]}`);
      }
    }
  });
}

async function scrollBottom() {
  await nextTick();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function autoGrow() {
  const el = inputRef.value;
  if (!el) return;
  el.style.height = 'auto';
  const next = Math.min(el.scrollHeight, 140);
  el.style.height = `${Math.max(44, next)}px`;
}

function onComposerKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSubmit();
  }
}

async function restoreSession() {
  const saved = loadChatState();
  if (!saved?.sessionId) return;

  sessionId.value = saved.sessionId;
  restoring.value = true;

  if (saved.messages?.length) {
    messages.value = hydrateMessages(saved.messages);
    showWelcome.value = false;
    chipsVisible.value = false;
    await scrollBottom();
  }

  try {
    const remote = await fetchSessionMessages(saved.sessionId);
    if (remote.length) {
      messages.value = hydrateMessages(remote);
      showWelcome.value = false;
      chipsVisible.value = false;
      persist();
      await scrollBottom();
    }
  } catch {
    /* keep local cache if AgentOS session fetch fails */
  } finally {
    restoring.value = false;
  }
}

async function send(text) {
  const msg = (text || '').trim();
  if (!msg || loading.value) return;
  chipsVisible.value = false;
  showWelcome.value = false;
  messages.value.push({ role: 'user', text: msg, time: timeNow() });
  draft.value = '';
  nextTick(autoGrow);
  loading.value = true;
  persist();
  await scrollBottom();

  const botIndex = messages.value.length;
  messages.value.push({
    role: 'assistant',
    text: '',
    html: '',
    time: timeNow(),
    streaming: true,
    status: 'Working on it',
  });
  await scrollBottom();

  try {
    const data = await streamSalesChat({
      sessionId: sessionId.value,
      message: msg,
      channel: 'webapp',
      onEvent: (evt) => {
        const row = messages.value[botIndex];
        if (!row) return;

        if (evt.session_id) {
          sessionId.value = evt.session_id;
        }

        if (evt.event === 'ToolCallStarted') {
          row.status = 'Checking live catalogue…';
        } else if (evt.event === 'ToolCallCompleted') {
          row.status = 'Writing reply…';
        } else if (evt.event === 'RunStarted') {
          row.status = 'Connected to sales agent…';
        } else if (evt.event === 'RunContent') {
          const chunk = typeof evt.content === 'string' ? evt.content : '';
          if (chunk) {
            row.text += chunk;
            row.html = toHtml(row.text);
            row.streaming = true;
            row.status = '';
            scrollBottom();
          }
        } else if (evt.event === 'RunCompleted') {
          const final = typeof evt.content === 'string' ? evt.content : '';
          if (final) {
            row.text = final;
            row.html = toHtml(final);
          } else if (row.text) {
            row.html = toHtml(row.text);
          }
          row.streaming = false;
          row.status = '';
        }
      },
    });

    if (data.sessionId) sessionId.value = data.sessionId;
    const row = messages.value[botIndex];
    if (row) {
      if (!row.text && data.reply) {
        row.text = data.reply;
        row.html = toHtml(data.reply);
      } else if (row.text) {
        row.html = toHtml(row.text);
      }
      if (!row.text) {
        row.text = 'No reply';
        row.html = toHtml('_No reply from sales agent._');
      }
      row.streaming = false;
      row.status = '';
    }
    persist();
  } catch (err) {
    const row = messages.value[botIndex];
    const errText = `**Error:** ${err.message || err}`;
    if (row) {
      row.text = String(err.message || err);
      row.html = toHtml(errText);
      row.streaming = false;
      row.status = '';
    } else {
      messages.value.push({
        role: 'assistant',
        text: String(err.message || err),
        html: toHtml(errText),
        time: timeNow(),
      });
    }
    persist();
  } finally {
    loading.value = false;
    await scrollBottom();
  }
}

function onSubmit() {
  send(draft.value);
}

watch(draft, () => nextTick(autoGrow));

onMounted(async () => {
  syncTopOffset();
  if (typeof ResizeObserver !== 'undefined' && topRef.value) {
    topResizeObserver = new ResizeObserver(() => syncTopOffset());
    topResizeObserver.observe(topRef.value);
  }
  window.addEventListener('resize', syncTopOffset);
  await restoreSession();
  nextTick(() => {
    autoGrow();
    syncTopOffset();
  });
  scrollBottom();
});

onUnmounted(() => {
  topResizeObserver?.disconnect();
  topResizeObserver = null;
  window.removeEventListener('resize', syncTopOffset);
});
</script>

<style scoped>
.sales-chat-page {
  --surface: #fdf9f0;
  --on-surface: #1c1c16;
  --muted: #44474d;
  --navy: #0b1f3a;
  --orange: #9a4600;
  --orange-bright: #fd8a3d;
  --card: #ffffff;
  --low: #f7f3ea;
  --high: #ece8df;
  --sc-top-h: 5.75rem;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
  background: var(--surface);
  color: var(--on-surface);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  padding-top: var(--sc-top-h);
  padding-bottom: calc(8.5rem + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}
.sales-chat-page *,
.sales-chat-page *::before,
.sales-chat-page *::after {
  box-sizing: border-box;
}
.sc-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(253, 249, 240, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 10px rgba(11, 31, 58, 0.06);
  padding-top: env(safe-area-inset-top, 0px);
}
.sc-header {
  position: relative;
  z-index: 1;
  background: transparent;
  box-shadow: none;
  padding-top: 0;
}
.sc-header-inner {
  min-height: 4.25rem;
  max-width: 36rem;
  margin: 0 auto;
  padding: 0.55rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  width: 100%;
}
.sc-brand { display: flex; align-items: center; gap: 0.45rem; min-width: 0; flex: 1; }
.sc-titles { min-width: 0; flex: 1; }
.sc-title-row { display: flex; align-items: center; gap: 0.35rem; min-width: 0; }
.sc-titles h1, .sc-name {
  margin: 0;
  font-family: Outfit, system-ui, sans-serif;
  font-size: clamp(0.95rem, 3.8vw, 1.125rem);
  font-weight: 600;
  color: var(--navy);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sc-title-short { display: none; }
.sc-subtitle {
  margin: 0;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sc-titles p, .sc-sub {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--muted);
}
.sc-status-short { display: none; }
.sc-pill {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.12rem 0.35rem;
  border-radius: 999px;
  background: #e6e2d9;
  color: var(--muted);
  flex-shrink: 0;
}
.sc-pill-orange { background: rgba(154, 70, 0, 0.1); color: var(--orange); }
.sc-header-actions { display: flex; align-items: center; gap: 0.1rem; flex-shrink: 0; }
.sc-icon-btn {
  width: 40px; height: 40px; border: 0; background: transparent; border-radius: 0.5rem;
  color: var(--navy); display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  flex-shrink: 0;
}
.sc-icon-btn:hover { background: var(--high); }
.sc-logo {
  width: 2.1rem;
  height: 2.1rem;
  object-fit: contain;
  border-radius: 0.4rem;
  background: #fff;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(11, 31, 58, 0.08);
}
.sc-logo-lg {
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
  border-radius: 0.55rem;
  background: #fff;
  flex-shrink: 0;
  box-shadow: 0 1px 6px rgba(11, 31, 58, 0.1);
}
.sc-lucide { width: 1.2rem; height: 1.2rem; }
.sc-lucide-sm { width: 1.1rem; height: 1.1rem; }
.sc-lucide-xs { width: 0.9rem; height: 0.9rem; }
.sc-lucide-xs.orange { color: var(--orange); }
.sc-status {
  max-width: 36rem; margin: 0 auto; width: 100%;
  padding: 0.35rem 0.75rem; display: flex; justify-content: space-between; align-items: center;
  background: var(--low); color: var(--muted); font-size: 0.65rem; font-weight: 700;
  gap: 0.5rem;
}
.sc-status-left, .sc-status-right { display: flex; align-items: center; gap: 0.35rem; min-width: 0; }
.sc-status-left span:not(.sc-dot) {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sc-dot, .sc-dot-sm {
  width: 0.5rem; height: 0.5rem; border-radius: 999px; background: var(--orange);
  animation: pulse 1.5s infinite; flex-shrink: 0;
}
.sc-dot-sm { width: 0.4rem; height: 0.4rem; animation: none; }
@keyframes pulse { 50% { opacity: 0.4; } }
.sc-main {
  max-width: 36rem; margin: 0 auto; width: 100%;
  padding: 0.85rem 0.75rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.sc-md :deep(a.sc-cta),
.sc-md :deep(a[href*="/product/"]) {
  white-space: normal;
  text-align: center;
  max-width: 100%;
}
.sc-welcome { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.sc-time-badge {
  font-size: 0.7rem; font-weight: 700; color: var(--muted);
  background: #f1eee5; padding: 0.25rem 0.75rem; border-radius: 999px;
}
.sc-card {
  width: 100%; background: var(--card); border-radius: 1rem 1rem 1rem 0.25rem;
  padding: 1rem; box-shadow: 0 2px 8px rgba(11, 31, 58, 0.04);
}
.sc-card-welcome { border-radius: 1rem 0.25rem 1rem 1rem; }
.sc-welcome-head { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; }
.sc-body { margin: 0 0 0.75rem; font-size: 0.9rem; line-height: 1.5; }
.sc-note {
  display: none;
}
.sc-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.sc-chip {
  position: relative;
  overflow: hidden;
  height: 2.5rem; padding: 0 0.9rem; border: 0; border-radius: 999px; background: #f1eee5;
  display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 600;
  cursor: pointer; color: var(--on-surface);
  box-shadow: 0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 14px rgba(11, 31, 58, 0.06);
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
.sc-chip:hover { background: var(--navy); color: #fff; transform: translateY(-1px); }
.sc-chip:hover :deep(svg) { color: #fd8a3d; }
.sc-row-user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-left: 1.25rem;
}
.sc-bubble-user {
  background: var(--navy); color: #fff; border-radius: 1rem 1rem 0.25rem 1rem;
  padding: 0.65rem 1rem; max-width: 92%; box-shadow: 0 4px 12px rgba(11, 31, 58, 0.12);
}
.sc-bubble-user p { margin: 0; font-size: 0.9rem; white-space: pre-wrap; word-break: break-word; }
.sc-row-bot { display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem; }
.sc-eng-label {
  display: flex; align-items: center; gap: 0.4rem; font-size: 0.65rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 0.35rem;
}
.sc-meta { font-size: 0.7rem; font-weight: 700; color: var(--muted); padding-left: 0.25rem; }
.sc-meta-end { display: flex; align-items: center; gap: 0.25rem; padding-right: 0.25rem; }
.sc-thinking {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  width: auto;
  max-width: 16rem;
  background: linear-gradient(135deg, #ffffff 0%, #f7f3ea 100%);
  border: 1px solid rgba(11, 31, 58, 0.06);
}
.sc-thinking-inline {
  margin: 0;
  padding: 0.35rem 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  max-width: none;
}
.sc-stream-cursor {
  display: inline-block;
  width: 0.45rem;
  height: 1.05rem;
  margin-left: 0.15rem;
  vertical-align: text-bottom;
  background: var(--orange);
  border-radius: 1px;
  animation: scCursor 0.9s steps(1) infinite;
}
@keyframes scCursor {
  50% { opacity: 0; }
}
.sc-think-orb {
  position: relative;
  width: 2.1rem;
  height: 2.1rem;
  flex-shrink: 0;
}
.sc-think-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid transparent;
  border-top-color: var(--orange);
  border-right-color: rgba(154, 70, 0, 0.35);
  animation: scSpin 0.9s linear infinite;
}
.sc-think-core {
  position: absolute;
  inset: 0.45rem;
  border-radius: 999px;
  background: var(--navy);
  animation: scPulseCore 1.4s ease-in-out infinite;
}
.sc-think-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.sc-think-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--navy);
  font-style: normal;
}
.sc-think-dots {
  display: inline-flex;
  gap: 0.28rem;
  align-items: center;
  height: 0.7rem;
}
.sc-think-dots i {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: var(--orange);
  display: block;
  animation: scDot 1.2s ease-in-out infinite;
}
.sc-think-dots i:nth-child(2) { animation-delay: 0.15s; }
.sc-think-dots i:nth-child(3) { animation-delay: 0.3s; }
@keyframes scSpin {
  to { transform: rotate(360deg); }
}
@keyframes scPulseCore {
  0%, 100% { transform: scale(0.85); opacity: 0.85; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes scDot {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
  40% { transform: translateY(-3px); opacity: 1; }
}
.sc-md :deep(p) { margin: 0.45em 0; font-size: 0.9rem; line-height: 1.55; color: var(--on-surface); }
.sc-md :deep(h1),
.sc-md :deep(h2),
.sc-md :deep(h3),
.sc-md :deep(h4) {
  margin: 0.75em 0 0.35em;
  font-family: Outfit, system-ui, sans-serif;
  font-weight: 700;
  color: var(--navy);
  line-height: 1.25;
}
.sc-md :deep(h1) { font-size: 1.15rem; }
.sc-md :deep(h2) { font-size: 1.05rem; }
.sc-md :deep(h3),
.sc-md :deep(h4) { font-size: 0.95rem; }
.sc-md :deep(strong) { font-weight: 700; color: var(--navy); }
.sc-md :deep(em) { font-style: italic; }
.sc-md :deep(ul),
.sc-md :deep(ol) {
  margin: 0.45em 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.55;
}
.sc-md :deep(li) { margin: 0.2em 0; }
.sc-md :deep(li::marker) { color: var(--orange); }
.sc-md :deep(blockquote) {
  margin: 0.55em 0;
  padding: 0.45rem 0.75rem;
  border-left: 3px solid var(--orange);
  background: var(--low);
  border-radius: 0 0.5rem 0.5rem 0;
  color: var(--muted);
  font-size: 0.88rem;
}
.sc-md :deep(hr) {
  border: 0;
  border-top: 1px solid var(--high);
  margin: 0.85em 0;
}
.sc-md :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.6em 0;
  font-size: 0.82rem;
  overflow: hidden;
  border-radius: 0.5rem;
}
.sc-md :deep(th),
.sc-md :deep(td) {
  border: 1px solid var(--high);
  padding: 0.4rem 0.55rem;
  text-align: left;
  vertical-align: top;
}
.sc-md :deep(th) {
  background: var(--low);
  color: var(--navy);
  font-weight: 700;
}
.sc-md :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8em;
  background: var(--low);
  color: #7a3700;
  padding: 0.12em 0.35em;
  border-radius: 0.3rem;
}
.sc-md :deep(pre) {
  margin: 0.55em 0;
  padding: 0.75rem 0.85rem;
  background: #121820;
  color: #e8eef5;
  border-radius: 0.75rem;
  overflow-x: auto;
  max-width: 100%;
}
.sc-md :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: 0.78rem;
  line-height: 1.45;
  white-space: pre;
}
.sc-md :deep(img) {
  display: block; max-width: 100%; max-height: 200px; border-radius: 0.75rem;
  margin: 0.5rem 0; background: var(--high); object-fit: contain;
}
.sc-md :deep(a) { color: var(--orange); font-weight: 600; word-break: break-word; }
.sc-md :deep(a.sc-cta),
.sc-md :deep(a[href*="/product/"]) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin: 0.5rem 0;
  min-height: 44px;
  padding: 0.65rem 1.1rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #b35410 0%, var(--orange) 45%, #7a3700 100%) !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  background-clip: border-box !important;
  -webkit-background-clip: border-box !important;
  text-decoration: none !important;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: normal;
  text-align: center;
  max-width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(154, 70, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.12) inset;
}
.sc-md :deep(a.sc-cta:hover),
.sc-md :deep(a[href*="/product/"]:hover) {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  filter: brightness(1.06);
}
.sc-md :deep(a.sc-cta img),
.sc-md :deep(a[href*="/product/"] img) {
  display: none;
}
.sc-shine::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 35%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0.08) 65%,
    transparent 100%
  );
  transform: skewX(-18deg);
  animation: scShine 3.2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes scShine {
  0%, 55% { left: -120%; opacity: 0; }
  60% { opacity: 1; }
  75% { left: 140%; opacity: 0.9; }
  100% { left: 140%; opacity: 0; }
}
.sc-composer {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
  background: rgba(253, 249, 240, 0.96); backdrop-filter: blur(12px);
  box-shadow: 0 -4px 16px rgba(11, 31, 58, 0.06);
  padding: 0.75rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom, 0px));
}
.sc-composer-hint {
  max-width: 36rem; margin: 0 auto 0.45rem; text-align: center;
  font-size: 0.65rem; color: var(--muted); padding: 0 0.25rem;
}
.sc-form {
  max-width: 36rem; margin: 0 auto; display: flex; gap: 0.5rem; align-items: flex-end;
  width: 100%;
}
.sc-input-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
  border-radius: 1.15rem;
  border: 1.5px solid rgba(154, 70, 0, 0.16);
  background: #fff;
  box-shadow: 0 4px 14px rgba(11, 31, 58, 0.05);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
}
.sc-input-wrap:focus-within {
  border-color: #c45f12;
  box-shadow: 0 0 0 3px rgba(196, 95, 18, 0.2);
}
.sc-input {
  display: block;
  width: 100%;
  min-height: 2.75rem;
  max-height: 140px;
  border: 0;
  border-radius: 1.15rem;
  padding: 0.7rem 0.95rem;
  background: transparent;
  box-shadow: none;
  font-size: 0.9rem;
  line-height: 1.35;
  outline: none;
  resize: none;
  overflow-y: auto;
  font-family: inherit;
  color: var(--on-surface);
  /* hide inner scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.sc-input::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
.sc-input:focus {
  border: 0;
  outline: none;
  box-shadow: none;
}
.sc-input:disabled { opacity: 0.7; }
.sc-input-wrap:focus-within .sc-input {
  outline: none;
  box-shadow: none;
}
.sc-send {
  position: relative;
  overflow: hidden;
  width: 2.75rem; height: 2.75rem; border: 0; border-radius: 999px;
  background: linear-gradient(145deg, #fd8a3d 0%, var(--orange) 48%, #7a3700 100%);
  color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(154, 70, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.18) inset;
  margin-bottom: 0.05rem;
  transition: transform 0.15s ease, filter 0.15s ease;
}
.sc-send:hover:not(:disabled) { transform: translateY(-1px) scale(1.03); filter: brightness(1.05); }
.sc-send:disabled { opacity: 0.55; cursor: not-allowed; }

@media (max-width: 480px) {
  .sc-title-full { display: none; }
  .sc-title-short { display: inline; }
  .sc-status-long { display: none; }
  .sc-status-short { display: inline; }
  .sc-header-inner { padding: 0.45rem 0.55rem; }
  .sc-main { padding: 0.75rem 0.55rem; }
  .sc-row-user { padding-left: 0.65rem; }
  .sc-bubble-user { max-width: 100%; }
  .sc-chip { height: auto; min-height: 2.4rem; padding: 0.45rem 0.75rem; }
  .sc-composer { padding: 0.65rem 0.55rem calc(0.65rem + env(safe-area-inset-bottom, 0px)); }
  .sc-md :deep(ol),
  .sc-md :deep(ul) { padding-left: 1.15rem; }
}
</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
</style>
