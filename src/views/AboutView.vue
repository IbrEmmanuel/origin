<template>
  <div class="about-view">
    <!-- Header -->
    <header class="page-header bg-gradient">
      <div class="container text-center">
        <h1 class="page-title">About <span class="grad-blue">Us</span></h1>
        <p class="section-desc mx-auto">Learn more about our journey, engineering core values, and mission to deliver sustainable energy and robust safety infrastructures.</p>
      </div>
    </header>

    <!-- Company Story Section -->
    <section class="story-section">
      <div class="container grid-2">
        <div class="story-text">
          <h2 class="section-title text-left">Who We Are</h2>
          <p class="para-large">Origin Electric is a premier smart energy and security integration engineering company. We are committed to powering modern homes and industrial spaces with high-performance solar energy ecosystems, advanced CCTV surveillance networks, biometric access management systems, and fire detection safeguards.</p>
          <p class="para-default">Our approach merges cutting-edge technology, mechanical and electrical engineering layouts, and dedicated lifecycle support. We strive to assist individuals and commercial entities across Nigeria in transitioning smoothly to cleaner energy sources and achieving security peace of mind.</p>
        </div>
        <div class="story-image-wrapper glass-card">
          <img src="../assets/about_visual.png" alt="Origin Electric Smart Energy Installation" class="story-img" />
          <div class="story-image-overlay">
            <div class="overlay-badge">
              <ActivityIcon class="icon-xs" />
              <span>Smart Integration</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Process Section -->
    <section class="process-section bg-secondary">
      <div class="container">
        <h2 class="section-title text-center">Our Seamless <span class="grad-orange">Process</span></h2>
        <p class="section-desc mx-auto text-center mb-12">From auditing to support, we ensure a highly precise, custom-tailored execution cycle for every client.</p>
        <div class="process-steps mt-8">
          <div class="process-step">
            <div class="step-blob">01</div>
            <h4>Audit</h4>
            <p>Intelligent load profiling for your space using advanced metrics.</p>
          </div>
          <div class="process-step">
            <div class="step-blob">02</div>
            <h4>Design</h4>
            <p>Custom blueprinting and layout diagrams for maximum efficiency.</p>
          </div>
          <div class="process-step">
            <div class="step-blob">03</div>
            <h4>Install</h4>
            <p>Rapid, high-performance deployment with precision engineering care.</p>
          </div>
          <div class="process-step">
            <div class="step-blob">04</div>
            <h4>Support</h4>
            <p>Dedicated lifecycle maintenance, warranties, and quick updates.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title text-center">What Clients <span class="grad-blue">Say</span></h2>
        <div class="testimonial-grid mt-12">
          <div class="t-card glass-card">
            <div class="quote-icon"><QuoteIcon class="icon-sm" /></div>
            <p>"The 85kWh solar plant has significantly reduced our energy costs and carbon footprint. A truly professional installation."</p>
            <div class="t-author">
              <div class="t-avatar"><UserIcon class="icon-user" /></div>
              <div class="t-meta">
                <strong>Mr. Festus</strong>
                <span>Solar Client, Ondo</span>
              </div>
            </div>
          </div>
          <div class="t-card glass-card">
            <div class="quote-icon"><QuoteIcon class="icon-sm" /></div>
            <p>"The 40-camera CCTV setup is crisp and the AI features are extremely helpful for our facility security."</p>
            <div class="t-author">
              <div class="t-avatar orange"><UserIcon class="icon-user" /></div>
              <div class="t-meta">
                <strong>GOFAMINT Press</strong>
                <span>Industrial Client, Ibadan</span>
              </div>
            </div>
          </div>
          <div class="t-card glass-card">
            <div class="quote-icon"><QuoteIcon class="icon-sm" /></div>
            <p>"Reliable energy is critical for our operations. Origin Electric delivered a robust solution we can strictly count on."</p>
            <div class="t-author">
              <div class="t-avatar"><UserIcon class="icon-user" /></div>
              <div class="t-meta">
                <strong>FCDA Management</strong>
                <span>Government Partner, Abuja</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section bg-gradient text-center py-16">
      <div class="container">
        <h2>Ready to transition to Smart Energy?</h2>
        <p class="max-w-600 mx-auto text-secondary mt-4">Calculate your power needs now or talk to our experts for a personalized system design.</p>
        <div class="cta-buttons">
          <router-link to="/load-audit" class="btn btn-primary">
            Calculate Load
          </router-link>
          <router-link to="/contact" class="btn btn-secondary ml-4">
            Contact Us
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  Activity as ActivityIcon,
  Quote as QuoteIcon,
  User as UserIcon
} from 'lucide-vue-next';
</script>

<style scoped>
.about-view {
  padding-top: 0;
  padding-bottom: var(--space-xl);
}

.page-header {
  padding: var(--space-xl) 0 var(--space-lg);
  text-align: center;
  background: radial-gradient(circle at 50% 0%, var(--color-blue-light) 0%, transparent 70%);
}

.page-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.story-section {
  padding: var(--space-xl) 0;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
  align-items: center;
}

@media (min-width: 992px) {
  .grid-2 {
    grid-template-columns: 1.2fr 1fr;
  }
}

.story-text {
  text-align: left;
}

.section-title.text-left {
  text-align: left;
}

.para-large {
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.para-default {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Story Visual */
.story-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding: 0 !important;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--border-color);
}

.story-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--transition-bounce);
}

.story-image-wrapper:hover .story-img {
  transform: scale(1.05);
}

.story-image-overlay {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 2;
}

.overlay-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  box-shadow: var(--shadow-sm);
}

/* Process Section */
.process-section {
  padding: var(--space-xl) 0;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: start;
}

.process-step {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-blob {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  margin-bottom: var(--space-sm);
  border: 1px solid var(--glass-border);
  transition: all 0.3s;
}

.process-step:hover .step-blob {
  background: var(--color-blue-primary);
  color: white;
  transform: scale(1.05);
}

.process-line {
  flex: 1;
  height: 2px;
  background: var(--border-color);
  margin-top: 30px;
  min-width: 20px;
}

@media (max-width: 992px) {
  .process-line {
    display: none;
  }
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .process-steps {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

/* Testimonials Grid */
.testimonials-section {
  padding: var(--space-xl) 0;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .testimonial-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .testimonial-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

.t-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.quote-icon {
  color: var(--color-blue-primary);
  opacity: 0.2;
  margin-bottom: var(--space-sm);
}

.t-card p {
  font-style: italic;
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  flex-grow: 1;
}

.t-author {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-sm);
}

.t-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.t-avatar.orange {
  background: var(--color-orange-light);
  color: var(--color-orange-primary);
}

.t-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.t-meta strong {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.t-meta span {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* CTA Buttons */
.cta-section {
  padding: 4rem 0;
}

.cta-section h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

.max-w-600 {
  max-width: 600px;
}

.py-16 {
  padding-top: 4rem;
  padding-bottom: 4rem;
}
</style>
