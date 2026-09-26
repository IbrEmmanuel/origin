<template>
  <div class="home-view">
    <!-- HERO SECTION -->
    <section class="hero" id="home">


      <!-- Circuit decoration -->
      <svg class="circuit-line" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="circuit-path" d="M580 0 L580 80 L500 80 L500 160 L420 160 L420 120 L340 120 L340 200 L260 200 L260 140 L180 140 L180 260 L300 260 L300 340 L220 340 L220 420 L380 420 L380 360 L460 360 L460 480 L340 480 L340 560 L500 560 L500 640 L400 640 L400 720 L580 720 L580 800" style="animation-delay:0.3s"/>
        <path class="circuit-path" d="M480 0 L480 60 L560 60" style="animation-delay:0.6s"/>
        <path class="circuit-path" d="M220 260 L140 260 L140 360 L220 360" style="animation-delay:0.9s"/>
        <circle class="circuit-dot" cx="500" cy="80"  r="4" style="animation-delay:0.8s"/>
        <circle class="circuit-dot" cx="340" cy="200" r="4" style="animation-delay:1.1s"/>
        <circle class="circuit-dot" cx="380" cy="420" r="4" style="animation-delay:1.4s"/>
        <circle class="circuit-dot" cx="500" cy="560" r="4" style="animation-delay:1.7s"/>
      </svg>

      <!-- ── HERO BODY — centered column ── -->
      <div class="hero-body">


        <!-- H1 — large display heading with typewriter word-swap -->
        <h1 class="hero-h1 reveal" style="--reveal-delay:80ms">
          Engineering<br class="hero-br-mobile" />
          <span class="hero-type-wrap">
            <span class="hero-type-text" ref="typeTextRef"></span><span class="hero-type-cursor" ref="typeCursorRef">|</span>
          </span><br />
          for Nigeria.
        </h1>

        <!-- Sub-copy -->
        <p class="hero-sub reveal" style="--reveal-delay:180ms">
          We design, install, and maintain solar, BESS, security, and EV charging systems
          for businesses, institutions, and government — built to last, backed by engineering.
        </p>

        <!-- ── BUTTON ROW — min-h-[4.4em] feel ── -->
        <div class="hero-btn-row reveal" style="--reveal-delay:280ms">
          <router-link to="/account/consultations" class="hero-btn hero-btn--primary">
            <CalendarIcon class="hero-btn-icon" />
            Book Consultation
          </router-link>
          <router-link to="/load-audit" class="hero-btn hero-btn--glass">
            <CalculatorIcon class="hero-btn-icon" />
            Load Audit
          </router-link>
          <router-link to="/sales-chat" class="hero-btn hero-btn--ghost">
            <MessageSquareIcon class="hero-btn-icon" />
            Talk to Us
          </router-link>
          <button type="button" class="hero-btn hero-btn--ghost" @click="openInstallerModal">
            <WrenchIcon class="hero-btn-icon" />
            Request Install
          </button>
        </div>


        <!-- ── AUTO-SCROLL TICKER ── -->
        <div class="hero-ticker-wrap">
          <div class="hero-ticker-fade hero-ticker-fade--left"></div>
          <div class="hero-ticker-fade hero-ticker-fade--right"></div>
          <div class="hero-ticker" ref="tickerRef"
               @mouseenter="pauseTicker" @mouseleave="resumeTicker">
            <div class="hero-ticker-track" ref="tickerTrackRef">
              <!-- Render products twice for seamless infinite loop -->
              <template v-for="pass in 2" :key="pass">
                <!-- Skeleton chips while loading -->
                <template v-if="heroProducts.length === 0">
                  <div v-for="n in 10" :key="`sk-${pass}-${n}`" class="hero-chip hero-chip--skeleton">
                    <div class="hero-chip-img-wrap skeleton-box"></div>
                    <div class="hero-chip-skeleton-text">
                      <div class="skeleton-box" style="height:9px;width:80px;border-radius:3px"></div>
                      <div class="skeleton-box" style="height:8px;width:50px;border-radius:3px;margin-top:3px"></div>
                    </div>
                  </div>
                </template>
                <!-- Live product chips -->
                <router-link
                  v-for="product in heroProducts"
                  :key="`${pass}-${product.id}`"
                  :to="`/product/${product.id}`"
                  class="hero-chip"
                >
                  <div class="hero-chip-img-wrap">
                    <img v-if="product.image" :src="product.image" :alt="product.name"
                         class="hero-chip-img" loading="lazy" />
                    <div v-else class="hero-chip-img-placeholder">
                      <ZapIcon style="width:12px;height:12px;opacity:0.4" />
                    </div>
                  </div>
                  <div class="hero-chip-info">
                    <span class="hero-chip-name">{{ product.name }}</span>
                    <span class="hero-chip-price">₦{{ product.price }}</span>
                  </div>
                </router-link>
              </template>
            </div>
          </div>
          <div class="hero-ticker-meta">
            <span class="hero-ticker-dot"></span>
            <span class="hero-ticker-count">
              {{ heroProducts.length > 0 ? `${heroProducts.length} products live` : 'Loading products…' }}
            </span>
            <router-link to="/marketplace" class="hero-ticker-shoplink">
              Shop all <ArrowRightIcon style="width:11px;height:11px;display:inline-block;vertical-align:-1px" />
            </router-link>
          </div>
        </div>

      </div><!-- /hero-body -->
    </section>



    <!-- SERVICES -->
    <section class="services section-clipped section-divider" id="services">
      <div class="container">

        <div class="svc-intro reveal">
          <span class="section-eyebrow">What We Do</span>
          <h2 class="section-title text-left">Engineering solutions that <span class="highlight">actually work</span></h2>
        </div>

        <!-- Bento-style service grid -->
        <div class="svc-bento reveal-stagger">

          <!-- CCTV -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/cctv-pole.jpg" alt="CCTV & Surveillance" class="svc-bento-img" />
            <div class="svc-bento-overlay"></div>
            <div class="svc-bento-glass">
              <div class="svc-bento-icon svc-bento-icon--orange"><CctvIcon /></div>
              <div class="svc-bento-content">
                <span class="svc-bento-tag">Surveillance</span>
                <h3>CCTV &amp; Surveillance</h3>
                <p>4K IP camera networks, NVR/DVR and AI video analytics for zero blind spots.</p>
              </div>
              <router-link to="/services" class="svc-bento-link">Explore <ArrowRightIcon class="svc-bento-arrow" /></router-link>
            </div>
          </div>

          <!-- Access Control -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/access-biometric.jpg" alt="Access Control" class="svc-bento-img" />
            <div class="svc-bento-overlay"></div>
            <div class="svc-bento-glass">
              <div class="svc-bento-icon"><FingerprintIcon /></div>
              <div class="svc-bento-content">
                <span class="svc-bento-tag">Access Control</span>
                <h3>Access Control Systems</h3>
                <p>Biometric readers, RFID cards and boom barriers — one platform from door to campus perimeter.</p>
              </div>
              <router-link to="/services" class="svc-bento-link">Explore <ArrowRightIcon class="svc-bento-arrow" /></router-link>
            </div>
          </div>

          <!-- Fire -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/fire-detector.jpg" alt="Fire Detection" class="svc-bento-img" />
            <div class="svc-bento-overlay"></div>
            <div class="svc-bento-glass">
              <div class="svc-bento-icon svc-bento-icon--orange"><FlameIcon /></div>
              <div class="svc-bento-content">
                <span class="svc-bento-tag">Fire Safety</span>
                <h3>Fire Detection &amp; Suppression</h3>
                <p>NFPA &amp; BS compliant alarm systems, detectors and suppression for any facility size.</p>
              </div>
              <router-link to="/services" class="svc-bento-link">Explore <ArrowRightIcon class="svc-bento-arrow" /></router-link>
            </div>
          </div>

          <!-- EV Charging -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/img-017.jpg" alt="EV Charging" class="svc-bento-img" />
            <div class="svc-bento-overlay"></div>
            <div class="svc-bento-glass">
              <div class="svc-bento-icon svc-bento-icon--orange"><ZapIcon /></div>
              <div class="svc-bento-content">
                <span class="svc-bento-tag">EV Charging</span>
                <h3>EV Charging Infrastructure</h3>
                <p>Home wall-boxes to public DC fast chargers — we install Nigeria's next EV charging network.</p>
              </div>
              <router-link to="/services" class="svc-bento-link">Explore <ArrowRightIcon class="svc-bento-arrow" /></router-link>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="process section-clipped section-divider" id="process" :style="{ backgroundImage: `url(${processEngineeringBg})` }">
      <div class="container">
        <div class="process-header reveal">
          <span class="section-eyebrow">How We Work</span>
          <h2 class="section-title">A disciplined process. Every project, every time.</h2>
          <p class="section-sub text-center">We follow a rigorous four-stage methodology so nothing is guessed, and nothing is left to chance.</p>
        </div>
        <div class="process-steps reveal-stagger">
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
    <section class="cases section-clipped section-divider" id="cases">
      <div class="container">
        <div class="cases-header reveal">
          <div>
            <span class="section-eyebrow">Project Portfolio</span>
            <h2 class="section-title text-left">Success <span class="highlight">Stories</span></h2>
          </div>
          <router-link to="/projects" class="btn btn-secondary">View All Projects</router-link>
        </div>
        <div class="cases-grid reveal-stagger">
          <!-- Ondo Installation -->
          <div class="case-card">
            <div class="case-card-img-wrapper">
              <img :src="projectOndoImg" alt="Ondo Solar Installation" class="case-card-img-src" />
              <div class="case-tag-badge">Solar Plant</div>
            </div>
            <div class="case-drawer">
              <div class="case-drawer-metrics">
                <div class="case-metric-pill"><span class="case-metric-val">85 kWh</span><span class="case-metric-label">Capacity</span></div>
                <div class="case-metric-pill"><span class="case-metric-val">247 t</span><span class="case-metric-label">CO₂/yr</span></div>
              </div>
              <h3>Ondo Installation</h3>
              <p>State-of-the-art solar plant for Mr. Festus, achieving significant carbon savings.</p>
              <router-link to="/projects" class="case-drawer-link">View project →</router-link>
            </div>
          </div>
          <!-- Ibadan Security -->
          <div class="case-card">
            <div class="case-card-img-wrapper">
              <img :src="projectGofamintImg" alt="Ibadan CCTV Installation" class="case-card-img-src" />
              <div class="case-tag-badge">CCTV</div>
            </div>
            <div class="case-drawer">
              <div class="case-drawer-metrics">
                <div class="case-metric-pill"><span class="case-metric-val">40</span><span class="case-metric-label">Cameras</span></div>
                <div class="case-metric-pill"><span class="case-metric-val">✓</span><span class="case-metric-label">Risk Mitigated</span></div>
              </div>
              <h3>Ibadan Security</h3>
              <p>Comprehensive CCTV network for GOFAMINT Printing Press Bookshop.</p>
              <router-link to="/projects" class="case-drawer-link">View project →</router-link>
            </div>
          </div>
          <!-- Abuja FCDA Project -->
          <div class="case-card">
            <div class="case-card-img-wrapper">
              <img :src="projectFcdaImg" alt="Abuja FCDA Project" class="case-card-img-src" />
              <div class="case-tag-badge">Government</div>
            </div>
            <div class="case-drawer">
              <div class="case-drawer-metrics">
                <div class="case-metric-pill"><span class="case-metric-val">58 kWh</span><span class="case-metric-label">Capacity</span></div>
                <div class="case-metric-pill"><span class="case-metric-val">₦62M</span><span class="case-metric-label">Sec. Value</span></div>
              </div>
              <h3>Abuja FCDA Project</h3>
              <p>Robust energy infrastructure delivered to sustain government operations.</p>
              <router-link to="/projects" class="case-drawer-link">View project →</router-link>
            </div>
          </div>
          <!-- Ibadan Residential -->
          <div class="case-card">
            <div class="case-card-img-wrapper">
              <img :src="projectJudgeImg" alt="Ibadan Residential Solar" class="case-card-img-src" />
              <div class="case-tag-badge">Residential</div>
            </div>
            <div class="case-drawer">
              <div class="case-drawer-metrics">
                <div class="case-metric-pill"><span class="case-metric-val">3.5 kW</span><span class="case-metric-label">System</span></div>
                <div class="case-metric-pill"><span class="case-metric-val">24/7</span><span class="case-metric-label">Uptime</span></div>
              </div>
              <h3>Ibadan Residential</h3>
              <p>Hybrid solar solution for a premium residence, ensuring stable 24/7 power.</p>
              <router-link to="/projects" class="case-drawer-link">View project →</router-link>
            </div>
          </div>
          <!-- Ife Residential Project -->
          <div class="case-card">
            <div class="case-card-img-wrapper">
              <img :src="projectIfeImg" alt="Ife Residential Solar" class="case-card-img-src" />
              <div class="case-tag-badge">Residential</div>
            </div>
            <div class="case-drawer">
              <div class="case-drawer-metrics">
                <div class="case-metric-pill"><span class="case-metric-val">5 kW</span><span class="case-metric-label">Capacity</span></div>
                <div class="case-metric-pill"><span class="case-metric-val">15 kWh</span><span class="case-metric-label">Backup</span></div>
              </div>
              <h3>Ife Residential Project</h3>
              <p>Clean hybrid solar installation delivering round-the-clock power.</p>
              <router-link to="/projects" class="case-drawer-link">View project →</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FIELD WORK -->
    <section class="fieldwork section-clipped section-divider" id="fieldwork">
      <div class="container">

        <!-- Header -->
        <div class="fw-header reveal">
          <div class="fw-header-left">
            <span class="section-eyebrow">On The Ground</span>
            <h2 class="section-title text-left">Field Work</h2>
            <p class="section-sub text-left">Every installation is a commitment. Here's what our team looks like in action — on rooftops, in server rooms, and across Nigeria.</p>
          </div>
          <div class="fw-header-stats reveal-right">
            <div class="fw-stat">
              <span class="fw-stat-val">42+</span>
              <span class="fw-stat-lbl">Sites Installed</span>
            </div>
            <div class="fw-stat">
              <span class="fw-stat-val">1.2 MW</span>
              <span class="fw-stat-lbl">Solar Deployed</span>
            </div>
            <div class="fw-stat">
              <span class="fw-stat-val">100%</span>
              <span class="fw-stat-lbl">On-spec Delivery</span>
            </div>
          </div>
        </div>

        <!-- Masonry photo grid -->
        <div class="fw-grid reveal-stagger">

          <!-- Large featured photo -->
          <div class="fw-photo fw-photo--tall">
            <img src="../assets/pdf-assets/solar-main.jpg" alt="Solar installation in progress" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <SunIcon class="fw-label-icon" />
              <span>Solar Commissioning — Ondo State</span>
            </div>
          </div>

          <!-- Top right -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-ondo.jpg" alt="Ondo solar project" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <ZapIcon class="fw-label-icon" />
              <span>85 kWh System — Ondo</span>
            </div>
          </div>

          <!-- Middle right -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-gofamint.jpg" alt="CCTV installation" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <CctvIcon class="fw-label-icon" />
              <span>40-Camera Setup — Ibadan</span>
            </div>
          </div>

          <!-- Bottom left -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-fcda.jpg" alt="FCDA project" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <ShieldCheckIcon class="fw-label-icon" />
              <span>Government Install — Abuja</span>
            </div>
          </div>

          <!-- Bottom middle -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-ife.jpg" alt="Ife residential" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <HomeIcon class="fw-label-icon" />
              <span>5 kW Residential — Ife</span>
            </div>
          </div>

          <!-- Bottom right -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-judge.jpg" alt="Ibadan residential" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <BatteryIcon class="fw-label-icon" />
              <span>Hybrid Solar — Ibadan</span>
            </div>
          </div>

        </div>

        <!-- CTA strip -->
        <div class="fw-cta reveal">
          <span>See the full project portfolio</span>
          <router-link to="/projects" class="fw-cta-btn">
            View All Projects <ArrowRightIcon class="fw-cta-icon" />
          </router-link>
        </div>

      </div>
    </section>

    <!-- TRUST BAR -->
    <div class="trust-bar section-divider reveal-fade">
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
    <section class="financing section-clipped section-divider" id="financing">
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
    <section class="testimonials section-clipped section-divider" id="testimonials">
      <div class="container">
        <div class="testimonials-header reveal text-center">
          <span class="section-eyebrow">Client Voices</span>
          <h2 class="section-title">What our clients say</h2>
        </div>
        <div class="testimonials-grid reveal-stagger">
          <div class="testi-card">
            <div class="testi-card-top">
              <div class="testi-avatar">AO</div>
              <div class="testi-stars"><StarIcon v-for="n in 5" :key="n" class="star" /></div>
            </div>
            <p class="testi-quote">"Origin Electrical engineered an energy solution that has completely eliminated our generator costs. The installation was professional, the documentation thorough, and the monitoring app gives us total peace of mind."</p>
            <div class="testi-author">
              <div class="testi-name">Adewale Okonkwo</div>
              <div class="testi-role">MD, Okonkwo Manufacturing Ltd — Ibadan</div>
            </div>
          </div>
          <div class="testi-card">
            <div class="testi-card-top">
              <div class="testi-avatar">FK</div>
              <div class="testi-stars"><StarIcon v-for="n in 5" :key="n" class="star" /></div>
            </div>
            <p class="testi-quote">"We awarded the campus energy contract to Origin after seeing their M&E drawings and engineering rigour. 18 months later, we have zero unplanned outages and our electricity bill has dropped 78%."</p>
            <div class="testi-author">
              <div class="testi-name">Prof. Funmi Kassim</div>
              <div class="testi-role">Director of Works, Obafemi Awolowo University</div>
            </div>
          </div>
          <div class="testi-card">
            <div class="testi-card-top">
              <div class="testi-avatar">BI</div>
              <div class="testi-stars"><StarIcon v-for="n in 5" :key="n" class="star" /></div>
            </div>
            <p class="testi-quote">"The integrated CCTV and access control system has transformed our hospital's security posture. Their team understood the sensitivity of a healthcare environment and delivered accordingly."</p>
            <div class="testi-author">
              <div class="testi-name">Dr. Bola Idowu</div>
              <div class="testi-role">CEO, Ondo State Teaching Hospital</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EV SECTION -->
    <section class="ev-section section-clipped section-divider" id="ev">
      <div class="container ev-inner">
        <div class="ev-visual reveal-left">
          <div class="ev-icon"><ZapIcon class="ev-zap-icon" /></div>
          <h3>EV Charging Infrastructure</h3>
          <div class="ev-badge"><RocketIcon class="ev-badge-icon" /> First-Mover in Nigeria</div>
          <div class="ev-charging-pricing">
            <div class="ev-price-item">
              <div class="ev-price-header">
                <div class="ev-price-label">Home Charger (AC)</div>
                <div class="ev-price-val">from ₦350,000</div>
              </div>
              <div class="ev-gauge"><div class="ev-gauge-fill" style="width:14%"></div></div>
              <div class="ev-price-kw">7 kW</div>
            </div>
            <div class="ev-price-item">
              <div class="ev-price-header">
                <div class="ev-price-label">Commercial Fleet (AC)</div>
                <div class="ev-price-val">from ₦1.2m</div>
              </div>
              <div class="ev-gauge"><div class="ev-gauge-fill" style="width:44%"></div></div>
              <div class="ev-price-kw">22 kW</div>
            </div>
            <div class="ev-price-item">
              <div class="ev-price-header">
                <div class="ev-price-label">Public Fast Charger (DC)</div>
                <div class="ev-price-val">from ₦6.5m</div>
              </div>
              <div class="ev-gauge"><div class="ev-gauge-fill" style="width:100%"></div></div>
              <div class="ev-price-kw">50 kW</div>
            </div>
          </div>
        </div>
        <div class="reveal-right">
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
    <section class="cta-section section-clipped section-divider" id="contact" :style="{ backgroundImage: `url(${ctaSolarDuskBg})` }">
      <div class="cta-overlay" aria-hidden="true"></div>
      <div class="container cta-inner">
        <span class="cta-eyebrow">Ready to Start?</span>
        <h2 class="cta-heading">Your energy independence<br class="cta-br"> begins here.</h2>
        <p class="cta-desc">Free, no-obligation energy audit — our engineers visit your site, assess your needs, and deliver a full proposal.</p>
        <div class="cta-actions">
          <router-link to="/load-audit" class="cta-btn cta-btn--solid">
            <CalculatorIcon class="cta-btn-icon" />
            Book Free Audit
          </router-link>
          <a href="tel:07041880339" class="cta-btn cta-btn--ghost">
            <PhoneIcon class="cta-btn-icon" />
            0704 188 0339
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  Calculator as CalculatorIcon, 
  Calendar as CalendarIcon, 
  Sparkles as SparklesIcon, 
  MessageSquare as MessageSquareIcon,
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
  MapPin as MapPinIcon,
  ShieldCheck as ShieldCheckIcon,
  Battery as BatteryIcon,
  Clock as ClockIcon,
  Award as AwardIcon,
  Users as UsersIcon,
  Activity as ActivityIcon,
  Wrench as WrenchIcon
} from 'lucide-vue-next';

