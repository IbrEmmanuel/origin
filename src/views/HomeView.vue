<template>
  <div class="home-view">
    <!-- HERO SECTION -->
    <section class="hero" id="home">
      <!-- Background slideshow -->
      <div class="hero-bg">
        <transition-group name="slide-fade" tag="div" class="hero-slides-wrap">
          <div
            v-for="(slide, i) in heroSlides"
            v-show="i === heroSlideActive"
            :key="slide"
            class="hero-slide"
            :class="`kb-${heroSlideKbDir[heroSlideActive]}`"
            :style="{ backgroundImage: `url(${slide})` }"
            aria-hidden="true"
          ></div>
        </transition-group>
        <div class="hero-bg-overlay"></div>
      </div>

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

        <p class="hero-brand reveal" style="--reveal-delay:40ms">Origin Electric</p>

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
          Solar, BESS, security, and EV charging — engineered for businesses, institutions, and government.
        </p>

        <!-- ── BUTTON ROW — justified modern-tech CTAs ── -->
        <div class="hero-btn-row reveal" style="--reveal-delay:280ms">
          <router-link to="/account/consultations" class="hero-btn hero-btn--primary">
            <CalendarIcon class="hero-btn-icon" />
            <span>Book Consultation</span>
          </router-link>
          <router-link to="/load-audit" class="hero-btn hero-btn--glass">
            <CalculatorIcon class="hero-btn-icon" />
            <span>Load Audit</span>
          </router-link>
          <router-link to="/sales-chat" class="hero-btn hero-btn--ghost">
            <MessageSquareIcon class="hero-btn-icon" />
            <span>Talk to Us</span>
          </router-link>
          <button type="button" class="hero-btn hero-btn--ghost" @click="openInstallerModal">
            <WrenchIcon class="hero-btn-icon" />
            <span>Request Install</span>
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
          <p class="section-sub text-left">End-to-end systems — designed, installed, and maintained by one engineering team.</p>
        </div>

        <!-- Bento-style service grid — 6 services, 2 rows of 3 -->
        <div class="svc-bento reveal-stagger">

          <!-- Solar PV — wide hero card, real installation photo -->
          <div class="svc-bento-card svc-bento-card--wide svc-bento-card--tall">
            <img src="../assets/pdf-assets/solar-2.jpg" alt="Origin team installing solar panels on rooftop" class="svc-bento-img" style="object-position: center 30%;" />
            <div class="svc-bento-overlay svc-bento-overlay--solar"></div>
            <div class="svc-bento-glass">
              <div class="svc-bento-icon svc-bento-icon--orange"><SunIcon /></div>
              <div class="svc-bento-content">
                <span class="svc-bento-tag">Solar Energy</span>
                <h3>Solar PV Systems</h3>
                <p>Grid-tied, off-grid and hybrid solar installations from 3 kW homes to 500 kW+ commercial plants — engineered for Nigeria's climate.</p>
                <div class="svc-bento-stats">
                  <span><strong>Grid-tied</strong> &amp; hybrid</span>
                  <span><strong>Commercial</strong> grade</span>
                  <span><strong>Engineered</strong> for NG</span>
                </div>
              </div>
              <router-link to="/services" class="svc-bento-link">Explore <ArrowRightIcon class="svc-bento-arrow" /></router-link>
            </div>
          </div>

          <!-- CCTV — real control room photo -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/cctv-main.jpg" alt="CCTV surveillance control room" class="svc-bento-img" />
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

          <!-- BESS / Battery Storage — wide, real battery bank photo -->
          <div class="svc-bento-card svc-bento-card--wide svc-bento-card--tall">
            <img src="../assets/pdf-assets/img-047.jpg" alt="Battery energy storage system installation" class="svc-bento-img" style="object-position: center 40%;" />
            <div class="svc-bento-overlay svc-bento-overlay--wind"></div>
            <div class="svc-bento-glass">
              <div class="svc-bento-icon"><BatteryIcon /></div>
              <div class="svc-bento-content">
                <span class="svc-bento-tag">Energy Storage</span>
                <h3>BESS &amp; Battery Solutions</h3>
                <p>Lithium and lead-acid battery banks paired with hybrid inverters — backup power that keeps your facility running when the grid fails.</p>
                <div class="svc-bento-stats">
                  <span><strong>LFP</strong> ready</span>
                  <span><strong>Hybrid</strong> inverters</span>
                  <span><strong>Backup</strong> first</span>
                </div>
              </div>
              <router-link to="/services" class="svc-bento-link">Explore <ArrowRightIcon class="svc-bento-arrow" /></router-link>
            </div>
          </div>

          <!-- Access Control — real automated gate photo -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/img-076.jpg" alt="Automated access control gate" class="svc-bento-img" style="object-position: center 60%;" />
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

          <!-- Fire Detection -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/fire-detector.jpg" alt="Fire detection system" class="svc-bento-img" />
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

          <!-- EV Charging — real commercial aerial with solar -->
          <div class="svc-bento-card">
            <img src="../assets/pdf-assets/img-017.jpg" alt="EV charging infrastructure" class="svc-bento-img" />
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
    <section class="process section-clipped section-divider" id="process">
      <div class="container">
        <div class="process-header reveal">
          <span class="section-eyebrow">How We Work</span>
          <h2 class="section-title">A disciplined process. Every project, every time.</h2>
          <p class="section-sub text-center">We follow a rigorous four-stage methodology so nothing is guessed, and nothing is left to chance.</p>
        </div>
        <div class="process-steps reveal-stagger">
          <div class="process-step">
            <div class="step-num">01</div>
            <div class="process-step-card">
              <h3>Audit &amp; Assess</h3>
              <p>We visit your site, measure your load, study your bills, and map your energy risks. No assumptions — only data.</p>
            </div>
          </div>
          <div class="process-step">
            <div class="step-num">02</div>
            <div class="process-step-card">
              <h3>Engineer &amp; Design</h3>
              <p>Our engineers produce detailed M&amp;E drawings, sizing calculations, and a cost-benefit model. You approve before we touch a cable.</p>
            </div>
          </div>
          <div class="process-step">
            <div class="step-num">03</div>
            <div class="process-step-card">
              <h3>Install &amp; Commission</h3>
              <p>Certified technicians execute to spec. We commission every system, test every component, and hand over full documentation.</p>
            </div>
          </div>
          <div class="process-step">
            <div class="step-num">04</div>
            <div class="process-step-card">
              <h3>Monitor &amp; Support</h3>
              <p>Remote monitoring dashboard keeps you informed 24/7. Maintenance plans ensure your system performs for decades.</p>
            </div>
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
          <router-link to="/projects" class="lp-btn lp-btn--accent">View All Projects <ArrowRightIcon class="lp-btn-icon" /></router-link>
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
              <span class="fw-stat-val">{{ liveStats.products || '—' }}</span>
              <span class="fw-stat-lbl">Live Products</span>
            </div>
            <div class="fw-stat">
              <span class="fw-stat-val">{{ liveStats.categories || '—' }}</span>
              <span class="fw-stat-lbl">Categories</span>
            </div>
            <div class="fw-stat">
              <span class="fw-stat-val">{{ liveStats.posts || '—' }}</span>
              <span class="fw-stat-lbl">Articles</span>
            </div>
          </div>
        </div>

        <!-- Editorial photo grid — all oooooo images + project shots -->
        <div class="fw-grid reveal-stagger">

          <!-- SLOT 1: Hero wide — IMG_0020 -->
          <div class="fw-photo fw-photo--wide">
            <img src="../assets/oooooo/web/IMG_0020.jpg" alt="Team on site" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--bottom-left">
              <ZapIcon class="fw-label-icon" />
              <span>Installation Day — Live</span>
            </div>
          </div>

          <!-- SLOT 2: tall right — IMG_0036 -->
          <div class="fw-photo fw-photo--tall-right">
            <img src="../assets/oooooo/web/IMG_0036.jpg" alt="Field engineers at work" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--bottom-left">
              <WrenchIcon class="fw-label-icon" />
              <span>Engineers on Ground</span>
            </div>
          </div>

          <!-- SLOT 3: tall right — IMG_3321 -->
          <div class="fw-photo fw-photo--tall-right">
            <img src="../assets/oooooo/web/IMG_3321.jpg" alt="Site work in progress" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--top-right">
              <SunIcon class="fw-label-icon" />
              <span>Active Site — Field Crew</span>
            </div>
          </div>

          <!-- SLOT 4: IMG_0058 -->
          <div class="fw-photo">
            <img src="../assets/oooooo/web/IMG_0058.jpg" alt="Site survey and audit" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <ActivityIcon class="fw-label-icon" />
              <span>Site Survey & Audit</span>
            </div>
          </div>

          <!-- SLOT 5: project-ondo -->
          <div class="fw-photo fw-photo--accent">
            <img src="../assets/pdf-assets/project-ondo.jpg" alt="Ondo 85kWh system" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--top-right">
              <ZapIcon class="fw-label-icon" />
              <span>85 kWh — Ondo State</span>
            </div>
          </div>

          <!-- SLOT 6: project-gofamint -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-gofamint.jpg" alt="CCTV Ibadan" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <CctvIcon class="fw-label-icon" />
              <span>40 Cameras — Ibadan</span>
            </div>
          </div>

          <!-- SLOT 7: IMG_3335 portrait -->
          <div class="fw-photo fw-photo--portrait">
            <img src="../assets/oooooo/web/IMG_3335.jpg" alt="Origin field team" class="fw-img fw-img--top" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--bottom-left">
              <UsersIcon class="fw-label-icon" />
              <span>Origin Field Team</span>
            </div>
          </div>

          <!-- SLOT 8: solar-main -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/solar-main.jpg" alt="Solar commissioning Ondo" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <SunIcon class="fw-label-icon" />
              <span>Solar Commissioning — Ondo</span>
            </div>
          </div>

          <!-- SLOT 9: project-fcda -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-fcda.jpg" alt="FCDA Abuja" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <ShieldCheckIcon class="fw-label-icon" />
              <span>Government Install — Abuja</span>
            </div>
          </div>

          <!-- SLOT 10: project-ife + project-judge side by side -->
          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-ife.jpg" alt="Ife residential" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <HomeIcon class="fw-label-icon" />
              <span>5 kW Residential — Ife</span>
            </div>
          </div>

          <div class="fw-photo">
            <img src="../assets/pdf-assets/project-judge.jpg" alt="Ibadan hybrid solar" class="fw-img" />
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
          <router-link to="/projects" class="lp-btn lp-btn--dark">
            View All Projects <ArrowRightIcon class="lp-btn-icon" />
          </router-link>
        </div>

      </div>
    </section>

    <!-- LIVE MARKETPLACE — API products -->
    <section class="home-market section-clipped section-divider" id="marketplace-preview">
      <div class="container">
        <div class="home-market-header reveal">
          <div>
            <span class="section-eyebrow">Live Marketplace</span>
            <h2 class="section-title text-left">Shop verified energy gear</h2>
            <p class="section-sub text-left">Real inventory from the Origin API — prices and stock update with the catalog.</p>
          </div>
          <router-link to="/marketplace" class="lp-btn lp-btn--accent">
            Open marketplace <ArrowRightIcon class="lp-btn-icon" />
          </router-link>
        </div>

        <div v-if="marketLoading" class="home-market-grid">
          <div v-for="n in 4" :key="n" class="home-mkt-card home-mkt-card--skel">
            <div class="skel media"></div>
            <div class="skel line w-40"></div>
            <div class="skel line w-80"></div>
          </div>
        </div>

        <div v-else-if="marketProducts.length" class="home-market-grid reveal-stagger">
          <router-link
            v-for="product in marketProducts"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="home-mkt-card"
          >
            <div class="home-mkt-media">
              <img v-if="product.image" :src="product.image" :alt="product.name" loading="lazy" />
              <div v-else class="home-mkt-fallback"><ZapIcon /></div>
              <span v-if="product.category" class="home-mkt-badge">{{ product.category }}</span>
            </div>
            <div class="home-mkt-body">
              <h3>{{ product.name }}</h3>
              <p class="home-mkt-price">₦{{ product.price }}</p>
              <span class="home-mkt-cta">View product <ArrowRightIcon class="lp-btn-icon" /></span>
            </div>
          </router-link>
        </div>

        <div v-else class="home-market-empty">
          <p>Marketplace catalog is loading from the API. Check back shortly or browse the full shop.</p>
          <router-link to="/marketplace" class="lp-btn lp-btn--dark">Go to marketplace</router-link>
        </div>
      </div>
    </section>

    <!-- LIVE STATS BAR — API counts -->
    <div class="trust-bar section-divider reveal-fade">
      <div class="container">
        <div class="trust-bar-label">Live from Origin systems</div>
        <div class="trust-logos trust-logos--stats">
          <span class="trust-logo">{{ liveStats.products || '—' }} PRODUCTS</span>
          <span class="trust-logo">{{ liveStats.categories || '—' }} CATEGORIES</span>
          <span class="trust-logo">{{ liveStats.posts || '—' }} ARTICLES</span>
          <span class="trust-logo">API CONNECTED</span>
        </div>
      </div>
    </div>

    <!-- FINANCING -->
    <section class="financing section-clipped section-divider" id="financing">
      <div class="container financing-inner">
        <div class="financing-content reveal">
          <span class="section-eyebrow">Flexible Financing</span>
          <h2 class="section-title text-left">Own your energy. Pay on your terms.</h2>
          <p class="section-sub text-left">Spread the cost of solar, storage, and security across a structured payment plan. Final offers are confirmed after a site audit with our engineers.</p>
          <ul class="financing-bullets">
            <li><CheckIcon class="bullet-check-icon" /> Tenure options from 12 to 60 months</li>
            <li><CheckIcon class="bullet-check-icon" /> Quote after a free load audit</li>
            <li><CheckIcon class="bullet-check-icon" /> Commercial and residential packages</li>
            <li><CheckIcon class="bullet-check-icon" /> Estimate tool below — illustrative only</li>
          </ul>
        </div>
        <div class="financing-tool reveal">
          <div class="tool-title">Estimate a payment plan</div>
          <p class="tool-disclaimer">Illustrative only — not a bank offer. Apply for a real quote via consultation.</p>
          
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
          
          <button type="button" class="lp-btn lp-btn--dark lp-btn--block" @click="calcPayment">Calculate estimate</button>
          
          <div :class="['tool-result', { visible: showResult }]">
            <div v-for="(plan, idx) in resultPlans" :key="idx" class="result-plan">
              <div class="result-plan-name">{{ plan.name }}</div>
              <div class="result-plan-amount">{{ plan.amount }}/month</div>
              <div class="result-plan-term">{{ plan.term }}</div>
              <hr v-if="idx < resultPlans.length - 1" class="result-divider" />
            </div>
            <div class="lp-actions lp-actions--center mt-md">
              <router-link to="/account/consultations" class="lp-btn lp-btn--accent">Request real quote</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED BLOG — API -->
    <section v-if="featuredPosts.length || postsLoading" class="home-blog section-clipped section-divider" id="insights">
      <div class="container">
        <div class="home-blog-header reveal">
          <div>
            <span class="section-eyebrow">From the blog</span>
            <h2 class="section-title text-left">Engineering insights</h2>
            <p class="section-sub text-left">Live articles from the Origin editorial API.</p>
          </div>
          <router-link to="/blog" class="lp-btn lp-btn--outline">View all articles</router-link>
        </div>

        <div v-if="postsLoading" class="home-blog-grid">
          <div v-for="n in 3" :key="n" class="home-blog-card home-blog-card--skel">
            <div class="skel media"></div>
            <div class="skel line w-50"></div>
            <div class="skel line w-90"></div>
          </div>
        </div>

        <div v-else class="home-blog-grid reveal-stagger">
          <router-link
            v-for="post in featuredPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="home-blog-card"
          >
            <div class="home-blog-media">
              <img v-if="post.image" :src="post.image" :alt="post.title" loading="lazy" />
              <div v-else class="home-blog-fallback">{{ post.initials }}</div>
              <span class="home-blog-badge">{{ post.category }}</span>
            </div>
            <div class="home-blog-body">
              <p class="home-blog-meta">{{ post.date }} · {{ post.minutes }} min</p>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- EV SECTION -->
    <section class="ev-section section-clipped section-divider" id="ev">
      <div class="container ev-inner">
        <div class="ev-visual reveal-left">
          <div class="ev-icon"><ZapIcon class="ev-zap-icon" /></div>
          <h3>EV Charging Infrastructure</h3>
          <div class="ev-badge"><RocketIcon class="ev-badge-icon" /> Live marketplace pricing</div>
          <div class="ev-charging-pricing">
            <template v-if="evProducts.length">
              <router-link
                v-for="item in evProducts"
                :key="item.id"
                :to="`/product/${item.id}`"
                class="ev-price-item ev-price-item--link"
              >
                <div class="ev-price-header">
                  <div class="ev-price-label">{{ item.name }}</div>
                  <div class="ev-price-val">₦{{ item.price }}</div>
                </div>
                <div class="ev-gauge"><div class="ev-gauge-fill" :style="{ width: item.gauge }"></div></div>
                <div class="ev-price-kw">{{ item.meta }}</div>
              </router-link>
            </template>
            <div v-else class="ev-price-empty">
              <p>Browse live EV / charging products in the marketplace for current pricing.</p>
              <router-link to="/marketplace" class="lp-btn lp-btn--accent lp-btn--block">Shop EV gear</router-link>
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
          <div class="lp-actions lp-actions--block ev-cta">
            <router-link to="/load-audit" class="lp-btn lp-btn--accent lp-btn--block">
              Request EV Charger Quote
              <ArrowRightIcon class="lp-btn-icon" />
            </router-link>
          </div>
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
        <div class="cta-actions lp-actions lp-actions--center">
          <router-link to="/load-audit" class="lp-btn lp-btn--accent lp-btn--lg">
            <CalculatorIcon class="lp-btn-icon" />
            <span>Book Free Audit</span>
          </router-link>
          <a href="tel:07041880339" class="lp-btn lp-btn--glass lp-btn--lg">
            <PhoneIcon class="lp-btn-icon" />
            <span>0704 188 0339</span>
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
import blogService from '@/services/blog.service';
import { mediaUrl, firstMediaUrl } from '@/utils/mediaUrl';

