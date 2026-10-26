<template>
  <div class="app-container">
    <Header v-if="!hideGlobalLayout" />
    <main class="main-content" :class="{ 'is-standalone': hideGlobalLayout, 'has-bottom-nav': !hideGlobalLayout }">
      <router-view />
    </main>
    <Footer v-if="!hideGlobalLayout" />
    <RequestInstallerFAB v-if="!hideGlobalLayout" />
    <FloatingActions v-if="!hideGlobalLayout" />
    <MobileBottomNav v-if="!hideGlobalLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import RequestInstallerFAB from './components/RequestInstallerFAB.vue';
import FloatingActions from './components/FloatingActions.vue';
import MobileBottomNav from './components/MobileBottomNav.vue';

const route = useRoute();
const hideGlobalLayout = computed(() => {
  const p = route.path.replace(/\/$/, '') || '/';
  return (
    p.startsWith('/account') ||
    p === '/origin-talk' ||
    p === '/sales-chat' ||
    p === '/login' ||
    p === '/signup' ||
    p === '/forgot-password' ||
    p === '/verify-email'
  );
});
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  min-width: 0;
  overflow-x: clip;
}

.main-content {
  flex: 1;
  min-width: 0;
}

/* Bottom padding for mobile nav is handled in global.css (includes safe-area) */

/* Ensure font family is applied universally if not already */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
