<template>
  <div class="fab-dock">
    <!-- Typing teaser bubble -->
    <button
      type="button"
      class="fab-hint"
      aria-label="Chat with Origin Customer Care"
      @click="goToChat"
    >
      <span class="fab-hint-bubble">
        <span class="fab-hint-typed">{{ typed }}</span><span class="fab-hint-caret" aria-hidden="true" />
      </span>
    </button>

    <!-- Main FAB — single click goes straight to Customer Care -->
    <button
      type="button"
      class="fab-main"
      aria-label="Origin Customer Care"
      @click="goToChat"
    >
      <span class="fab-pulse" aria-hidden="true" />
      <span class="fab-pulse fab-pulse-delay" aria-hidden="true" />
      <MessageSquareMore class="fab-main-icon" />
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessageSquareMore } from 'lucide-vue-next';

const router = useRouter();

const phrases = [
  'Need solar help?',
  'Chat with Origin AI…',
  'Size your home load',
  'Ask about products',
];

const typed = ref('');
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let timer = null;

function tickType() {
  const phrase = phrases[phraseIndex];
  if (!deleting) {
    typed.value = phrase.slice(0, charIndex + 1);
    charIndex += 1;
    if (charIndex >= phrase.length) {
      deleting = true;
      timer = window.setTimeout(tickType, 1800);
      return;
    }
    timer = window.setTimeout(tickType, 55 + Math.random() * 40);
    return;
  }
  typed.value = phrase.slice(0, charIndex - 1);
  charIndex -= 1;
  if (charIndex <= 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    timer = window.setTimeout(tickType, 400);
    return;
  }
  timer = window.setTimeout(tickType, 28);
}

function goToChat() {
  router.push({ name: 'SalesChat' });
}

onMounted(() => {
  timer = window.setTimeout(tickType, 600);
});

onUnmounted(() => {
  if (timer) window.clearTimeout(timer);
});
</script>

<style scoped>
.fab-dock {
  --fab-navy: #0b1f3a;
  --fab-orange: #c45a12;
  --fab-cream: #fff8f1;
  position: fixed;
  right: 1.25rem;
  bottom: 1.5rem;
  z-index: 950;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  pointer-events: none;
}

.fab-dock > * {
  pointer-events: auto;
}

/* ── Typing hint bubble ── */
.fab-hint {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  max-width: min(16rem, calc(100vw - 5.5rem));
}

.fab-hint-bubble {
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  padding: 0.5rem 0.875rem;
  border-radius: 1rem 1rem 0.3rem 1rem;
  background: var(--fab-cream);
  color: var(--fab-navy);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.4;
  box-shadow:
    0 3px 0 rgba(196, 90, 18, 0.12),
    0 10px 24px rgba(11, 31, 58, 0.16);
  border: 1px solid rgba(11, 31, 58, 0.07);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  animation: hint-float 3.2s ease-in-out infinite;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.fab-hint:hover .fab-hint-bubble {
  box-shadow:
    0 3px 0 rgba(196, 90, 18, 0.22),
    0 14px 30px rgba(11, 31, 58, 0.22);
  transform: translateY(-2px);
}

.fab-hint-caret {
  display: inline-block;
  width: 2px;
  height: 0.95em;
  margin-left: 2px;
  background: var(--fab-orange);
  border-radius: 1px;
  vertical-align: -0.1em;
  animation: caret-blink 0.9s step-end infinite;
}

@keyframes caret-blink {
  50% { opacity: 0; }
}

@keyframes hint-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* ── Main FAB button ── */
.fab-main {
  position: relative;
  width: 3.75rem;
  height: 3.75rem;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #143456 0%, var(--fab-navy) 55%, #071525 100%);
  color: #fff;
  box-shadow:
    0 0 0 3px rgba(196, 90, 18, 0.35),
    0 12px 32px rgba(11, 31, 58, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: fab-bob 2.8s ease-in-out infinite;
}

.fab-main:hover {
  transform: translateY(-3px) scale(1.06);
  box-shadow:
    0 0 0 4px rgba(196, 90, 18, 0.5),
    0 16px 36px rgba(11, 31, 58, 0.45);
  animation: none;
}

.fab-main:active {
  transform: scale(0.96);
}

.fab-main-icon {
  width: 1.45rem;
  height: 1.45rem;
  position: relative;
  z-index: 1;
}

.fab-pulse {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid rgba(196, 90, 18, 0.55);
  animation: pulse-ring 2.4s ease-out infinite;
  pointer-events: none;
}

.fab-pulse-delay {
  animation-delay: 1.2s;
}

@keyframes pulse-ring {
  0%   { transform: scale(1);    opacity: 0.7; }
  100% { transform: scale(1.55); opacity: 0;   }
}

@keyframes fab-bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .fab-dock {
    right: 0.875rem;
    bottom: 5rem; /* clears the 62px mobile bottom nav */
    gap: 0.5rem;
  }

  .fab-main {
    width: 3.25rem;
    height: 3.25rem;
  }

  .fab-main-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .fab-hint-bubble {
    font-size: 0.72rem;
    padding: 0.4rem 0.7rem;
    min-height: 2rem;
  }
}

@media (max-width: 400px) {
  .fab-dock {
    right: 0.75rem;
    bottom: 4.75rem;
  }

  /* Hide the hint bubble on very small screens to save space */
  .fab-hint {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fab-main,
  .fab-hint-bubble,
  .fab-pulse,
  .fab-hint-caret {
    animation: none;
  }
}
</style>
