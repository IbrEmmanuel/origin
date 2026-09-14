<template>
  <div class="sales-fab-system">
    <button
      type="button"
      class="sales-fab"
      aria-label="Open sales chat"
      @click="open"
    >
      <MessageCircle class="fab-icon" />
      <span class="fab-label">Sales Chat</span>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { MessageCircle } from 'lucide-vue-next';

const router = useRouter();

function open() {
  router.push({ name: 'SalesChat' });
}
</script>

<style scoped>
.sales-fab-system {
  position: fixed;
  right: 1.25rem;
  bottom: 5.5rem;
  z-index: 90;
}
.sales-fab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  cursor: pointer;
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  background: #0b1f3a;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 8px 24px rgba(11, 31, 58, 0.35);
  transition: transform 0.15s ease, background 0.15s ease;
}
.sales-fab:hover {
  background: #9a4600;
  transform: translateY(-2px);
}
.fab-icon { width: 1.15rem; height: 1.15rem; }
@media (max-width: 640px) {
  .fab-label { display: none; }
  .sales-fab { padding: 0.9rem; border-radius: 999px; }
  .sales-fab-system { bottom: 5rem; right: 1rem; }
}
</style>
