<template>
  <div class="app-container">
    <Header v-if="!isAccountPage" />
    <main class="main-content">
      <router-view />
    </main>
    <Footer v-if="!isAccountPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const route = useRoute();
const isAccountPage = computed(() => route.path.startsWith('/account'));
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
