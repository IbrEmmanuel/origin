<template>
  <div class="header-wrapper" :class="{ 'is-scrolled': isScrolled }">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container top-bar-content">
        <div class="contact-info">
          <a href="tel:+2347041880339" class="top-link"><PhoneIcon class="icon-xs" /> +234 704 188 0339</a>
          <a href="mailto:hello@originelectricltd.com" class="top-link hidden-mobile"><MailIcon class="icon-xs" /> hello@originelectricltd.com</a>
        </div>
        <router-link to="/cart" class="top-cart">
          <ShoppingCartIcon class="icon-sm" /> 
          <span class="cart-text">Cart</span>
          <span class="cart-badge">{{ cartCount }}</span>
        </router-link>
      </div>
    </div>

    <!-- Main Header -->
    <header class="main-header" :class="{ 'header-scrolled': isScrolled, 'header-shrunk': isScrolled }">
    <div class="container header-content">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="brand-link">
          <img src="../assets/logo.png" alt="Origin Electric" class="logo-img" />
          <div class="brand-text">
            <div class="brand-name">ORIGIN ELECTRIC</div>
            <div class="brand-tagline">Power you can trust</div>
          </div>
        </router-link>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/marketplace">Marketplace</router-link></li>
          <li><router-link to="/blog">Blog</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </nav>

      <!-- Actions -->
      <div class="header-actions">
        <!-- Theme Toggle -->
        <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <component :is="isDark ? SunIcon : MoonIcon" class="icon" />
        </button>

        <!-- Account Pill -->
        <router-link :to="accountPath" class="account-pill">
          <UserIcon class="icon-sm" />
          <span class="desktop-only">Account</span>
        </router-link>
        
        <!-- Mobile Toggle -->
        <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle Menu">
          <div class="hamburger" :class="{ 'is-active': isMenuOpen }">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <Transition name="fade-slide">
      <div v-if="isMenuOpen" class="mobile-nav-overlay" @click="isMenuOpen = false">
        <div class="mobile-menu" @click.stop>
          <div class="mobile-menu-header">
            <img src="../assets/logo.png" alt="Origin Electric" class="logo-img" />
            <button class="close-btn" @click="isMenuOpen = false">
              <XIcon class="icon" />
            </button>
          </div>
          <ul class="mobile-links">
            <li><router-link to="/" @click="isMenuOpen = false"><HomeIcon class="icon-sm" /> Home</router-link></li>
            <li><router-link to="/marketplace" @click="isMenuOpen = false"><ShoppingBagIcon class="icon-sm" /> Marketplace</router-link></li>
            <li><router-link to="/blog" @click="isMenuOpen = false"><BookOpenIcon class="icon-sm" /> Blog</router-link></li>
            <li><router-link to="/contact" @click="isMenuOpen = false"><MailIcon class="icon-sm" /> Contact</router-link></li>
            <li><router-link :to="accountPath" @click="isMenuOpen = false"><UserIcon class="icon-sm" /> Account</router-link></li>
          </ul>
        </div>
      </div>
    </Transition>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import authService from '@/services/auth.service';

const route = useRoute();
import { 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  User as UserIcon, 
  X as XIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Calculator as CalculatorIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  ShoppingCart as ShoppingCartIcon,
  BookOpen as BookOpenIcon,
  MessageSquare as MessageSquareIcon
} from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';

const { cartCount } = useCart();

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const isDark = ref(false);
const isAuthenticated = ref(false);
const scrollY = ref(0);

const accountPath = computed(() => isAuthenticated.value ? '/account' : '/login');

const handleScroll = () => {
  scrollY.value = window.scrollY;
  isScrolled.value = window.scrollY > 20;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
};

const checkAuth = () => {
  isAuthenticated.value = authService.isAuthenticated();
};

watch(() => route.path, () => {
  checkAuth();
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  checkAuth();
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.body.classList.add('dark-mode');
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.top-bar {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 8px 0;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  border-bottom: 1px solid var(--border-color);
  /* Slide-up hide on scroll — driven by max-height transition */
  overflow: hidden;
  max-height: 44px;
  transition: max-height 0.35s var(--transition-bounce), opacity 0.3s ease, padding 0.35s ease;
  opacity: 1;
}

/* When header is scrolled, top bar collapses */
.header-wrapper.is-scrolled .top-bar {
  max-height: 0;
  padding: 0;
  opacity: 0;
  border-bottom-color: transparent;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info {
  display: flex;
  gap: 1.5rem;
}

.top-link {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: color 0.2s;
}

.top-link:hover {
  color: var(--text-primary);
}

.top-cart {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 5px 14px;
  border-radius: var(--radius-full);
  background: var(--color-blue-primary);
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 102, 204, 0.25);
  text-decoration: none;
}

.top-cart:hover {
  background: var(--color-blue-dark);
  transform: translateY(-1px);
}

.cart-badge {
  background: #f97316;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  min-width: 14px;
  text-align: center;
}

.main-header {
  position: relative;
  width: 100%;
  padding: var(--space-sm) 0;
  /* Smooth transition for all scroll-driven changes */
  transition:
    padding 0.35s var(--transition-bounce),
    background 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    backdrop-filter 0.3s ease;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  will-change: padding, box-shadow;
}

/* Scroll state: deep blur + shadow — screenshot pattern */
.header-scrolled {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.04),
    0 4px 20px -4px rgba(0, 0, 0, 0.06);
}

.dark-mode .header-scrolled {
  background: rgba(2, 4, 8, 0.85);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-bottom: 1px solid rgba(22, 27, 34, 0.8);
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.3),
    0 4px 20px -4px rgba(0, 0, 0, 0.4);
}