// PDF Assets
import projectOndoImg from '../assets/pdf-assets/project-ondo.jpg';
import projectGofamintImg from '../assets/pdf-assets/project-gofamint.jpg';
import projectFcdaImg from '../assets/pdf-assets/project-fcda.jpg';
import projectJudgeImg from '../assets/pdf-assets/project-judge.jpg';
import projectIfeImg from '../assets/pdf-assets/project-ife.jpg';

// Section Background Images
import ctaSolarDuskBg from '../assets/cta_solar_dusk_bg.jpg';

// oooooo Hero Slideshow Images — web-optimised versions (compressed, portrait-cropped to 16:9)
import heroSlide0 from '../assets/oooooo/web/IMG_0020.jpg';
import heroSlide1 from '../assets/oooooo/web/IMG_0036.jpg';
import heroSlide2 from '../assets/oooooo/web/IMG_0058.jpg';
import heroSlide3 from '../assets/oooooo/web/IMG_3321.jpg';
import heroSlide4 from '../assets/oooooo/web/IMG_3335.jpg';

// ----------------- HERO SLIDESHOW -----------------
const heroSlides = [heroSlide0, heroSlide1, heroSlide2, heroSlide3, heroSlide4];

// KB direction cycles with every advance — stored as reactive so the
// active slide div gets a fresh class (which restarts the CSS animation)
const KB_DIRS = ['zil', 'zir', 'zol', 'zor'];
const heroSlideActive = ref(0);
const heroSlideKbDir  = ref(KB_DIRS[0]);
let   heroSlideTimer  = null;