import marketplaceService from '@/services/marketplace.service';

// PDF Assets
import projectOndoImg from '../assets/pdf-assets/project-ondo.jpg';
import projectGofamintImg from '../assets/pdf-assets/project-gofamint.jpg';
import projectFcdaImg from '../assets/pdf-assets/project-fcda.jpg';
import projectJudgeImg from '../assets/pdf-assets/project-judge.jpg';
import projectIfeImg from '../assets/pdf-assets/project-ife.jpg';

// Section Background Images

import processEngineeringBg from '../assets/process_engineering_bg.jpg';
import ctaSolarDuskBg from '../assets/cta_solar_dusk_bg.jpg';

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

// ----------------- HERO H1 TYPEWRITER -----------------
const swapPhrases = [
  ' Energy Independence',
  ' Solar Power Systems',
  ' BESS & Storage',
  ' EV Charging Networks',
  ' Security Solutions',
  ' Engineering Excellence',
];

const typeTextRef   = ref(null);
const typeCursorRef = ref(null);
// keep swapTrackRef defined so nothing else breaks
const swapTrackRef  = ref(null);

let typeIndex    = 0;   // current phrase index
let typeTimer    = null;
let typeRunning  = false;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const typeWriter = async () => {
  typeRunning = true;
  while (typeRunning) {
    const phrase = swapPhrases[typeIndex % swapPhrases.length];
    const el     = typeTextRef.value;
    const cursor = typeCursorRef.value;
    if (!el || !cursor) break;

    // — Type in —
    cursor.style.opacity = '1';
    for (let i = 0; i <= phrase.length; i++) {
      if (!typeRunning) return;
      el.textContent = phrase.slice(0, i);
      await sleep(55 + Math.random() * 35);   // natural typing rhythm
    }

    // — Pause at full phrase —
    await sleep(1800);

    // — Delete —
    cursor.style.opacity = '1';
    for (let i = phrase.length; i >= 0; i--) {
      if (!typeRunning) return;
      el.textContent = phrase.slice(0, i);
      await sleep(28 + Math.random() * 20);   // delete faster
    }

    await sleep(300);
    typeIndex++;
  }
};

