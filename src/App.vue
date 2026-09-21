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
    p === '/sales-chat'
  );
});
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

/* Push footer/content above the mobile bottom nav */
@media (max-width: 992px) {
  .main-content.has-bottom-nav {
    padding-bottom: 62px;
  }
}

/* Ensure font family is applied universally if not already */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
