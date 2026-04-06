<template>
  <div class="account-page-wrapper">
    <!-- Dedicated Account Header -->
    <header class="account-header">
      <div class="header-container">
        <router-link to="/" class="header-brand">
          <img src="../../assets/logo.png" alt="Origin Electric" class="header-logo" />
          <div class="brand-text">
            <div class="brand-name">ORIGIN ELECTRIC</div>
            <div class="brand-tagline">Power you can trust</div>
          </div>
        </router-link>
        
        <div class="header-actions">
          <!-- Cart Icon -->
          <router-link to="/cart" class="header-icon-btn">
            <ShoppingCartIcon class="header-icon" />
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>

          <!-- User Avatar Initial -->
          <router-link to="/account/profile" class="user-avatar" title="View Profile">
            {{ userInitials[0] || 'U' }}
          </router-link>
        </div>
      </div>
    </header>

    <div class="dashboard-layout">
      <!-- Desktop Sidebar / Mobile Bottom Nav -->
      <nav class="dashboard-nav" :class="{ 'bottom-nav': isMobile }">
        <div class="nav-container">
          <ul class="nav-menu">
            <li v-for="item in navItems" :key="item.path">
              <router-link 
                :to="item.path" 
                class="nav-item" 
                active-class="active"
              >
                <component :is="item.icon" class="nav-icon" />
                <span class="nav-label">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>

          <div class="nav-footer desktop-only">
            <button @click="handleLogout" class="logout-btn">
              <LogOutIcon class="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="dashboard-main">
        <header class="content-header">
          <div class="header-left">
            <h1>{{ currentRouteLabel }}</h1>
            <p class="text-secondary">{{ currentRouteDescription }}</p>
          </div>
        </header>

        <section class="dashboard-content">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  LayoutDashboard as DashboardIcon, 
  ShoppingBag as ShoppingBagIcon, 
  Store as VendorIcon, 
  Calendar as ConsultIcon, 
  User as UserIcon,
  LogOut as LogOutIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as MarketIcon
} from 'lucide-vue-next';

import authService from '@/services/auth.service';
import vendorService from '@/services/vendor.service';
import { useCart } from '@/composables/useCart';

const router = useRouter();
const route = useRoute();
const isMobile = ref(false);
const user = ref(authService.getUser());
const vendorStatus = ref(null);

const { cartCount } = useCart();

const userName = computed(() => user.value?.name || 'User');
const userInitials = computed(() => {
  if (!user.value?.name) return 'U';
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
});

const navItems = computed(() => {
  const items = [
    { path: '/account/dashboard', label: 'Dashboard', icon: DashboardIcon, description: 'Quick overview of your energy ecosystem.' },
    { path: '/account/orders', label: 'Orders', icon: ShoppingBagIcon, description: 'Track your energy systems and installation progress.' },
  ];

  if (vendorStatus.value === 'approved') {
    items.push({ path: '/account/vendor', label: 'Vendor', icon: VendorIcon, description: 'Manage your partner account and store.' });
  } else {
    items.push({ path: '/account/market', label: 'Market', icon: MarketIcon, description: 'Explore premium energy products and solutions.' });
  }

  items.push(
    { path: '/account/consultations', label: 'Consultations', icon: ConsultIcon, description: 'View and schedule your engineering assessments.' },
    { path: '/account/profile', label: 'Profile', icon: UserIcon, description: 'Manage your personal details and preferences.' }
  );

  return items;
});

const currentRouteItem = computed(() => {
  return navItems.value.find(item => route.path.startsWith(item.path)) || navItems.value[0];
});

const currentRouteLabel = computed(() => currentRouteItem.value.label);
const currentRouteDescription = computed(() => currentRouteItem.value.description);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const fetchVendorStatus = async () => {
  try {
    const data = await vendorService.getStatus();
    vendorStatus.value = data.status;
  } catch (err) {
    console.error('Failed to fetch vendor status', err);
  }
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

onMounted(() => {
  checkMobile();
  fetchVendorStatus();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.account-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Dedicated Account Header */
.account-header {
  height: 80px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
}

.header-logo {
  height: 40px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  min-width: 0;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-layout {
  display: flex;
  flex: 1;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding-top: 80px; /* Fixed header offset */
}

/* Sidebar Navigation */
.dashboard-nav {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: var(--space-md);
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  transition: all var(--transition-speed);
  z-index: 100;
}

.nav-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--space-lg);
  padding: 0 var(--space-sm);
}

.nav-title {
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-bounce);
  text-decoration: none;
}

.nav-item:hover {
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
}

.nav-item.active {
  background: var(--color-blue-primary);
  color: white;
  box-shadow: 0 8px 16px -4px rgba(0, 102, 204, 0.3);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #ef4444;
  background: transparent;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;
}

/* Main Content */
.dashboard-main {
  flex: 1;
  margin-left: 280px; /* Offset for fixed sidebar */
  padding: var(--space-md) var(--space-lg);
  max-width: 1400px;
}

.content-header {
  margin-bottom: var(--space-sm);
}

.dashboard-content {
  padding-top: 0;
}

/* Global Reset for Dashboard Cards: Border instead of Shadow */
.dashboard-content :deep(.glass-card) {
  box-shadow: none !important;
  border: 1px solid var(--border-color) !important;
}

.content-header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-secondary);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
}

.header-icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.header-icon {
  width: 20px;
  height: 20px;
}

.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  height: 18px;
  min-width: 18px;
  padding: 0 4px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-primary);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--color-blue-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-secondary { color: var(--text-secondary); }
.desktop-only { display: flex; }

@media (max-width: 1024px) {
  .dashboard-main {
    padding: var(--space-lg);
  }
}

@media (max-width: 768px) {
  .account-header {
    height: 70px;
    padding: 0 var(--space-md);
    margin-left: 0;
  }

  .header-logo {
    height: 32px;
  }

  .brand-name {
    font-size: 0.9rem;
  }

  .brand-tagline {
    font-size: 0.55rem;
  }

  .dashboard-layout {
    flex-direction: column;
    padding-bottom: 80px; /* Room for bottom nav */
    padding-top: 70px; /* Mobile header offset */
  }

  .dashboard-nav {
    width: 100%;
    height: auto;
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    border-right: none;
    border-top: 1px solid var(--border-color);
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
  }

  .nav-menu {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px;
  }

  .nav-item {
    flex-direction: column;
    align-items: center;
    padding: 8px;
    gap: 4px;
    background: transparent !important;
    box-shadow: none !important;
  }

  .nav-label {
    font-size: 0.65rem;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
  }

  .nav-item.active {
    color: var(--color-blue-primary);
  }

  .dashboard-main {
    margin-left: 0;
    padding: var(--space-sm) var(--space-md);
  }

  .content-header h1 {
    font-size: 1.75rem;
  }

  .desktop-only { display: none !important; }
}
</style>
