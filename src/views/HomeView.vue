<template>
  <div class="home-view">
    <!-- HERO — full-bleed video backdrop (no installation stills) -->
    <section class="hero" id="home">
      <div class="hero-bg" aria-hidden="true">
        <div class="hero-poster"></div>
        <video
          v-if="heroVideoEnabled"
          ref="heroVideoRef"
          class="hero-video"
          :class="{ 'is-ready': heroVideoReady }"
          autoplay
          muted
          loop
          playsinline
          webkit-playsinline
          preload="auto"
          disablePictureInPicture
          tabindex="-1"
          aria-hidden="true"
          @loadeddata="onHeroVideoFrame"
          @canplay="onHeroVideoFrame"
          @playing="onHeroVideoPlaying"
          @error="onHeroVideoError"
        >
          <source :src="HERO_VIDEO_SRC" type="video/mp4" />
        </video>
        <div class="hero-bg-overlay"></div>
        <div class="hero-bg-grain"></div>
      </div>

      <div class="hero-body">
        <p class="hero-brand reveal" style="--reveal-delay:40ms">Origin Electric</p>

        <h1 class="hero-h1 reveal" style="--reveal-delay:100ms">
          Power systems engineered<br />for Nigeria.
        </h1>

        <p class="hero-sub reveal" style="--reveal-delay:180ms">
          Solar, storage, security, and EV charging — designed, installed, and supported for sites that cannot afford downtime.
        </p>

        <div class="hero-actions reveal" style="--reveal-delay:260ms">
          <router-link
            :to="{ path: '/account/consultations', query: { from: 'home' } }"
            class="hero-btn hero-btn--primary"
          >
            Book Consultation
          </router-link>
          <router-link to="/marketplace" class="hero-btn hero-btn--secondary">
            Shop Marketplace
          </router-link>
        </div>

        <div class="hero-links reveal" style="--reveal-delay:320ms">
          <router-link to="/load-audit">Load Audit</router-link>
          <span aria-hidden="true">·</span>
          <router-link to="/sales-chat">Talk to Us</router-link>
          <span aria-hidden="true">·</span>
          <button type="button" class="hero-text-btn" @click="openInstallerModal">Request Install</button>
        </div>
      </div>
    </section>

    <!-- Live catalog — below the fold so the video stays the hero -->
    <section class="catalog-strip" aria-label="Live marketplace products">
      <div class="hero-ticker-wrap">
        <div class="hero-ticker-fade hero-ticker-fade--left"></div>
        <div class="hero-ticker-fade hero-ticker-fade--right"></div>
        <div
          class="hero-ticker"
          ref="tickerRef"
          @mouseenter="pauseTicker"
          @mouseleave="resumeTicker"
        >
          <div class="hero-ticker-track" ref="tickerTrackRef">
            <template v-for="pass in 2" :key="pass">
              <template v-if="heroProducts.length === 0">
                <div v-for="n in 10" :key="`sk-${pass}-${n}`" class="hero-chip hero-chip--skeleton">
                  <div class="hero-chip-img-wrap skeleton-box"></div>
                  <div class="hero-chip-skeleton-text">
                    <div class="skeleton-box" style="height:9px;width:80px;border-radius:3px"></div>
                    <div class="skeleton-box" style="height:8px;width:50px;border-radius:3px;margin-top:3px"></div>
                  </div>
                </div>
              </template>
              <router-link
                v-for="product in heroProducts"
                :key="`${pass}-${product.id}`"
                :to="`/product/${product.id}`"
                class="hero-chip"
              >
                <div class="hero-chip-img-wrap">
                  <img
                    v-if="product.image && !product.imageBroken"
                    :src="product.image"
                    :alt="product.name"
                    class="hero-chip-img"
                    loading="lazy"
                    @error="product.imageBroken = true"
                  />
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
            Shop all
            <ArrowRightIcon style="width:11px;height:11px;display:inline-block;vertical-align:-1px" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- SERVICES — premium engineering grid -->
    <HomeServicesSection class="section-clipped section-divider" />

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
        </div>

        <!-- Crew / site photos only — portfolio projects live in Success Stories above -->
        <div class="fw-grid reveal-stagger">
          <div class="fw-photo fw-photo--wide">
            <img src="../assets/oooooo/web/IMG_0020.jpg" alt="Team on site" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--bottom-left">
              <ZapIcon class="fw-label-icon" />
              <span>Installation Day — Live</span>
            </div>
          </div>

          <div class="fw-photo fw-photo--tall-right">
            <img src="../assets/oooooo/web/IMG_0036.jpg" alt="Field engineers at work" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--bottom-left">
              <WrenchIcon class="fw-label-icon" />
              <span>Engineers on Ground</span>
            </div>
          </div>

          <div class="fw-photo fw-photo--tall-right">
            <img src="../assets/oooooo/web/IMG_3321.jpg" alt="Site work in progress" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--top-right">
              <SunIcon class="fw-label-icon" />
              <span>Active Site — Field Crew</span>
            </div>
          </div>

          <div class="fw-photo">
            <img src="../assets/oooooo/web/IMG_0058.jpg" alt="Site survey and audit" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <ActivityIcon class="fw-label-icon" />
              <span>Site Survey & Audit</span>
            </div>
          </div>

          <div class="fw-photo fw-photo--portrait">
            <img src="../assets/oooooo/web/IMG_3335.jpg" alt="Origin field team" class="fw-img fw-img--top" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label fw-photo-label--bottom-left">
              <UsersIcon class="fw-label-icon" />
              <span>Origin Field Team</span>
            </div>
          </div>

          <div class="fw-photo">
            <img src="../assets/pdf-assets/solar-main.jpg" alt="Solar commissioning" class="fw-img" />
            <div class="fw-photo-overlay"></div>
            <div class="fw-photo-label">
              <SunIcon class="fw-label-icon" />
              <span>Solar Commissioning</span>
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

        <div v-if="marketLoading" class="home-market-grid" aria-busy="true">
          <div v-for="n in 8" :key="n" class="home-mkt-card home-mkt-card--skel">
            <div class="skel media"></div>
            <div class="skel line w-40"></div>
            <div class="skel line w-80"></div>
            <div class="skel line w-55"></div>
          </div>
        </div>

        <!-- No reveal-stagger here: grid mounts after API load, so IO never sees it -->
        <div v-else-if="marketProducts.length" class="home-market-grid home-market-grid--live">
          <router-link
            v-for="product in marketProducts"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="home-mkt-card"
          >
            <div class="home-mkt-media">
              <img
                v-if="product.image && !product.imageBroken"
                :src="product.image"
                :alt="product.name"
                loading="lazy"
                @error="product.imageBroken = true"
              />
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

        <div v-if="postsLoading" class="home-blog-grid" aria-busy="true">
          <div v-for="n in 3" :key="n" class="home-blog-card home-blog-card--skel">
            <div class="skel media"></div>
            <div class="skel line w-50"></div>
            <div class="skel line w-90"></div>
          </div>
        </div>

        <div v-else class="home-blog-grid home-blog-grid--live">
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

    <SupplierCTA class="section-clipped" />

    <!-- CTA -->
    <section class="cta-section section-clipped section-divider" id="cta" :style="{ backgroundImage: `url(${ctaSolarDuskBg})` }">
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
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { 
  Calculator as CalculatorIcon,
  Sun as SunIcon, 
  Zap as ZapIcon, 
  ArrowRight as ArrowRightIcon,
  Phone as PhoneIcon,
  Check as CheckIcon,
  Building2 as BuildingIcon,
  Home as HomeIcon,
  Rocket as RocketIcon,
  HelpingHand as HandshakeIcon,
  Users as UsersIcon,
  Activity as ActivityIcon,
  Wrench as WrenchIcon
} from 'lucide-vue-next';

