<template>
  <div class="services-view">
    <!-- Header -->
    <header class="page-header bg-gradient">
      <div class="container text-center">
        <h1 class="page-title">Our <span class="grad-blue">Services</span></h1>
        <p class="section-desc mx-auto">We provide comprehensive engineering integrations spanning solar energy, high-end security monitoring, access control, and mechanical/electrical designs.</p>
      </div>
    </header>

    <!-- Services Grid -->
    <section class="services-grid-section">
      <div class="container">
        <h2 class="section-title text-center">In-House <span class="grad-blue">End-to-End</span> Services</h2>
        <p class="section-desc mx-auto text-center mb-12">Designed to bring safety, reliability, and modern efficiency to homes and businesses alike.</p>
        
        <div class="services-grid mt-8">
          <div class="service-card glass-card">
            <div class="service-icon grad-blue">
              <SunIcon class="icon-lg" />
            </div>
            <h3>Solar Energy Solutions</h3>
            <p>Reliable power for homes and industries. We handle design, installation, and maintenance of rooftop and ground systems.</p>
          </div>
          <div class="service-card glass-card">
            <div class="service-icon grad-orange">
              <CctvIcon class="icon-lg" />
            </div>
            <h3>CCTV & Surveillance</h3>
            <p>Advanced security systems ensuring round-the-clock protection with IP/Analog cameras and smart monitoring.</p>
          </div>
          <div class="service-card glass-card">
            <div class="service-icon grad-blue">
              <AuthIcon class="icon-lg" />
            </div>
            <h3>Access Control</h3>
            <p>Efficient security management using biometric, RFID, and automated gate technologies for organizations.</p>
          </div>
          <div class="service-card glass-card">
            <div class="service-icon grad-orange">
              <FireIcon class="icon-lg" />
            </div>
            <h3>Fire Detection</h3>
            <p>Reliable alarm systems built for speed and accuracy to protect lives and assets across all facilities.</p>
          </div>
          <div class="service-card glass-card">
            <div class="service-icon grad-blue">
              <WindIcon class="icon-lg" />
            </div>
            <h3>Wind Turbine</h3>
            <p>Sustainable wind energy solutions designed for efficiency and reliability to complement your power needs.</p>
          </div>
          <div class="service-card glass-card">
            <div class="service-icon grad-orange">
              <PenToolIcon class="icon-lg" />
            </div>
            <h3>M&E Drawing</h3>
            <p>Mechanical & Electrical Protective Drawings, including engineering layouts, protection designs, and technical drafting services.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed "What We Do" Sections -->
    <section class="details-section bg-secondary">
      <div class="container">
        <h2 class="section-title text-center">Detailed Solutions Breakdown</h2>
        <p class="section-desc mx-auto text-center mb-12">Learn more about the engineering details and customized specifications we deliver.</p>

        <!-- Solar detailed -->
        <div class="detail-block mb-16">
          <div class="block-header">
            <SunIcon class="icon-md grad-blue" />
            <h3>Solar Solutions Breakdown</h3>
          </div>
          <div class="details-grid">
            <div class="detail-card glass-card">
              <h4>Rooftop Arrays</h4>
              <p>Customized solar solutions designed specifically for KlipLok, IBR, tile, or flat concrete roof surfaces, maximizing available space and energy yield outcomes.</p>
            </div>
            <div class="detail-card glass-card">
              <h4>Ground Mounted Systems</h4>
              <p>Turnkey grid-scale and industrial solar fields, covering full technical design, robust site construction, foundation laying, and long-term O&M schedules.</p>
            </div>
            <div class="detail-card glass-card">
              <h4>Solar Car Ports</h4>
              <p>Efficient utilization of outdoor commercial and residential parking bays to provide shelter and shade for vehicles while generating high-yield clean electricity.</p>
            </div>
            <div class="detail-card glass-card">
              <h4>Greenfield Project Development</h4>
              <p>Ground-up solar farm developments (100kW up to 100MW projects) specifically built to sustain clean power grids for industrial estates and community setups.</p>
            </div>
          </div>
        </div>

        <!-- CCTV detailed -->
        <div class="detail-block mb-16">
          <div class="block-header">
            <CctvIcon class="icon-md grad-orange" />
            <h3>Surveillance Systems Breakdown</h3>
          </div>
          <div class="details-grid-2">
            <div class="detail-card glass-card">
              <h4>IP Security Systems</h4>
              <p>High-definition digital security networks powered by smart AI capabilities. Features automatic object classification, human/vehicle detection, facial recognition, and crisp high-megapixel lenses for future-proof security.</p>
            </div>
            <div class="detail-card glass-card">
              <h4>Analogue & HD CCTV</h4>
              <p>Cost-effective and resilient analogue/HD layouts tailored for smaller layouts, budgets, or retrofit upgrades, ensuring stable video capturing without complex IT network overheads.</p>
            </div>
          </div>
        </div>

        <!-- Access Control detailed -->
        <div class="detail-block">
          <div class="block-header">
            <ShieldIcon class="icon-md grad-blue" />
            <h3>Access Control & Perimeter Breakdown</h3>
          </div>
          <div class="details-grid-3">
            <div class="detail-card glass-card">
              <AuthIcon class="icon-sm" />
              <h4>Biometrics & RFID</h4>
              <p>Card readers, fingerprint scanners, and facial biometric terminals for high-security entry access tracking and staff attendance reporting.</p>
            </div>
            <div class="detail-card glass-card">
              <PlusIcon class="icon-sm text-orange" />
              <h4>Gate Automation</h4>
              <p>Automated gate controls and barriers configured to manage vehicle ingress/egress securely for residential complexes and commercial sites.</p>
            </div>
            <div class="detail-card glass-card">
              <ZapIcon class="icon-sm" />
              <h4>Electric Fencing</h4>
              <p>High-tension perimeter security fences complete with voltage monitoring and automated alarms linked directly to regional control centers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Load Calculator CTA -->
    <section class="cta-section bg-gradient text-center py-16">
      <div class="container">
        <h2>Unsure about your power requirements?</h2>
        <p class="max-w-600 mx-auto text-secondary mt-4">Use our intelligent load calculator to estimate your appliance loads and receive custom systems recommendation within minutes.</p>
        <div class="cta-buttons">
          <router-link to="/load-audit" class="btn btn-primary">
            Launch Load Calculator
          </router-link>
          <router-link to="/contact" class="btn btn-secondary ml-4">
            Request Custom Quote
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  Sun as SunIcon, 
  Cctv as CctvIcon,
  Fingerprint as AuthIcon,
  FlameKindling as FireIcon, 
  Plus as PlusIcon,
  Zap as ZapIcon,
  ShieldCheck as ShieldIcon,
  Wind as WindIcon,
  PenTool as PenToolIcon
} from 'lucide-vue-next';
</script>

<style scoped>
.services-view {
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

.services-grid-section {
  padding: var(--space-xl) 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.service-card {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-blue-primary);
}

.service-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-sm);
  color: var(--color-blue-primary);
  background: var(--color-blue-light);
}

.service-icon.grad-orange {
  color: var(--color-orange-primary);
  background: var(--color-orange-light);
}

.service-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.service-card p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Detail Sections */
.details-section {
  padding: var(--space-xl) 0;
}

.detail-block {
  text-align: left;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--space-md);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--space-xs);
}

.block-header h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.icon-md {
  width: 28px;
  height: 28px;
}

.icon-sm {
  width: 24px;
  height: 24px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.details-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.details-grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-color: var(--border-color);
  transition: all 0.25s;
}

.detail-card:hover {
  border-color: var(--color-blue-primary);
  transform: translateY(-2px);
}

.detail-card svg {
  color: var(--color-blue-primary);
  margin-bottom: 4px;
}

.detail-card svg.text-orange {
  color: var(--color-orange-primary);
}

.detail-card h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.detail-card p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
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

.mb-16 {
  margin-bottom: 3.5rem;
}
</style>
