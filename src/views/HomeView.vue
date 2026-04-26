<template>
  <div class="home-view">
    <!-- Modern Hero Section -->
    <section class="hero-premium">
      <div class="hero-bg-accent"></div>
      <div class="container hero-content">
        <div class="hero-text-wrapper">
          <span class="hero-badge">Smart Energy Revolution</span>
          <h1 class="hero-headline">Powering Homes & Businesses with <span class="grad-blue">Smart Energy</span> Solutions</h1>
          <p class="hero-subline">Experience the future of energy. High-performance solar and inverter systems designed for modern living.</p>
          <div class="hero-actions">
            <router-link to="/load-audit" class="btn btn-primary btn-lg">
              <CalculatorIcon class="icon-btn" />
              Calculate My Power Need
            </router-link>
            <router-link to="/account/consultations" class="btn btn-secondary btn-lg">
              <CalendarIcon class="icon-btn" />
              Book Consultation
            </router-link>
          </div>
          <div class="hero-ai-trigger">
            <router-link to="/origin-talk" class="btn btn-ai-glow">
              <SparklesIcon class="ai-icon" /> Talk to Origin
            </router-link>
          </div>
        </div>

        <!-- Creative Hero Visual -->
        <div class="hero-visual-wrapper">
          <div class="visual-glass-stage"></div>
          <div class="visual-glow"></div>
          <img src="../assets/hero-visual.png" alt="Smart Solar System" class="hero-3d-visual" />
          <div class="floating-energy-particles">
            <div v-for="n in 5" :key="n" class="particle"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Services Section (Updated from PDF) -->
    <section class="services-modern" id="services">
      <div class="container text-center">
        <h2 class="section-title">In-House <span class="grad-blue">End-to-End</span> Services</h2>
        <div class="modern-grid">
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
        </div>
      </div>
    </section>

    <!-- Detailed "What We Do" - 3 Part Section -->
    <section class="what-we-do bg-gradient">
      <div class="container">
        <div class="text-center mb-xl">
          <h2 class="section-title">What <span class="grad-blue">We Do</span></h2>
        </div>

        <!-- Part 1: Solar Solutions -->
        <div class="wwd-part mb-xl">
          <div class="wwd-header">
            <SunIcon class="icon-md grad-blue" />
            <h3>Our Solar Solutions</h3>
          </div>
          <div class="wwd-content-layout">
            <div class="wwd-visual slider-container">
              <div class="image-slider">
                <transition-group name="fade">
                  <img v-for="(img, index) in solarImages" 
                       :key="img" 
                       :src="img" 
                       v-show="currentSolarSlide === index" 
                       alt="Solar Solutions" 
                       class="slider-img" />
                </transition-group>
                <div class="slider-dots">
                  <span v-for="(_, index) in solarImages" 
                        :key="index" 
                        class="dot" 
                        :class="{ active: currentSolarSlide === index }"
                        @click="currentSolarSlide = index"></span>
                </div>
              </div>
            </div>
            <div class="wwd-grid">
              <div class="wwd-card">
                <h4>Roof Top</h4>
                <p>Customized solutions for KlipLok, IBR, tile, or flat roofs, maximizing space and energy returns.</p>
              </div>
              <div class="wwd-card">
                <h4>Ground Mounted</h4>
                <p>Turnkey solutions covering design, installation, and full O&M support.</p>
              </div>
              <div class="wwd-card">
                <h4>Solar Car Park</h4>
                <p>Efficient utilization of parking space to provide shade while harnessing solar energy.</p>
              </div>
              <div class="wwd-card">
                <h4>Greenfield Project Development</h4>
                <p>Ground-up solar plants (100kW to 100MW) for industries and communities.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 2: CCTV Solutions -->
        <div class="wwd-part mb-xl">
          <div class="wwd-header">
            <CctvIcon class="icon-md grad-orange" />
            <h3>Our CCTV Solutions</h3>
          </div>
          <div class="wwd-content-layout reverse">
            <div class="wwd-visual slider-container">
              <div class="image-slider">
                <transition-group name="fade">
                  <img v-for="(img, index) in cctvImages" 
                       :key="img" 
                       :src="img" 
                       v-show="currentCctvSlide === index" 
                       alt="CCTV Solutions" 
                       class="slider-img" />
                </transition-group>
                <div class="slider-dots">
                  <span v-for="(_, index) in cctvImages" 
                        :key="index" 
                        class="dot" 
                        :class="{ active: currentCctvSlide === index }"
                        @click="currentCctvSlide = index"></span>
                </div>
              </div>
            </div>
            <div class="wwd-detailed-grid">
              <div class="wwd-detail-card glass-card">
                <h4>IP Security Systems</h4>
                <p>The way of the future. AI-powered systems that assist with identifying objects or people using mega-pixel quality images.</p>
              </div>
              <div class="wwd-detail-card glass-card">
                <h4>Analogue & HD CCTV</h4>
                <p>Cost-effective options built around client needs and budgets, always offering suitability for any site requirement.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Part 3: Access Control & Security -->
        <div class="wwd-part">
          <div class="wwd-header">
            <ShieldIcon class="icon-md grad-blue" />
            <h3>Access Control & Perimeter</h3>
          </div>
          <div class="wwd-content-layout">
            <div class="wwd-visual slider-container">
              <div class="image-slider">
                <transition-group name="fade">
                  <img v-for="(img, index) in accessImages" 
                       :key="img" 
                       :src="img" 
                       v-show="currentAccessSlide === index" 
                       alt="Access Control" 
                       class="slider-img" />
                </transition-group>
                <div class="slider-dots">
                  <span v-for="(_, index) in accessImages" 
                        :key="index" 
                        class="dot" 
                        :class="{ active: currentAccessSlide === index }"
                        @click="currentAccessSlide = index"></span>
                </div>
              </div>
            </div>
            <div class="modern-grid-3">
              <div class="service-card-mini">
                <AuthIcon class="icon-sm" />
                <div>
                  <h5>Biometric & RFID</h5>
                  <p>Card, tag, fingerprint, and facial readers for secure attendance and access.</p>
                </div>
              </div>
              <div class="service-card-mini">
                <PlusIcon class="icon-sm" />
                <div>
                  <h5>Gate Automation</h5>
                  <p>Secure, convenient entry control for residents, staff, and visitors.</p>
                </div>
              </div>
              <div class="service-card-mini">
                <ZapIcon class="icon-sm" />
                <div>
                  <h5>Electric Fencing</h5>
                  <p>Advanced perimeter protection linked directly to alarm systems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section (Extracted from PDF) -->
    <section class="projects-premium bg-dark">
      <div class="container text-center">
        <h2 class="section-title">Success <span class="grad-orange">Stories</span></h2>
        <div class="projects-grid">
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectOndoImg" alt="Ondo Solar Installation" class="project-img" />
              <div class="project-tag">Solar Plant</div>
            </div>
            <div class="project-body">
              <h3>Ondo Installation</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>85 kWh</strong> Capacity</div>
                <div class="p-stat"><strong>247 tons</strong> CO2 Sav./yr</div>
              </div>
              <p>State-of-the-art solar plant for Mr. Festus, achieving significant carbon savings.</p>
            </div>
          </div>
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectGofamintImg" alt="Ibadan CCTV Installation" class="project-img" />
              <div class="project-tag">CCTV</div>
            </div>
            <div class="project-body">
              <h3>Ibadan Security</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>40 Cameras</strong> Setup</div>
                <div class="p-stat"><strong>Risk</strong> Mitigated</div>
              </div>
              <p>Comprehensive CCTV network for GOFAMINT Printing Press Bookshop.</p>
            </div>
          </div>
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectFcdaImg" alt="Abuja FCDA Project" class="project-img" />
              <div class="project-tag">Government</div>
            </div>
            <div class="project-body">
              <h3>Abuja FCDA Project</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>58 kWh</strong> Capacity</div>
                <div class="p-stat"><strong>#62M</strong> Sec. Value</div>
              </div>
              <p>Robust energy infrastructure delivered to sustain government operations.</p>
            </div>
          </div>
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectJudgeImg" alt="Ibadan Residential Solar" class="project-img" />
              <div class="project-tag">Residential</div>
            </div>
            <div class="project-body">
              <h3>Ibadan Residential</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>3.5 kW</strong> System</div>
                <div class="p-stat"><strong>Stable</strong> Power</div>
              </div>
              <p>Hybrid solar solution for a premium residence, ensuring 24/7 uptime.</p>
            </div>
          </div>
          <div class="project-card glass-card">
            <div class="project-img-wrapper">
              <img :src="projectIfeImg" alt="Ife Residential Solar" class="project-img" />
              <div class="project-tag">Residential</div>
            </div>
            <div class="project-body">
              <h3>Ife Residential Project</h3>
              <div class="project-stats">
                <div class="p-stat"><strong>5 kW</strong> Capacity</div>
                <div class="p-stat"><strong>15 kWh</strong> Backup</div>
              </div>
              <p>A clean hybrid solar installation delivering stable, round-the-clock power for a premium residence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Us - Showcase -->
    <section class="why-us-modern">
      <div class="container">
        <div class="why-header">
          <h2 class="section-title">The <span class="grad-blue">Origin</span> Advantage</h2>
        </div>
        <div class="feature-strip">
          <div class="feature-item">
            <span class="count">10+</span>
            <span class="label">Years Excellence</span>
          </div>
          <div class="feature-item">
            <span class="count">1,500+</span>
            <span class="label">Happy Clients</span>
          </div>
          <div class="feature-item">
            <span class="count">99.9%</span>
            <span class="label">System Uptime</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Workflow - Steps -->
    <section class="workflow-modern bg-dark">
      <div class="container">
        <h2 class="section-title">Our Seamless <span class="grad-orange">Process</span></h2>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-blob">01</div>
            <h4>Audit</h4>
            <p>Intelligent load profiling for your space.</p>
          </div>
          <div class="process-line"></div>
          <div class="process-step">
            <div class="step-blob">02</div>
            <h4>Design</h4>
            <p>Custom blueprinting for maximum yield.</p>
          </div>
          <div class="process-line"></div>
          <div class="process-step">
            <div class="step-blob">03</div>
            <h4>Install</h4>
            <p>Rapid deployment with precision care.</p>
          </div>
          <div class="process-line"></div>
          <div class="process-step">
            <div class="step-blob">04</div>
            <h4>Support</h4>
            <p>Dedicated life-cycle maintenance.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-modern">
      <div class="container text-center">
        <h2 class="section-title">Trusted by <span class="grad-blue">Industry Leaders</span></h2>
        <div class="testimonial-float">
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
          <div class="t-card glass-card">
            <div class="quote-icon"><QuoteIcon class="icon-sm" /></div>
            <p>"The 3.5kW hybrid system provides seamless power for my residence. Excellent service and technical support."</p>
            <div class="t-author">
              <div class="t-avatar orange"><UserIcon class="icon-user" /></div>
              <div class="t-meta">
                <strong>Hon. Justice</strong>
                <span>Residential Client, Ibadan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Blog Section -->
    <section v-if="featuredBlogs.length > 0" class="latest-blog bg-secondary">
      <div class="container">
        <div class="blog-header">
          <h2 class="section-title">Latest <span class="grad-blue">Blog</span> Posts</h2>
          <p class="section-desc mx-auto">Stay updated with the latest in sustainable energy, power solutions, and environmental impact.</p>
        </div>

        <div class="blog-grid">
          <article 
            v-for="post in featuredBlogs" 
            :key="post.id" 
            class="blog-card"
            @click="$router.push(`/blog/${post.slug}`)"
          >
            <div class="blog-card-image-wrapper">
              <img 
                v-if="post.featured_image"
                :src="getImgUrl(post.featured_image)" 
                :alt="post.title"
                class="blog-card-image"
              />
              <div v-else class="blog-placeholder">
                <SunIcon class="icon-placeholder" />
              </div>
              <div class="blog-card-badge">
                {{ post.category_name || 'Innovation' }}
              </div>
            </div>
            
            <div class="blog-card-content">
              <div class="blog-card-meta">
                <CalendarIcon class="icon-meta" />
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              <h3 class="blog-card-title">
                {{ post.title }}
              </h3>
              <p class="blog-card-excerpt">
                {{ stripMarkdown(post.content) }}
              </p>
              <div class="blog-card-footer">
                <div class="blog-read-more">
                  <span>Read Article</span>
                  <ArrowIcon class="icon-read" />
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="blog-actions">
          <router-link to="/blog" class="btn-blog-all">
            View All Blog Posts <ArrowIcon class="icon-sm" />
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import blogService from '@/services/blog.service';
import { 
  Calculator as CalculatorIcon, 
  Calendar as CalendarIcon, 
  Sparkles as SparklesIcon, 
  Sun as SunIcon, 
  Zap as ZapIcon, 
  ShieldCheck as ShieldIcon, 
  Cctv as CctvIcon,
  Fingerprint as AuthIcon,
  FlameKindling as FireIcon, 
  BarChart3 as BarChartIcon, 
  CheckCircle2 as CheckCircleIcon,
  Quote as QuoteIcon,
  User as UserIcon,
  Plus as PlusIcon,
  ArrowRight as ArrowIcon
} from 'lucide-vue-next';