import marketplaceService, {
  normalizeProductsResponse,
  normalizeCategories
} from '@/services/marketplace.service';
import blogService from '@/services/blog.service';
import { mediaUrl, firstMediaUrl } from '@/utils/mediaUrl';
import HomeServicesSection from '@/components/home/HomeServicesSection.vue';
import SupplierCTA from '@/components/SupplierCTA.vue';

// PDF Assets
import projectOndoImg from '../assets/pdf-assets/project-ondo.jpg';
import projectGofamintImg from '../assets/pdf-assets/project-gofamint.jpg';
import projectFcdaImg from '../assets/pdf-assets/project-fcda.jpg';
import projectJudgeImg from '../assets/pdf-assets/project-judge.jpg';
import projectIfeImg from '../assets/pdf-assets/project-ife.jpg';

// Section Background Images
import ctaSolarDuskBg from '../assets/cta_solar_dusk_bg.jpg';
import heroVideoUrl from '../assets/video/origing.mp4';

// ----------------- HERO CINEMATIC VIDEO -----------------
// Bundled hashed asset so the MP4 always ships with the build (not rewritten to HTML).
const HERO_VIDEO_SRC = heroVideoUrl;

const heroVideoRef = ref(null);
const heroVideoEnabled = ref(false);
const heroVideoReady = ref(false);