const advanceHeroSlide = () => {
  const next = (heroSlideActive.value + 1) % heroSlides.length;
  heroSlideActive.value = next;
  heroSlideKbDir.value  = KB_DIRS[next % KB_DIRS.length];
};

const startHeroSlideshow = () => {
  clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(advanceHeroSlide, 5500);
};

const stopHeroSlideshow = () => {
  clearInterval(heroSlideTimer);
};

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
  // Illustrative amortisation only — not a lender quote
  const rates = { 12: 0.025, 24: 0.022, 36: 0.019, 48: 0.018, 60: 0.017 };
  const r = rates[tenureVal];
  const base = (budgetVal * r * Math.pow(1 + r, tenureVal)) / (Math.pow(1 + r, tenureVal) - 1);
  const fmt = n => '₦' + Math.round(n).toLocaleString('en-NG');

  resultPlans.value = [
    {
      name: 'Illustrative estimate',
      amount: fmt(base),
      term: `for ${tenureVal} months · Est. total: ${fmt(base * tenureVal)} · confirm via consult`
    }
  ];
  showResult.value = true;
};

// ----------------- LIVE API DATA (marketplace + blog) -----------------
const marketProducts = ref([]);
const marketLoading = ref(true);
const featuredPosts = ref([]);
const postsLoading = ref(true);
const evProducts = ref([]);
const liveStats = ref({ products: 0, categories: 0, posts: 0 });

