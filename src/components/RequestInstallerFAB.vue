<template>
  <div class="whatsapp-fab-system">
    <!-- Floating Action Button -->
    <button 
      class="fab-button" 
      @click="openModal" 
      aria-label="Request Solar Installation"
      :class="{ 'fab-pulse': !isOpen }"
    >
      <span class="fab-icon-wrapper">
        <svg class="whatsapp-icon" viewBox="0 0 448 512" fill="currentColor">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </span>
      <span class="fab-text">Request Installer</span>
    </button>

    <!-- Overlay Backdrop -->
    <transition name="fade">
      <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
        <!-- Lead Form Modal Container -->
        <transition name="modal-bounce" appear>
          <div class="modal-container glass-card" @click.stop>
            <!-- Header -->
            <div class="modal-header">
              <h3>Request Installation</h3>
              <button class="close-btn" @click="closeModal" aria-label="Close dialog">
                <X class="close-icon-lucide" />
              </button>
            </div>

            <!-- Path Guidance Panel -->
            <div v-if="!selectedPath" class="path-selection">
              <p class="selection-intro">Let's get you set up with high-quality solar power. How would you like to proceed?</p>
              <div class="choice-cards">
                <button class="choice-card" @click="selectPath('know-needs')">
                  <div class="choice-icon-wrapper">
                    <FileText class="choice-icon-lucide" />
                  </div>
                  <div class="choice-info">
                    <h4>I already know what I need</h4>
                    <p>Proceed directly to fill out the installation request form.</p>
                  </div>
                </button>
                <button class="choice-card highlight" @click="selectPath('need-help')">
                  <div class="choice-icon-wrapper">
                    <Zap class="choice-icon-lucide" />
                  </div>
                  <div class="choice-info">
                    <h4>I need help calculating</h4>
                    <p>Calculate your appliance power loads using our smart tool first.</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Lead Submission Form -->
            <div v-else class="form-container">
              <!-- Back to choice button (if path was manually selected) -->
              <button v-if="!savedAudit" class="back-path-btn" @click="selectedPath = null">
                <ArrowLeft class="back-icon-lucide" /> Back to options
              </button>

              <!-- Calculator Data Attachment Alert -->
              <div v-if="savedAudit" class="audit-attachment-alert">
                <Plug class="alert-icon-lucide" />
                <div class="alert-content">
                  <strong>Load Calculation Found:</strong>
                  <p>Estimated Load: {{ savedAudit.recommendedInverter }}kVA ({{ savedAudit.totalWatts }}W). This will be attached to your details.</p>
                  <label class="attachment-toggle">
                    <input type="checkbox" v-model="includeCalculator" />
                    <span>Include calculation summary</span>
                  </label>
                </div>
              </div>

              <!-- Form Fields -->
              <form @submit.prevent="submitLead">
                <div class="form-group">
                  <label for="lead-name">Name <span class="required">*</span></label>
                  <input 
                    type="text" 
                    id="lead-name" 
                    v-model="form.name" 
                    placeholder="Enter your name" 
                    required 
                    class="form-input-field"
                  />
                </div>

                <div class="form-group">
                  <label for="lead-phone">Phone Number <span class="required">*</span></label>
                  <input 
                    type="tel" 
                    id="lead-phone" 
                    v-model="form.phone" 
                    placeholder="e.g. +234 803 123 4567" 
                    required 
                    class="form-input-field"
                  />
                </div>

                <div class="form-group">
                  <label for="lead-state">State <span class="required">*</span></label>
                  <select 
                    id="lead-state" 
                    v-model="form.state" 
                    required 
                    class="form-input-field"
                  >
                    <option value="" disabled selected>Select your state</option>
                    <option v-for="state in states" :key="state" :value="state">
                      {{ state }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Type of Property <span class="required">*</span></label>
                  <div class="property-toggles">
                    <label class="toggle-option" :class="{ active: form.propertyType === 'Home' }">
                      <input type="radio" value="Home" v-model="form.propertyType" />
                      <Home class="toggle-icon-lucide" /> Home
                    </label>
                    <label class="toggle-option" :class="{ active: form.propertyType === 'Business' }">
                      <input type="radio" value="Business" v-model="form.propertyType" />
                      <Building2 class="toggle-icon-lucide" /> Business
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="lead-details">Optional Details / Notes</label>
                  <textarea 
                    id="lead-details" 
                    v-model="form.details" 
                    rows="3" 
                    placeholder="Any specific appliances, budget, or instructions..." 
                    class="form-input-field textarea-field"
                  ></textarea>
                </div>

                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  <svg class="whatsapp-icon-sm" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  <span>Submit to WhatsApp</span>
                </button>
              </form>

              <!-- Fallback View -->
              <div v-if="showFallback" class="fallback-panel">
                <div class="fallback-divider"></div>
                <p class="fallback-warning">
                  <AlertTriangle class="fallback-icon-lucide text-warning" /> 
                  Could not launch WhatsApp automatically. Please choose an option below:
                </p>
                <a 
                  :href="fallbackUrl" 
                  target="_blank" 
                  class="fallback-direct-btn"
                  @click="closeModal"
                >
                  <ExternalLink class="fallback-icon-lucide btn-icon" /> Open Direct Chat Link
                </a>
                <div class="phone-fallback">
                  <p>Or call/message us directly:</p>
                  <strong>
                    <Phone class="fallback-icon-lucide inline-phone-icon" /> +234 704 188 0339
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  FileText, 
  Zap, 
  Plug, 
  Home, 
  Building2, 
  AlertTriangle, 
  ExternalLink, 
  Phone, 
  ArrowLeft, 
  X 
} from 'lucide-vue-next';

