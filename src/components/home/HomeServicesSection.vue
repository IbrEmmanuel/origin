<template>
  <section class="home-services" id="services" aria-labelledby="home-services-title">
    <div class="home-services__inner">
      <header class="home-services__intro">
        <span class="home-services__eyebrow">What We Do</span>
        <h2 id="home-services-title" class="home-services__title">
          Engineering solutions that <span class="home-services__accent">actually work</span>
        </h2>
        <p class="home-services__sub">
          End-to-end systems — designed, installed, and maintained by one engineering team.
        </p>
      </header>

      <div class="home-services__grid">
        <article
          v-for="service in services"
          :key="service.id"
          class="svc-card"
          :class="{ 'svc-card--featured': service.featured }"
        >
          <div class="svc-card__media">
            <img
              class="svc-card__img"
              :src="service.image"
              :alt="service.imageAlt"
              :style="{ objectPosition: service.objectPosition || 'center' }"
              :loading="service.featured ? 'eager' : 'lazy'"
              :fetchpriority="service.featured ? 'high' : 'auto'"
              width="800"
              height="500"
            />
            <div class="svc-card__shade" aria-hidden="true" />
          </div>

          <div class="svc-card__body">
            <div class="svc-card__icon" :class="{ 'svc-card__icon--accent': service.featured }" aria-hidden="true">
              <component :is="iconMap[service.icon]" />
            </div>
            <span class="svc-card__category">{{ service.category }}</span>
            <h3 class="svc-card__name">{{ service.title }}</h3>
            <p class="svc-card__desc">{{ service.description }}</p>
            <router-link :to="service.to" class="svc-card__cta">
              {{ service.cta }}
              <ArrowRight class="svc-card__cta-icon" aria-hidden="true" />
            </router-link>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ArrowRight,
  Sun,
  Cctv,
  Battery,
  Fingerprint,
  Flame,
  Zap
} from 'lucide-vue-next';
import { homeServices } from '@/data/homeServices';

const services = homeServices;

const iconMap = {
  sun: Sun,
  cctv: Cctv,
  battery: Battery,
  fingerprint: Fingerprint,
  flame: Flame,
  zap: Zap
};
</script>

<style scoped>
.home-services {
  --hs-pad: clamp(1rem, 4vw, 1.5rem);
  --hs-max: 1120px;
  --hs-gap: 14px;
  --hs-radius: var(--radius-md, 12px);
  background: var(--bg-primary, #faf9f7);
  border-top: 1px solid var(--border-color, #e8e4de);
  padding: clamp(3rem, 6vw, 4.5rem) 0 clamp(3.25rem, 7vw, 5rem);
  /* Keep content clear of floating chat FAB on the right */
  padding-right: max(0px, env(safe-area-inset-right, 0px));
}

.home-services__inner {
  width: 100%;
  max-width: var(--hs-max);
  margin: 0 auto;
  padding-inline: var(--hs-pad);
  box-sizing: border-box;
}

.home-services__intro {
  max-width: 36rem;
  margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
}

.home-services__eyebrow {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary, #ff7600);
  margin-bottom: 0.75rem;
}

.home-services__title {
  margin: 0 0 0.75rem;
  font-family: var(--font-display, Georgia, serif);
  font-size: clamp(1.65rem, 3.4vw, 2.55rem);
  font-weight: 550;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text-primary, #1c1a17);
}

.home-services__accent {
  color: var(--color-primary, #ff7600);
}

.home-services__sub {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.6;
  color: var(--text-secondary, #5c574f);
  max-width: 34rem;
}

/* 12-column editorial grid */
.home-services__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--hs-gap);
  align-items: stretch;
}

.svc-card {
  grid-column: span 4;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg-primary, #fff);
  border: 1px solid var(--border-color, #e8e4de);
  border-radius: var(--hs-radius);
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.25s ease;
}

/* Featured Solar — full-bleed lead row; image + copy side-by-side on desktop */
.svc-card--featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  align-items: stretch;
}

/* Last two supporting cards share a balanced bottom row */
.svc-card:nth-child(5),
.svc-card:nth-child(6) {
  grid-column: span 6;
}

.svc-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--bg-secondary, #f0ebe4);
  overflow: hidden;
  flex-shrink: 0;
}

.svc-card--featured .svc-card__media {
  aspect-ratio: auto;
  min-height: 280px;
  height: 100%;
}

.svc-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.55s ease;
}