const mapProductCard = (p) => ({
  id: p.id,
  name: p.name,
  price: Number(p.price).toLocaleString('en-NG'),
  category: p.category || p.category_name || '',
  image: firstMediaUrl(p.images) || mediaUrl(p.featured_image) || ''
});

const isEvRelated = (p) => {
  const hay = `${p.name || ''} ${p.category || ''} ${p.description || ''}`.toLowerCase();
  return /ev|charg|electric vehicle|wall.?box|dc fast|ac charg/.test(hay);
};

const fetchLiveCatalog = async () => {
  marketLoading.value = true;
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      marketplaceService.getProducts({ page: 1, limit: 48 }),
      marketplaceService.getCategories().catch(() => [])
    ]);
    const raw = productsRes.products || productsRes || [];
    const list = Array.isArray(raw) ? raw : [];
    liveStats.value.products = productsRes.total || list.length || 0;

    let cats = categoriesRes;
    if (!Array.isArray(cats) && cats?.value) cats = cats.value;
    if (!Array.isArray(cats) && cats && typeof cats === 'object') {
      cats = Object.keys(cats);
    }
    liveStats.value.categories = Array.isArray(cats) ? cats.length : 0;

    marketProducts.value = list.slice(0, 8).map(mapProductCard);

    const ev = list.filter(isEvRelated).slice(0, 3);
    const maxPrice = Math.max(...ev.map((p) => Number(p.price) || 0), 1);
    evProducts.value = ev.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price).toLocaleString('en-NG'),
      meta: p.category || 'Marketplace',
      gauge: `${Math.max(12, Math.round((Number(p.price) / maxPrice) * 100))}%`
    }));
  } catch (e) {
    console.error('Live catalog fetch error:', e);
    marketProducts.value = [];
    evProducts.value = [];
  } finally {
    marketLoading.value = false;
  }
};

