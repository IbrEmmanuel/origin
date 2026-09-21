<template>
  <nav class="mobile-bottom-nav" aria-label="Mobile navigation">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item) }"
      :aria-label="item.label"
    >
      <span class="nav-active-line" aria-hidden="true" />
      <component :is="item.icon" class="nav-icon" aria-hidden="true" />
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import {
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Calculator as CalculatorIcon,
  MessageSquare as MessageSquareIcon,
  User as UserIcon,
} from 'lucide-vue-next';

const route = useRoute();

const navItems = [
  { label: 'Home',      path: '/',            icon: HomeIcon         },
  { label: 'Shop',      path: '/marketplace', icon: ShoppingBagIcon  },
  { label: 'Audit',     path: '/load-audit',  icon: CalculatorIcon   },
  { label: 'AI Chat',   path: '/sales-chat',  icon: MessageSquareIcon },
  { label: 'Account',   path: '/account',     icon: UserIcon         },
];

function isActive(item) {
  if (item.path === '/') return route.path === '/';
  if (item.path === '/account') return route.path.startsWith('/account');
  return route.path.startsWith(item.path);
}
</script>

<style scoped>
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 992px) {
  .mobile-bottom-nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 62px;
    background: var(--bg-primary);
    border-top: 0.5px solid var(--border-color);
    padding: 0 8px;
    z-index: 900;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
    /* Safe area for modern phones */
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}

/* Each tab item */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 3px;
  padding: 8px 4px 6px;
  position: relative;
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 0.2s ease;
  min-width: 0;
  /* kill the router-link active class default */
  border-radius: 0;
}

/* Active indicator line at top — from design spec "Line 1: 2px solid primary" */
.nav-active-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 24px;
  height: 2px;
  background: var(--color-blue-primary);
  border-radius: var(--radius-full);
  transition: transform 0.25s var(--transition-bounce);
}

.nav-item.active .nav-active-line {
  transform: translateX(-50%) scaleX(1);
}

/* Icon */
.nav-icon {
  width: 22px;
  height: 22px;
  stroke-width: 1.8;
  flex-shrink: 0;
  transition: color 0.2s ease, transform 0.2s ease;
}

.nav-item.active .nav-icon {
  color: var(--color-blue-primary);
  transform: translateY(-1px);
}

/* Label */
.nav-label {
  font-family: var(--font-main);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.0144em;
  line-height: 1;
  color: inherit;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
}

.nav-item.active .nav-label {
  font-weight: 600;
  color: var(--color-blue-primary);
}

/* Hover for non-touch */
@media (hover: hover) {
  .nav-item:hover {
    color: var(--color-blue-primary);
  }
}

/* Dark mode */
.dark-mode .mobile-bottom-nav {
  background: var(--bg-primary);
  border-top-color: var(--border-color);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}
</style>
