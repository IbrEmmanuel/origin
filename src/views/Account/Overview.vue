<template>
  <div class="overview">
    <div v-if="loading" class="state">
      <span class="loader"></span>
      <p>Syncing live account data…</p>
    </div>

    <template v-else>
      <div v-if="error" class="banner" role="alert">{{ error }}</div>

      <!-- Hero pulse -->
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-kicker mono">Workspace · live</p>
          <h2>Your energy control plane</h2>
          <p>Orders, spend, and next actions — pulled from the Origin API, not sample data.</p>
        </div>
        <div class="hero-actions">
          <router-link to="/marketplace" class="btn primary">Shop gear</router-link>
          <router-link to="/account/consultations" class="btn ghost">Book consult</router-link>
        </div>
      </section>

      <!-- Stats -->
      <div class="stats">
        <article v-for="stat in stats" :key="stat.label" class="stat">
          <div class="stat-top">
            <span class="stat-icon" :style="{ color: stat.color }">
              <component :is="stat.icon" />
            </span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
          <p class="stat-value">{{ stat.value }}</p>
        </article>
      </div>

      <!-- Quick grid -->
      <div class="quick">
        <router-link
          v-for="item in shortcuts"
          :key="item.to"
          :to="item.to"
          class="quick-card"
        >
          <span class="quick-icon" :class="item.tone">
            <component :is="item.icon" />
          </span>
          <span class="quick-copy">
            <strong>{{ item.title }}</strong>
            <small>{{ item.sub }}</small>
          </span>
          <ArrowRightIcon class="chev" />
        </router-link>
      </div>

      <!-- Recent orders -->
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Recent orders</h2>
            <p class="panel-sub mono">/user/orders</p>
          </div>
          <router-link to="/account/orders" class="link">View all</router-link>
        </div>

        <div v-if="!recentOrders.length" class="empty">
          <ShoppingBagIcon class="empty-icon" />
          <p>No orders yet. Browse the marketplace to get started.</p>
          <router-link to="/marketplace" class="btn primary">Shop now</router-link>
        </div>

        <ul v-else class="order-list">
          <li v-for="order in recentOrders" :key="order.id">
            <router-link
              :to="`/account/orders/${String(order.id).replace(/^ORD-/, '')}`"
              class="order-row"
            >
              <div class="order-id">
                <strong>#{{ order.id }}</strong>
                <span>{{ order.date }}</span>
              </div>
              <div class="order-meta">
                <strong>{{ order.total }}</strong>
                <span class="pill" :class="statusClass(order.status)">{{ order.status }}</span>
              </div>
            </router-link>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  ShoppingBag as OrderIcon,
  Clock as PendingIcon,
  Wallet as BalanceIcon,
  Sparkles as SparklesIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowRight as ArrowRightIcon,
  Calendar as CalendarIcon,
  User as UserIcon
} from 'lucide-vue-next';
import userService from '@/services/user.service';

const loading = ref(true);
const error = ref('');
const stats = ref([
  { label: 'Total Orders', value: '—', icon: OrderIcon, color: 'var(--color-primary)' },
  { label: 'Pending', value: '—', icon: PendingIcon, color: '#f59e0b' },
  { label: 'Total Spent', value: '—', icon: BalanceIcon, color: 'var(--color-success)' }
]);
const recentOrders = ref([]);

const shortcuts = [
  { to: '/origin-talk', title: 'Origin Talk', sub: 'AI energy support', icon: SparklesIcon, tone: 'talk' },
  { to: '/marketplace', title: 'Marketplace', sub: 'Live catalog', icon: ShoppingBagIcon, tone: 'market' },
  { to: '/account/consultations', title: 'Book consult', sub: 'Engineering slot', icon: CalendarIcon, tone: 'book' },
  { to: '/account/profile', title: 'Profile', sub: 'Referrals & prefs', icon: UserIcon, tone: 'you' }
];

const iconMap = { OrderIcon, PendingIcon, BalanceIcon };

const statusClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s.includes('deliver') || s.includes('complete') || s.includes('success')) return 'ok';
  if (s.includes('ship') || s.includes('process')) return 'info';
  if (s.includes('cancel') || s.includes('fail')) return 'err';
  return 'warn';
};

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await userService.getDashboard();
    stats.value = (data.stats || []).map((s) => ({
      ...s,
      icon: iconMap[s.icon] || OrderIcon,
      color: s.color || 'var(--color-primary)'
    }));
    if (!stats.value.length) {
      stats.value = [
        { label: 'Total Orders', value: '0', icon: OrderIcon, color: 'var(--color-primary)' },
        { label: 'Pending', value: '0', icon: PendingIcon, color: '#f59e0b' },
        { label: 'Total Spent', value: '₦0', icon: BalanceIcon, color: 'var(--color-success)' }
      ];
    }
    recentOrders.value = data.recentOrders || [];
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || 'Could not load dashboard. Try again.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.loader {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.mono {
  font-family: ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace;
}

.banner {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: var(--status-warn-bg);
  color: var(--status-warn-fg);
  border: 1px solid var(--status-warn-border);
  font-size: 0.88rem;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 45%),
    color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  animation: rise 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-kicker {
  margin: 0 0 0.4rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.hero h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.hero-copy p:last-child {
  margin: 0.45rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.45;
  max-width: 34rem;
}

.hero-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
}

.btn.primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 12px 28px -14px color-mix(in srgb, var(--color-primary) 70%, transparent);
}

.btn.ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong, var(--border-color));
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}

.stat {
  padding: 1rem;
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  border: 1px solid var(--border-color);
}

.stat-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.stat-icon :deep(svg) { width: 16px; height: 16px; }

.stat-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.stat-value {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 3.8vw, 1.55rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  line-height: 1.1;
  word-break: break-word;
}

.quick {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  border: 1px solid var(--border-color);
  text-decoration: none;
  color: inherit;
}

.quick-card:active { transform: scale(0.99); }

.quick-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-icon :deep(svg) { width: 18px; height: 18px; }
.quick-icon.talk { background: color-mix(in srgb, var(--color-primary) 16%, transparent); color: var(--color-primary); }
.quick-icon.market { background: var(--status-ok-bg); color: var(--status-ok-fg); }
.quick-icon.book { background: var(--status-info-bg); color: var(--status-info-fg); }
.quick-icon.you { background: color-mix(in srgb, #a78bfa 18%, transparent); color: #a78bfa; }

.quick-copy {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
  flex: 1;
}

.quick-copy strong {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--text-primary);
}

.quick-copy small {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.chev {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.panel {
  padding: 1rem;
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-secondary) 94%, transparent);
  border: 1px solid var(--border-color);
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.panel-head h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.panel-sub {
  margin: 0.2rem 0 0;
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding: 1.75rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  width: 32px;
  height: 32px;
  opacity: 0.45;
}

.order-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 0.8rem;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.order-id {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.order-id strong {
  font-size: 0.92rem;
  color: var(--text-primary);
}

.order-id span,
.order-meta span:not(.pill) {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.order-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.order-meta strong {
  font-size: 0.92rem;
  color: var(--text-primary);
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: capitalize;
}

.pill.ok { background: var(--status-ok-bg); color: var(--status-ok-fg); }
.pill.warn { background: var(--status-warn-bg); color: var(--status-warn-fg); }
.pill.err { background: var(--status-err-bg); color: var(--status-err-fg); }
.pill.info { background: var(--status-info-bg); color: var(--status-info-fg); }

@keyframes rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 720px) {
  .hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.6rem;
  }

  .hero-actions {
    width: auto;
    grid-template-columns: auto auto;
  }

  .btn { min-width: 132px; }

  .stats { gap: 1rem; }

  .quick {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .quick {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 420px) {
  .stats { grid-template-columns: 1fr; }
  .stat-top { margin-bottom: 0.4rem; }
  .stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .stat-value { text-align: right; }
}
</style>