/* Shrunk state: tighter vertical padding when scrolled */
.header-shrunk {
  padding: 0.5rem 0;
}

.header-shrunk .logo-img {
  height: 34px;
}

.header-shrunk .brand-name {
  font-size: 0.95rem;
}

.header-shrunk .brand-tagline {
  display: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  min-width: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  min-width: 0;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-tagline {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo-img {
  height: 40px;
  width: auto;
  transition: height 0.35s var(--transition-bounce), transform 0.3s var(--transition-bounce);
}

.logo-img:hover {
  transform: scale(1.05);
}

.desktop-nav {
  display: block;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.nav-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  position: relative;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-full);
  letter-spacing: 0.01em;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s var(--transition-bounce);
}

.nav-links a:hover {
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}

.dark-mode .nav-links a:hover {
  background: rgba(255, 255, 255, 0.06);
}

/* Active state — filled pill */
.nav-links a.router-link-active {
  color: var(--color-blue-primary);
  background: rgba(0, 102, 204, 0.08);
  font-weight: 700;
}

/* Active indicator: bottom dot */
.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  background: var(--color-blue-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s var(--transition-bounce);
}

.nav-links a:hover.router-link-active::after {
  width: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  padding: 9px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    transform 0.4s var(--transition-bounce);
}

.theme-toggle:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--color-blue-primary);
  transform: rotate(20deg) scale(1.05);
}

.account-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-blue-primary);
  color: white;
  padding: 0.5rem 1.125rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.01em;
  transition:
    background 0.25s ease,
    transform 0.3s var(--transition-bounce),
    box-shadow 0.3s ease;
  box-shadow: 0 4px 14px -3px rgba(0, 102, 204, 0.45);
}

.account-pill:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px -6px rgba(0, 102, 204, 0.55);
  background: var(--color-blue-dark);
}

/* Shrunk state: tighter pill */
.header-shrunk .account-pill {
  padding: 0.4375rem 1rem;
  font-size: 0.8rem;
}

.icon { width: 22px; height: 22px; }
.icon-sm { width: 20px; height: 20px; }

.menu-toggle {
  display: none;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  width: 44px;
  height: 44px;
  display: none; /* Hidden by default, shown in media query */
  align-items: center;
  justify-content: center;
}

@media (max-width: 992px) {
  .menu-toggle { display: flex; }
}

.hamburger {
  width: 22px;
  height: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all var(--transition-speed);
}

.hamburger.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.is-active span:nth-child(2) { opacity: 0; }
.hamburger.is-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile Menu Styles */
.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

.mobile-menu {
  width: 80%;
  max-width: 340px;
  height: 100%;
  background: var(--bg-primary);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: -12px 0 48px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* Subtle inner border */
  border-left: 1px solid var(--border-color);
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.close-btn {
  background: var(--bg-secondary);
  border: none;
  padding: 10px;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-links a {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.25s var(--transition-bounce);
}

.mobile-links a:hover {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  transform: translateX(4px);
}

.mobile-links a.router-link-active {
  background: rgba(0, 102, 204, 0.08);
  color: var(--color-blue-primary);
  border-color: rgba(0, 102, 204, 0.15);
  font-weight: 700;
}

/* Transitions */
.fade-slide-enter-active {
  transition: all 0.4s var(--transition-bounce);
}

.fade-slide-leave-active {
  transition: all 0.3s ease-in;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Overlay fade only (not the panel) */
.mobile-nav-overlay.fade-slide-enter-from {
  background: transparent;
}

.mobile-nav-overlay.fade-slide-leave-to {
  background: transparent;
}

/* Responsive */
@media (max-width: 992px) {
  .main-header {
    padding: var(--space-xs) 0;
  }
  
  .header-content {
    padding: 0 var(--space-sm);
  }

  .brand-name {
    font-size: 0.85rem;
  }
  
  .brand-tagline {
    font-size: 0.6rem;
  }

  .desktop-nav { display: none; }
  .menu-toggle { display: flex; }
  .desktop-only { display: none; }
  .account-pill { padding: 10px; border-radius: 50%; }
  .hidden-mobile { display: none; }
  .cart-text { display: none; }
}
</style>