const router = useRouter();

// Modals and form selections
const isOpen = ref(false);
const selectedPath = ref(null);
const savedAudit = ref(null);
const includeCalculator = ref(true);

const form = ref({
  name: '',
  phone: '',
  state: '',
  propertyType: 'Home',
  details: ''
});

const isSubmitting = ref(false);
const showFallback = ref(false);
const fallbackUrl = ref('');

const states = [
  'Lagos', 'Abuja (FCT)', 'Oyo', 'Ondo', 'Ogun', 'Osun', 'Rivers',
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 'Niger',
  'Plateau', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const checkSavedAudit = () => {
  try {
    const raw = localStorage.getItem('origin_last_load_audit');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure the calculation is relatively fresh (e.g. within 2 hours)
      if (Date.now() - parsed.timestamp < 2 * 60 * 60 * 1000) {
        savedAudit.value = parsed;
        selectedPath.value = 'know-needs'; // Skip option selection if calculator is done
        return;
      }
    }
  } catch (e) {
    console.error('Failed to parse localStorage load audit', e);
  }
  savedAudit.value = null;
};

const openModal = () => {
  checkSavedAudit();
  isOpen.value = true;
  showFallback.value = false;
  fallbackUrl.value = '';
};

const closeModal = () => {
  isOpen.value = false;
  selectedPath.value = null;
};

const selectPath = (path) => {
  if (path === 'need-help') {
    closeModal();
    router.push('/load-audit');
  } else {
    selectedPath.value = 'know-needs';
  }
};

