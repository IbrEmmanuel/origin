<template>
  <div class="header-wrapper">
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
    <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
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
          <li><router-link to="/load-audit">Load Audit</router-link></li>
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
            <li><router-link to="/load-audit" @click="isMenuOpen = false"><CalculatorIcon class="icon-sm" /> Load Audit</router-link></li>
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
  BookOpen as BookOpenIcon
} from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';

const { cartCount } = useCart();

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const isDark = ref(false);
const isAuthenticated = ref(false);

const accountPath = computed(() => isAuthenticated.value ? '/account' : '/login');

const handleScroll = () => {
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
  padding: 10px 0;
  font-size: 0.85rem;
  font-weight: 400;
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
  gap: 8px;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 20px;
  background: var(--color-blue-primary);
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 102, 204, 0.3);
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
  transition: all var(--transition-speed);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.header-scrolled {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
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

.logo-img {
  height: 40px;
  width: auto;
  transition: transform var(--transition-speed);
}

.logo-img:hover {
  transform: scale(1.05);
}

.desktop-nav {
  display: block;
}

.nav-links {
  display: flex;
  gap: var(--space-md);
  align-items: center;
}

.nav-links a {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  position: relative;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  transition: all var(--transition-speed);
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-blue-primary);
  background: rgba(0, 102, 204, 0.05);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.theme-toggle {
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  padding: 10px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-speed);
  border: 1px solid var(--border-color);
}

.theme-toggle:hover {
  background: var(--color-blue-primary);
  color: white;
  transform: rotate(15deg);
  border-color: var(--color-blue-primary);
}

.account-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-blue-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.95rem;
  transition: all var(--transition-speed);
  box-shadow: 0 10px 20px -5px rgba(0, 102, 204, 0.3);
}

.account-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(0, 102, 204, 0.4);
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
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  gap: var(--space-sm);
}

.mobile-links a {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: all var(--transition-speed);
}

.mobile-links a:hover,
.mobile-links a.router-link-active {
  background: var(--color-blue-primary);
  color: white;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s var(--transition-bounce);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
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
    font-size: 0.95rem;
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
