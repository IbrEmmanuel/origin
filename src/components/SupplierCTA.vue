<template>
  <section class="supplier-cta-section">
    <div class="cta-minimal">
       <div class="cta-left">
          <StoreIcon class="icon-md cta-icon" />
          <div class="cta-text">
             <h3 class="cta-title">Are you a supplier?</h3>
             <p class="cta-subtitle">Grow your business by joining our verified vendor network.</p>
          </div>
       </div>
       <router-link to="/vendor-apply" class="cta-link">
          <span>Get Started</span>
          <ArrowRightIcon class="icon-sm" />
       </router-link>
    </div>
  </section>
</template>

<script setup>
import { Store as StoreIcon, ArrowRight as ArrowRightIcon } from 'lucide-vue-next';
</script>

<style scoped>
.supplier-cta-section {
  margin-top: 4rem;
  padding: 0 1rem;
}

.cta-minimal {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  transition: all 0.3s ease;
}

.cta-minimal:hover {
  border-color: var(--color-blue-primary);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
}

.cta-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.cta-icon {
  color: var(--color-blue-primary);
  background: var(--bg-primary);
  padding: 10px;
  border-radius: 12px;
  width: 44px;
  height: 44px;
}

.cta-text {
  display: flex;
  flex-direction: column;
}

.cta-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.cta-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.cta-link {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-blue-primary);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.cta-link:hover {
  background: var(--color-blue-dark);
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .cta-minimal {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;
    gap: 1.5rem;
  }
  
  .cta-left {
    flex-direction: column;
  }
  
  .cta-link {
    width: 100%;
    justify-content: center;
  }
}
</style>
