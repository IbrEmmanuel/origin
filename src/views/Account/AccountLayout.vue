<template>
  <div class="dash-shell" :class="{ 'rail-collapsed': railCollapsed }">
    <div class="grid-lines" aria-hidden="true"></div>

    <header class="topbar">
      <div class="topbar-left">
        <button
          type="button"
          class="icon-btn menu-btn"
          @click="toggleRail"
          :aria-label="drawerOpen || !railCollapsed ? 'Hide menu' : 'Show menu'"
          :aria-expanded="drawerOpen || !railCollapsed"
        >
          <PanelLeftCloseIcon v-if="isDesktop && !railCollapsed" />
          <PanelLeftOpenIcon v-else-if="isDesktop && railCollapsed" />
          <XIcon v-else-if="drawerOpen" />
          <MenuIcon v-else />
        </button>

        <router-link to="/" class="brand">
          <img src="../../assets/logo.png" alt="" class="brand-logo" />
          <div class="brand-copy">
            <strong>ORIGIN</strong>
            <span>Control</span>
          </div>
        </router-link>
      </div>

      <div class="topbar-actions">
        <button
          type="button"
          class="icon-btn"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <component :is="isDark ? SunIcon : MoonIcon" />
        </button>

        <router-link to="/cart" class="icon-btn" aria-label="Cart">
          <ShoppingCartIcon />
          <span v-if="cartCount > 0" class="badge">{{ cartCount > 9 ? '9+' : cartCount }}</span>
        </router-link>

        <router-link to="/account/profile" class="avatar" :title="userName">
          {{ userInitials }}
        </router-link>
      </div>
    </header>

    <!-- Mobile drawer backdrop -->
    <Transition name="fade-fast">
      <div
        v-if="drawerOpen"
        class="drawer-backdrop"
        @click="closeDrawer"
        aria-hidden="true"
      />
    </Transition>

    <div class="shell-body">
      <aside
        class="side-rail"
        :class="{
          'is-open': drawerOpen,
          'is-collapsed': railCollapsed && isDesktop
        }"
      >
        <div class="rail-inner">
          <div class="rail-head">
            <div class="rail-identity" v-show="!railCollapsed || !isDesktop">
              <span class="rail-mark">{{ userInitials }}</span>
              <div class="rail-id-copy">
                <strong>{{ userName }}</strong>
                <small>{{ vendorStatus === 'approved' ? 'Supplier' : 'Account' }}</small>
              </div>
            </div>
            <button
              v-if="isDesktop"
              type="button"
              class="rail-collapse-btn"
              @click="toggleCollapse"
              :aria-label="railCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
              :title="railCollapsed ? 'Expand' : 'Collapse'"
            >
              <ChevronsLeftIcon v-if="!railCollapsed" />
              <ChevronsRightIcon v-else />
            </button>
            <button
              v-else
              type="button"
              class="rail-collapse-btn"
              @click="closeDrawer"
              aria-label="Close menu"
            >
              <XIcon />
            </button>
          </div>

          <div class="rail-scroll">
            <p class="rail-section" v-show="!railCollapsed || !isDesktop">Menu</p>
            <nav class="rail-nav" aria-label="Account">
              <router-link
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                class="rail-link"
                active-class="is-active"
                :title="item.label"
                @click="onNavClick"
              >
                <span class="rail-ico"><component :is="item.icon" /></span>
                <span class="rail-label" v-show="!railCollapsed || !isDesktop">{{ item.label }}</span>
              </router-link>
            </nav>
          </div>

          <div class="rail-foot">
            <button
              type="button"
              class="rail-logout"
              @click="handleLogout"
              :title="'Sign out'"
            >
              <LogOutIcon />
              <span v-show="!railCollapsed || !isDesktop">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="main-pane">
        <header class="page-head">
          <div class="page-head-copy">
            <p class="eyebrow">{{ greeting }}</p>
            <h1>{{ currentRouteLabel }}</h1>
            <p class="lede">{{ currentRouteDescription }}</p>
          </div>
        </header>

        <section class="page-body">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </section>
      </main>
    </div>

    <nav class="dock" aria-label="Primary">
      <div class="dock-track">
        <router-link
          v-for="item in dockItems"
          :key="item.path"
          :to="item.path"
          class="dock-item"
          active-class="is-active"
        >
          <span class="dock-glyph"><component :is="item.icon" /></span>
          <span class="dock-label">{{ item.dock }}</span>
        </router-link>
        <button type="button" class="dock-item dock-logout" @click="handleLogout">
          <span class="dock-glyph"><LogOutIcon /></span>
          <span class="dock-label">Logout</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  LayoutDashboard as DashboardIcon,
  ShoppingBag as ShoppingBagIcon,
  Store as VendorIcon,
  Calendar as ConsultIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as MarketIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Menu as MenuIcon,
  X as XIcon,
  PanelLeftClose as PanelLeftCloseIcon,
  PanelLeftOpen as PanelLeftOpenIcon,
  ChevronsLeft as ChevronsLeftIcon,
  ChevronsRight as ChevronsRightIcon
} from 'lucide-vue-next';
import authService from '@/services/auth.service';
import vendorService from '@/services/vendor.service';
import { useCart } from '@/composables/useCart';
import { useTheme } from '@/composables/useTheme';