const shouldEnableHeroVideo = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn?.saveData) return false;
  // Allow 3g+; only skip truly slow links
  if (conn?.effectiveType && /^(slow-2g|2g)$/i.test(conn.effectiveType)) return false;
  return true;
};

const markHeroVideoReady = () => {
  heroVideoReady.value = true;
};

const onHeroVideoFrame = () => {
  markHeroVideoReady();
};

const onHeroVideoPlaying = () => {
  markHeroVideoReady();
};

const onHeroVideoError = () => {
  heroVideoEnabled.value = false;
  heroVideoReady.value = false;
};

const tryPlayHeroVideo = async () => {
  const el = heroVideoRef.value;
  if (!el) return;
  try {
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');
    el.playsInline = true;
    el.load();
    const playPromise = el.play();
    if (playPromise && typeof playPromise.then === 'function') {
      await playPromise;
    }
    markHeroVideoReady();
  } catch {
    // Keep first decoded frame visible if autoplay is blocked
    if (el.readyState >= 2) markHeroVideoReady();
  }
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
  image: firstMediaUrl(p.images) || mediaUrl(p.featured_image) || '',
  imageBroken: false
});

const isEvRelated = (p) => {
  const hay = `${p.name || ''} ${p.category || ''} ${p.description || ''}`.toLowerCase();
  return /ev|charg|electric vehicle|wall.?box|dc fast|ac charg/.test(hay);
};

const fetchLiveCatalog = async () => {
  marketLoading.value = true;
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      marketplaceService.getProducts({ page: 1, limit: 60 }),
      marketplaceService.getCategories().catch(() => [])
    ]);
    const { products: list, total } = normalizeProductsResponse(productsRes);
    liveStats.value.products = total;
    liveStats.value.categories = normalizeCategories(categoriesRes).length;

    // One API load feeds ticker, marketplace grid, and EV pricing
    heroProducts.value = list.map(mapProductCard);
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

    setTimeout(startTicker, 100);
  } catch (e) {
    console.error('Live catalog fetch error:', e);
    heroProducts.value = [];
    marketProducts.value = [];
    evProducts.value = [];
  } finally {
    marketLoading.value = false;
  }
};

const mapBlogCard = (p) => {
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
};