// PDF Assets
import solar1 from '../assets/pdf-assets/solar-1.jpg';
import solar2 from '../assets/pdf-assets/solar-2.jpg';
import solar3 from '../assets/pdf-assets/solar-3.jpg';
import solar4 from '../assets/pdf-assets/solar-4.jpg';
import cctv1 from '../assets/pdf-assets/cctv-1.png';
import cctv2 from '../assets/pdf-assets/cctv-2.png';
import cctv3 from '../assets/pdf-assets/cctv-3.png';
import access1 from '../assets/pdf-assets/access-1.jpg';
import access2 from '../assets/pdf-assets/access-2.jpg';
import access3 from '../assets/pdf-assets/access-3.jpg';
import projectOndoImg from '../assets/pdf-assets/project-ondo.jpg';
import projectGofamintImg from '../assets/pdf-assets/project-gofamint.jpg';
import projectFcdaImg from '../assets/pdf-assets/project-fcda.jpg';
import projectJudgeImg from '../assets/pdf-assets/project-judge.jpg';
import projectIfeImg from '../assets/pdf-assets/project-ife.jpg';

const scroll = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// Solar Slider Logic
const solarImages = [solar1, solar2, solar3, solar4];
const currentSolarSlide = ref(0);
let solarTimer = null;

const nextSolarSlide = () => {
  currentSolarSlide.value = (currentSolarSlide.value + 1) % solarImages.length;
};

