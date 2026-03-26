<template>
  <div class="success-page">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
    </div>
    
    <div class="container py-xl">
      <div class="success-content glass-card">
        <div class="hero-section">
          <div class="icon-ring">
            <CheckIcon class="success-icon" />
          </div>
          <h1 class="welcome-title">Success!</h1>
          <p class="subtitle">Your order has been placed and is now on our fulfillment desk.</p>
        </div>

        <div class="divider"></div>

        <div class="fulfillment-journey">
          <h3 class="journey-title text-center">Order Progress</h3>
          <div class="journey-timeline">
            <div class="timeline-step completed">
              <div class="step-dot"></div>
              <div class="step-label">Order Placed</div>
            </div>
            <div class="timeline-step active">
              <div class="step-dot"></div>
              <div class="step-label">Processing</div>
            </div>
            <div class="timeline-step">
              <div class="step-dot"></div>
              <div class="step-label">Dispatch</div>
            </div>
            <div class="timeline-step">
              <div class="step-dot"></div>
              <div class="step-label">Delivered</div>
            </div>
          </div>
        </div>

        <div class="action-grid mt-4">
          <router-link to="/account/orders" class="action-card">
            <PackageIcon class="action-icon" />
            <div class="action-info">
              <h4>Order Dashboard</h4>
              <p>Review delivery status and order history</p>
            </div>
          </router-link>
          
          <router-link to="/marketplace" class="action-card highlight">
            <ShoppingBagIcon class="action-icon" />
            <div class="action-info">
              <h4>Fell inspired?</h4>
              <p>Continue exploring our latest solar deals</p>
            </div>
          </router-link>
        </div>
        
        <div class="footer-msg mt-4 text-center">
            <p>A confirmation email has been sent to your registered address.</p>
            <router-link to="/" class="text-link mt-2">Back to Homepage</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check as CheckIcon, Package as PackageIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-vue-next';
</script>

<style scoped>
.success-page {
  padding-top: 100px;
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.background-blobs {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  width: 500px; height: 500px;
  filter: blur(80px);
  border-radius: 50%;
  opacity: 0.1;
}

.blob-1 { top: -100px; right: -100px; background: var(--color-blue-primary); }

.success-content {
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 40px;
  padding: 4rem 3rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 32px;
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-ring {
  width: 100px; height: 100px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  margin-bottom: 2rem;
  animation: scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleUp {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-icon { width: 48px; height: 48px; stroke-width: 3; }

.welcome-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 400px;
  margin: 1rem auto;
}

.divider {
  height: 1px;
  background: var(--border-color);
  margin: 3rem 0;
  opacity: 0.5;
}

.journey-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-weight: 800;
}

.journey-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 20px;
}

.journey-timeline::before {
  content: '';
  position: absolute;
  top: 15px; left: 40px; right: 40px;
  height: 2px;
  background: var(--border-color);
  z-index: 0;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
  width: 100px;
}

.step-dot {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  transition: all 0.3s;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.timeline-step.completed .step-dot {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.timeline-step.active .step-dot {
  background: var(--color-blue-primary);
  border-color: var(--color-blue-primary);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0, 102, 204, 0.4);
}

.timeline-step.active .step-label {
  color: var(--color-blue-primary);
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 4rem;
  margin-bottom: 3rem;
}

.action-card {
  display: flex;
  gap: 1.25rem;
  text-align: left;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-blue-primary);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
}

.action-card.highlight {
  background: var(--color-blue-primary);
}
.action-card.highlight h4, 
.action-card.highlight p, 
.action-card.highlight .action-icon {
  color: white;
}
.action-card.highlight .action-icon { background: rgba(255, 255, 255, 0.15); }

.action-icon {
  width: 48px; height: 48px;
  padding: 12px;
  background: var(--bg-secondary);
  color: var(--color-blue-primary);
  border-radius: 14px;
  flex-shrink: 0;
}

.action-info h4 { margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 800; color: var(--text-primary); }
.action-info p { margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4; }

.footer-msg p { color: var(--text-secondary); font-size: 0.95rem; }
.text-link { display: inline-block; color: var(--color-blue-primary); font-weight: 700; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.2s; }
.text-link:hover { border-bottom-color: var(--color-blue-primary); }

@media (max-width: 768px) {
  .success-page { padding-top: 60px; padding-bottom: 80px; }
  .success-page :deep(.container) { padding-left: 0 !important; padding-right: 0 !important; max-width: 100% !important; }
  .success-content { padding: 3rem 1.25rem; margin: 0; margin-bottom: 0px; border-radius: 0; border-left: none; border-right: none; width: 100%; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); }
  .action-grid { grid-template-columns: 1fr; margin-top: 3rem; margin-bottom: 2.5rem; }
  .welcome-title { font-size: 2.2rem; }
  .journey-timeline { padding: 0 5px; }
  .journey-timeline::before { left: 20px; right: 20px; }
  .timeline-step { width: auto; flex: 1; }
  .step-label { font-size: 0.7rem; }
}
</style>
