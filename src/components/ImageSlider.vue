<template>
  <div class="image-slider" :class="{ 'image-slider--contain': fit === 'contain' }">
    <div class="slider-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(img, idx) in safeImages" :key="`${idx}-${img}`" class="slide">
        <img
          :src="img"
          :alt="`${alt} ${idx + 1}`"
          class="slider-img"
          loading="lazy"
          decoding="async"
          @error="onImgError(idx)"
          @click.stop="$emit('click-image')"
        />
      </div>
      <div v-if="!safeImages.length" class="slide fallback-slide" @click.stop="$emit('click-image')">
        <PackageIcon class="fallback-icon" />
        <span class="fallback-label">No image</span>
      </div>
    </div>

    <button
      v-if="safeImages.length > 1"
      type="button"
      class="nav-btn prev-btn"
      @click.stop="prev"
      :disabled="currentIndex === 0"
      aria-label="Previous image"
    >
      <ChevronLeftIcon class="icon-sm" />
    </button>
    <button
      v-if="safeImages.length > 1"
      type="button"
      class="nav-btn next-btn"
      @click.stop="next"
      :disabled="currentIndex === safeImages.length - 1"
      aria-label="Next image"
    >
      <ChevronRightIcon class="icon-sm" />
    </button>

    <div v-if="safeImages.length > 1" class="dots">
      <button
        v-for="(_, idx) in safeImages"
        :key="'dot-' + idx"
        type="button"
        class="dot"
        :class="{ active: currentIndex === idx }"
        :aria-label="`Image ${idx + 1}`"
        @click.stop="currentIndex = idx"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Package as PackageIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-vue-next';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  alt: {
    type: String,
    default: 'Product Image'
  },
  /** cover crops; contain shows full product on soft pad (premium marketplace) */
  fit: {
    type: String,
    default: 'contain'
  }
});

defineEmits(['click-image']);

const currentIndex = ref(0);
const failed = ref(new Set());

const safeImages = computed(() =>
  (props.images || []).filter((src, i) => src && !failed.value.has(i) && !failed.value.has(src))
);

watch(
  () => props.images,
  () => {
    failed.value = new Set();
    currentIndex.value = 0;
  },
  { deep: true }
);

watch(safeImages, (list) => {
  if (currentIndex.value >= list.length) currentIndex.value = Math.max(0, list.length - 1);
});

const onImgError = (idx) => {
  const src = props.images?.[idx];
  const next = new Set(failed.value);
  next.add(idx);
  if (src) next.add(src);
  failed.value = next;
};

const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

const next = () => {
  if (currentIndex.value < safeImages.value.length - 1) currentIndex.value++;
};
</script>

<style scoped>
.image-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background:
    linear-gradient(145deg, var(--bg-secondary) 0%, var(--bg-primary) 55%, var(--bg-secondary) 100%);
}

.slider-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
}

.image-slider--contain .slide {
  padding: 10px;
}

.slider-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
  transition: transform 0.55s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.image-slider--contain .slider-img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

.slider-img:hover {
  transform: scale(1.03);
}

.fallback-slide {
  flex-direction: column;
  gap: 8px;
  background: var(--bg-secondary);
  cursor: pointer;
  color: var(--text-muted);
}
.fallback-icon {
  width: 40px;
  height: 40px;
  opacity: 0.55;
}
.fallback-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 253, 250, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 2;
}
.image-slider:hover .nav-btn { opacity: 0.95; }
@media (hover: none) {
  .nav-btn { opacity: 0.9; }
}

.nav-btn:disabled {
  opacity: 0 !important;
  pointer-events: none;
}
.nav-btn:hover:not(:disabled) {
  background: #fff;
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-50%) scale(1.05);
}

.prev-btn { left: 8px; }
.next-btn { right: 8px; }

.dots {
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 5px;
  z-index: 2;
}

.dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(47, 47, 47, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
}
.dot.active {
  background: var(--color-primary);
  transform: scale(1.25);
}

.icon-sm { width: 16px; height: 16px; }
</style>