const fetchFeaturedBlog = async () => {
  postsLoading.value = true;
  try {
    const posts = await blogService.getFeaturedPosts();
    liveStats.value.posts = posts.length;
    featuredPosts.value = posts.slice(0, 3).map((p) => {
      const plain = String(p.excerpt || p.content || '')
        .replace(/[#*`_~]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category_name || 'Insights',
        image: p.featured_image ? mediaUrl(p.featured_image) : '',
        date: p.created_at
          ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—',
        minutes: blogService.readingMinutes(p.content),
        excerpt: plain.length > 120 ? `${plain.slice(0, 120)}…` : plain,
        initials: String(p.title || 'OE')
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0] || '')
          .join('')
          .toUpperCase()
      };
    });
    // Prefer total article count when possible
    try {
      const all = await blogService.getAllPosts();
      if (all.length) liveStats.value.posts = all.length;
    } catch { /* keep featured length */ }
  } catch (e) {
    console.error('Featured blog fetch error:', e);
    featuredPosts.value = [];
  } finally {
    postsLoading.value = false;
  }
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
  stopHeroSlideshow();
});

// ----------------- INSTALLER MODAL -----------------
function openInstallerModal() {
  window.dispatchEvent(new CustomEvent('open-installer-modal'));
}

// ----------------- LIFECYCLE -----------------
onMounted(() => {
  // Start H1 word swap
  startSwap();

  // Start hero background slideshow
  startHeroSlideshow();

  // Start ticker immediately (skeleton chips give it content to scroll)
  startTicker();

  // Live API: hero ticker + marketplace preview + blog + EV pricing
  fetchLiveCatalog();
  fetchFeaturedBlog();

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
  background-color: #000;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

/* Hero background */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
/* ── Hero Slideshow ── */
.hero-slides-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  will-change: opacity, transform;
}

/* Vue transition-group enter/leave hooks */
.slide-fade-enter-active {
  z-index: 2;
  animation: kbSlideIn 5.5s ease-out forwards;
}
.slide-fade-leave-active {
  z-index: 1;
  animation: kbSlideOut 1.3s ease-in forwards;
}
.slide-fade-enter-from { opacity: 0; }
.slide-fade-leave-to   { opacity: 0; }

/* Per-direction Ken Burns on enter */
.slide-fade-enter-active.kb-zil { animation: kbSlideIn_zil 5.5s ease-out forwards; }
.slide-fade-enter-active.kb-zir { animation: kbSlideIn_zir 5.5s ease-out forwards; }
.slide-fade-enter-active.kb-zol { animation: kbSlideIn_zol 5.5s ease-out forwards; }
.slide-fade-enter-active.kb-zor { animation: kbSlideIn_zor 5.5s ease-out forwards; }

@keyframes kbSlideIn {
  0%   { opacity: 0; transform: scale(1.08); }
  12%  { opacity: 1; }
  100% { opacity: 1; transform: scale(1.00); }
}
@keyframes kbSlideOut {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
/* Zoom-in from left */
@keyframes kbSlideIn_zil {
  0%   { opacity: 0; transform: scale(1.10) translate(2.5%,  1%); }
  12%  { opacity: 1; }
  100% { opacity: 1; transform: scale(1.00) translate(0%,    0%); }
}
/* Zoom-in from right */
@keyframes kbSlideIn_zir {
  0%   { opacity: 0; transform: scale(1.10) translate(-2.5%, -1%); }
  12%  { opacity: 1; }
  100% { opacity: 1; transform: scale(1.00) translate(0%,    0%);  }
}
/* Zoom-out to left */
@keyframes kbSlideIn_zol {
  0%   { opacity: 0; transform: scale(1.00) translate(0%,    0%); }
  12%  { opacity: 1; }
  100% { opacity: 1; transform: scale(1.10) translate(2.5%, -1%); }
}
/* Zoom-out to right */
@keyframes kbSlideIn_zor {
  0%   { opacity: 0; transform: scale(1.00) translate(0%,    0%);  }
  12%  { opacity: 1; }
  100% { opacity: 1; transform: scale(1.10) translate(-2.5%, 1%); }
}

/* Overlay sits on top of all slides */
.hero-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: linear-gradient(
    160deg,
    rgba(0,0,0,0.70) 0%,
    rgba(0,0,0,0.45) 55%,
    rgba(0,0,0,0.25) 100%
  );
}

.hero-bg-img {
  display: none;
}
/* placeholder so the closing brace below stays valid */
.hero-bg-overlay-placeholder {
  display: none;
}

/* Circuit SVG decoration */
.circuit-line {
  position: absolute;
  right: 0; top: 0;
  width: 55%; height: 100%;
  opacity: 0.05;
  z-index: 4;
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
  z-index: 5;
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 0 1.5rem 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

/* Brand — hero-level signal */
.hero-brand {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.4vw, 1.85rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0 0 1rem;
  line-height: 1;
}
.hero-brand::after {
  content: '';
  display: block;
  width: 36px;
  height: 2px;
  margin: 12px auto 0;
  background: var(--orange);
  border-radius: 1px;
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
  font-size: 1.05rem;
  color: rgba(255,255,255,0.68);
  max-width: 520px;
  line-height: 1.65;
  margin-bottom: 2rem;
  font-weight: 400;
}

/* ══════════════════════════════════════
   BUTTON ROW — justified modern-tech
   ══════════════════════════════════════ */
.hero-btn-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 720px;
  margin-bottom: 1.75rem;
}

/* Base hero button — sharp, equal, justified */
.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  font-family: var(--font-main);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.01em;
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
    transform   0.2s var(--transition-bounce),
    color 0.18s ease;
}
.hero-btn span {
  overflow: hidden;
  text-overflow: ellipsis;
}
.hero-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%);
  background-size: 200% 100%;
  background-position: -100% 0;
  transition: background-position 0.5s ease;
  pointer-events: none;
  border-radius: inherit;
}
.hero-btn:hover::after { background-position: 200% 0; }
.hero-btn:hover        { transform: translateY(-1px); }
.hero-btn:active       { transform: scale(0.97); opacity: 0.9; }

.hero-btn-icon { width: 15px; height: 15px; flex-shrink: 0; stroke-width: 2; }

/* Solid orange — primary CTA */
.hero-btn--primary {
  background: var(--orange);
  color: #fff;
  border-color: var(--orange);
  box-shadow: 0 2px 16px -4px rgba(255,118,0,0.55);
}
.hero-btn--primary:hover {
  background: var(--orange2);
  border-color: var(--orange2);
  box-shadow: 0 6px 22px -4px rgba(255,118,0,0.6);
}

