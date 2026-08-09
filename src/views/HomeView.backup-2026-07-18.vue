<template>
  <div class="home-view">
    <!-- HERO SECTION -->
    <section class="hero" id="home">
      <div class="hero-bg"></div>
      <svg class="circuit-line" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="circuit-path" d="M580 0 L580 80 L500 80 L500 160 L420 160 L420 120 L340 120 L340 200 L260 200 L260 140 L180 140 L180 260 L300 260 L300 340 L220 340 L220 420 L380 420 L380 360 L460 360 L460 480 L340 480 L340 560 L500 560 L500 640 L400 640 L400 720 L580 720 L580 800" style="animation-delay:0.3s"/>
        <path class="circuit-path" d="M480 0 L480 60 L560 60" style="animation-delay:0.6s"/>
        <path class="circuit-path" d="M220 260 L140 260 L140 360 L220 360" style="animation-delay:0.9s"/>
        <circle class="circuit-dot" cx="500" cy="80" r="4" style="animation-delay:0.8s"/>
        <circle class="circuit-dot" cx="340" cy="200" r="4" style="animation-delay:1.1s"/>
        <circle class="circuit-dot" cx="380" cy="420" r="4" style="animation-delay:1.4s"/>
        <circle class="circuit-dot" cx="500" cy="560" r="4" style="animation-delay:1.7s"/>
      </svg>

      <div class="container hero-container-layout">
        <div class="hero-content">
          <div class="hero-eyebrow">Nigeria's Energy Engineering Authority</div>
          <h1>Engineering <span class="highlight">Energy Independence</span> for Nigeria.</h1>
          <p class="hero-sub">We design, install, and maintain solar, BESS, security, and EV charging systems for businesses, institutions, and government — built to last, backed by engineering.</p>
          
          <div class="hero-actions">
            <router-link to="/load-audit" class="btn-primary">
              <CalculatorIcon class="btn-icon" />
              Get Free Energy Audit
            </router-link>
            <router-link to="/account/consultations" class="btn-secondary">
              <CalendarIcon class="btn-icon" />
              Book Consultation
            </router-link>
            <router-link to="/origin-talk" class="btn-ai-glow">
              <SparklesIcon class="btn-icon ai-icon" />
              Talk to Origin
            </router-link>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-card-stack">
            <div class="hero-main-card">
              <div class="hero-card-label">System Performance — Ibadan Commercial Site</div>
              <div class="hero-card-stat">98.4%</div>
              <div class="hero-card-desc">Grid uptime since installation</div>
              <div class="mini-chart">
                <div class="chart-bar" style="height:40%"></div>
                <div class="chart-bar" style="height:65%"></div>
                <div class="chart-bar" style="height:55%"></div>
                <div class="chart-bar" style="height:80%"></div>
                <div class="chart-bar" style="height:70%"></div>
                <div class="chart-bar" style="height:90%"></div>
                <div class="chart-bar" style="height:85%"></div>
                <div class="chart-bar" style="height:100%"></div>
              </div>
              <div class="hero-card-divider"></div>
              <div class="hero-status-row">
                <span class="status-dot"></span>
                <span>42 sites actively monitored — all nominal</span>
              </div>
            </div>
            <div class="hero-floating-card">
              <div class="float-card-num">1.2 MW</div>
              <div class="float-card-label">Total Installed Capacity</div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- SERVICES -->
    <section class="services" id="services">
      <div class="container">
        <div class="services-header reveal">
          <span class="section-eyebrow">What We Do</span>
          <h2 class="section-title text-left">End-to-end energy and security engineering</h2>
          <p class="section-sub text-left">From feasibility to commissioning, we handle every stage of your project with engineering discipline and long-term thinking.</p>
        </div>
        <div class="services-grid">
          <div class="service-card reveal">
            <div class="service-icon"><SunIcon /></div>
            <h3>Solar PV & BESS Systems</h3>
            <p>Grid-tied, off-grid and hybrid solar installations paired with lithium battery energy storage. We size systems precisely for your load profile and future growth.</p>
            <router-link to="/services" class="service-card-link">Learn more →</router-link>
          </div>
          <div class="service-card reveal">
            <div class="service-icon"><PenToolIcon /></div>
            <h3>M&E Engineering Drawings</h3>
            <p>Full mechanical and electrical design documentation to regulatory and international standards — for construction, compliance, and tender submissions.</p>
            <router-link to="/services" class="service-card-link">Learn more →</router-link>
          </div>
          <div class="service-card reveal">
            <div class="service-icon"><CctvIcon /></div>
            <h3>CCTV & Surveillance</h3>
            <p>IP camera networks, NVR/DVR systems, remote monitoring, and integrated video analytics for commercial, industrial, and government facilities.</p>
            <router-link to="/services" class="service-card-link">Learn more →</router-link>
          </div>
          <div class="service-card reveal">
            <div class="service-icon"><FingerprintIcon /></div>
            <h3>Access Control Systems</h3>
            <p>Biometric readers, card-based entry, boom barriers and integrated security management platforms. Scalable from a single entrance to campus-wide control.</p>
            <router-link to="/services" class="service-card-link">Learn more →</router-link>
          </div>
          <div class="service-card reveal">
            <div class="service-icon"><FlameIcon /></div>
            <h3>Fire Detection & Suppression</h3>
            <p>Design and installation of fire alarm systems, heat/smoke detectors, suppression systems, and emergency lighting compliant with NFPA and BS standards.</p>
            <router-link to="/services" class="service-card-link">Learn more →</router-link>
          </div>
          <div class="service-card reveal">
            <div class="service-icon"><WindIcon /></div>
            <h3>Wind Energy Solutions</h3>
            <p>Small-to-mid scale wind turbine installations, hybrid wind-solar systems, and site wind resource assessments for remote and off-grid locations.</p>
            <router-link to="/services" class="service-card-link">Learn more →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="process" id="process">
      <div class="container">
        <div class="process-header reveal">
          <span class="section-eyebrow">How We Work</span>
          <h2 class="section-title">A disciplined process. Every project, every time.</h2>
          <p class="section-sub text-center">We follow a rigorous four-stage methodology so nothing is guessed, and nothing is left to chance.</p>
        </div>
        <div class="process-steps reveal">
          <div class="process-step">
            <div class="step-num">01</div>
            <h3>Audit & Assess</h3>
            <p>We visit your site, measure your load, study your bills, and map your energy risks. No assumptions — only data.</p>
          </div>
          <div class="process-step">
            <div class="step-num">02</div>
            <h3>Engineer & Design</h3>
            <p>Our engineers produce detailed M&E drawings, sizing calculations, and a cost-benefit model. You approve before we touch a cable.</p>
          </div>
          <div class="process-step">
            <div class="step-num">03</div>
            <h3>Install & Commission</h3>
            <p>Certified technicians execute to spec. We commission every system, test every component, and hand over full documentation.</p>
          </div>
          <div class="process-step">
            <div class="step-num">04</div>
            <h3>Monitor & Support</h3>
            <p>Remote monitoring dashboard keeps you informed 24/7. Maintenance plans ensure your system performs for decades.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CASE STUDIES -->
    <section class="cases" id="cases">
      <div class="container">
        <div class="cases-header reveal">
          <div>
            <span class="section-eyebrow">Project Portfolio</span>
            <h2 class="section-title text-left">Success <span class="highlight">Stories</span></h2>
          </div>
          <router-link to="/projects" class="btn-secondary">View All Projects</router-link>
        </div>
        <div class="cases-grid">
          <!-- Ondo Installation -->
          <div class="case-card reveal">
            <div class="case-card-img-wrapper">
              <img :src="projectOndoImg" alt="Ondo Solar Installation" class="case-card-img-src" />
              <div class="case-tag-badge">Solar Plant</div>
            </div>
            <div class="case-card-body">
              <h3>Ondo Installation</h3>
              <div class="case-metrics-layout">
                <div><span class="case-metric-val">85 kWh</span><span class="case-metric-label">Capacity</span></div>
                <div><span class="case-metric-val">247 tons</span><span class="case-metric-label">CO2 Sav./yr</span></div>
              </div>
              <p>State-of-the-art solar plant for Mr. Festus, achieving significant carbon savings.</p>
            </div>
          </div>
          <!-- Ibadan Security -->
          <div class="case-card reveal">
            <div class="case-card-img-wrapper">
              <img :src="projectGofamintImg" alt="Ibadan CCTV Installation" class="case-card-img-src" />
              <div class="case-tag-badge">CCTV</div>
            </div>
            <div class="case-card-body">
              <h3>Ibadan Security</h3>
              <div class="case-metrics-layout">
                <div><span class="case-metric-val">40 Cameras</span><span class="case-metric-label">Setup</span></div>
                <div><span class="case-metric-val">Risk</span><span class="case-metric-label">Mitigated</span></div>
              </div>
              <p>Comprehensive CCTV network for GOFAMINT Printing Press Bookshop.</p>
            </div>
          </div>
          <!-- Abuja FCDA Project -->
          <div class="case-card reveal">
            <div class="case-card-img-wrapper">
              <img :src="projectFcdaImg" alt="Abuja FCDA Project" class="case-card-img-src" />
              <div class="case-tag-badge">Government</div>
            </div>
            <div class="case-card-body">
              <h3>Abuja FCDA Project</h3>
              <div class="case-metrics-layout">
                <div><span class="case-metric-val">58 kWh</span><span class="case-metric-label">Capacity</span></div>
                <div><span class="case-metric-val">₦62M</span><span class="case-metric-label">Sec. Value</span></div>
              </div>
              <p>Robust energy infrastructure delivered to sustain government operations.</p>
            </div>
          </div>
          <!-- Ibadan Residential -->
          <div class="case-card reveal">
            <div class="case-card-img-wrapper">
              <img :src="projectJudgeImg" alt="Ibadan Residential Solar" class="case-card-img-src" />
              <div class="case-tag-badge">Residential</div>
            </div>
            <div class="case-card-body">
              <h3>Ibadan Residential</h3>
              <div class="case-metrics-layout">
                <div><span class="case-metric-val">3.5 kW</span><span class="case-metric-label">System</span></div>
                <div><span class="case-metric-val">Stable</span><span class="case-metric-label">Power</span></div>
              </div>
              <p>Hybrid solar solution for a premium residence, ensuring 24/7 uptime.</p>
            </div>
          </div>
          <!-- Ife Residential Project -->
          <div class="case-card reveal">
            <div class="case-card-img-wrapper">
              <img :src="projectIfeImg" alt="Ife Residential Solar" class="case-card-img-src" />
              <div class="case-tag-badge">Residential</div>
            </div>
            <div class="case-card-body">
              <h3>Ife Residential Project</h3>
              <div class="case-metrics-layout">
                <div><span class="case-metric-val">5 kW</span><span class="case-metric-label">Capacity</span></div>
                <div><span class="case-metric-val">15 kWh</span><span class="case-metric-label">Backup</span></div>
              </div>
              <p>A clean hybrid solar installation delivering stable, round-the-clock power for a premium residence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST BAR -->
    <div class="trust-bar">
      <div class="container text-center">
        <div class="trust-bar-label">Trusted by forward-thinking organisations</div>
        <div class="trust-logos">
          <span class="trust-logo">FGN MINISTRY</span>
          <span class="trust-logo">OAU IFE</span>
          <span class="trust-logo">ONDO STATE GOVT</span>
          <span class="trust-logo">NESREA</span>
          <span class="trust-logo">REA</span>
          <span class="trust-logo">NAFDAC</span>
        </div>
      </div>
    </div>



    <!-- FINANCING -->
    <section class="financing" id="financing">
      <div class="container financing-inner">
        <div class="financing-content reveal">
          <span class="section-eyebrow">Flexible Financing</span>
          <h2 class="section-title text-left">Own your energy. Pay on your terms.</h2>
          <p class="section-sub text-left">Energy independence shouldn't be blocked by upfront cost. We've partnered with leading Nigerian banks and fintechs to give you flexible payment plans — so you can start saving from day one.</p>
          <ul class="financing-bullets">
            <li><CheckIcon class="bullet-check-icon" /> Plans from 12 to 60 months</li>
            <li><CheckIcon class="bullet-check-icon" /> Pre-approval in under 24 hours</li>
            <li><CheckIcon class="bullet-check-icon" /> No collateral for systems under ₦15m</li>
            <li><CheckIcon class="bullet-check-icon" /> Partner banks: Carbon, FairMoney, Sterling Bank</li>
          </ul>
        </div>
        <div class="financing-tool reveal">
          <div class="tool-title">Check Your Payment Plan</div>
          
          <div class="tool-label">System Type</div>
          <select class="tool-select" v-model="sysType">
            <option value="">Select system type…</option>
            <option value="solar">Solar PV Only</option>
            <option value="solarbess">Solar + BESS (Battery)</option>
            <option value="security">Security Systems (CCTV/Access)</option>
            <option value="full">Full Energy + Security Package</option>
          </select>
          
          <div class="tool-label">Estimated Budget (₦)</div>
          <input type="number" class="tool-input" v-model="budget" placeholder="e.g. 5,000,000" min="500000"/>
          
          <div class="tool-label">Preferred Tenure</div>
          <select class="tool-select" v-model="tenure">
            <option value="">Select tenure…</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
            <option value="60">60 months</option>
          </select>
          
          <button class="tool-btn" @click="calcPayment">Calculate My Plan</button>
          
          <div :class="['tool-result', { visible: showResult }]">
            <div v-for="(plan, idx) in resultPlans" :key="idx" class="result-plan">
              <div class="result-plan-name">{{ plan.name }}</div>
              <div class="result-plan-amount">{{ plan.amount }}/month</div>
              <div class="result-plan-term">{{ plan.term }}</div>
              <hr v-if="idx < resultPlans.length - 1" class="result-divider" />
            </div>
            <div class="mt-md text-center">
              <router-link to="/load-audit" class="btn-primary btn-sm-fit">Apply Now</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials" id="testimonials">
      <div class="container">
        <div class="testimonials-header reveal text-center">
          <span class="section-eyebrow">Client Voices</span>
          <h2 class="section-title">What our clients say</h2>
        </div>
        <div class="testimonials-grid">
          <div class="testi-card reveal">
            <div class="testi-stars"><StarIcon v-for="n in 5" :key="n" class="star" /></div>
            <p class="testi-quote">"Origin Electrical engineered an energy solution that has completely eliminated our generator costs. The installation was professional, the documentation thorough, and the monitoring app gives us total peace of mind."</p>
            <div class="testi-author">
              <div class="testi-avatar">AO</div>
              <div>
                <div class="testi-name">Adewale Okonkwo</div>
                <div class="testi-role">MD, Okonkwo Manufacturing Ltd — Ibadan</div>
              </div>
            </div>
          </div>
          <div class="testi-card reveal">
            <div class="testi-stars"><StarIcon v-for="n in 5" :key="n" class="star" /></div>
            <p class="testi-quote">"We awarded the campus energy contract to Origin after seeing their M&E drawings and engineering rigour. 18 months later, we have zero unplanned outages and our electricity bill has dropped 78%."</p>
            <div class="testi-author">
              <div class="testi-avatar">FK</div>
              <div>
                <div class="testi-name">Prof. Funmi Kassim</div>
                <div class="testi-role">Director of Works, Obafemi Awolowo University</div>
              </div>
            </div>
          </div>
          <div class="testi-card reveal">
            <div class="testi-stars"><StarIcon v-for="n in 5" :key="n" class="star" /></div>
            <p class="testi-quote">"The integrated CCTV and access control system has transformed our hospital's security posture. Their team understood the sensitivity of a healthcare environment and delivered accordingly."</p>
            <div class="testi-author">
              <div class="testi-avatar">BI</div>
              <div>
                <div class="testi-name">Dr. Bola Idowu</div>
                <div class="testi-role">CEO, Ondo State Teaching Hospital</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EV SECTION -->
    <section class="ev-section" id="ev">
      <div class="container ev-inner">
        <div class="ev-visual reveal">
          <div class="ev-icon"><ZapIcon class="ev-zap-icon" /></div>
          <h3>EV Charging Infrastructure</h3>
          <div class="ev-badge"><RocketIcon class="ev-badge-icon" /> First-Mover in Nigeria</div>
          <div class="ev-charging-pricing">
            <div class="ev-price-item">
              <div class="ev-price-label">Home Charger (AC)</div>
              <div class="ev-price-val">7 kW — from ₦350,000</div>
            </div>
            <div class="ev-price-item">
              <div class="ev-price-label">Commercial Fleet (AC)</div>
              <div class="ev-price-val">22 kW — from ₦1.2m</div>
            </div>
            <div class="ev-price-item">
              <div class="ev-price-label">Public Fast Charger (DC)</div>
              <div class="ev-price-val">50 kW — from ₦6.5m</div>
            </div>
          </div>
        </div>
        <div class="reveal">
          <span class="section-eyebrow">EV Charging Division</span>
          <h2 class="section-title text-left">Nigeria is going electric. We'll wire the infrastructure.</h2>
          <p class="section-sub text-left">As EV adoption accelerates, the charging infrastructure gap is Nigeria's biggest opportunity. Origin Electrical is positioning to be the dominant installer — bundled with our solar expertise for truly clean charging.</p>
          <div class="ev-features">
            <div class="ev-feature">
              <div class="ev-feature-icon"><HomeIcon class="ev-feat-icon" /></div>
              <div>
                <div class="ev-feature-title">Residential Home Chargers</div>
                <div class="ev-feature-desc">AC wall-box chargers with smart scheduling and solar integration. Charge overnight on your own solar energy.</div>
              </div>
            </div>
            <div class="ev-feature">
              <div class="ev-feature-icon"><BuildingIcon class="ev-feat-icon" /></div>
              <div>
                <div class="ev-feature-title">Commercial Fleet Solutions</div>
                <div class="ev-feature-desc">Multi-bay charging infrastructure for offices, hotels, shopping malls, and logistics companies. Load-balanced and remotely managed.</div>
              </div>
            </div>
            <div class="ev-feature">
              <div class="ev-feature-icon"><HandshakeIcon class="ev-feat-icon" /></div>
              <div>
                <div class="ev-feature-title">Developer Partnerships</div>
                <div class="ev-feature-desc">We partner with real estate developers and EV distributors to specify and install EV-ready infrastructure from the foundation up.</div>
              </div>
            </div>
          </div>
          <router-link to="/load-audit" class="btn-primary">
            Request EV Charger Quote
            <ArrowRightIcon class="btn-icon-right" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" id="contact">
      <div class="cta-glow"></div>
      <div class="container text-center">
        <span class="section-eyebrow">Ready to Start?</span>
        <h2>Your energy independence begins with one conversation.</h2>
        <p class="cta-desc">Book a free, no-obligation energy audit. Our engineers will visit your site, assess your needs, and deliver a full proposal — at no cost.</p>
        <div class="cta-actions">
          <router-link to="/load-audit" class="btn-primary">
            Book Free Energy Audit
            <CalculatorIcon class="btn-icon" />
          </router-link>
          <a href="tel:07041880339" class="btn-secondary">
            <PhoneIcon class="btn-icon" />
            Call Us: 0704 188 0339
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  Calculator as CalculatorIcon, 
  Calendar as CalendarIcon, 
  Sparkles as SparklesIcon, 
  Sun as SunIcon, 
  Zap as ZapIcon, 
  Cctv as CctvIcon,
  Fingerprint as FingerprintIcon,
  Flame as FlameIcon, 
  Wind as WindIcon,
  PenTool as PenToolIcon,
  ArrowRight as ArrowRightIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Check as CheckIcon,
  Landmark as LandmarkIcon,
  Factory as FactoryIcon,
  GraduationCap as GraduationCapIcon,
  HeartPulse as HeartPulseIcon,
  Building2 as BuildingIcon,
  Home as HomeIcon,
  Rocket as RocketIcon,
  HelpingHand as HandshakeIcon,
  MapPin as MapPinIcon
} from 'lucide-vue-next';

