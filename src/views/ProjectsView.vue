<template>
  <div class="projects-view">
    <!-- Header -->
    <header class="page-header bg-gradient">
      <div class="container text-center">
        <h1 class="page-title">Our <span class="grad-orange">Projects</span></h1>
        <p class="section-desc mx-auto">Explore some of our successfully delivered solar energy, automated access, and smart security installations across Nigeria.</p>
      </div>
    </header>

    <!-- Projects Grid Section -->
    <section class="projects-grid-section">
      <div class="container">
        <h2 class="section-title text-center">Featured <span class="grad-blue">Success Stories</span></h2>
        <p class="section-desc mx-auto text-center mb-12">Providing clean power grids, advanced surveillance tracking, and infrastructure upgrades for government, commercial, and residential spaces.</p>

        <div class="projects-grid mt-8">
          <!-- Ondo Project -->
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectOndoImg" alt="Ondo Solar Installation" class="project-img" />
              <span class="project-tag">Solar Plant</span>
            </div>
            <div class="project-body">
              <h3>Ondo Solar installation</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>85 kWh</strong> Capacity</div>
                <div class="p-stat"><strong>247 tons</strong> CO2 Sav./yr</div>
              </div>
              <p class="project-desc">A premium off-grid solar installation designed for Mr. Festus in Ondo State, delivering high-performance electricity yield and achieving substantial carbon reductions.</p>
            </div>
          </div>

          <!-- Ibadan Security Project -->
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectGofamintImg" alt="Ibadan CCTV Installation" class="project-img" />
              <span class="project-tag">CCTV</span>
            </div>
            <div class="project-body">
              <h3>Ibadan CCTV Installation</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>40 Cameras</strong> Setup</div>
                <div class="p-stat"><strong>AI Enabled</strong> Monitoring</div>
              </div>
              <p class="project-desc">A comprehensive closed-circuit security surveillance setup deployed for GOFAMINT Printing Press Bookshop in Ibadan, implementing smart threat detection and remote monitoring feeds.</p>
            </div>
          </div>

          <!-- Abuja FCDA Project -->
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectFcdaImg" alt="Abuja FCDA Project" class="project-img" />
              <span class="project-tag">Government</span>
            </div>
            <div class="project-body">
              <h3>Abuja FCDA Energy Plant</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>58 kWh</strong> Capacity</div>
                <div class="p-stat"><strong>₦62M</strong> Secured Value</div>
              </div>
              <p class="project-desc">A high-capacity energy infrastructure project delivered to ensure seamless power and support continuous operations for the Federal Capital Development Authority (FCDA) in Abuja.</p>
            </div>
          </div>

          <!-- Ibadan Residential Project -->
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectJudgeImg" alt="Ibadan Residential Solar" class="project-img" />
              <span class="project-tag">Residential</span>
            </div>
            <div class="project-body">
              <h3>Ibadan Residential Solar</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>3.5 kW</strong> Inverter</div>
                <div class="p-stat"><strong>24/7</strong> Stable Power</div>
              </div>
              <p class="project-desc">A hybrid residential solar backup solution configured for a premium home in Ibadan, ensuring round-the-clock electrical uptime and lowering monthly utility grid costs.</p>
            </div>
          </div>

          <!-- Ife Residential Project -->
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectIfeImg" alt="Ife Residential Solar" class="project-img" />
              <span class="project-tag">Residential</span>
            </div>
            <div class="project-body">
              <h3>Ife Residential Project</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>5 kW</strong> Inverter</div>
                <div class="p-stat"><strong>15 kWh</strong> Battery Bank</div>
              </div>
              <p class="project-desc">A clean, high-capacity hybrid solar installation delivering stable, round-the-clock electricity backups for a premium residential building in Ile-Ife, Osun State.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Request Installer Call Action -->
    <section class="cta-section bg-gradient text-center py-16">
      <div class="container">
        <h2>Want a custom installation for your space?</h2>
        <p class="max-w-600 mx-auto text-secondary mt-4">Submit a quick request to link up with our professional engineers and get an instant custom quote via WhatsApp.</p>
        <div class="cta-buttons">
          <button @click="triggerInstallerRequest" class="btn btn-primary">
            Request Installer Now
          </button>
          <router-link to="/load-audit" class="btn btn-secondary ml-4">
            Run Load Audit First
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Import project assets
import projectOndoImg from '../assets/pdf-assets/project-ondo.jpg';
import projectGofamintImg from '../assets/pdf-assets/project-gofamint.jpg';
import projectFcdaImg from '../assets/pdf-assets/project-fcda.jpg';
import projectJudgeImg from '../assets/pdf-assets/project-judge.jpg';
import projectIfeImg from '../assets/pdf-assets/project-ife.jpg';

const triggerInstallerRequest = () => {
  // Dispatches a global custom event to open the RequestInstallerFAB modal dialog
  window.dispatchEvent(new CustomEvent('open-installer-modal'));
};
</script>

<style scoped>
.projects-view {
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

.projects-grid-section {
  padding: var(--space-xl) 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  text-align: left;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-blue-primary);
  box-shadow: var(--shadow-lg);
}

.project-img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-secondary);
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover .project-img {
  transform: scale(1.04);
}

.project-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--color-blue-primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-body h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

.project-stats {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 8px 0;
}

.p-stat {
  color: var(--text-secondary);
}

.p-stat strong {
  color: var(--color-blue-primary);
  font-weight: 700;
}

.project-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
}

/* Call to Action */
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
