<template>
  <div class="fab-dock" :class="{ open: expanded }">
    <!-- Typing teaser — only when menu closed -->
    <transition name="hint">
      <button
        v-if="!expanded"
        type="button"
        class="fab-hint"
        aria-label="Open Origin AI chat"
        @click="openChat"
      >
        <span class="fab-hint-bubble">
          <span class="fab-hint-typed">{{ typed }}</span><span class="fab-hint-caret" aria-hidden="true" />
        </span>
      </button>
    </transition>

    <transition name="fab-fade">
      <div v-if="expanded" class="fab-menu" role="menu">
        <button
          type="button"
          class="fab-item fab-item-chat"
          role="menuitem"
          @click="openChat"
        >
          <MessageSquareMore class="fab-item-icon" />
          <span>Ask Origin AI</span>
        </button>
        <button
          type="button"
          class="fab-item fab-item-install"
          role="menuitem"
          @click="openInstaller"
        >
          <Wrench class="fab-item-icon" />
          <span>Request Installer</span>
        </button>
      </div>
    </transition>

    <button
      type="button"
      class="fab-main"
      :aria-expanded="expanded"
      :aria-label="expanded ? 'Close actions' : 'Open Origin AI and installer'"
      @click="expanded = !expanded"
    >
      <span class="fab-pulse" aria-hidden="true" />
      <span class="fab-pulse fab-pulse-delay" aria-hidden="true" />
      <X v-if="expanded" class="fab-main-icon" />
      <MessageSquareMore v-else class="fab-main-icon" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessageSquareMore, Wrench, X } from 'lucide-vue-next';

const router = useRouter();
const expanded = ref(false);

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

function openChat() {
  expanded.value = false;
  router.push({ name: 'SalesChat' });
}

function openInstaller() {
  expanded.value = false;
  window.dispatchEvent(new CustomEvent('open-installer-modal'));
}

function onKey(e) {
  if (e.key === 'Escape') expanded.value = false;
}

onMounted(() => {
  window.addEventListener('keydown', onKey);
  timer = window.setTimeout(tickType, 600);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
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
  z-index: 95;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.85rem;
  pointer-events: none;
}

.fab-dock > * {
  pointer-events: auto;
}

/* —— Typing hint —— */
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
  gap: 0;
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
}

.fab-hint-typed {
  min-width: 0;
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

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* —— Main FAB —— */
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
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  animation: fab-bob 2.8s ease-in-out infinite;
}

.fab-dock.open .fab-main {
  animation: none;
  background: linear-gradient(145deg, #e07a2a 0%, var(--fab-orange) 50%, #8a3d0a 100%);
  box-shadow:
    0 0 0 3px rgba(11, 31, 58, 0.2),
    0 12px 28px rgba(154, 70, 0, 0.35);
  transform: rotate(90deg);
}

.fab-main:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow:
    0 0 0 4px rgba(196, 90, 18, 0.45),
    0 16px 36px rgba(11, 31, 58, 0.45);
}

.fab-dock.open .fab-main:hover {
  transform: rotate(90deg) translateY(-2px) scale(1.04);
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

.fab-dock.open .fab-pulse {
  display: none;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.55);
    opacity: 0;
  }
}

@keyframes fab-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* —— Menu —— */
.fab-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.fab-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  cursor: pointer;
  padding: 0.65rem 1.125rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.825rem;
  letter-spacing: 0.01em;
  color: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.fab-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
  filter: brightness(1.06);
}

.fab-item-icon {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
}

.fab-item-chat {
  background: linear-gradient(135deg, #143456, var(--fab-navy));
}

.fab-item-install {
  background: #128c7e;
}

.fab-fade-enter-active,
.fab-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fab-fade-enter-from,
.fab-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .fab-dock {
    right: 1rem;
    bottom: 4.75rem; /* sits above the 62px mobile bottom nav */
  }
  .fab-hint-bubble {
    font-size: 0.75rem;
    padding: 0.45rem 0.75rem;
  }
  .fab-item span {
    display: none;
  }
  .fab-item {
    width: 3rem;
    height: 3rem;
    padding: 0;
    justify-content: center;
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