// PDF Assets
import projectOndoImg from '../assets/pdf-assets/project-ondo.jpg';
import projectGofamintImg from '../assets/pdf-assets/project-gofamint.jpg';
import projectFcdaImg from '../assets/pdf-assets/project-fcda.jpg';
import projectJudgeImg from '../assets/pdf-assets/project-judge.jpg';
import projectIfeImg from '../assets/pdf-assets/project-ife.jpg';

// ----------------- FINANCING PLAN CALCULATOR -----------------
const sysType = ref('');
const budget = ref(null);
const tenure = ref('');
const showResult = ref(false);
const resultPlans = ref([]);

const calcPayment = () => {
  if (!sysType.value || !budget.value || !tenure.value) {
    alert('Please fill in all fields.');
    return;
  }
  const budgetVal = parseFloat(budget.value);
  const tenureVal = parseInt(tenure.value);
  if (budgetVal < 500000) {
    alert('Minimum financed amount is ₦500,000.');
    return;
  }
  const rates = { 12: 0.025, 24: 0.022, 36: 0.019, 48: 0.018, 60: 0.017 };
  const r = rates[tenureVal];
  const base = (budgetVal * r * Math.pow(1 + r, tenureVal)) / (Math.pow(1 + r, tenureVal) - 1);
  const fmt = n => '₦' + Math.round(n).toLocaleString('en-NG');
  
  const plans = [
    { name: 'Carbon Finance', adj: 1.0 },
    { name: 'Sterling Bank Clean Energy', adj: 1.02 },
    { name: 'FairMoney Business', adj: 0.98 },
  ];

  resultPlans.value = plans.map(p => ({
    name: p.name,
    amount: fmt(base * p.adj),
    term: `for ${tenureVal} months · Total: ${fmt(base * p.adj * tenureVal)}`
  }));
  showResult.value = true;
};