// Access Control Slider Logic
const accessImages = [access1, access2, access3];
const currentAccessSlide = ref(0);
let accessTimer = null;

const nextAccessSlide = () => {
  currentAccessSlide.value = (currentAccessSlide.value + 1) % accessImages.length;
};

// CCTV Slider Logic
const cctvImages = [cctv1, cctv2, cctv3];
const currentCctvSlide = ref(0);
let cctvTimer = null;

const nextCctvSlide = () => {
  currentCctvSlide.value = (currentCctvSlide.value + 1) % cctvImages.length;
};

const featuredBlogs = ref([]);

const fetchFeaturedBlogs = async () => {
  try {
    featuredBlogs.value = await blogService.getFeaturedPosts();
  } catch (err) {
    console.error('Failed to fetch featured blogs', err);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const stripMarkdown = (content) => {
  if (!content) return '';
  return content
    .replace(/[#*`_~]/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .slice(0, 120) + '...';
};

const getImgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
};

onMounted(() => {
  solarTimer = setInterval(nextSolarSlide, 4000);
  accessTimer = setInterval(nextAccessSlide, 4500);
  cctvTimer = setInterval(nextCctvSlide, 5000); // Slightly slower for variety
  fetchFeaturedBlogs();
});

onUnmounted(() => {
  if (solarTimer) clearInterval(solarTimer);
  if (accessTimer) clearInterval(accessTimer);
  if (cctvTimer) clearInterval(cctvTimer);
});
</script>

<style scoped>
.hero-premium {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  padding: var(--space-xl) 0;
  overflow: hidden;
  background: radial-gradient(circle at 70% 30%, var(--color-blue-light) 0%, transparent 60%);
}

@media (max-width: 992px) {
  .hero-premium {
    padding: var(--space-xl) 0 var(--space-lg);
    min-height: auto;
  }
}

.hero-bg-accent {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-blue-light) 0%, transparent 100%);
  z-index: -1;
  filter: blur(120px);
  opacity: 0.6;
}

.hero-premium .container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--space-xl);
  align-items: center;
  position: relative;
  z-index: 2;
}