.svc-card__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(20, 16, 12, 0.28) 0%,
    rgba(20, 16, 12, 0.05) 45%,
    transparent 70%
  );
  pointer-events: none;
}

.svc-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1.1rem 1.15rem 1.25rem;
  flex: 0 0 auto;
}

.svc-card__icon {
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--color-dark, #2f2f2f);
  color: #fff;
  margin-bottom: 0.25rem;
}

.svc-card__icon--accent {
  background: var(--color-primary, #ff7600);
}

.svc-card__icon :deep(svg) {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
}

.svc-card__category {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--color-primary, #ff7600);
}

.svc-card__name {
  margin: 0;
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.05rem;
  font-weight: 550;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--text-primary, #1c1a17);
}

.svc-card--featured .svc-card__body {
  justify-content: center;
  padding: clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2.25rem);
}

.svc-card--featured .svc-card__name {
  font-size: clamp(1.25rem, 2.2vw, 1.55rem);
}

.svc-card--featured .svc-card__desc {
  font-size: 0.95rem;
  max-width: 36ch;
}

.svc-card__desc {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--text-secondary, #5c574f);
  flex: 1;
}

.svc-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.55rem;
  width: fit-content;
  min-height: 2.25rem;
  padding: 0 0.85rem;
  border-radius: 8px;
  border: 1.5px solid var(--color-primary, #ff7600);
  color: var(--color-primary, #ff7600);
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, gap 0.2s ease;
}

.svc-card__cta-icon {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}

.svc-card__cta:hover,
.svc-card__cta:focus-visible {
  background: var(--color-primary, #ff7600);
  color: #fff;
  gap: 0.55rem;
  outline: none;
}

@media (hover: hover) and (pointer: fine) {
  .svc-card:hover {
    border-color: rgba(255, 118, 0, 0.35);
    transform: translateY(-2px);
  }
  .svc-card:hover .svc-card__img {
    transform: scale(1.03);
  }
}

/* Tablet — 2 columns */
@media (max-width: 960px) {
  .home-services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .svc-card,
  .svc-card--featured,
  .svc-card:nth-child(5),
  .svc-card:nth-child(6) {
    grid-column: span 1;
  }
  .svc-card--featured {
    grid-column: 1 / -1;
    grid-template-columns: 1fr;
  }
  .svc-card--featured .svc-card__media {
    aspect-ratio: 21 / 10;
    min-height: 0;
    height: auto;
  }
}

/* Mobile — single column; clear FAB / bottom nav */
@media (max-width: 640px) {
  .home-services {
    padding-bottom: calc(3rem + 4.5rem);
  }
  .home-services__inner {
    padding-inline: max(var(--hs-pad), 0.85rem);
    /* Leave room for right-side FAB so titles/CTAs stay readable */
    padding-right: max(0.85rem, calc(0.85rem + 3.5rem));
  }
  .home-services__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .svc-card,
  .svc-card--featured,
  .svc-card:nth-child(5),
  .svc-card:nth-child(6) {
    grid-column: span 1;
  }
  .svc-card--featured {
    grid-template-columns: 1fr;
  }
  .svc-card--featured .svc-card__media {
    aspect-ratio: 16 / 10;
    min-height: 0;
    height: auto;
  }
  .svc-card__body {
    padding: 1rem 1.05rem 1.15rem;
  }
  .svc-card--featured .svc-card__body {
    padding: 1.1rem 1.05rem 1.25rem;
  }
  .svc-card__cta {
    min-height: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .svc-card,
  .svc-card__img,
  .svc-card__cta {
    transition: none;
  }
}
</style>
