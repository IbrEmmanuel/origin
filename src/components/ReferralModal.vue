<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-card glass-card">
      <div class="modal-header">
        <div class="gift-icon">
          <GiftIcon class="icon-lg" />
        </div>
        <h2>Welcome to Origin Electric!</h2>
        <p>Do you have a referral code? Enter it below to link your account. This is optional.</p>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <div class="input-wrapper">
            <TagIcon class="input-icon" />
            <input 
              type="text" 
              v-model="referralCode" 
              placeholder="REFERRAL CODE (OPTIONAL)" 
              class="modal-input"
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="submit" class="btn btn-primary full-width">Continue</button>
        <button @click="close" class="btn-text">Skip for now</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Gift as GiftIcon, Tag as TagIcon } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'submit']);

const referralCode = ref('');

const close = () => {
  emit('close');
};

const submit = () => {
  emit('submit', referralCode.value);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}

.modal-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  text-align: center;
  animation: modalScale 0.4s var(--transition-bounce);
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 1rem 0 0.5rem;
}

.modal-header p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.gift-icon {
  width: 60px;
  height: 60px;
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.modal-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-align: center;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-secondary);
}

.modal-footer {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  transition: all var(--transition-speed);
  opacity: 0.8;
  margin-top: 1rem; /* Explicit spacing */
}


.btn-text:hover {
  color: var(--text-primary);
  opacity: 1;
  transform: translateY(-1px);
}


@keyframes modalScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