@media (max-width: 1200px) {
  .hero-premium .container {
    display: block;
    text-align: center;
  }
}

.hero-text-wrapper {
  max-width: 680px;
}

@media (max-width: 1200px) {
  .hero-text-wrapper {
    max-width: 100%;
    margin: 0 auto;
  }
}

/* Hero Visual Concept */
.hero-visual-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}

@media (max-width: 1200px) {
  .hero-visual-wrapper {
    display: none;
  }
}

.hero-3d-visual {
  width: 100%;
  max-width: 550px;
  height: auto;
  z-index: 3;
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.2));
  animation: floatHero 6s ease-in-out infinite;
}

.visual-glass-stage {
  position: absolute;
  width: 120%;
  height: 60%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  bottom: 0%;
  left: -10%;
  z-index: 1;
  transform: rotate(-5deg);
}

.visual-glow {
  position: absolute;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(0, 102, 204, 0.15), transparent 70%);
  z-index: 2;
  border-radius: 50%;
  animation: pulseGlow 4s ease-in-out infinite;
}

.floating-energy-particles .particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-orange-primary);
  border-radius: 50%;
  filter: blur(2px);
  box-shadow: 0 0 10px var(--color-orange-primary);
  z-index: 4;
}

.particle:nth-child(1) { top: 20%; left: 10%; animation: particleFloat 10s infinite 0s; }
.particle:nth-child(2) { top: 40%; left: 80%; animation: particleFloat 12s infinite -2s; }
.particle:nth-child(3) { top: 70%; left: 30%; animation: particleFloat 14s infinite -4s; }
.particle:nth-child(4) { top: 10%; left: 60%; animation: particleFloat 11s infinite -1s; }
.particle:nth-child(5) { top: 80%; left: 70%; animation: particleFloat 13s infinite -3s; }