const submitLead = () => {
  const name = form.value.name.trim();
  const phone = form.value.phone.trim();
  const state = form.value.state;
  const propertyType = form.value.propertyType;
  let detailsText = form.value.details.trim();

  if (!name || !phone || !state) {
    return;
  }

  isSubmitting.value = true;

  // Smart attachment logic
  if (includeCalculator.value && savedAudit.value) {
    const calculationNote = `Estimated Load: ${savedAudit.value.recommendedInverter}kVA (${savedAudit.value.totalWatts}W)`;
    detailsText = detailsText ? `[${calculationNote}] ${detailsText}` : calculationNote;
  }

  const phoneNumber = '2347041880339';
  
  // Format WhatsApp message as specified in requirement #4
  let message = `Hello Origin Electric, I want to request a solar installation.\n\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n`;
  message += `Location: ${state}\n`;
  message += `Property Type: ${propertyType}\n`;
  message += `Details: ${detailsText || 'None'}\n\n`;
  message += `Please assist me with installation.`;

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encoded}`;

  fallbackUrl.value = whatsappUrl;

  try {
    // Attempt opening WhatsApp in a new tab/window
    const newWindow = window.open(whatsappUrl, '_blank');
    
    // Check if browser blocked window popup
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      throw new Error('Popup blocked');
    }

    // Auto-close modal after successful redirect trigger
    setTimeout(() => {
      closeModal();
      isSubmitting.value = false;
      // Reset form
      form.value = { name: '', phone: '', state: '', propertyType: 'Home', details: '' };
    }, 800);
  } catch (err) {
    // Fallback if blocked
    showFallback.value = true;
    isSubmitting.value = false;
  }
};

onMounted(() => {
  checkSavedAudit();
  window.addEventListener('open-installer-modal', openModal);
});

onUnmounted(() => {
  window.removeEventListener('open-installer-modal', openModal);
});
</script>

<style scoped>
/* Floating Action Button (FAB) */
.fab-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 25px -5px rgba(37, 211, 102, 0.4), var(--shadow-sm);
  cursor: pointer;
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s var(--transition-bounce);
}

.fab-button:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 15px 30px -5px rgba(37, 211, 102, 0.6), var(--shadow-md);
}

.fab-button:active {
  transform: translateY(-1px) scale(0.98);
}

.fab-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.whatsapp-icon {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

/* Pulsing effect for visibility */
.fab-pulse {
  animation: fabPulseGlow 3s infinite;
}

@keyframes fabPulseGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5), 0 10px 25px -5px rgba(37, 211, 102, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(37, 211, 102, 0), 0 10px 25px -5px rgba(37, 211, 102, 0.4);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 10px 25px -5px rgba(37, 211, 102, 0.4);
  }
}

/* Modal Overlay & Transitions */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-container {
  width: 100%;
  max-width: 460px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.modal-header h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.close-icon-lucide {
  width: 20px;
  height: 20px;
}

/* Choice Cards (Guiding path selector) */
.path-selection {
  text-align: center;
  padding: 8px 0;
}

.selection-intro {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.5;
}

.choice-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.choice-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all 0.25s var(--transition-bounce);
}

.choice-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-blue-primary);
  box-shadow: var(--shadow-sm);
}

.choice-card.highlight {
  border-color: rgba(255, 153, 0, 0.25);
  background: linear-gradient(to bottom right, var(--bg-secondary), var(--color-orange-light));
}

.choice-card.highlight:hover {
  border-color: var(--color-orange-primary);
}

.choice-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--bg-primary);
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}

.choice-icon-lucide {
  width: 22px;
  height: 22px;
  color: var(--color-blue-primary);
}

.choice-card.highlight .choice-icon-lucide {
  color: var(--color-orange-primary);
}

.choice-info h4 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--text-primary);
}

.choice-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Form Styles */
.back-path-btn {
  background: none;
  border: none;
  color: var(--color-blue-primary);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;
}

.back-path-btn:hover {
  text-decoration: underline;
}

.back-icon-lucide {
  width: 14px;
  height: 14px;
}

.audit-attachment-alert {
  background: var(--color-blue-light);
  border: 1px solid rgba(0, 102, 204, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  text-align: left;
  align-items: flex-start;
}

.alert-icon-lucide {
  width: 20px;
  height: 20px;
  color: var(--color-blue-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-content {
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-content p {
  color: var(--text-secondary);
  margin: 0;
}

.attachment-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  margin-top: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 0.825rem;
  color: var(--color-blue-primary);
}

.attachment-toggle input {
  cursor: pointer;
}

.form-group {
  margin-bottom: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}

.required {
  color: #ff3b30;
}

.form-input-field {
  width: 100%;
  padding: 10px 14px;
  font-size: 0.95rem;
  font-family: inherit;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}

.form-input-field:focus {
  border-color: var(--color-blue-primary);
}

.textarea-field {
  resize: vertical;
  min-height: 70px;
}

.property-toggles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.toggle-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  user-select: none;
  transition: all 0.2s;
  text-align: center;
}

.toggle-option input {
  display: none;
}

.toggle-option:hover {
  background: var(--bg-primary);
  border-color: var(--text-secondary);
}

.toggle-option.active {
  border-color: var(--color-blue-primary);
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
}

.toggle-icon-lucide {
  width: 16px;
  height: 16px;
  color: inherit;
}

/* Submit & Integration Buttons */
.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
  transition: all 0.25s;
}

.submit-btn:hover:not(:disabled) {
  background: #1ebe57;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.3);
}

.submit-btn:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}

.whatsapp-icon-sm {
  width: 18px;
  height: 18px;
}

/* Fallback view styling */
.fallback-panel {
  text-align: center;
}

.fallback-divider {
  height: 1px;
  background: var(--border-color);
  margin: 20px 0;
}

.fallback-warning {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.fallback-icon-lucide {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.text-warning {
  color: var(--color-orange-primary);
}

.fallback-direct-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-blue-primary);
  color: white;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2);
  margin-bottom: 16px;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.fallback-direct-btn:hover {
  background: var(--color-blue-dark);
}

.btn-icon {
  width: 14px;
  height: 14px;
}

.phone-fallback {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.phone-fallback strong {
  font-size: 1rem;
  color: var(--text-primary);
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.inline-phone-icon {
  width: 16px;
  height: 16px;
  color: var(--color-blue-primary);
}

/* Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-bounce-enter-active {
  animation: modalBounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.modal-bounce-leave-active {
  transition: all 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.modal-bounce-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

@keyframes modalBounceIn {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .fab-button {
    bottom: 16px;
    right: 16px;
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .modal-container {
    padding: 20px;
  }
}
</style>