const startSwap = () => {
  typeRunning = false;
  clearTimeout(typeTimer);
  // small delay so DOM is ready
  typeTimer = setTimeout(typeWriter, 600);
};
const stopSwap = () => {
  typeRunning = false;
  clearTimeout(typeTimer);
};

// ----------------- HERO PRODUCT TICKER (rAF horizontal scroll) -----------------
const heroProducts    = ref([]);
const tickerRef       = ref(null);
const tickerTrackRef  = ref(null);
let   tickerRaf       = null;
let   tickerPos       = 0;
let   tickerPaused    = false;
let   tickerHalfWidth = 0;

const runTicker = () => {
  const track = tickerTrackRef.value;
  if (!track) return;

  // Measure half-width once (one full copy of items)
  if (!tickerHalfWidth) {
    tickerHalfWidth = track.scrollWidth / 2;
  }

  if (!tickerPaused) {
    tickerPos += 0.6;                             // px per frame ≈ ~36px/s at 60fps
    if (tickerPos >= tickerHalfWidth) tickerPos = 0; // seamless reset
    track.style.transform = `translateX(-${tickerPos}px)`;
  }

  tickerRaf = requestAnimationFrame(runTicker);
};

const startTicker = () => {
  if (tickerRaf) cancelAnimationFrame(tickerRaf);
  tickerHalfWidth = 0;   // re-measure after products load
  tickerPos = 0;
  tickerRaf = requestAnimationFrame(runTicker);
};

