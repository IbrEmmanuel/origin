<template>
  <div class="home">
    <h1>Home Page</h1>
    <div class="icons">
      <p>Lucide Icons Example:</p>
      <HomeIcon :size="24" />
      <UserIcon :size="24" />
    </div>
  </div>
</template>

<script setup>
import { Home as HomeIcon, User as UserIcon } from 'lucide-vue-next'
</script>

<style scoped>
.icons {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