const DESKTOP_MQ = '(min-width: 900px)';
const COLLAPSE_KEY = 'origin_rail_collapsed';

const router = useRouter();
const route = useRoute();
const user = ref(authService.getUser());
const vendorStatus = ref(null);
const { cartCount } = useCart();
const { isDark, toggleTheme } = useTheme();

const isDesktop = ref(false);
const drawerOpen = ref(false);
const railCollapsed = ref(false);

const userName = computed(() => user.value?.name || user.value?.first_name || 'User');
const userInitials = computed(() => {
  const name = user.value?.name || `${user.value?.first_name || ''} ${user.value?.last_name || ''}`.trim();
  if (!name) return 'U';
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${hello}, ${String(userName.value).split(' ')[0]}`;
});

const navItems = computed(() => {
  const mid =
    vendorStatus.value === 'approved'
      ? {
          path: '/account/vendor',
          label: 'Supplier',
          dock: 'Supplier',
          icon: VendorIcon,
          description: 'Products, bulk import, orders, and wallet.'
        }
      : {
          path: '/account/market',
          label: 'Market',
          dock: 'Shop',
          icon: MarketIcon,
          description: 'Browse live marketplace inventory and add to cart.'
        };

  return [
    {
      path: '/account/dashboard',
      label: 'Dashboard',
      dock: 'Home',
      icon: DashboardIcon,
      description: 'Live snapshot of orders, spend, and shortcuts.'
    },
    {
      path: '/account/orders',
      label: 'Orders',
      dock: 'Orders',
      icon: ShoppingBagIcon,
      description: 'Track systems, payments, and delivery status.'
    },
    mid,
    {
      path: '/account/consultations',
      label: 'Consultations',
      dock: 'Book',
      icon: ConsultIcon,
      description: 'Book and manage engineering assessments.'
    },
    {
      path: '/account/profile',
      label: 'Profile',
      dock: 'You',
      icon: UserIcon,
      description: 'Personal details, referrals, and preferences.'
    }
  ];
});

const currentRouteItem = computed(
  () => navItems.value.find((item) => route.path.startsWith(item.path)) || navItems.value[0]
);
const currentRouteLabel = computed(() => currentRouteItem.value.label);
const currentRouteDescription = computed(() => currentRouteItem.value.description);
const dockItems = computed(() => navItems.value);

const syncViewport = () => {
  const desktop = window.matchMedia(DESKTOP_MQ).matches;
  isDesktop.value = desktop;
  if (desktop) {
    drawerOpen.value = false;
  }
};

const toggleCollapse = () => {
  railCollapsed.value = !railCollapsed.value;
  try {
    localStorage.setItem(COLLAPSE_KEY, railCollapsed.value ? '1' : '0');
  } catch {
    /* ignore */
  }
};

const toggleRail = () => {
  if (isDesktop.value) {
    toggleCollapse();
  } else {
    drawerOpen.value = !drawerOpen.value;
  }
};

const closeDrawer = () => {
  drawerOpen.value = false;
};

const onNavClick = () => {
  if (!isDesktop.value) closeDrawer();
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

const fetchVendorStatus = async () => {
  try {
    const data = await vendorService.getStatus();
    vendorStatus.value = data.status;
  } catch (err) {
    console.error('Failed to fetch vendor status', err);
  }
};

watch(
  () => route.path,
  () => {
    if (!isDesktop.value) closeDrawer();
  }
);

watch(drawerOpen, (open) => {
  document.body.style.overflow = open && !isDesktop.value ? 'hidden' : '';
});

onMounted(() => {
  syncViewport();
  window.addEventListener('resize', syncViewport);
  try {
    railCollapsed.value = localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    railCollapsed.value = false;
  }
  fetchVendorStatus();
});

onUnmounted(() => {
  window.removeEventListener('resize', syncViewport);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.dash-shell {
  --dash-ink: var(--text-primary);
  --dash-muted: var(--text-muted);
  --dash-line: var(--border-color);
  --dash-surface: var(--bg-secondary);
  --dash-base: var(--bg-primary);
  --dash-accent: var(--color-primary);
  --rail-w: 220px;
  --rail-w-collapsed: 68px;
  --topbar-h: 56px;

  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--dash-ink);
  background: var(--dash-base);
  padding-top: calc(var(--topbar-h) + env(safe-area-inset-top, 0px));
  padding-bottom: calc(5.85rem + env(safe-area-inset-bottom, 0px));
}

.grid-lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.22;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--dash-line) 80%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--dash-line) 80%, transparent) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(180deg, #000 0%, transparent 55%);
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  height: calc(var(--topbar-h) + env(safe-area-inset-top, 0px));
  min-height: var(--topbar-h);
  padding:
    env(safe-area-inset-top, 0px)
    max(0.85rem, env(safe-area-inset-right))
    0
    max(0.85rem, env(safe-area-inset-left));
  background: color-mix(in srgb, var(--dash-base) 92%, transparent);
  border-bottom: 1px solid var(--dash-line);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.brand-logo { height: 30px; width: auto; }

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-copy strong {
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.brand-copy span {
  font-size: 0.6rem;
  color: var(--dash-muted);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--dash-line);
  background: transparent;
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.icon-btn :deep(svg) { width: 18px; height: 18px; }
.icon-btn:hover { color: var(--dash-accent); border-color: color-mix(in srgb, var(--dash-accent) 40%, var(--dash-line)); }

.menu-btn { flex-shrink: 0; }

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 9px;
  background: var(--dash-accent);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--dash-base);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--dash-accent);
  color: #fff;
  font-weight: 800;
  font-size: 0.8rem;
  text-decoration: none;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(8, 10, 14, 0.48);
  backdrop-filter: blur(2px);
}

.shell-body {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

/* ── Sidebar / drawer ── */
.side-rail {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 80;
  width: min(86vw, 280px);
  height: 100dvh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--dash-surface);
  border-right: 1px solid var(--dash-line);
  transform: translateX(-105%);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), width 0.22s ease;
  will-change: transform;
}

.side-rail.is-open {
  transform: translateX(0);
}

.rail-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding:
    max(0.75rem, env(safe-area-inset-top))
    0.75rem
    max(0.75rem, env(safe-area-inset-bottom));
}

.rail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.35rem 0.35rem 0.85rem;
  border-bottom: 1px solid var(--dash-line);
  flex-shrink: 0;
}

.rail-identity {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  flex: 1;
}

.rail-mark {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--dash-accent);
  color: #fff;
  font-weight: 800;
  font-size: 0.78rem;
  flex-shrink: 0;
}

.rail-id-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.2;
}

.rail-id-copy strong {
  font-size: 0.88rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rail-id-copy small {
  font-size: 0.68rem;
  color: var(--dash-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
}

.rail-collapse-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--dash-line);
  background: transparent;
  color: var(--dash-muted);
  cursor: pointer;
  flex-shrink: 0;
}

.rail-collapse-btn :deep(svg) { width: 16px; height: 16px; }
.rail-collapse-btn:hover { color: var(--dash-accent); }

.rail-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 0.85rem 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--dash-muted) 40%, transparent) transparent;
}

.rail-scroll::-webkit-scrollbar { width: 4px; }
.rail-scroll::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--dash-muted) 35%, transparent);
  border-radius: 4px;
}

.rail-section {
  margin: 0 0 0.45rem;
  padding: 0 0.65rem;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dash-muted);
}

.rail-nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.rail-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 44px;
  padding: 0.45rem 0.65rem;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-secondary);
  border-left: 2px solid transparent;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.rail-ico {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
}

.rail-ico :deep(svg) { width: 18px; height: 18px; }

.rail-label {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.rail-link:hover {
  background: color-mix(in srgb, var(--dash-base) 70%, transparent);
  color: var(--dash-ink);
}

.rail-link.is-active {
  color: var(--dash-accent);
  background: color-mix(in srgb, var(--dash-accent) 10%, transparent);
  border-left-color: var(--dash-accent);
}

.rail-foot {
  flex-shrink: 0;
  padding-top: 0.65rem;
  border-top: 1px solid var(--dash-line);
}

.rail-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  min-height: 44px;
  padding: 0.45rem 0.65rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--color-error);
  font-weight: 650;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
}

.rail-logout :deep(svg) { width: 18px; height: 18px; flex-shrink: 0; }
.rail-logout:hover { background: color-mix(in srgb, var(--color-error) 10%, transparent); }

.main-pane {
  flex: 1;
  min-width: 0;
  padding: 1rem 1rem 1.5rem;
}

.page-head { margin-bottom: 1.1rem; }

.eyebrow {
  margin: 0 0 0.2rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--dash-accent);
}

.page-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 5vw, 2rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.lede {
  margin: 0.3rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.45;
  max-width: 34rem;
}

.page-body :deep(.glass-card),
.page-body :deep(.section-card),
.page-body :deep(.panel),
.page-body :deep(.card),
.page-body :deep(.product-card) {
  background: color-mix(in srgb, var(--dash-surface) 94%, transparent) !important;
  border: 1px solid var(--dash-line) !important;
  box-shadow: none !important;
  border-radius: 16px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.2s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to { opacity: 0; }

/* Dock — mobile only */
.dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  padding:
    0 max(0.65rem, env(safe-area-inset-left))
    max(0.55rem, env(safe-area-inset-bottom))
    max(0.65rem, env(safe-area-inset-right));
  pointer-events: none;
}

.dock-track {
  pointer-events: auto;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.1rem;
  width: min(100%, 560px);
  margin: 0 auto;
  padding: 0.35rem 0.2rem;
  border-radius: 20px;
  border: 1px solid var(--dash-line);
  background: color-mix(in srgb, var(--dash-surface) 94%, #000 3%);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  min-height: 54px;
  border: none;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  color: var(--dash-muted);
  border-radius: 14px;
  -webkit-tap-highlight-color: transparent;
}

.dock-glyph {
  width: 32px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}

.dock-glyph :deep(svg) { width: 17px; height: 17px; }

.dock-label {
  font-size: 0.56rem;
  font-weight: 700;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dock-item.is-active { color: var(--dash-accent); }
.dock-item.is-active .dock-glyph {
  background: color-mix(in srgb, var(--dash-accent) 14%, transparent);
}
.dock-logout { color: var(--color-error); }
.dock-item:active { transform: scale(0.96); }

@media (min-width: 900px) {
  .dash-shell {
    padding-bottom: 0;
    padding-left: var(--rail-w);
    transition: padding-left 0.22s ease;
  }

  .dash-shell.rail-collapsed {
    padding-left: var(--rail-w-collapsed);
  }

  .dock { display: none; }

  .shell-body {
    padding: 1.15rem 1.5rem 2rem;
    max-width: none;
  }

  /* Fixed — does not move when page scrolls */
  .side-rail {
    position: fixed;
    top: calc(var(--topbar-h) + env(safe-area-inset-top, 0px));
    left: 0;
    bottom: 0;
    z-index: 80;
    width: var(--rail-w);
    height: auto;
    max-height: none;
    transform: none;
    border-right: 1px solid var(--dash-line);
    border-radius: 0;
    margin: 0;
    transition: width 0.22s ease;
  }

  .side-rail.is-collapsed {
    width: var(--rail-w-collapsed);
  }

  .side-rail.is-collapsed .rail-identity,
  .side-rail.is-collapsed .rail-section,
  .side-rail.is-collapsed .rail-label,
  .side-rail.is-collapsed .rail-logout span {
    display: none;
  }

  .side-rail.is-collapsed .rail-head {
    justify-content: center;
    padding-inline: 0.25rem;
  }

  .side-rail.is-collapsed .rail-link {
    justify-content: center;
    padding-inline: 0.4rem;
    border-left-width: 0;
  }

  .side-rail.is-collapsed .rail-link.is-active {
    background: color-mix(in srgb, var(--dash-accent) 14%, transparent);
  }

  .side-rail.is-collapsed .rail-logout {
    justify-content: center;
    padding-inline: 0.4rem;
  }

  .rail-inner {
    padding: 0.65rem 0.5rem;
    height: 100%;
  }

  .main-pane {
    padding: 0.15rem 0 0;
    max-width: 1100px;
  }
}

@media (max-width: 380px) {
  .brand-copy span { display: none; }
  .dock-label { font-size: 0.5rem; }
}
</style>