const pauseTicker  = () => { tickerPaused = true; };
const resumeTicker = () => { tickerPaused = false; };

const getHeroImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://api.originelectricltd.com${path}`;
};

const parseHeroImages = (images) => {
  try {
    const arr = typeof images === 'string' ? JSON.parse(images || '[]') : (images || []);
    return arr.length ? arr : [];
  } catch { return []; }
};

const fetchHeroProducts = async () => {
  try {
    const res = await marketplaceService.getProducts({ page: 1, limit: 60 });
    const raw = res.products || res || [];
    heroProducts.value = raw.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price).toLocaleString('en-NG'),
      category: p.category || '',
      image: getHeroImageUrl(parseHeroImages(p.images)[0] || '')
    }));
  } catch (e) {
    console.error('Hero products fetch error:', e);
  }
};

const startHeroScroll = () => {};   /* no-op — replaced by rAF ticker */
const stopHeroScroll  = () => {};

onUnmounted(() => {
  if (tickerRaf) cancelAnimationFrame(tickerRaf);
  stopSwap();
});

// ----------------- INSTALLER MODAL -----------------
function openInstallerModal() {
  window.dispatchEvent(new CustomEvent('open-installer-modal'));
}

// ----------------- LIFECYCLE -----------------
onMounted(() => {
  // Start H1 word swap
  startSwap();

  // Start ticker immediately (skeleton chips give it content to scroll)
  startTicker();

  // Fetch products, then restart ticker so it re-measures the real item width
  fetchHeroProducts().then(() => {
    // nextTick lets Vue render the real chips before we re-measure
    setTimeout(startTicker, 100);
  });

  // Scroll Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade, .reveal-stagger').forEach((el) => {
    revealObserver.observe(el);
  });

  // Hero elements — trigger with staggered CSS animation delays
  const heroEls = document.querySelectorAll('.hero .reveal, .hero .reveal-right, .hero .reveal-fade');
  heroEls.forEach((el, i) => {
    const delay = el.style.getPropertyValue('--reveal-delay') || `${i * 100}ms`;
    setTimeout(() => el.classList.add('visible'), parseInt(delay) || i * 100);
  });
});
</script>

<style scoped>
/* ── Local token aliases ── */
.home-view {
  --orange:  var(--color-primary);
  --orange2: var(--color-primary-light);
  --orange3: var(--color-orange-light);
  --border:  rgba(255, 118, 0, 0.15);
  overflow-x: hidden;
  min-width: 0;
}

.text-left   { text-align: left; }
.text-center { text-align: center; }
.mt-sm  { margin-top: 0.5rem; }
.mt-md  { margin-top: 1.5rem; }

/* ══════════════════════════════════════════
   HERO — full-screen centered column
   Matches reference: min-h-screen, flex-col,
   items-center, text-center, dark bg photo
   ══════════════════════════════════════════ */
.hero {
  position: relative;
  min-height: 100svh;
  padding-top: calc(5.5rem + env(safe-area-inset-top, 0px));
  padding-bottom: 0;              /* ticker bleeds to edge */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #0a0a0a;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

/* Hero background — no image, pure dark */

/* Circuit SVG decoration */
.circuit-line {
  position: absolute;
  right: 0; top: 0;
  width: 55%; height: 100%;
  opacity: 0.08;
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
@keyframes dot-appear    { to { opacity: 1; } }

/* ── Hero body — centered column ── */
.hero-body {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

/* Eyebrow badge */
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,118,0,0.1);
  border: 1px solid rgba(255,118,0,0.28);
  border-radius: var(--radius-xs);
  padding: 5px 14px;
  font-family: var(--font-main);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 1.4rem;
}
.hero-eyebrow-dot {
  width: 6px; height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px var(--color-primary);
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1;   transform: scale(1);   }
  50%       { opacity: 0.4; transform: scale(0.6); }
}

/* ── H1 — large display type ── */
.hero-h1 {
  font-family: var(--font-display);
  /* matches reference text-4xl → text-7xl clamp */
  font-size: clamp(2.6rem, 6.5vw, 5rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #fff;
  margin-bottom: 1.25rem;
  max-width: 820px;
}
.hero-h1 .highlight {
  background: linear-gradient(135deg, var(--orange), var(--orange2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
}
/* hide the mobile-only <br> on desktop */
.hero-br-mobile { display: none; }
@media (max-width: 520px) { .hero-br-mobile { display: block; } }

/* ── H1 typewriter ── */
.hero-type-wrap {
  display: inline;
  position: relative;
}
.hero-type-text {
  background: linear-gradient(135deg, var(--orange) 0%, var(--orange2) 50%, #ffb347 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: type-gradient-shift 4s linear infinite;
}
@keyframes type-gradient-shift {
  0%   { background-position: 0% center; }
  100% { background-position: 200% center; }
}
.hero-type-cursor {
  display: inline-block;
  width: 3px;
  background: var(--orange);
  -webkit-text-fill-color: var(--orange);
  color: var(--orange);
  margin-left: 2px;
  font-weight: 300;
  animation: cursor-blink 0.75s step-end infinite;
  vertical-align: baseline;
}
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* Sub-copy */
.hero-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  max-width: 600px;
  line-height: 1.7;
  margin-bottom: 2.25rem;
}

/* ══════════════════════════════════════
   BUTTON ROW — compact modern-tech style
   ══════════════════════════════════════ */
.hero-btn-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-bottom: 1.5rem;
}

/* Base hero button */
.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 18px;
  border-radius: var(--radius-full);   /* pill — modern tech */
  font-family: var(--font-main);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  transition:
    background  0.18s ease,
    border-color 0.18s ease,
    box-shadow  0.2s ease,
    transform   0.2s var(--transition-bounce);
}
.hero-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%);
  background-size: 200% 100%;
  background-position: -100% 0;
  transition: background-position 0.5s ease;
  pointer-events: none;
  border-radius: inherit;
}
.hero-btn:hover::after { background-position: 200% 0; }
.hero-btn:hover        { transform: translateY(-1px); }
.hero-btn:active       { transform: scale(0.96); opacity: 0.88; }

.hero-btn-icon { width: 14px; height: 14px; flex-shrink: 0; stroke-width: 2; }