// ----------------- LIFECYCLE -----------------
onMounted(() => {
  // Scroll Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });
});
</script>

<style scoped>
/* ----------------- GLOBAL LOCAL TOKENS ----------------- */
.home-view {
  --orange: var(--color-orange-primary);
  --orange2: var(--color-orange-dark);
  --orange3: var(--color-orange-light);
  --border: rgba(255, 153, 0, 0.15);
  overflow-x: hidden;
}

/* ----------------- LAYOUT SHELLS ----------------- */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.text-left { text-align: left; }
.text-center { text-align: center; }
.mt-sm { margin-top: 0.5rem; }
.mt-md { margin-top: 1.5rem; }
.py-lg { padding: 3rem 0; }

/* ----------------- HERO SECTION ----------------- */
.hero {
  min-height: 90vh;
  padding: 5.5rem 0 3.5rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 60% 80% at 70% 50%, rgba(255, 153, 0, 0.05) 0%, transparent 70%),
    radial-gradient(ellipse 50% 70% at 10% 80%, rgba(0, 102, 204, 0.03) 0%, transparent 60%),
    linear-gradient(160deg, var(--bg-secondary) 0%, var(--bg-primary) 60%);
}

.hero-container-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 60px;
  position: relative;
  z-index: 1;
}

@media (max-width: 992px) {
  .hero-container-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero {
    padding-top: 6.5rem;
    padding-bottom: 3.5rem;
    min-height: unset;
  }
}