const fetchFeaturedBlog = async () => {
  postsLoading.value = true;
  try {
    let posts = await blogService.getFeaturedPosts();
    // Prefer total article count + fill grid to 3 when API marks only one as featured
    try {
      const all = await blogService.getAllPosts();
      if (all.length) liveStats.value.posts = all.length;
      if (posts.length < 3 && all.length) {
        const seen = new Set(posts.map((p) => p.id || p.slug));
        for (const p of all) {
          if (posts.length >= 3) break;
          const key = p.id || p.slug;
          if (key && seen.has(key)) continue;
          if (key) seen.add(key);
          posts.push(p);
        }
      }
    } catch {
      liveStats.value.posts = posts.length;
    }
    if (!liveStats.value.posts) liveStats.value.posts = posts.length;
    featuredPosts.value = posts.slice(0, 3).map(mapBlogCard);
  } catch (e) {
    console.error('Featured blog fetch error:', e);
    featuredPosts.value = [];
  } finally {
    postsLoading.value = false;
  }
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

onUnmounted(() => {
  if (tickerRaf) cancelAnimationFrame(tickerRaf);
  const el = heroVideoRef.value;
  if (el) {
    el.pause();
    el.removeAttribute('src');
    el.load();
  }
});

// ----------------- INSTALLER MODAL -----------------
function openInstallerModal() {
  window.dispatchEvent(new CustomEvent('open-installer-modal'));
}

// ----------------- LIFECYCLE -----------------
onMounted(() => {
  // Cinematic hero video (poster-only when reduced-motion / save-data / slow network)
  heroVideoEnabled.value = shouldEnableHeroVideo();
  if (heroVideoEnabled.value) {
    nextTick(() => {
      tryPlayHeroVideo();
    });
  }

  // Catalog strip ticker (re-measured after single catalog fetch)
  startTicker();

  // Live API: one catalog load → ticker + marketplace + EV; plus blog
  fetchLiveCatalog();
  fetchFeaturedBlog();

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
   HERO — full-bleed video, brand first
   ══════════════════════════════════════════ */
.hero {
  position: relative;
  min-height: 100svh;
  min-height: 100dvh;
  padding-top: calc(5.5rem + env(safe-area-inset-top, 0px));
  padding-bottom: calc(clamp(3.25rem, 9vh, 6rem) + env(safe-area-inset-bottom, 0px));
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #050806;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background-color: #050806;
}

/* Dark cinematic wash — never an installation still */
.hero-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 70% 55% at 72% 38%, rgba(255, 118, 0, 0.14) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(20, 60, 45, 0.35) 0%, transparent 60%),
    linear-gradient(145deg, #0a100e 0%, #121816 42%, #0b0f0d 100%);
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 55% 42%;
  opacity: 0;
  transform: scale(1.08);
  /* Cinematic grade — denser, less “phone video” */
  filter: contrast(1.18) saturate(0.92) brightness(0.78) sepia(0.08);
  transition: opacity 0.9s ease;
  max-width: 100%;
  pointer-events: none;
  z-index: 1;
}

.hero-video.is-ready {
  opacity: 1;
  animation: hero-video-drift 36s ease-in-out infinite alternate;
}

@keyframes hero-video-drift {
  from { transform: scale(1.08) translate3d(0, 0, 0); }
  to   { transform: scale(1.16) translate3d(-1.6%, -1%, 0); }
}

/* Text rail + soft vignette so footage reads as a backdrop, not a photo dump */
.hero-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    radial-gradient(
      ellipse 95% 85% at 50% 45%,
      transparent 0%,
      rgba(3, 6, 5, 0.35) 55%,
      rgba(3, 6, 5, 0.72) 100%
    ),
    linear-gradient(
      105deg,
      rgba(3, 6, 5, 0.9) 0%,
      rgba(3, 6, 5, 0.55) 30%,
      rgba(3, 6, 5, 0.18) 58%,
      rgba(3, 6, 5, 0.35) 100%
    ),
    linear-gradient(
      180deg,
      rgba(3, 6, 5, 0.45) 0%,
      transparent 30%,
      transparent 55%,
      rgba(3, 6, 5, 0.7) 100%
    );
}

.hero-bg-grain {
  position: absolute;
  inset: 0;
  z-index: 3;
  opacity: 0.04;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 220px 220px;
  mix-blend-mode: soft-light;
}

.hero-body {
  position: relative;
  z-index: 5;
  width: min(100% - 3rem, 640px);
  margin: 0;
  margin-left: max(1.5rem, env(safe-area-inset-left, 0px), 5vw);
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.hero-brand {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.4vw, 2.45rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 1.2rem;
  line-height: 1;
}

.hero-brand::after {
  content: '';
  display: block;
  width: 2.75rem;
  height: 2px;
  margin-top: 0.9rem;
  background: var(--orange);
}

.hero-h1 {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5.8vw, 4rem);
  font-weight: 550;
  line-height: 1.06;
  letter-spacing: -0.035em;
  color: #fff;
  margin: 0 0 1.15rem;
  max-width: 13ch;
}

.hero-sub {
  font-family: var(--font-main);
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: rgba(255, 255, 255, 0.78);
  max-width: 34rem;
  line-height: 1.55;
  margin: 0 0 1.75rem;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.15rem;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.4rem;
  border-radius: 2px;
  font-family: var(--font-main);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.hero-btn--primary {
  background: var(--orange);
  color: #fff;
  border-color: var(--orange);
}

@media (hover: hover) and (pointer: fine) {
  .hero-btn--primary:hover {
    background: var(--orange2);
    border-color: var(--orange2);
  }
}

.hero-btn--secondary {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.42);
}

@media (hover: hover) and (pointer: fine) {
  .hero-btn--secondary:hover {
    border-color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.65rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.42);
}

.hero-links a,
.hero-text-btn {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  font: inherit;
  font-weight: 500;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .hero-links a:hover,
  .hero-text-btn:hover {
    color: #fff;
  }
}

/* Catalog strip — below fold */
.catalog-strip {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0 1.15rem;
  overflow-x: clip;
}

.hero-ticker-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.hero-ticker-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 56px;
  z-index: 3;
  pointer-events: none;
}

