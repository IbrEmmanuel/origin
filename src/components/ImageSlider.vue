<template>
  <div class="image-slider">
    <div class="slider-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(img, idx) in images" :key="idx" class="slide">
        <img :src="img" :alt="alt + ' ' + (idx + 1)" class="slider-img" @click.stop="$emit('click-image')" />
      </div>
      <div v-if="images.length === 0" class="slide fallback-slide" @click.stop="$emit('click-image')">
        <PackageIcon class="fallback-icon" />
      </div>
    </div>
    
    <!-- Arrows -->
    <button v-if="images.length > 1" class="nav-btn prev-btn" @click.stop="prev" :disabled="currentIndex === 0">
      <ChevronLeftIcon class="icon-sm" />
    </button>
    <button v-if="images.length > 1" class="nav-btn next-btn" @click.stop="next" :disabled="currentIndex === images.length - 1">
      <ChevronRightIcon class="icon-sm" />
    </button>

    <!-- Dots -->
    <div v-if="images.length > 1" class="dots">
      <span v-for="(_, idx) in images" :key="'dot-'+idx" class="dot" :class="{ active: currentIndex === idx }" @click.stop="currentIndex = idx"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Package as PackageIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-vue-next';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  alt: {
    type: String,
    default: 'Product Image'
  }
});

defineEmits(['click-image']);

const currentIndex = ref(0);

const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

const next = () => {
  if (currentIndex.value < props.images.length - 1) currentIndex.value++;
};
</script>

<style scoped>
.image-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  /* Allow clicking background to bubble up if we wanted, but we stop propagation on imgs/buttons */
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
}

.slider-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slider-img:hover {
  transform: scale(1.04);
}

.fallback-slide {
  background: var(--bg-secondary);
  cursor: pointer;
}
.fallback-icon {
  width: 48px;
  height: 48px;
  color: #d2d2d7;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #111;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  opacity: 0.85;
  transition: all 0.2s ease;
  z-index: 2;
}

.nav-btn:disabled {
  opacity: 0 !important; /* Hide disabled buttons completely */
  pointer-events: none;
}

.nav-btn:hover:not(:disabled) {
  background: white;
  transform: translateY(-50%) scale(1.1);
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
  gap: 6px;
  z-index: 2;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

.dot.active {
  background: white;
  transform: scale(1.2);
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.icon-sm { width: 18px; height: 18px; }
</style>