/* Solid orange — primary CTA */
.hero-btn--primary {
  background: var(--orange);
  color: #fff;
  border-color: var(--orange);
  box-shadow: 0 2px 14px -3px rgba(255,118,0,0.55);
}
.hero-btn--primary:hover {
  background: var(--orange2);
  border-color: var(--orange2);
  box-shadow: 0 4px 20px -4px rgba(255,118,0,0.65);
}

/* Glass — secondary actions */
.hero-btn--glass {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9);
  border-color: rgba(255,255,255,0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.hero-btn--glass:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}

/* Ghost — tertiary actions */
.hero-btn--ghost {
  background: transparent;
  color: rgba(255,255,255,0.65);
  border-color: rgba(255,255,255,0.14);
}
.hero-btn--ghost:hover {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.9);
  border-color: rgba(255,255,255,0.26);
}

/* ══════════════════════════════════════
   CTA QUICK-ACTION TILES (4 tiles row)
   ══════════════════════════════════════ */
.hero-cta-tiles {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 680px;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.hero-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1 1 120px;
  min-width: 110px;
  padding: 14px 12px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.12);
  text-decoration: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    background  0.2s ease,
    border-color 0.2s ease,
    transform   0.22s var(--transition-bounce);
  -webkit-tap-highlight-color: transparent;
}
.hero-tile:hover { transform: translateY(-3px); }

.hero-tile--ai {
  background: linear-gradient(135deg, rgba(255,118,0,0.18), rgba(30,30,30,0.5));
  border-color: rgba(255,118,0,0.28);
}
.hero-tile--ai:hover { background: linear-gradient(135deg, rgba(255,118,0,0.28), rgba(30,30,30,0.62)); border-color: rgba(255,118,0,0.45); }

.hero-tile--muted {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.hero-tile--muted:hover { background: rgba(255,255,255,0.11); border-color: rgba(255,255,255,0.26); }

.hero-tile-icon {
  width: 20px; height: 20px;
  color: rgba(255,255,255,0.8);
  stroke-width: 1.8;
  margin-bottom: 2px;
}
.hero-tile--ai .hero-tile-icon { color: var(--orange); }

.hero-tile-label {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  line-height: 1;
}
.hero-tile-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.2;
}

/* ══════════════════════════════════════
   HORIZONTAL AUTO-SCROLL TICKER
   Pure CSS @keyframes marquee — no JS.
   ══════════════════════════════════════ */
.hero-ticker-wrap {
  width: 100vw;          /* bleed beyond container */
  margin-left: calc(-50vw + 50%);
  position: relative;
  padding-bottom: 2.75rem;
}

/* Fade edges */
.hero-ticker-fade {
  position: absolute;
  top: 0; bottom: 20px;
  width: 80px;
  z-index: 3;
  pointer-events: none;
}
.hero-ticker-fade--left  {
  left: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.88) 0%, transparent 100%);
}
.hero-ticker-fade--right {
  right: 0;
  background: linear-gradient(to left, rgba(0,0,0,0.88) 0%, transparent 100%);
}

/* Scrolling container — overflow hidden */
.hero-ticker {
  overflow: hidden;
  width: 100%;
  cursor: default;
}

/* The moving track — rendered twice for seamless loop */
.hero-ticker-track {
  display: flex;
  align-items: center;
  gap: 10px;
  width: max-content;
  will-change: transform;
}

/* Product chip */
.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px 7px 7px;
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.18s ease, border-color 0.18s ease;
}
.hero-chip:hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,118,0,0.4);
}

.hero-chip-img-wrap {
  width: 32px; height: 32px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
}
.hero-chip-img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.hero-chip-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.4);
}

.hero-chip-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hero-chip-name {
  font-family: var(--font-main);
  font-size: 0.76rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hero-chip-price {
  font-family: var(--font-main);
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--orange);
}

/* Skeleton chip */
.hero-chip--skeleton {
  pointer-events: none;
  opacity: 0.6;
}
.hero-chip-skeleton-text {
  display: flex; flex-direction: column; gap: 3px;
}

/* Ticker metadata bar */
.hero-ticker-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
  font-family: var(--font-main);
  font-size: 0.72rem;
  color: rgba(255,255,255,0.45);
}
.hero-ticker-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 6px var(--color-success);
  animation: pulse-dot 2s infinite;
  flex-shrink: 0;
}
.hero-ticker-count { color: rgba(255,255,255,0.45); }
.hero-ticker-shoplink {
  color: var(--orange);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}
.hero-ticker-shoplink:hover { color: var(--orange2); }

/* Respect reduced-motion — stop the rAF ticker via pauseTicker on mount */
@media (prefers-reduced-motion: reduce) {
  .hero-ticker-track { transition: none; }
}

/* ══════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════ */
@media (max-width: 768px) {
  .hero-h1 { font-size: clamp(2.2rem, 8vw, 3.2rem); }
  .hero-sub { font-size: 0.92rem; }
  .hero-btn { height: 34px; padding: 0 15px; font-size: 0.77rem; }
  .hero-btn-icon { width: 13px; height: 13px; }
  .hero-cta-tiles { gap: 6px; }
  .hero-tile { min-width: 90px; padding: 12px 8px; }
  .hero-tile-title { font-size: 0.72rem; }
}
@media (max-width: 520px) {
  .hero-body { padding: 0 1rem 2.5rem; }
  .hero-btn-row { gap: 6px; }
  .hero-btn { height: 33px; padding: 0 13px; font-size: 0.75rem; flex: 1 1 calc(50% - 3px); }
  .hero-cta-tiles { display: grid; grid-template-columns: 1fr 1fr; }
  .hero-tile { flex: unset; }
  .hero-ticker-fade { width: 48px; }
}

/* ─────────────────────────────────────
   HERO CTA CARDS (kept for reference —
   no longer used in template)
/* ── ai-icon pulse (used by hero-tile--ai) ── */
.ai-icon { color: var(--orange); animation: aiPulse 2s ease-in-out infinite; }
@keyframes aiPulse {
  0%, 100% { transform: scale(1) rotate(0); opacity: 1; }
  50%       { transform: scale(1.15) rotate(12deg); opacity: 0.8; }
}

/* Legacy btn-icon alias */
.btn-icon { width: 15px; height: 15px; flex-shrink: 0; }

/* ══════════════════════════════════════════
   STATS BAR
   ══════════════════════════════════════════ */
.stats-bar {
  background: var(--bg-secondary);
  border-top: 2px solid var(--color-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 32px 0;
}
.stats-container-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 900px) {
  .stats-container-layout { grid-template-columns: repeat(2, 1fr); }
  .stat-item:nth-child(2) { border-right: none; }
  .stat-item:nth-child(3) { border-right: 1px solid var(--border-color); border-top: 1px solid var(--border-color); }
  .stat-item:nth-child(4) { border-right: none; border-top: 1px solid var(--border-color); }
}
.stat-item { text-align: center; padding: 12px 20px; border-right: 1px solid var(--border-color); }
.stat-item:last-child { border-right: none; }
.stat-number {
  font-family: var(--font-display);
  font-size: clamp(1.65rem, 2.5vw, 2.4rem);
  font-weight: 500; letter-spacing: -0.025em;
  color: var(--text-primary); line-height: 1; margin-bottom: 5px;
}
.stat-label { font-size: 0.78rem; color: var(--text-secondary); font-weight: 500; }

/* ══════════════════════════════════════════
   SECTION COMMON — border-t border-border/40 py-16
   ══════════════════════════════════════════ */
.services, .process, .cases, .fieldwork, .financing,
.testimonials, .ev-section { padding: 64px 0; }

@media (max-width: 992px) {
  .services, .process, .cases, .fieldwork,
  .financing, .testimonials, .ev-section { padding: 48px 0; }
}

/* Local reveal — global handles animation */


/* ----------------- SERVICES SECTION ----------------- */
.services {
  background: var(--bg-primary);
  border-top: 1px solid rgba(238,233,224,0.4);
}
.dark-mode .services { border-top: 1px solid rgba(42,37,32,0.4); }