.hero-ticker-fade--left {
  left: 0;
  background: linear-gradient(to right, var(--bg-primary) 0%, transparent 100%);
}

.hero-ticker-fade--right {
  right: 0;
  background: linear-gradient(to left, var(--bg-primary) 0%, transparent 100%);
}

.hero-ticker {
  overflow: hidden;
  width: 100%;
  cursor: default;
}

.hero-ticker-track {
  display: flex;
  align-items: center;
  gap: 10px;
  width: max-content;
  will-change: transform;
  padding: 0 0.75rem;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px 7px 7px;
  border-radius: 2px;
  background: var(--bg-secondary, var(--bg-primary));
  border: 1px solid var(--border-color);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: border-color 0.18s ease;
}

@media (hover: hover) and (pointer: fine) {
  .hero-chip:hover {
    border-color: var(--orange);
  }
}

.hero-chip-img-wrap {
  width: 32px;
  height: 32px;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-chip-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-chip-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, rgba(0, 0, 0, 0.4));
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
  color: var(--text-primary);
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

.hero-chip--skeleton {
  pointer-events: none;
  opacity: 0.55;
}

.hero-chip-skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.hero-ticker-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 0.65rem;
  font-family: var(--font-main);
  font-size: 0.72rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.5));
}

.hero-ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success, #2d8a4e);
  flex-shrink: 0;
}

.hero-ticker-count {
  color: inherit;
}

.hero-ticker-shoplink {
  color: var(--orange);
  font-weight: 600;
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .hero-ticker-shoplink:hover {
    color: var(--orange2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-ticker-track {
    transition: none;
  }
  .hero-video {
    display: none !important;
    animation: none !important;
  }
  .hero-poster {
    transform: none;
  }
}

@media (max-width: 768px) {
  .hero {
    /* Clear fixed mobile bottom nav + safe area */
    padding-bottom: calc(5.75rem + env(safe-area-inset-bottom, 0px));
    align-items: flex-end;
  }
  /* Bottom grade keeps footage visible above the copy */
  .hero-bg-overlay {
    background:
      linear-gradient(
        180deg,
        rgba(4, 8, 6, 0.28) 0%,
        rgba(4, 8, 6, 0.18) 32%,
        rgba(4, 8, 6, 0.55) 62%,
        rgba(4, 8, 6, 0.88) 100%
      );
  }
  .hero-h1 {
    font-size: clamp(2.05rem, 9vw, 2.9rem);
    max-width: 12ch;
  }
  .hero-sub {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
  .hero-video {
    object-position: center 35%;
  }
}

@media (max-width: 520px) {
  .hero-body {
    width: min(100% - 1.5rem, 640px);
    margin-left: max(0.85rem, env(safe-area-inset-left, 0px));
  }
  .hero-brand {
    font-size: clamp(1.35rem, 5.5vw, 1.65rem);
    margin-bottom: 0.85rem;
  }
  .hero-brand::after {
    margin-top: 0.65rem;
  }
  .hero-h1 {
    margin-bottom: 0.85rem;
  }
  .hero-actions {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .hero-btn {
    flex: 1 1 auto;
    min-width: calc(50% - 0.4rem);
    min-height: 44px;
    padding: 0 1rem;
    font-size: 0.84rem;
  }
  .hero-links {
    font-size: 0.8rem;
  }
  .hero-ticker-fade {
    width: 40px;
  }
}

.btn-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

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
  min-height: 12rem;
}
.home-market-grid--live {
  animation: homeMarketIn 0.45s ease both;
}
@keyframes homeMarketIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.home-mkt-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color-strong, var(--border-color));
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary, var(--bg-primary));
  text-decoration: none;
  color: var(--text-primary);
  opacity: 1;
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
  background: var(--bg-primary);
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
  color: var(--text-primary);
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
.home-blog-grid--live {
  animation: homeMarketIn 0.45s ease both;
}
.home-blog-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary, var(--bg-primary));
  border: 1px solid var(--border-color-strong, var(--border-color));
  opacity: 1;
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