.circuit-line {
  position: absolute;
  right: 0;
  top: 0;
  width: 55%;
  height: 100%;
  opacity: 0.12;
  z-index: 0;
  pointer-events: none;
}

.circuit-path {
  stroke: var(--orange);
  stroke-width: 1.5;
  fill: none;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: draw-circuit 3s ease forwards 0.5s;
}

.circuit-dot {
  fill: var(--orange);
  opacity: 0;
  animation: dot-appear 0.4s ease forwards;
}

@keyframes draw-circuit { to { stroke-dashoffset: 0; } }
@keyframes dot-appear { to { opacity: 1; } }

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-orange-light);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--orange2);
  text-transform: uppercase;
  margin-bottom: 28px;
}

.dark-mode .hero-eyebrow {
  background: rgba(255, 153, 0, 0.1);
  color: var(--orange);
}

.hero-eyebrow::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--orange);
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.hero h1 {
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.hero h1 .highlight {
  background: linear-gradient(135deg, var(--orange), var(--orange2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: normal;
  display: inline-block;
}

.hero-sub {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 520px;
  line-height: 1.7;
  margin-bottom: 40px;
}

@media (max-width: 992px) {
  .hero-sub {
    margin-left: auto;
    margin-right: auto;
  }
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 992px) {
  .hero-actions {
    justify-content: center;
  }
}

.btn-primary, .btn-secondary, .btn-ai-glow {
  padding: 14px 28px;
  border-radius: 8px;
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all var(--transition-speed) var(--transition-bounce);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--orange);
  color: white;
  box-shadow: 0 8px 20px -6px rgba(255, 153, 0, 0.4);
}

.btn-primary:hover {
  background: var(--orange2);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -6px rgba(255, 153, 0, 0.6);
  color: white;
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--orange);
  color: var(--orange2);
  transform: translateY(-2px);
}

.btn-ai-glow {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  z-index: 1;
}

.btn-ai-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transition: 0.6s var(--transition-bounce);
  z-index: 2;
}

