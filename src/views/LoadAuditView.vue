<template>
  <div class="load-audit-page bg-premium">
    <div class="container page-padding">
      <div class="text-center intro-section">
        <h1 class="section-title">Smart <span class="grad-blue">Load Audit</span></h1>
        <p class="section-desc centered">Precision energy profiling for your residence or business. Our intelligent engine calculates your exact needs to guarantee zero downtime.</p>
      </div>
      
      <LoadAuditCalculator />
    </div>
  </div>
</template>

<script setup>
import LoadAuditCalculator from '../components/LoadAuditCalculator.vue';
</script>

<style scoped>
.load-audit-page {
  min-height: 100vh;
  padding-bottom: var(--space-xl);
}

.bg-premium {
  background: radial-gradient(circle at 10% 10%, rgba(0, 102, 204, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 90%, rgba(255, 153, 0, 0.05) 0%, transparent 40%);
}

.page-padding { 
  padding: var(--space-xl) var(--space-md); 
}

@media (max-width: 768px) {
  .page-padding {
    padding: var(--space-lg) var(--space-sm);
  }
}

.intro-section { 
  margin-bottom: var(--space-lg); 
}

@media (max-width: 768px) {
  .section-title {
    font-size: clamp(1.75rem, 7vw, 2.25rem);
    line-height: 1.1;
  }
  .section-desc {
    font-size: 1rem;
    padding: 0 var(--space-xs);
  }
}

.pb-xl { padding-bottom: var(--space-xl); }

.centered { margin-left: auto; margin-right: auto; }

.badge-premium {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  border-radius: var(--radius-full);
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
}
</style>
