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
/* ── Header wrapper ── */
.header-wrapper {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  z-index: 1000;
}

/* ── Top bar ── */
.top-bar {
  background: var(--color-beige);
  border-bottom: 1px solid var(--border-color);
  padding: 7px 0;
  font-family: var(--font-main);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  overflow: hidden;
  max-height: 40px;
  opacity: 1;
  transition:
    max-height 0.35s var(--transition-bounce),
    opacity 0.28s ease,
    padding 0.35s ease;
}

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

.contact-info { display: flex; gap: 1.25rem; }

.top-link {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  transition: color 0.18s;
}
.top-link:hover { color: var(--text-primary); }

.top-cart {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-xs);
  background: var(--color-primary);
  color: #fff;
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: background 0.18s ease, transform 0.2s var(--transition-bounce);
  box-shadow: 0 2px 8px -2px rgba(255,118,0,0.35);
}
.top-cart:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

.cart-badge {
  background: var(--color-dark);
  color: var(--color-light);
  padding: 1px 6px;
  border-radius: var(--radius-xs);
  font-size: 0.68rem;
  font-weight: 700;
  min-width: 14px;
  text-align: center;
}

/* ── Main header ── */
.main-header {
  position: relative;
  width: 100%;
  padding: 10px 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  transition:
    padding 0.3s var(--transition-bounce),
    background 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
  will-change: padding, box-shadow;
}

.header-scrolled {
  background: rgba(255,253,250,0.88);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-bottom: 1px solid var(--color-cream-200);
  box-shadow: 0 1px 0 rgba(47,47,47,0.04), 0 4px 16px -4px rgba(47,47,47,0.07);
}

.dark-mode .header-scrolled {
  background: rgba(20,18,16,0.9);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border-bottom: 1px solid var(--color-cream-200);
  box-shadow: 0 1px 0 rgba(0,0,0,0.3), 0 4px 16px -4px rgba(0,0,0,0.4);
}

.header-shrunk { padding: 10px 0; }
.header-shrunk .logo-img { height: 38px; }
.header-shrunk .brand-name { font-size: 1rem; }

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ── Logo / Brand ── */
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
  font-family: var(--font-main);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-tagline {
  font-family: var(--font-main);
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.logo-img {
  height: 38px;
  width: auto;
  transition: height 0.3s var(--transition-bounce), transform 0.25s var(--transition-bounce);
}
.logo-img:hover { transform: scale(1.04); }

/* ── Desktop nav ── */
.desktop-nav { display: block; }

.nav-links {
  display: flex;
  gap: 2px;
  align-items: center;
}

.nav-links a {
  font-family: var(--font-main);
  font-size: 0.83rem;
  font-weight: 500;
  color: var(--text-secondary);
  position: relative;
  padding: 6px 14px;
  border-radius: var(--radius-xs);
  letter-spacing: 0.01em;
  transition: color 0.18s ease, background 0.18s ease;
}

.nav-links a:hover {
  color: var(--text-primary);
  background: var(--color-cream-200);
}

.nav-links a.router-link-active {
  color: var(--color-primary);
  background: rgba(255,118,0,0.08);
  font-weight: 600;
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-xs);
  transition: width 0.25s var(--transition-bounce);
}

.nav-links a:hover.router-link-active::after { width: 22px; }

/* ── Header actions ── */
.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  padding: 8px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.35s var(--transition-bounce);
}
.theme-toggle:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--color-primary);
  transform: rotate(18deg) scale(1.05);
}

.account-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--color-dark);
  color: var(--color-light);
  padding: 7px 16px;
  border-radius: var(--radius-xs);
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition:
    background 0.2s ease,
    transform 0.25s var(--transition-bounce),
    box-shadow 0.25s ease;
  box-shadow: 0 2px 8px -2px rgba(47,47,47,0.3);
}
.account-pill:hover {
  background: #444;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px -4px rgba(47,47,47,0.4);
}


.icon    { width: 20px; height: 20px; }
.icon-sm { width: 18px; height: 18px; }

/* ── Hamburger ── */
.menu-toggle {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xs);
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
}
@media (max-width: 992px) { .menu-toggle { display: flex; } }

.hamburger {
  width: 20px; height: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hamburger span {
  display: block;
  width: 100%; height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: all var(--transition-speed);
}
.hamburger.is-active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.hamburger.is-active span:nth-child(2) { opacity: 0; }
.hamburger.is-active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* ── Mobile menu overlay ── */
.mobile-nav-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100vh;
  background: rgba(47,47,47,0.35);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

.mobile-menu {
  width: 80%;
  max-width: 320px;
  height: 100%;
  background: var(--bg-primary);
  border-left: 1px solid var(--border-color);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: -8px 0 32px rgba(47,47,47,0.1);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.close-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 8px;
  border-radius: var(--radius-xs);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-links a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-xs);
  font-family: var(--font-main);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}
.mobile-links a:hover {
  background: var(--color-beige);
  border-color: var(--border-color);
}
.mobile-links a.router-link-active {
  background: rgba(255,118,0,0.08);
  color: var(--color-primary);
  border-color: rgba(255,118,0,0.18);
  font-weight: 600;
}

/* ── Slide transition ── */
.fade-slide-enter-active { transition: all 0.35s var(--transition-bounce); }
.fade-slide-leave-active  { transition: all 0.25s ease-in; }
.fade-slide-enter-from,
.fade-slide-leave-to      { opacity: 0; transform: translateX(100%); }
.mobile-nav-overlay.fade-slide-enter-from { background: transparent; }
.mobile-nav-overlay.fade-slide-leave-to   { background: transparent; }

/* ── Responsive ── */
@media (max-width: 992px) {
  .main-header     { padding: 8px 0; }
  .header-content  { padding: 0 var(--space-sm); }
  .brand-name      { font-size: 0.82rem; }
  .brand-tagline   { font-size: 0.58rem; }
  .desktop-nav     { display: none; }
  .desktop-only    { display: none; }
  .account-pill    { padding: 8px; border-radius: var(--radius-xs); }
  .hidden-mobile   { display: none; }
  .cart-text       { display: none; }
}
</style>