.btn-ai-glow:hover::before {
  left: 100%;
}

.btn-ai-glow::after {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(90deg, var(--color-blue-primary), var(--orange), var(--color-blue-primary));
  background-size: 200% 100%;
  z-index: -1;
  border-radius: 8px;
  opacity: 0.3;
  animation: borderGlow 3s linear infinite;
}

.btn-ai-glow:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-md);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.ai-icon {
  color: var(--orange);
  animation: aiPulse 2s ease-in-out infinite;
}

@keyframes aiPulse {
  0%, 100% { transform: scale(1) rotate(0); opacity: 1; }
  50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
}

.hero-visual {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

@media (max-width: 992px) {
  .hero-visual {
    display: none;
  }
}

.hero-card-stack {
  width: 100%;
  max-width: 440px;
  position: relative;
}

.hero-main-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 28px;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-md);
}

.hero-card-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.hero-card-stat {
  font-family: var(--font-main);
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--orange);
  line-height: 1;
  margin-bottom: 4px;
}

.hero-card-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 60px;
  margin-bottom: 20px;
}

.chart-bar {
  flex: 1;
  background: rgba(255, 153, 0, 0.15);
  border-radius: 4px 4px 0 0;
  border-top: 2px solid var(--orange);
}

.hero-card-divider {
  height: 1px;
  background: var(--border-color);
  margin: 20px 0;
}