@keyframes floatHero {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(1deg); }
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

@keyframes particleFloat {
  0% { transform: translate(0, 0) scale(1); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translate(40px, -60px) scale(0); opacity: 0; }
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-sm);
}

.hero-headline {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: var(--space-md);
  letter-spacing: -0.05em;
  color: var(--text-primary);
}

.hero-subline {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

@media (max-width: 1200px) {
  .hero-actions {
    justify-content: center;
  }
}

.btn-lg {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  white-space: nowrap; /* Prevent button text from breaking */
}

.icon-btn {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.hero-ai-trigger {
  margin-top: var(--space-md);
}

.btn-ai-glow {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 0.875rem 2.25rem;
  border-radius: var(--radius-full);
  font-weight: 800;
  font-size: 1rem;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all var(--transition-speed);
  box-shadow: 0 0 20px rgba(0, 102, 204, 0.1);
  z-index: 1;
}

.btn-ai-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
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
  background: linear-gradient(90deg, 
    var(--color-blue-primary), 
    var(--color-orange-primary), 
    var(--color-blue-primary)
  );
  background-size: 200% 100%;
  z-index: -1;
  border-radius: var(--radius-full);
  opacity: 0.4;
  animation: borderGlow 3s linear infinite;
}

.btn-ai-glow:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 102, 204, 0.3);
  border-color: transparent;
  color: white;
  background: var(--color-blue-dark);
}

.btn-ai-glow:hover::after {
  opacity: 1;
  filter: blur(8px);
}

@keyframes borderGlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.ai-icon {
  width: 22px;
  height: 22px;
  color: var(--color-orange-primary);
  animation: aiPulse 2s ease-in-out infinite;
}

@keyframes aiPulse {
  0%, 100% { transform: scale(1) rotate(0); opacity: 1; }
  50% { transform: scale(1.3) rotate(15deg); opacity: 0.8; }
}

/* Services */
.modern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.service-card {
  transition: all var(--transition-bounce);
  text-align: left;
  border-bottom: 2px solid transparent;
}

.service-card:hover {
  transform: translateY(-8px);
  border-bottom: 2px solid var(--color-blue-primary);
  box-shadow: var(--shadow-lg);
  background: var(--bg-primary);
}

.service-icon {
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
}

.icon-lg {
  width: 48px;
  height: 48px;
}

/* Problems */
.grid-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--space-xl);
}

.problem-content .section-title {
  text-align: left;
  line-height: 1.1;
  margin-bottom: var(--space-sm);
}

.problem-content .section-desc {
  text-align: left;
  max-width: 100%;
}

.bg-gradient {
  background: linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary));
}

/* What We Do Section Styles */
.mb-xl { margin-bottom: var(--space-xl); }

.what-we-do {
  padding: var(--space-xl) 0;
}

.wwd-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--color-blue-light);
}

.wwd-header h3 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
}

.wwd-content-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-lg);
  align-items: center;
}

.wwd-content-layout.reverse {
  direction: rtl;
}

.wwd-content-layout.reverse > * {
  direction: ltr;
}

.wwd-visual {
  width: 100%;
  height: 100%;
}

.wwd-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.wwd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.wwd-card {
  padding: var(--space-md);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-blue-primary);
  transition: all var(--transition-speed);
}

.wwd-card:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-md);
}

.wwd-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: var(--space-xs);
  color: var(--color-blue-primary);
}