.services-header {
  margin-bottom: 40px;
}

.section-eyebrow {
  font-family: var(--font-main);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 10px;
  display: block;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.75rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin-bottom: 14px;
  color: var(--text-primary);
}

.section-sub {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 580px;
  line-height: 1.6;
  letter-spacing: 0em;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

/* ═══════════════════════════════════════════════════
   UNIQUE CARD SYSTEM
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════
   SERVICE CARD — Photo card design
   Real image + diagonal wave + icon
   ═══════════════════════════════ */
.service-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.45s var(--transition-bounce),
    box-shadow 0.45s var(--transition-bounce),
    border-color 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

/* ── Photo section (top 55% of card) ── */
.svc-img-wrap {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-secondary);
}

.svc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
  transition: transform 0.7s var(--transition-bounce);
}

/* Per-card image focus — ensures subject is always visible */
.service-card:nth-child(1) .svc-img { object-position: center 30%; }   /* Solar — panels top */
.service-card:nth-child(2) .svc-img { object-position: center center; } /* CCTV — pole centre */
.service-card:nth-child(3) .svc-img { object-position: center 40%; }   /* Access — device centre */
.service-card:nth-child(4) .svc-img { object-position: center 50%; }   /* Fire — equipment */
.service-card:nth-child(5) .svc-img { object-position: center 40%; }   /* M&E — engineer */
.service-card:nth-child(6) .svc-img { object-position: center 50%; }   /* EV — charger */

.service-card:hover .svc-img {
  transform: scale(1.06);
}

/* Dark gradient at bottom of image — bleeds into body */
.svc-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.08) 0%,
    rgba(0,0,0,0.48) 100%
  );
  transition: opacity 0.3s ease;
}

.service-card:hover .svc-img-overlay {
  opacity: 0.85;
}

/* Category tag — top-left of image */
.svc-tag {
  position: absolute;
  top: 12px;
  left: 14px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(255,255,255,0.15);
  z-index: 2;
}

/* Service number — top-right of image */
.svc-num {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(255,118,0,0.35);
}

/* ── Card body ── */
.svc-body {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  /* Slight diagonal top-left cut using clip-path on the wrapper */
  position: relative;
}

/* Diagonal coloured bar across the join */
.svc-body::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s var(--transition-bounce);
}

.service-card:hover .svc-body::before {
  transform: scaleX(1);
}

/* Icon row — small pill icon below the join */
.svc-icon-row {
  margin-bottom: 14px;
  margin-top: -32px; /* pulls icon up into the image */
  z-index: 3;
  position: relative;
}

.svc-icon {
  width: 46px;
  height: 46px;
  background: var(--color-dark);
  color: var(--color-light);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(47,47,47,0.22);
  border: 3px solid var(--bg-primary);
  transition:
    transform 0.35s var(--transition-bounce),
    box-shadow 0.35s ease;
}

.svc-icon--orange {
  background: var(--color-primary);
  box-shadow: 0 4px 14px rgba(255,118,0,0.3);
}

.service-card:hover .svc-icon {
  transform: scale(1.1) rotate(-4deg);
  box-shadow: 0 8px 22px rgba(47,47,47,0.3);
}

.service-card:hover .svc-icon--orange {
  box-shadow: 0 8px 22px rgba(255,118,0,0.4);
}

.svc-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.service-card h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  line-height: 1.3;
  color: var(--text-primary);
}

.service-card p {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

/* Link — always visible but slides on hover */
.service-card-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  padding: 8px 14px;
  border-radius: var(--radius-xs);
  border: 1.5px solid var(--color-primary);
  width: fit-content;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    gap 0.2s ease,
    transform 0.3s var(--transition-bounce);
}

.service-card-link span {
  transition: transform 0.25s ease;
}

.service-card:hover .service-card-link {
  background: var(--color-primary);
  color: #fff;
  gap: 10px;
  transform: translateY(-1px);
}

.service-card:hover .service-card-link span {
  transform: translateX(3px);
}

/* Dark mode adjustments */
.dark-mode .svc-icon {
  border-color: var(--bg-primary);
}

/* ═══════════════════════════════════════════
   SERVICES — BENTO GRID
   ═══════════════════════════════════════════ */

/* Intro */
.svc-intro {
  margin-bottom: 40px;
}

.svc-intro .highlight {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Bento grid — magazine-style asymmetric layout */
.svc-bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 16px;
}

/* Wide cards span 2 columns */
.svc-bento-card--wide {
  grid-column: span 2;
}

@media (max-width: 900px) {
  .svc-bento {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .svc-bento-card--wide {
    grid-column: span 2;
  }
}

@media (max-width: 560px) {
  .svc-bento {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .svc-bento-card--wide {
    grid-column: span 1;
  }
}

/* Individual card */
.svc-bento-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 160px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.45s var(--transition-bounce), box-shadow 0.45s var(--transition-bounce);
}

.svc-bento-card--wide {
  height: 160px;
}

.svc-bento-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: var(--shadow-lg);
}

/* Full-bleed photo */
.svc-bento-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.7s var(--transition-bounce);
}

.svc-bento-card:hover .svc-bento-img {
  transform: scale(1.07);
}

/* Dark gradient overlay — always visible, deepens on hover */
.svc-bento-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(5, 10, 20, 0.92) 0%,
    rgba(5, 10, 20, 0.5) 50%,
    rgba(5, 10, 20, 0.1) 100%
  );
  transition: opacity 0.3s ease;
  z-index: 1;
}

.svc-bento-card:hover .svc-bento-overlay {
  opacity: 1.1;
}

/* Glass info panel — sits at bottom, slides up on hover */
.svc-bento-glass {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  transform: translateY(0);
  transition: transform 0.45s var(--transition-bounce);
}

/* Icon badge — top of glass panel */
.svc-bento-icon {
  width: 32px;
  height: 32px;
  background: var(--color-dark);
  color: var(--color-light);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(47,47,47,0.3);
  transition: transform 0.3s var(--transition-bounce);
}

.svc-bento-icon--orange {
  background: var(--color-primary);
  box-shadow: 0 3px 8px rgba(255,118,0,0.35);
}

.svc-bento-card:hover .svc-bento-icon {
  transform: scale(1.1) rotate(-5deg);
}

.svc-bento-icon svg {
  width: 15px;
  height: 15px;
  stroke-width: 2;
}

/* Content */
.svc-bento-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.svc-bento-tag {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.svc-bento-content h3 {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
  line-height: 1.25;
  margin: 0;
}

.svc-bento-content p {
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.5;
  margin: 0;
  /* Hidden on default — slides in on hover */
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(6px);
  transition:
    max-height 0.4s var(--transition-bounce),
    opacity 0.35s ease 0.05s,
    transform 0.35s var(--transition-bounce) 0.05s;
}

.svc-bento-card:hover .svc-bento-content p {
  max-height: 80px;
  opacity: 1;
  transform: translateY(0);
}

/* Stats row — only on wide cards */
.svc-bento-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s var(--transition-bounce), opacity 0.3s ease 0.1s;
}

.svc-bento-card:hover .svc-bento-stats {
  max-height: 40px;
  opacity: 1;
}

.svc-bento-stats span {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.65);
}

.svc-bento-stats strong {
  color: var(--color-primary);
  font-weight: 800;
}

/* CTA link */
.svc-bento-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  padding: 6px 13px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  width: fit-content;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.28s ease 0.1s,
    transform 0.32s var(--transition-bounce) 0.1s,
    background 0.2s ease,
    border-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.svc-bento-card:hover .svc-bento-link {
  opacity: 1;
  transform: translateY(0);
}

.svc-bento-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  gap: 10px;
}

.svc-bento-arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .svc-bento-card,
  .svc-bento-img,
  .svc-bento-content p,
  .svc-bento-link {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
    max-height: none !important;
  }
}

