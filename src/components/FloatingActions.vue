<template>
  <div class="fab-dock" :class="{ open: expanded }">
    <transition name="fab-fade">
      <div v-if="expanded" class="fab-menu" role="menu">
        <button
          type="button"
          class="fab-item fab-item-chat"
          role="menuitem"
          @click="openChat"
        >
          <MessageCircle class="fab-item-icon" />
          <span>Sales Chat</span>
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
      :aria-label="expanded ? 'Close actions' : 'Open quick actions'"
      @click="expanded = !expanded"
    >
      <X v-if="expanded" class="fab-main-icon" />
      <Zap v-else class="fab-main-icon" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessageCircle, Wrench, X, Zap } from 'lucide-vue-next';

const router = useRouter();
const expanded = ref(false);

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

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.fab-dock {
  position: fixed;
  right: 1.25rem;
  bottom: 1.5rem;
  z-index: 95;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.fab-main {
  width: 3.5rem;
  height: 3.5rem;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #0b1f3a;
  color: #fff;
  box-shadow: 0 10px 28px rgba(11, 31, 58, 0.35);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.fab-dock.open .fab-main {
  background: #9a4600;
  transform: rotate(90deg);
}

.fab-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(11, 31, 58, 0.4);
}

.fab-dock.open .fab-main:hover {
  transform: rotate(90deg) translateY(-2px);
}

.fab-main-icon {
  width: 1.35rem;
  height: 1.35rem;
}

.fab-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.55rem;
}

.fab-item {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 0;
  cursor: pointer;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #fff;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
  transition: transform 0.15s ease, filter 0.15s ease;
}

.fab-item:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.fab-item-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

.fab-item-chat {
  background: #0b1f3a;
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
    bottom: 1.15rem;
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
</style>