.wwd-detailed-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.wwd-detail-card {
  padding: var(--space-lg);
  border-top: 4px solid var(--color-orange-primary);
}

.wwd-detail-card h4 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: var(--space-sm);
}

.modern-grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.service-card-mini {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  align-items: flex-start;
}

.service-card-mini h5 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.service-card-mini p {
  font-size: 0.9rem;
  margin: 0;
}

/* Projects Section Styles */
.projects-premium {
  padding: var(--space-xl) 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-xl);
}

.project-card {
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  transition: all var(--transition-bounce);
}

.project-card:hover {
  transform: translateY(-10px);
  border-color: var(--color-orange-primary);
}

.project-img-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-img {
  transform: scale(1.1);
}

.project-tag {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  padding: 6px 14px;
  background: var(--color-orange-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.project-body {
  padding: var(--space-md);
}

.project-card h3 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: var(--space-xs);
}

.project-stats {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
  margin-bottom: var(--space-sm);
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
}

.p-stat {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.p-stat strong {
  display: block;
  font-size: 1.1rem;
  color: var(--text-primary);
}

/* Why Us Showcase */
.why-us-modern {
  background: var(--bg-primary);
}

.why-header {
  margin-bottom: var(--space-lg);
  text-align: center;
}

.feature-strip {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--space-lg) var(--space-md);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  gap: var(--space-md);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.feature-item .count {
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-blue-primary);
  line-height: 1;
  letter-spacing: -0.05em;
}

.feature-item .label {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .feature-strip {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
  }
  
  .feature-item .count {
    font-size: 2.5rem;
  }
}

/* Workflow */
.bg-dark {
  background: var(--bg-secondary);
}

.process-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-lg);
}

.process-step {
  text-align: center;
  flex: 1;
}

.step-blob {
  width: 60px;
  height: 60px;
  background: var(--color-blue-primary);
  color: white;
  border-radius: 20px 4px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  margin: 0 auto var(--space-sm);
}

.process-line {
  height: 2px;
  background: var(--border-color);
  flex: 0.5;
  margin-bottom: var(--space-md);
}

/* Testimonials */
.testimonial-float {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.t-card {
  text-align: left;
  padding: var(--space-md);
  position: relative;
}

.quote-icon {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  opacity: 0.2;
}

.t-author {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.t-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue-primary);
}

.t-avatar.orange { 
  background: var(--color-orange-light); 
  color: var(--color-orange-primary);
}

.icon-user {
  width: 20px;
  height: 20px;
}

.t-meta strong { display: block; font-size: 1rem; }
.t-meta span { font-size: 0.85rem; color: var(--text-secondary); }

/* Icons */
.ai-icon {
  margin-right: 8px;
  width: 18px;
  height: 18px;
}

/* Slider Styles */
.slider-container {
  position: relative;
  min-height: 350px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.image-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.slider-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 5;
}

.dot {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dot.active {
  background: white;
  width: 24px;
  border-radius: 5px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.2s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
}

@media (max-width: 992px) {
  .hero-headline { font-size: 3rem; }
  .grid-split { grid-template-columns: 1fr; }
  .process-steps { flex-direction: column; gap: var(--space-md); }
  .process-line { display: none; }
  
  .wwd-content-layout,
  .wwd-content-layout.reverse {
    grid-template-columns: 1fr;
    direction: ltr;
    gap: var(--space-md);
  }
}

@media (max-width: 768px) {
  .hero-headline { font-size: 2.5rem; }
  .hero-actions { flex-direction: column; }
  .slider-container { min-height: 250px; }
}

.bg-grad-blue {
  background: linear-gradient(135deg, var(--color-blue-primary), var(--color-blue-dark));
  color: white;
}

.bg-grad-orange {
  background: linear-gradient(135deg, var(--color-orange-primary), var(--color-orange-dark));
  color: white;
}

/* Blog Section Specifics */
.blog-header {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.blog-actions {
  margin-top: var(--space-lg);
  text-align: center;
}

.btn-blog-all {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 2.8rem;
  background: var(--bg-primary);
  border: 2px solid var(--color-blue-primary);
  color: var(--color-blue-primary);
  border-radius: var(--radius-full);
  font-weight: 800;
  font-size: 1.05rem;
  transition: all var(--transition-bounce);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

.btn-blog-all:hover {
  background: var(--color-blue-primary);
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 102, 204, 0.3);
}

.icon-sm {
  width: 20px;
  height: 20px;
}
</style>