/* Glass — secondary actions */
.hero-btn--glass {
  background: rgba(255,255,255,0.09);
  color: rgba(255,255,255,0.95);
  border-color: rgba(255,255,255,0.22);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.hero-btn--glass:hover {
  background: rgba(255,255,255,0.16);
  border-color: rgba(255,255,255,0.35);
  color: #fff;
}

/* Ghost — tertiary actions */
.hero-btn--ghost {
  background: rgba(255,255,255,0.03);
  color: rgba(255,255,255,0.78);
  border-color: rgba(255,255,255,0.16);
}
.hero-btn--ghost:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-color: rgba(255,255,255,0.3);
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
  .hero-sub { font-size: 0.95rem; }
  .hero-btn-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    max-width: 420px;
  }
  .hero-btn { height: 42px; padding: 0 12px; font-size: 0.78rem; }
  .hero-btn-icon { width: 14px; height: 14px; }
  .hero-cta-tiles { gap: 6px; }
  .hero-tile { min-width: 90px; padding: 12px 8px; }
  .hero-tile-title { font-size: 0.72rem; }
}
@media (max-width: 520px) {
  .hero-body { padding: 0 1rem 2.5rem; }
  .hero-btn-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    max-width: 100%;
  }
  .hero-btn { height: 42px; padding: 0 10px; font-size: 0.74rem; }
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
   SECTION COMMON — premium spacing + tech rails
   ══════════════════════════════════════════ */
.services, .process, .cases, .fieldwork, .financing,
.home-market, .home-blog, .ev-section { padding: 88px 0; }

@media (max-width: 992px) {
  .services, .process, .cases, .fieldwork,
  .financing, .home-market, .home-blog, .ev-section { padding: 64px 0; }
}

/* Shared landing CTA system — sharp, justified, modern tech */
.lp-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}
.lp-actions--center { justify-content: center; }
.lp-actions--between { justify-content: space-between; }
.lp-actions--stretch > .lp-btn { flex: 1 1 0; min-width: 0; }
.lp-actions--block {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  width: 100%;
}
.lp-actions--block > .lp-btn { width: 100%; }

.lp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border-radius: var(--radius-sm);
  font-family: var(--font-main);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.2s ease,
    transform 0.2s var(--transition-bounce);
}
.lp-btn:hover { transform: translateY(-1px); }
.lp-btn:active { transform: scale(0.97); opacity: 0.9; }
.lp-btn-icon { width: 15px; height: 15px; flex-shrink: 0; stroke-width: 2; }
.lp-btn--lg { height: 48px; padding: 0 24px; font-size: 0.9rem; }
.lp-btn--block { width: 100%; max-width: 100%; }

.lp-btn--dark {
  background: var(--color-dark);
  color: var(--color-light);
  border-color: var(--color-dark);
  box-shadow: 0 2px 10px -3px rgba(47,47,47,0.28);
}
.lp-btn--dark:hover {
  background: #1a1a1a;
  border-color: #1a1a1a;
  box-shadow: 0 6px 18px -4px rgba(47,47,47,0.35);
}

.lp-btn--accent {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 14px -3px rgba(255,118,0,0.4);
}
.lp-btn--accent:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary-light);
  box-shadow: 0 6px 20px -4px rgba(255,118,0,0.5);
}

.lp-btn--outline {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-color-strong);
}
.lp-btn--outline:hover {
  background: var(--bg-secondary);
  border-color: var(--text-primary);
}

.lp-btn--glass {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-color: rgba(255,255,255,0.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.lp-btn--glass:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.36);
}

.dark-mode .lp-btn--dark {
  background: var(--color-light);
  color: var(--color-dark);
  border-color: var(--color-light);
}

/* Mobile / tablet — all landing CTAs stretch full width */
@media (max-width: 768px) {
  .lp-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .lp-actions--center {
    flex-direction: column;
    align-items: stretch;
  }
  .lp-actions > .lp-btn,
  .lp-btn--block {
    width: 100%;
    max-width: 100%;
  }
  .cases-header .lp-btn,
  .fw-cta .lp-btn {
    width: 100%;
  }
}

/* ----------------- SERVICES SECTION ----------------- */
.services {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  position: relative;
}
.services::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,118,0,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,118,0,0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.services > .container { position: relative; z-index: 1; }
.dark-mode .services { border-top-color: var(--border-color); }

.services-header {
  margin-bottom: 40px;
}

.section-eyebrow {
  font-family: var(--font-main);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 12px;
  display: block;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.2vw, 2.85rem);
  font-weight: 550;
  letter-spacing: -0.03em;
  line-height: 1.12;
  margin-bottom: 14px;
  color: var(--text-primary);
}

.section-sub {
  font-size: 1.02rem;
  color: var(--text-secondary);
  max-width: 540px;
  line-height: 1.65;
  letter-spacing: 0;
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
  margin-bottom: 48px;
  max-width: 640px;
}
.svc-intro .section-sub { margin-top: 4px; }

.svc-intro .highlight {
  color: var(--color-primary);
  background: none;
  -webkit-text-fill-color: var(--color-primary);
}

/* Bento grid — 3 cols desktop */
.svc-bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 14px;
}

/* Wide cards span 2 columns */
.svc-bento-card--wide {
  grid-column: span 2;
}

/* Tall modifier — for featured wide cards */
.svc-bento-card--tall {
  height: 280px !important;
}