.hero-status-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
  animation: pulse-dot 2s infinite;
}

.hero-floating-card {
  position: absolute;
  bottom: -24px;
  left: -28px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px 20px;
  z-index: 3;
  min-width: 180px;
  box-shadow: var(--shadow-md);
}

.float-card-num {
  font-family: var(--font-main);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--orange);
}

.float-card-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* ----------------- STATS BAR ----------------- */
.stats-bar {
  background: var(--bg-secondary);
  border-top: 4px solid var(--orange);
  padding: 40px 0;
  border-bottom: 1px solid var(--border-color);
}

.stats-container-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .stats-container-layout {
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
  }
  .stats-bar {
    margin-top: 0;
  }
  .stat-item:nth-child(2) { border-right: none; }
  .stat-item:nth-child(3) { border-right: 1px solid var(--border-color); border-top: 1px solid var(--border-color); }
  .stat-item:nth-child(4) { border-right: none; border-top: 1px solid var(--border-color); }
}

@media (max-width: 560px) {
  .stats-container-layout {
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
  }
}

.stat-item {
  text-align: center;
  padding: 0 20px;
  border-right: 1px solid var(--border-color);
}


.stat-item:last-child {
  border-right: none;
}

.stat-number {
  font-family: var(--font-main);
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}


@media (max-width: 900px) {
  .stat-item {
    padding: 24px 20px;
  }
  .stat-number {
    font-size: 2rem;
  }
}

/* ----------------- REVEAL ANIMATIONS ----------------- */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ----------------- SERVICES SECTION ----------------- */
.services {
  background: var(--bg-primary);
}

.services-header {
  margin-bottom: 48px;
}

.section-eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--orange);
  margin-bottom: 14px;
  display: block;
}

.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.section-sub {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.65;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}

.service-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 36px 32px;
  transition: all var(--transition-bounce) var(--transition-speed);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--orange);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--transition-bounce);
}

.service-card:hover {
  background: var(--bg-primary);
  border-color: rgba(255, 153, 0, 0.3);
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.service-card:hover::before {
  transform: scaleX(1);
}

.service-icon {
  width: 48px;
  height: 48px;
  background: var(--color-orange-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--orange);
}

.dark-mode .service-icon {
  background: rgba(255, 153, 0, 0.1);
}

.service-icon svg {
  width: 24px;
  height: 24px;
  stroke-width: 1.8;
}

.service-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.service-card p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 20px;
  flex: 1;
}

