<template>
  <div class="app-container">
    <Header v-if="!hideGlobalLayout" />
    <main class="main-content" :class="{ 'is-standalone': hideGlobalLayout }">
      <router-view />
    </main>
    <Footer v-if="!hideGlobalLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const route = useRoute();
const hideGlobalLayout = computed(() => {
  return route.path.startsWith('/account') || route.path === '/origin-talk';
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

/* Ensure font family is applied universally if not already */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