@media (max-width: 900px) {
  .svc-bento {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .svc-bento-card--wide {
    grid-column: span 2;
  }
  .svc-bento-card--tall {
    height: 180px !important;
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

/* Solar card — warm amber tint on overlay */
.svc-bento-overlay--solar {
  background: linear-gradient(
    to top,
    rgba(10, 5, 0, 0.93) 0%,
    rgba(40, 18, 0, 0.55) 50%,
    rgba(80, 40, 0, 0.08) 100%
  );
}

/* Wind card — cool blue-teal tint */
.svc-bento-overlay--wind {
  background: linear-gradient(
    to top,
    rgba(0, 8, 20, 0.93) 0%,
    rgba(0, 20, 45, 0.55) 50%,
    rgba(0, 35, 70, 0.08) 100%
  );
}

/* Wind image — focus on interesting part */
.svc-bento-img--wind { object-position: center 40%; }

/* Individual card */
.svc-bento-card {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 200px;
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: none;
  transition:
    transform 0.35s var(--transition-bounce),
    box-shadow 0.35s var(--transition-bounce),
    border-color 0.25s ease;
}

.svc-bento-card--wide {
  height: 240px;
}

.svc-bento-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255,118,0,0.35);
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

/* Stats row — shown on wide/featured cards on hover */
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
  justify-content: center;
  gap: 6px;
  height: 32px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  padding: 0 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: var(--radius-sm);
  backdrop-filter: blur(10px);
  width: fit-content;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.28s ease 0.08s,
    transform 0.32s var(--transition-bounce) 0.08s,
    background 0.2s ease,
    border-color 0.2s ease,
    gap 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.svc-bento-card:hover .svc-bento-link {
  opacity: 1;
  transform: translateY(0);
}

.svc-bento-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  gap: 9px;
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

/* ═══════════════════════════════════════════
   PROCESS SECTION — light + dark compatible
   ═══════════════════════════════════════════ */
.process {
  background-color: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

/* Subtle diagonal stripe texture — purely decorative */
.process::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    -55deg,
    transparent,
    transparent 40px,
    rgba(255,118,0,0.03) 40px,
    rgba(255,118,0,0.03) 41px
  );
  pointer-events: none;
}

.process .container {
  position: relative;
  z-index: 1;
}

/* Header — uses theme tokens, no !important */
.process-header {
  text-align: center;
  margin-bottom: 64px;
}

.process-header .section-title,
.process-header .section-sub {
  margin-left: auto;
  margin-right: auto;
}

/* 4-column grid with connector line */
.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  position: relative;
  align-items: start;
}

/* Horizontal connector line between step circles */
.process-steps::before {
  content: '';
  position: absolute;
  top: 34px; /* half of 68px circle */
  left: calc(12.5% + 34px); /* start after first circle */
  right: calc(12.5% + 34px); /* end before last circle */
  height: 2px;
  background: linear-gradient(
    to right,
    var(--color-primary),
    rgba(255,118,0,0.25)
  );
  z-index: 0;
}

/* Individual step */
.process-step {
  text-align: center;
  padding: 0 20px 32px;
  position: relative;
  z-index: 1;
}

/* Step card — visible panel with left accent */
.process-step-card {
  margin-top: 28px;
  text-align: left;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--color-primary);
  padding: 20px 18px 18px;
  box-shadow: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.25s ease;
}

.process-step:hover .process-step-card {
  transform: translateY(-3px);
  box-shadow: var(--shadow-sm);
  border-color: var(--border-color-strong);
}

.process-step-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.process-step-card p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* Step number — sharp tech marker */
.step-num {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  border: 1.5px solid var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-family: var(--font-main);
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(255,118,0,0.08);
  position: relative;
  z-index: 2;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.process-step:hover .step-num {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 0 0 8px rgba(255,118,0,0.15);
}

/* Legacy selectors — keep so nothing else breaks */
.process-step h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.process-step p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

@media (max-width: 900px) {
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .process-steps::before { display: none; }
  .process-step { padding: 0 12px 24px; }
}

@media (max-width: 560px) {
  .process-steps {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .process-step { padding: 0 0 20px; }
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
  gap: 16px;
}
@media (max-width: 768px) {
  .cases-header {
    flex-direction: column;
    align-items: stretch;
  }
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
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: none;
  transition:
    transform 0.35s var(--transition-bounce),
    box-shadow 0.35s var(--transition-bounce);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  height: 360px;
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
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

/* ── Editorial photo grid — 11 photos, 4 rows ── */
.fw-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-auto-rows: 240px;
  gap: 10px;
  margin-bottom: 28px;
}

/* Row 1: wide + two tall */
.fw-photo--wide       { grid-column: 1; grid-row: 1; }
.fw-photo--tall-right { grid-column: auto; grid-row: 1; }

/* Row 2: three equal, middle one is accent (no special sizing) */
/* Row 3: portrait left stays normal height */
/* Row 4: last two fill naturally */

/* Wide shot spans col 1 only, taller */
.fw-photo--wide { grid-row: span 1; }

/* On desktop make row 1 taller than the rest */
.fw-grid { grid-template-rows: 300px repeat(3, 220px); }

/* Tall card spans 2 rows — keep for legacy */
.fw-photo--tall { grid-row: span 2; }

@media (max-width: 900px) {
  .fw-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: none;
    grid-auto-rows: 190px;
    gap: 8px;
  }
  .fw-photo,
  .fw-photo--wide,
  .fw-photo--tall-right,
  .fw-photo--accent,
  .fw-photo--portrait { grid-column: auto; grid-row: auto; }
  .fw-photo--wide { grid-column: span 2; }
}

@media (max-width: 520px) {
  .fw-grid { grid-template-columns: 1fr 1fr; gap: 6px; grid-auto-rows: 150px; }
  .fw-photo--wide { grid-column: span 2; }
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

/* Label position variants */
.fw-photo-label--bottom-left {
  bottom: 12px; top: auto; left: 12px; right: 12px;
}
.fw-photo-label--top-right {
  bottom: auto; top: 12px; left: auto; right: 12px;
  left: 12px;
  /* gradient flips for top labels */
}
/* For top labels flip the overlay direction */
.fw-photo:has(.fw-photo-label--top-right) .fw-photo-overlay {
  background: linear-gradient(
    to bottom,
    rgba(5,10,20,0.75) 0%,
    rgba(5,10,20,0.15) 50%,
    transparent 100%
  );
}

/* Portrait image — focus on upper portion */
.fw-img--top { object-position: center 20%; }

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
  padding: 22px 28px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  gap: 16px;
  flex-wrap: wrap;
}

.fw-cta span {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.fw-cta .lp-btn-icon {
  transition: transform 0.15s ease;
}
.fw-cta .lp-btn:hover .lp-btn-icon { transform: translateX(2px); }

@media (max-width: 560px) {
  .fw-cta {
    flex-direction: column;
    align-items: stretch;
    padding: 18px 20px;
    gap: 14px;
  }
}

/* ----------------- TRUST BAR ----------------- */
.trust-bar {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 40px 0;
  text-align: center;
}

.trust-bar-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.trust-logos--stats {
  gap: 12px;
}

.tool-disclaimer {
  margin: -4px 0 16px;
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.45;
}

/* ── Live marketplace preview ── */
.home-market { background: var(--bg-primary); }
.home-market-header,
.home-blog-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}
.home-market-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
.home-mkt-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-primary);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s var(--transition-bounce), border-color 0.2s, box-shadow 0.3s;
}
.home-mkt-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255,118,0,0.4);
  box-shadow: var(--shadow-md);
}
.home-mkt-media {
  position: relative;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  overflow: hidden;
}
.home-mkt-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.home-mkt-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}
.home-mkt-fallback svg { width: 28px; height: 28px; }
.home-mkt-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: var(--radius-xs);
}
.home-mkt-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  text-align: left;
}
.home-mkt-body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 550;
  letter-spacing: -0.02em;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.home-mkt-price {
  margin: 0;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--color-primary);
}
.home-mkt-cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.home-market-empty {
  padding: 2rem;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  color: var(--text-secondary);
}
.home-mkt-card--skel,
.home-blog-card--skel { pointer-events: none; }
.home-mkt-card--skel .skel.media,
.home-blog-card--skel .skel.media {
  aspect-ratio: 1;
  margin: 0;
  border-radius: 0;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s infinite linear;
}
.home-mkt-card--skel .skel.line,
.home-blog-card--skel .skel.line {
  height: 12px;
  margin: 10px 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s infinite linear;
}
.skel.w-40 { width: 40%; }
.skel.w-50 { width: 50%; }
.skel.w-80 { width: 80%; }
.skel.w-90 { width: 90%; }