.service-card-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--orange2);
  font-weight: 700;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s, transform 0.2s;
}

.service-card:hover .service-card-link {
  opacity: 1;
  transform: translateX(4px);
}

/* ----------------- PROCESS SECTION ----------------- */
.process {
  background: var(--bg-secondary);
}

.process-header {
  text-align: center;
  margin-bottom: 72px;
}

.process-header .section-title, .process-header .section-sub {
  margin-left: auto;
  margin-right: auto;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;
}

@media (max-width: 900px) {
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 560px) {
  .process-steps {
    grid-template-columns: 1fr;
  }
}

.process-step {
  text-align: center;
  padding: 0 16px;
  position: relative;
  z-index: 2;
}

.step-num {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-family: var(--font-main);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--orange);
  box-shadow: var(--shadow-sm);
}

.process-step h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.process-step p {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ----------------- CASE STUDIES SECTION ----------------- */
.cases {
  background: var(--bg-primary);
}

.cases-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 56px;
  flex-wrap: wrap;
  gap: 24px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .cases-grid {
    grid-template-columns: 1fr;
  }
}

.case-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all var(--transition-bounce) var(--transition-speed);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.case-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 153, 0, 0.3);
  box-shadow: var(--shadow-md);
}

.case-card-img {
  height: 180px;
  background: linear-gradient(135deg, rgba(255, 153, 0, 0.08), var(--bg-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
  filter: hue-rotate(var(--case-hue, 0deg));
}

.case-img-icon-wrap {
  width: 64px;
  height: 64px;
  background: rgba(255, 153, 0, 0.12);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case-img-icon {
  width: 32px;
  height: 32px;
  color: var(--orange);
  stroke-width: 1.5;
}

.case-loc-icon {
  width: 12px;
  height: 12px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 2px;
  color: var(--orange);
}

.case-location {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--orange2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.case-card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.case-card-body h3 {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.35;
  color: var(--text-primary);
}

.case-card-body p {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.case-metrics {
  display: flex;
  gap: 16px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.case-metrics > div {
  flex: 1;
}

.case-metric-val {
  font-family: var(--font-main);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--orange);
}

.case-metric-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.case-card-img-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.case-card-img-src {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.case-card:hover .case-card-img-src {
  transform: scale(1.05);
}

.case-tag-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--orange);
  color: white;
  border-radius: 100px;
  padding: 4px 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.case-metrics-layout {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  margin-bottom: 12px;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.case-metrics-layout > div {
  flex: 1;
}

/* ----------------- TRUST BAR ----------------- */
.trust-bar {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 40px 0;
}

.trust-bar-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.trust-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.trust-logo {
  font-family: var(--font-main);
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--text-secondary);
  opacity: 0.5;
  letter-spacing: 0.04em;
  transition: opacity 0.3s, color 0.3s;
  cursor: default;
}

.trust-logo:hover {
  opacity: 1;
  color: var(--orange);
}

/* ----------------- MARKETPLACE SECTION ----------------- */
.marketplace {
  background: var(--bg-secondary);
}

.marketplace-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 24px;
}

.marketplace-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.mkt-tab {
  padding: 8px 18px;
  border-radius: 100px;
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
}

.mkt-tab.active {
  background: var(--orange);
  color: white;
  border-color: var(--orange);
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.2);
}

.mkt-tab:hover:not(.active) {
  border-color: var(--orange);
  color: var(--orange);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s var(--transition-bounce);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--orange);
}

.product-img {
  height: 180px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.p-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.p-placeholder {
  font-size: 3rem;
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: white;
  border-radius: 100px;
  padding: 3px 10px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  box-shadow: var(--shadow-sm);
}

.product-badge.out-of-stock {
  background: var(--text-secondary);
}

.product-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-category {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--orange2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.product-name {
  font-family: var(--font-main);
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.35;
}

.product-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 20px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.product-price {
  font-family: var(--font-main);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}

.product-btn {
  background: var(--text-primary);
  color: var(--bg-primary);
  padding: 8px 16px;
  border-radius: 6px;
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.78rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:hover .product-btn {
  background: var(--orange);
  color: white;
}

.empty-state-container {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 48px;
  max-width: 600px;
  margin: 0 auto;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.empty-state-container h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-state-container p {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.marketplace-cta {
  margin-top: 56px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.cta-icon-box {
  width: 60px;
  height: 60px;
  background: rgba(255, 153, 0, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cta-cart-icon {
  width: 28px;
  height: 28px;
  color: var(--orange);
  stroke-width: 1.8;
}

.tab-icon {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}

.placeholder-icon {
  width: 40px;
  height: 40px;
  color: var(--text-secondary);
  opacity: 0.4;
}

.marketplace-cta h3 {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text-primary);
}

.marketplace-cta p {
  font-size: 0.92rem;
  color: var(--text-secondary);
  max-width: 480px;
  text-align: center;
  line-height: 1.6;
}

.btn-icon-right {
  width: 16px;
  height: 16px;
}

/* ----------------- FINANCING SECTION ----------------- */
.financing {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.financing-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

@media (max-width: 900px) {
  .financing-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

.financing-bullets {
  list-style: none;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.financing-bullets li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.bullet-check-icon {
  width: 16px;
  height: 16px;
  color: var(--orange);
  flex-shrink: 0;
}

.financing-tool {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 36px;
  box-shadow: var(--shadow-sm);
}

.tool-title {
  font-family: var(--font-main);
  font-weight: 800;
  font-size: 1.15rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.tool-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.tool-select, .tool-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: var(--font-main);
  font-size: 0.9rem;
  margin-bottom: 20px;
  outline: none;
  transition: border-color 0.2s;
}

.tool-select:focus, .tool-input:focus {
  border-color: var(--orange);
}

.tool-btn {
  width: 100%;
  padding: 14px;
  background: var(--orange);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.tool-btn:hover {
  background: var(--orange2);
}

.tool-result {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s var(--transition-bounce), margin-top 0.4s;
  background: rgba(255, 153, 0, 0.04);
  border-radius: 10px;
  border: 0 solid var(--border);
}

.tool-result.visible {
  max-height: 500px;
  margin-top: 24px;
  padding: 20px;
  border: 1px solid var(--border);
}

.result-plan {
  margin-bottom: 12px;
}

.result-plan:last-child {
  margin-bottom: 0;
}

.result-plan-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 2px;
  text-transform: uppercase;
}

.result-plan-amount {
  font-family: var(--font-main);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--orange);
}

.result-plan-term {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.result-divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 12px 0;
}

.btn-sm-fit {
  padding: 8px 18px;
  font-size: 0.85rem;
  border-radius: 6px;
  display: inline-flex;
}

/* ----------------- TESTIMONIALS SECTION ----------------- */
.testimonials {
  background: var(--bg-secondary);
}

.testimonials-header {
  margin-bottom: 56px;
}

.testimonials-header .section-title {
  margin-left: auto;
  margin-right: auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}

.testi-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 28px;
  transition: all var(--transition-bounce) var(--transition-speed);
}

.testi-card:hover {
  border-color: rgba(255, 153, 0, 0.3);
  box-shadow: var(--shadow-sm);
}

.testi-stars {
  color: var(--orange);
  margin-bottom: 16px;
  display: flex;
  gap: 4px;
}

.star {
  width: 14px;
  height: 14px;
  fill: var(--orange);
}

.testi-quote {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24px;
  font-style: italic;
}

.testi-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testi-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-orange-light);
  color: var(--orange2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-main);
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.dark-mode .testi-avatar {
  background: rgba(255, 153, 0, 0.1);
  color: var(--orange);
}

.testi-name {
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--text-primary);
}

.testi-role {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

/* ----------------- EV SECTION ----------------- */
.ev-section {
  background: var(--bg-primary);
}

.ev-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

@media (max-width: 900px) {
  .ev-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

.ev-visual {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.ev-visual::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 153, 0, 0.08) 0%, transparent 70%);
}

.ev-icon {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ev-zap-icon {
  width: 56px;
  height: 56px;
  color: var(--orange);
  stroke-width: 1.5;
}

.ev-badge-icon {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}

.ev-feat-icon {
  width: 20px;
  height: 20px;
  color: var(--orange);
  stroke-width: 1.8;
}

.ev-visual h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.ev-badge {
  display: inline-block;
  background: var(--color-orange-light);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--orange2);
  position: relative;
  z-index: 1;
}

.dark-mode .ev-badge {
  background: rgba(255, 153, 0, 0.15);
  color: var(--orange);
}

.ev-charging-pricing {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.ev-price-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
  text-align: left;
}

.ev-price-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-bottom: 2px;
  text-transform: uppercase;
  font-weight: 700;
}

.ev-price-val {
  font-family: var(--font-main);
  font-weight: 800;
  color: var(--orange);
}

.ev-features {
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ev-feature {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.ev-feature-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(255, 153, 0, 0.08);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.ev-feature-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.ev-feature-desc {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ----------------- CTA SECTION ----------------- */
.cta-section {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  text-align: center;
  padding: 110px 0;
  position: relative;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(255, 153, 0, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.cta-section h2 {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  max-width: 640px;
  margin: 0 auto 20px;
  position: relative;
  z-index: 1;
  color: var(--text-primary);
}

.cta-desc {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0 auto 40px;
  position: relative;
  z-index: 1;
  line-height: 1.7;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

/* Dynamic CSS Loader */
.loader {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-bottom-color: var(--orange);
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes borderGlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
</style>