/* ----------------- PROCESS SECTION ----------------- */
.process {
  background-color: var(--bg-secondary);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

.process::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.48) 0%,
    rgba(0, 0, 0, 0.40) 50%,
    rgba(0, 0, 0, 0.52) 100%
  );
  z-index: 0;
  pointer-events: none;
}

.process .container {
  position: relative;
  z-index: 1;
}

.process .section-title,
.process .section-sub {
  color: #fff !important;
}

.process .process-step h3 {
  color: #fff !important;
}

.process .process-step p {
  color: rgba(255, 255, 255, 0.78) !important;
}

.process .step-num {
  background: rgba(0, 0, 0, 0.45);
  border-color: var(--orange);
  color: var(--orange);
}

.process-header {
  text-align: center;
  margin-bottom: 56px;
}

.process-header .section-title, .process-header .section-sub {
  margin-left: auto;
  margin-right: auto;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  position: relative;
  align-items: stretch;
}

@media (max-width: 900px) {
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 560px) {
  .process-steps {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

.process-step {
  text-align: center;
  padding: 0 16px;
  position: relative;
  z-index: 2;
}

.step-num {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-family: var(--font-main);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--orange);
  box-shadow: 0 0 0 6px rgba(255, 118, 0, 0.08);
}

.process-step h3 {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.process-step p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  letter-spacing: 0em;
}

/* ----------------- CASE STUDIES SECTION ----------------- */
.cases {
  background: var(--bg-primary);
}

.cases-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .cases-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

/* ── CASE CARD — full-bleed image + slide-up frosted drawer ── */
.case-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.4s var(--transition-bounce),
    box-shadow 0.4s var(--transition-bounce);
  /* remove old bg/border — image is the card face */
  background: var(--bg-secondary);
  border: none;
  /* Uniform height — all case cards in a row are identical height */
  height: 340px;
}

.case-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: var(--shadow-lg);
}

/* Full-bleed image wrapper */
.case-card-img-wrapper {
  position: absolute;
  inset: 0;
  height: 100%;
}

.case-card-img-src {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s var(--transition-bounce);
}

.case-card:hover .case-card-img-src {
  transform: scale(1.08);
}

/* Dark gradient over image always visible at bottom */
.case-card-img-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 12, 18, 0.92) 0%,
    rgba(10, 12, 18, 0.45) 50%,
    transparent 100%
  );
  transition: opacity 0.3s ease;
}

/* Tag badge — top-left */
.case-tag-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 118, 0, 0.9);
  backdrop-filter: blur(8px);
  color: white;
  border-radius: var(--radius-xs);
  padding: 4px 12px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  z-index: 3;
}

/* Slide-up drawer — sits at bottom, expands on hover */
.case-drawer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 20px 20px 18px;
  /* Frosted glass effect */
  background: rgba(10, 12, 18, 0.75);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  /* Start collapsed — only show metrics + title */
  max-height: 110px;
  transition: max-height 0.5s var(--transition-bounce), padding 0.3s ease;
  overflow: hidden;
}

.case-card:hover .case-drawer {
  max-height: 280px;
}

/* Metric pills row */
.case-drawer-metrics {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.case-metric-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xs);
  padding: 3px 10px;
}

.case-metric-val {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.01em;
  display: inline;
}

.case-metric-label {
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.03em;
  display: inline;
}

/* Title always visible */
.case-drawer h3 {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
  line-height: 1.3;
}

/* Description — hidden until hover */
.case-drawer p {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.55;
  margin-bottom: 14px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease 0.1s, transform 0.35s var(--transition-bounce) 0.1s;
}

.case-card:hover .case-drawer p {
  opacity: 1;
  transform: translateY(0);
}

/* CTA link */
.case-drawer-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.22s ease 0.15s, transform 0.28s var(--transition-bounce) 0.15s;
  letter-spacing: 0.01em;
}

.case-card:hover .case-drawer-link {
  opacity: 1;
  transform: translateY(0);
}

.case-card-img {
  height: 180px;
  background: linear-gradient(135deg, rgba(255, 118, 0, 0.08), var(--bg-secondary));
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
  background: rgba(255, 118, 0, 0.12);
  border-radius: var(--radius-md);
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

/* (old case-card-body/metrics removed — replaced by .case-drawer system above) */

/* ═══════════════════════════════════════════
   FIELD WORK SECTION
   ═══════════════════════════════════════════ */

.fieldwork {
  background: var(--bg-primary);
}

/* Header row */
.fw-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.fw-header-left {
  flex: 1;
  min-width: 260px;
}

/* Stats cluster */
.fw-header-stats {
  display: flex;
  gap: 32px;
  flex-shrink: 0;
}

.fw-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.fw-stat-val {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-primary);
  line-height: 1;
}

.fw-stat-lbl {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .fw-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  .fw-header-stats {
    gap: 20px;
  }
  .fw-stat {
    align-items: flex-start;
  }
  .fw-stat-val {
    font-size: 1.4rem;
  }
}

/* ── Masonry photo grid ── */
.fw-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 220px 220px;
  gap: 12px;
  margin-bottom: 28px;
}

/* Tall card spans 2 rows */
.fw-photo--tall {
  grid-row: span 2;
}

@media (max-width: 900px) {
  .fw-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 180px 180px 180px;
  }
  .fw-photo--tall {
    grid-row: span 2;
  }
}

@media (max-width: 560px) {
  .fw-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 150px);
    gap: 8px;
  }
  .fw-photo--tall {
    grid-row: span 2;
    grid-column: span 1;
  }
}

/* Individual photo */
.fw-photo {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.4s var(--transition-bounce),
    box-shadow 0.4s var(--transition-bounce);
}

.fw-photo:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
  z-index: 2;
}

.fw-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.7s var(--transition-bounce);
}

.fw-photo:hover .fw-img {
  transform: scale(1.07);
}

/* Dark gradient overlay */
.fw-photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(5, 10, 20, 0.82) 0%,
    rgba(5, 10, 20, 0.2) 55%,
    transparent 100%
  );
  transition: opacity 0.3s ease;
}

.fw-photo:hover .fw-photo-overlay {
  opacity: 0.9;
}

/* Label at bottom of each photo */
.fw-photo-label {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.02em;
  transform: translateY(4px);
  opacity: 0.85;
  transition:
    transform 0.35s var(--transition-bounce),
    opacity 0.3s ease;
}

.fw-photo:hover .fw-photo-label {
  transform: translateY(0);
  opacity: 1;
}

.fw-label-icon {
  width: 14px;
  height: 14px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* CTA strip */
.fw-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  gap: 16px;
  flex-wrap: wrap;
}

.fw-cta span {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.fw-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  background: var(--color-dark);
  color: var(--color-light);
  font-family: var(--font-main);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--color-dark);
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.fw-cta-btn:hover {
  background: #1a1a1a;
  border-color: #1a1a1a;
}
.fw-cta-btn:active { opacity: 0.85; }

.fw-cta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}
.fw-cta-btn:hover .fw-cta-icon { transform: translateX(2px); }

@media (max-width: 560px) {
  .fw-cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 18px;
  }
  .fw-cta-btn {
    width: 100%;
    justify-content: center;
  }
}

/* ----------------- TRUST BAR ----------------- */
.trust-bar {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 40px 0;
}

.trust-bar-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.trust-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 36px;
  flex-wrap: wrap;
}

.trust-logo {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-secondary);
  opacity: 0.45;
  letter-spacing: 0.06em;
  text-transform: uppercase;
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
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-family: var(--font-main);
  font-weight: 500;
  font-size: 0.83rem;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  -webkit-tap-highlight-color: transparent;
}
.mkt-tab.active {
  background: var(--color-dark);
  color: var(--color-light);
  border-color: var(--color-dark);
}
.mkt-tab:hover:not(.active) {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color-strong);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

