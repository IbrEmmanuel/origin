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
  border-radius: var(--radius-lg);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  transition: all var(--transition-bounce);
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
  border-radius: var(--radius-md);
  width: 44px;
  height: 44px;
}

.cta-text {
  display: flex;
  flex-direction: column;
}

.cta-title {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.cta-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0em;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-blue-primary);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0em;
  text-decoration: none;
  transition: all var(--transition-bounce);
  white-space: nowrap;
  box-shadow: 0 8px 20px -5px rgba(0, 102, 204, 0.3);
}

.cta-link:hover {
  background: var(--color-blue-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
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