/* ── Live blog preview ── */
.home-blog { background: var(--bg-secondary); }
.home-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.home-blog-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s var(--transition-bounce), border-color 0.2s, box-shadow 0.3s;
}
.home-blog-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255,118,0,0.4);
  box-shadow: var(--shadow-md);
}
.home-blog-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--bg-secondary);
  overflow: hidden;
}
.home-blog-media img { width: 100%; height: 100%; object-fit: cover; }
.home-blog-fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 1.75rem;
  color: var(--text-muted);
}
.home-blog-badge {
  position: absolute; top: 10px; left: 10px;
  background: var(--color-primary); color: #fff;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 4px 8px; border-radius: var(--radius-xs);
}
.home-blog-body { padding: 1.1rem 1.15rem 1.25rem; text-align: left; }
.home-blog-meta { margin: 0 0 6px; font-size: 0.74rem; color: var(--text-muted); }
.home-blog-body h3 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 550;
  letter-spacing: -0.02em;
  line-height: 1.25;
}
.home-blog-body p:last-child {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.ev-price-item--link { text-decoration: none; color: inherit; display: block; }
.ev-price-empty {
  text-align: left;
  padding: 8px 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 992px) {
  .home-market-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .home-blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .home-market-header,
  .home-blog-header {
    flex-direction: column;
    align-items: stretch;
  }
  .home-market-header .lp-btn,
  .home-blog-header .lp-btn { width: 100%; }
  .home-market-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .home-blog-grid { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .home-market-grid { grid-template-columns: 1fr; }
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
  font-size: 0.78rem;
  color: var(--text-secondary);
  opacity: 0.5;
  letter-spacing: 0.1em;
  padding: 8px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
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
  border-radius: var(--radius-md);
  padding: 32px;
  box-shadow: none;
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

/* legacy tool-btn — prefer .lp-btn */
.tool-btn {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background: var(--color-dark);
  color: var(--color-light);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.tool-btn:hover {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

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
  /* legacy — prefer .lp-btn */
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

/* ── TESTIMONIAL CARD — clean tech rail ── */
.testi-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.35s var(--transition-bounce),
    box-shadow 0.35s var(--transition-bounce),
    border-color 0.25s ease;
  border-left: 3px solid var(--border-color-strong);
}

.testi-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-left-color: var(--color-primary);
  border-color: var(--border-color-strong);
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
  border-radius: var(--radius-md);
  padding: 40px 36px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: none;
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
  margin: 28px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ev-feature {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
}

.ev-feature-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(255, 118, 0, 0.1);
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
  margin-bottom: 4px;
}

.ev-feature-desc {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.6;
  letter-spacing: 0;
  text-align: justify;
  hyphens: auto;
}

.ev-cta {
  width: 100%;
  margin-top: 4px;
}
.ev-cta .lp-btn {
  width: 100%;
  height: 48px;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .ev-cta,
  .ev-cta .lp-btn {
    width: 100%;
    max-width: 100%;
  }
  .ev-feature-desc {
    text-align: left;
    hyphens: none;
  }
}

/* ----------------- CTA SECTION ----------------- */
.cta-section {
  background-color: #0a0a0a;
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  padding: 112px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
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

/* ── Button row — uses shared .lp-btn ── */
.cta-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 10px;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}
.cta-actions .lp-btn { width: 100%; }

@media (max-width: 768px) {
  .cta-section { padding: 80px 0; background-attachment: scroll; }
  .cta-heading { font-size: 1.6rem; }
  .cta-br { display: none; }
  .cta-actions {
    grid-template-columns: 1fr;
    max-width: 100%;
  }
  .cta-desc { max-width: 100%; }
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