<template>
  <div class="content-section">
    <div class="section-card glass-card empty-state">
      <div class="empty-content">
        <CalendarIcon class="empty-icon" />
        <h3>No Consultations Yet</h3>
        <p>Get expert advice on solar and energy systems tailored to your needs.</p>
        <button class="btn btn-primary mt-4">Book New Consultation</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar as CalendarIcon } from 'lucide-vue-next';
</script>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 40px 20px;
  border-radius: 16px;
}

.empty-content {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  width: 56px;
  height: 56px;
  color: var(--text-secondary);
  opacity: 0.4;
  margin-bottom: 20px;
}

h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--color-blue-primary);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.mt-4 {
  margin-top: 8px;
}
</style>