.product-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
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
  padding: 7px 14px;
  border-radius: 999px;
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.01em;
  border: none;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.2s var(--transition-bounce);
  -webkit-tap-highlight-color: transparent;
}
.product-card:hover .product-btn {
  background: var(--orange);
  color: #fff;
  transform: translateY(-1px);
}

.empty-state-container {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
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
  border-radius: var(--radius-lg);
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.cta-icon-box {
  width: 60px;
  height: 60px;
  background: rgba(255, 118, 0, 0.1);
  border-radius: var(--radius-md);
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
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.financing-bullets li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1.5;
  letter-spacing: 0em;
  color: var(--text-secondary);
}

.bullet-check-icon {
  width: 15px;
  height: 15px;
  color: var(--orange);
  flex-shrink: 0;
}

.financing-tool {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-sm);
}

.tool-title {
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.tool-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
}

.tool-select, .tool-input {
  width: 100%;
  padding: 11px 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: var(--font-main);
  font-size: 0.9rem;
  margin-bottom: 16px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.tool-select:focus, .tool-input:focus {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(255, 118, 0, 0.1);
}

.tool-btn {
  width: 100%;
  height: 36px;
  padding: 0 16px;
  background: var(--color-dark);
  color: var(--color-light);
  border: 1px solid var(--color-dark);
  border-radius: 6px;
  font-family: var(--font-main);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.tool-btn:hover {
  background: #1a1a1a;
  border-color: #1a1a1a;
}
.tool-btn:active { opacity: 0.85; }

.tool-result {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s var(--transition-bounce), margin-top 0.4s;
  background: rgba(255, 118, 0, 0.04);
  border-radius: var(--radius-md);
  border: 0 solid var(--border);
}

.tool-result.visible {
  max-height: 500px;
  margin-top: 20px;
  padding: 18px;
  border: 1px solid var(--border);
}

.result-plan {
  margin-bottom: 12px;
}

.result-plan:last-child {
  margin-bottom: 0;
}

.result-plan-name {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 2px;
  text-transform: uppercase;
}

.result-plan-amount {
  font-family: var(--font-main);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--orange);
}

.result-plan-term {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.result-divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 12px 0;
}

.btn-sm-fit {
  padding: 7px 18px;
  font-size: 0.8rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
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
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

/* ── TESTIMONIAL CARD — thick left band + asymmetric layout ── */
.testi-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.4s var(--transition-bounce),
    box-shadow 0.4s var(--transition-bounce);
  /* Thick left color band */
  border-left: 4px solid var(--border-color);
}

.testi-card:hover {
  transform: translateY(-7px);
  box-shadow: var(--shadow-lg);
  border-left-color: var(--color-primary);
}

/* Inner content wrapper with proper padding */
.testi-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.testi-card:hover .testi-card-top {
  border-bottom-color: rgba(255, 118, 0, 0.15);
}

/* Avatar — prominent top-left */
.testi-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-xs);
  background: linear-gradient(135deg, var(--color-primary), var(--color-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-main);
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  box-shadow: 0 4px 14px -4px rgba(255, 118, 0, 0.5);
  transition: transform 0.35s var(--transition-bounce), box-shadow 0.3s ease;
}

.testi-card:hover .testi-avatar {
  transform: scale(1.1);
  box-shadow: 0 8px 20px -4px rgba(255, 118, 0, 0.55);
}

/* Stars */
.testi-stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 13px;
  height: 13px;
  fill: var(--color-primary);
  color: var(--color-primary);
}

/* Quote */
.testi-quote {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
  padding: 20px 24px 16px;
  font-style: italic;
  flex: 1;
  position: relative;
  transition: color 0.3s ease;
}

/* Large opening quote mark — decorative */
.testi-quote::before {
  content: '\201C';
  position: absolute;
  top: 8px;
  left: 16px;
  font-size: 3.5rem;
  line-height: 1;
  color: var(--color-primary);
  opacity: 0.12;
  font-family: Georgia, serif;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.testi-card:hover .testi-quote::before {
  opacity: 0.22;
}

/* Author section */
.testi-author {
  padding: 14px 24px 20px;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.testi-card:hover .testi-author {
  border-top-color: rgba(255, 118, 0, 0.15);
}

.testi-name {
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.testi-role {
  font-size: 0.72rem;
  letter-spacing: 0.01em;
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
  border-radius: var(--radius-lg);
  padding: 40px 36px;
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
  background: radial-gradient(circle, rgba(255, 118, 0, 0.08) 0%, transparent 70%);
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
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.ev-badge {
  display: inline-block;
  background: var(--color-orange-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 5px 14px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--orange2);
  position: relative;
  z-index: 1;
}

.dark-mode .ev-badge {
  background: rgba(255, 118, 0, 0.15);
  color: var(--orange);
}

.ev-charging-pricing {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

/* ── EV PRICE ITEMS — capacity gauge bar ── */
.ev-price-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  transition:
    border-color 0.25s ease,
    transform 0.3s var(--transition-bounce),
    box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ev-price-item:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.ev-price-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.ev-price-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.ev-price-val {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

/* Gauge bar track */
.ev-gauge {
  height: 5px;
  background: var(--border-color);
  border-radius: var(--radius-xs);
  overflow: hidden;
  margin-bottom: 8px;
}

/* Gauge fill — animates on parent hover */
.ev-gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary));
  border-radius: var(--radius-xs);
  transition: width 0.8s var(--transition-bounce), opacity 0.3s ease;
  opacity: 0.7;
}

.ev-price-item:hover .ev-gauge-fill {
  opacity: 1;
}

/* kW label */
.ev-price-kw {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.01em;
}

.ev-features {
  margin: 28px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ev-feature {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.ev-feature-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: rgba(255, 118, 0, 0.08);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ev-feature-title {
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  margin-bottom: 3px;
}

.ev-feature-desc {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.55;
  letter-spacing: 0em;
}

/* ----------------- CTA SECTION ----------------- */
.cta-section {
  background-color: var(--bg-secondary);
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  padding: 100px 0;
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(5,10,20,0.72) 100%);
  pointer-events: none;
  z-index: 0;
}

.cta-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

.cta-eyebrow {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--orange);
  margin-bottom: 14px;
}

.cta-heading {
  font-size: clamp(1.6rem, 3.5vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: #fff;
  margin: 0 0 16px;
  max-width: 520px;
}

.cta-br { display: block; }

.cta-desc {
  font-size: 0.92rem;
  color: rgba(255,255,255,0.62);
  max-width: 420px;
  margin: 0 0 36px;
  line-height: 1.65;
  letter-spacing: 0.01em;
}

/* ── Button row ── */
.cta-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Shared pill base */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  border-radius: var(--radius-xs);
  font-family: var(--font-main);
  font-size: 0.83rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform 0.22s var(--transition-bounce),
    box-shadow 0.22s ease,
    background 0.18s ease,
    border-color 0.18s ease;
  -webkit-tap-highlight-color: transparent;
}

.cta-btn:active { transform: scale(0.96) !important; }

/* Solid orange */
.cta-btn--solid {
  background: var(--color-primary);
  color: #fff;
  border: 1.5px solid transparent;
  box-shadow: 0 4px 16px -4px rgba(255,118,0,0.45);
}
.cta-btn--solid:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: 0 8px 22px -5px rgba(255,118,0,0.55);
}

/* Ghost outline */
.cta-btn--ghost {
  background: rgba(255,255,255,0.07);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.28);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.cta-btn--ghost:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.5);
  transform: translateY(-1px);
}

.cta-btn-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  stroke-width: 2.2;
}

@media (max-width: 480px) {
  .cta-section { padding: 72px 0; }
  .cta-heading { font-size: 1.6rem; }
  .cta-br { display: none; }
  .cta-actions {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
    gap: 8px;
  }
  .cta-btn {
    width: 100%;
    justify-content: center;
  }
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