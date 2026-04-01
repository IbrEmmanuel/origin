<template>
  <div class="content-section">
    <!-- Booking Wizard -->
    <div v-if="isBooking" class="booking-container glass-card fade-in">
      <div v-if="loadingTypes" class="text-center py-12">
        <span class="loader"></span> Loading options...
      </div>
      <template v-else>
        <div class="wizard-header">
          <button class="back-btn" @click="cancelBooking" :disabled="isSubmitting">
            <ArrowLeftIcon class="icon-sm" /> Back
          </button>
          <div class="stepper">
            <div v-for="n in 4" :key="n" class="step" :class="{ 'active': step === n, 'completed': step > n }">
              <span class="step-dot">{{ step > n ? '✓' : n }}</span>
            </div>
          </div>
        </div>

        <!-- Step 1: Type Selection -->
        <div v-if="step === 1" class="wizard-step">
          <h2 class="step-title">Choose Consultation Type</h2>
          <p class="step-desc">Select the service that best matches your needs.</p>
          
          <div class="options-grid">
            <div v-for="type in consultationTypes" :key="type.id" 
                 class="option-card" 
                 :class="{ 'selected': formData.type === type.name }"
                 @click="selectType(type)">
              <div class="option-header">
                <component :is="getIcon(type.icon)" class="option-icon" />
                <span class="option-price">{{ type.price == 0 ? 'Free' : '₦' + Number(type.price).toLocaleString() }}</span>
              </div>
              <h3>{{ type.name }}</h3>
              <p>{{ type.description }}</p>
              <div class="option-footer">
                <ClockIcon class="icon-xs" /> <span>{{ type.duration }}</span>
              </div>
            </div>
          </div>
          
          <div class="step-actions">
            <button class="btn btn-primary" :disabled="!formData.type" @click="nextStep">Continue</button>
          </div>
        </div>

        <!-- Step 2: Date & Time -->
        <div v-if="step === 2" class="wizard-step">
          <h2 class="step-title">Pick Date & Time</h2>
          <p class="step-desc">Available slots for {{ formData.type }}</p>

          <div class="calendar-layout">
            <div class="datepicker-wrapper">
              <input type="date" v-model="formData.date" :min="minDate" class="date-input" @change="fetchSlots" />
            </div>
            
            <div class="slots-wrapper">
              <h4 class="slots-header">Select Time Slot</h4>
              <div v-if="loadingSlots" class="loading-slots">
                <span class="loader-sm"></span> Loading availability...
              </div>
              <div v-else-if="availableSlots.length > 0" class="slots-grid">
                <button v-for="slot in availableSlots" :key="slot" 
                        class="slot-btn" 
                        :class="{ 'selected': formData.time_slot === slot }"
                        @click="formData.time_slot = slot">
                  {{ slot }}
                </button>
              </div>
              <div v-else-if="formData.date && availableSlots.length === 0" class="no-slots">
                <p>No slots available for this date. Try another day.</p>
              </div>
              <div v-else-if="!formData.date" class="no-slots">
                <p>Please select a date to view available time slots.</p>
              </div>
            </div>
          </div>

          <div class="step-actions flex-gap">
            <button class="btn btn-ghost" @click="prevStep">Back</button>
            <button class="btn btn-primary" :disabled="!formData.date || !formData.time_slot" @click="nextStep">Continue</button>
          </div>
        </div>

        <!-- Step 3: Project Details -->
        <div v-if="step === 3" class="wizard-step">
          <h2 class="step-title">Project Details</h2>
          <p class="step-desc">Tell us a bit more so we can prepare for the session.</p>

          <form class="details-form" @submit.prevent="nextStep">
            <div class="form-row">
              <div class="form-group half">
                <label>Full Name</label>
                <input type="text" v-model="formData.name" placeholder="John Doe" required />
              </div>
              <div class="form-group half">
                <label>Phone / WhatsApp</label>
                <input type="tel" v-model="formData.phone" placeholder="08012345678" required />
              </div>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" v-model="formData.email" placeholder="john@example.com" readonly class="readonly-input" required />
            </div>
            <div class="form-group">
              <label>Project Type</label>
              <select v-model="formData.project_type" required>
                <option value="">Select project type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Short Description</label>
              <textarea v-model="formData.description" placeholder="Describe what you want to achieve..." rows="3"></textarea>
            </div>

            <div class="step-actions flex-gap">
              <button type="button" class="btn btn-ghost" @click="prevStep">Back</button>
              <button type="submit" class="btn btn-primary">Proceed to Payment</button>
            </div>
          </form>
        </div>

        <!-- Step 4: Payment -->
        <div v-if="step === 4" class="wizard-step">
          <h2 class="step-title">Payment & Confirmation</h2>
          <p class="step-desc">Please review your booking details before proceeding to payment.</p>

          <div class="summary-card review-card">
            <div class="summary-section">
              <h4 class="section-label">Service Info</h4>
              <div class="summary-line"><span>Type</span> <strong>{{ formData.type }}</strong></div>
              <div class="summary-line"><span>Date & Time</span> <strong>{{ formData.date }} at {{ formData.time_slot }}</strong></div>
            </div>
            
            <div class="summary-divider"></div>

            <div class="summary-section">
              <h4 class="section-label">Your Info</h4>
              <div class="summary-line"><span>Name</span> <strong>{{ formData.name }}</strong></div>
              <div class="summary-line"><span>Contact</span> <strong>{{ formData.email }} / {{ formData.phone }}</strong></div>
              <div class="summary-line"><span>Project</span> <strong>{{ formData.project_type }}</strong></div>
              <div v-if="formData.description" class="summary-line description">
                <span>Description</span>
                <p>{{ formData.description }}</p>
              </div>
            </div>

            <div class="summary-divider"></div>
            <div class="summary-line total"><span>Amount Due</span> <strong>₦{{ Number(formData.amount).toLocaleString() }}</strong></div>
          </div>

          <div class="payment-options">
            <button v-if="formData.amount > 0" 
                    class="btn btn-paystack full-width" 
                    @click="payWithPaystack" 
                    :disabled="isSubmitting">
              {{ isSubmitting ? 'Processing...' : 'Pay with Paystack' }}
            </button>
            <button v-else 
                    class="btn btn-primary full-width" 
                    @click="confirmFreeBooking" 
                    :disabled="isSubmitting">
              {{ isSubmitting ? 'Confirming...' : 'Confirm Free Booking' }}
            </button>
            
            <button v-if="formData.amount > 0" 
                    class="btn btn-outline full-width" 
                    @click="payLater" 
                    :disabled="isSubmitting">
              I'll pay later (Keep as Pending)
            </button>
          </div>

          <div class="step-actions mt-6">
            <button class="btn btn-ghost full-width" @click="prevStep" :disabled="isSubmitting">Back to Project Details</button>
          </div>
        </div>
      </template>
    </div>

    <!-- Success Page -->
    <div v-else-if="checkoutSuccess" class="success-container glass-card fade-in text-center">
      <div class="success-icon-wrapper">
        <CheckCircleIcon class="success-icon" />
      </div>
      <h2>Booking Successful!</h2>
      <p>Your consultation is scheduled. A confirmation email has been sent to <strong>{{ formData.email }}</strong>.</p>
      
      <div class="booking-summary mt-5">
        <div class="summary-item">
          <CalendarIcon class="icon-sm" /> <span>{{ formData.date }} at {{ formData.time_slot }}</span>
        </div>
        <div class="summary-item" v-if="meetingLink">
          <VideoIcon class="icon-sm" /> <a :href="meetingLink" target="_blank">Join Meeting</a>
        </div>
      </div>

      <button class="btn btn-primary mt-6" @click="resetFlow">View My Bookings</button>
    </div>

    <!-- Consultations List (Dashboard) -->
    <div v-else class="consultations-dashboard">
      <div class="dashboard-header">
        <h2>My Consultations</h2>
        <button class="btn btn-primary" @click="startBooking">
          <PlusIcon class="icon-sm" /> Book New
        </button>
      </div>

      <div v-if="loadingConsultations" class="loading-state py-xl">
        <span class="loader"></span> Loading your bookings...
      </div>

      <div v-else-if="consultations.length === 0" class="empty-state-card glass-card fade-in">
        <div class="empty-state-icon">
          <CalendarIcon class="icon-xl" />
        </div>
        <h3>No Consultations Yet</h3>
        <p>Schedule a session with our experts to get tailored advice on your solar and energy projects.</p>
        <button class="btn btn-primary" @click="startBooking">
          <PlusIcon class="icon-sm" /> Book New Consultation
        </button>
      </div>

      <div v-else class="consultations-grid">
        <div v-for="c in consultations" :key="c.id" class="consultation-card glass-card">
          <div class="c-header">
            <span class="c-type">{{ c.type }}</span>
            <span class="c-status" :class="c.status.toLowerCase()">{{ c.status }}</span>
          </div>
          <div class="c-body">
            <div class="c-info">
              <CalendarIcon class="icon-xs" /> <span>{{ formatDate(c.date) }}</span>
            </div>
            <div class="c-info">
              <ClockIcon class="icon-xs" /> <span>{{ c.time_slot }}</span>
            </div>
          </div>
          <div class="c-footer" v-if="c.status === 'Confirmed' && c.meeting_link">
            <a :href="c.meeting_link" class="btn btn-primary btn-sm btn-full btn-flex" target="_blank">
               <VideoIcon class="icon-xs" /> Join Meeting
            </a>
          </div>
          <div class="c-footer" v-else-if="c.status === 'Pending'">
            <button class="btn btn-primary btn-sm btn-full btn-flex" @click="payExistingBooking(c)" :disabled="isSubmitting">
              <CreditCardIcon class="icon-xs" /> Pay Now
            </button>
          </div>
          <div class="c-footer" v-else-if="c.status === 'Confirmed' && !c.meeting_link">
             <span class="text-xs text-secondary">Awaiting meeting link</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { 
  ArrowLeft as ArrowLeftIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Sun as SunIcon,
  Zap as ZapIcon,
  ShieldCheck as ShieldIcon,
  Video as VideoIcon,
  CheckCircle as CheckCircleIcon,
  Plus as PlusIcon,
  LayoutGrid as GridIcon,
  PhoneCall as PhoneIcon,
  Briefcase as BusinessIcon,
  CreditCard as CreditCardIcon
} from 'lucide-vue-next';
import consultationService from '@/services/consultationService';

// State
const consultationTypes = ref([]);
const isBooking = ref(false);
const step = ref(1);
const loadingConsultations = ref(false);
const loadingTypes = ref(false);
const loadingSlots = ref(false);
const isSubmitting = ref(false);
const checkoutSuccess = ref(false);
const meetingLink = ref('');
const consultations = ref([]);
const availableSlots = ref([]);
const minDate = new Date().toISOString().split('T')[0];

const formData = reactive({
  type: '',
  date: '',
  time_slot: '',
  name: '',
  email: '',
  phone: '',
  project_type: '',
  description: '',
  amount: 0
});

// Methods
const getIcon = (iconName) => {
  const icons = {
    Sun: SunIcon,
    Zap: ZapIcon,
    ShieldCheck: ShieldIcon,
    LayoutGrid: GridIcon,
    PhoneCall: PhoneIcon,
    Briefcase: BusinessIcon
  };
  return icons[iconName] || SunIcon;
};

const startBooking = () => {
  isBooking.value = true;
  step.value = 1;
};

const cancelBooking = () => {
  isBooking.value = false;
  resetFormData();
};

const nextStep = () => {
  if (step.value < 4) {
    step.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevStep = () => {
  if (step.value > 1) {
    step.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const selectType = (type) => {
  formData.type = type.name;
  formData.amount = type.price;
  
  setTimeout(() => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  }, 100);
};

const fetchTypes = async () => {
  loadingTypes.value = true;
  try {
    consultationTypes.value = await consultationService.getConsultationTypes();
  } catch (err) {
    console.error('Failed to fetch types', err);
  } finally {
    loadingTypes.value = false;
  }
};

const fetchSlots = async () => {
  if (!formData.date) return;
  loadingSlots.value = true;
  try {
    const slots = await consultationService.getAvailableSlots(formData.date);
    availableSlots.value = slots;
  } catch (err) {
    console.error('Failed to fetch slots', err);
  } finally {
    loadingSlots.value = false;
  }
};

const fetchConsultations = async () => {
  loadingConsultations.value = true;
  try {
    consultations.value = await consultationService.getMyConsultations();
  } catch (err) {
    console.error('Failed to fetch consultations', err);
  } finally {
    loadingConsultations.value = false;
  }
};

const confirmFreeBooking = async () => {
  isSubmitting.value = true;
  try {
    await consultationService.createBooking(formData);
    checkoutSuccess.value = true;
    isBooking.value = false;
    await fetchConsultations();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to book consultation');
  } finally {
    isSubmitting.value = false;
  }
};

const payLater = async () => {
  isSubmitting.value = true;
  try {
    await consultationService.createBooking(formData);
    checkoutSuccess.value = true;
    isBooking.value = false;
    await fetchConsultations();
  } catch (err) {
    alert('Failed to book consultation');
  } finally {
    isSubmitting.value = false;
  }
};

const loadPaystack = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const payWithPaystack = async () => {
  isSubmitting.value = true;
  try {
    await loadPaystack();
    const bookingRes = await consultationService.createBooking(formData);
    
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
      email: formData.email,
      amount: formData.amount * 100,
      currency: 'NGN',
      callback: (response) => {
        // Handle verification inside a regular function to avoid Paystack callback validation issues
        consultationService.verifyPayment(bookingRes.consultationId, response.reference)
          .then(() => {
            checkoutSuccess.value = true;
            isBooking.value = false;
            fetchConsultations();
          })
          .catch(err => {
            console.error('Verification error', err);
            alert('Payment was successful, but we couldn\'t verify it yet. Please contact support.');
          })
          .finally(() => {
            isSubmitting.value = false;
          });
      },
      onClose: () => {
        isSubmitting.value = false;
      }
    });
    handler.openIframe();
  } catch (err) {
    console.error('Payment error', err);
    isSubmitting.value = false;
  }
};

const payExistingBooking = async (consultation) => {
  isSubmitting.value = true;
  try {
    await loadPaystack();
    
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
      email: consultation.email,
      amount: consultation.amount * 100,
      currency: 'NGN',
      callback: (response) => {
        consultationService.verifyPayment(consultation.id, response.reference)
          .then(() => {
            alert('Payment successful!');
            fetchConsultations();
          })
          .catch(err => {
            console.error('Verification error', err);
            alert('Payment was successful, but we couldn\'t verify it yet. Please contact support.');
          })
          .finally(() => {
            isSubmitting.value = false;
          });
      },
      onClose: () => {
        isSubmitting.value = false;
      }
    });
    handler.openIframe();
  } catch (err) {
    console.error('Payment error', err);
    isSubmitting.value = false;
  }
};

const resetFlow = () => {
  checkoutSuccess.value = false;
  isBooking.value = false;
  resetFormData();
};

const resetFormData = () => {
  formData.type = '';
  formData.date = '';
  formData.time_slot = '';
  formData.name = '';
  formData.email = '';
  formData.phone = '';
  formData.project_type = '';
  formData.description = '';
  formData.amount = 0;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

onMounted(async () => {
  fetchConsultations();
  fetchTypes();
  
  // Try to get from localStorage first for instant load
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (!formData.name) formData.name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    if (!formData.email) formData.email = user.email || '';
    if (!formData.phone) formData.phone = user.phone || user.phone_number || '';
  }

  // Then fetch from API for the latest data (in case localStorage is stale)
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const profile = data.user;
        if (profile) {
          formData.name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          formData.email = profile.email || '';
          formData.phone = profile.phone || '';
        }
      }
    }
  } catch (err) {
    console.error('Failed to sync profile for auto-fill', err);
  }
});
</script>

<style scoped>
.booking-container {
  max-width: 800px;
  margin: 2rem auto 0;
  padding: 2.5rem;
}

@media (max-width: 640px) {
  .booking-container {
    padding: 1.5rem;
    margin-top: 1rem;
  }
}

.wizard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
}

.back-btn:hover { color: var(--color-blue-primary); }

.stepper { display: flex; gap: 12px; }
.step { width: 32px; height: 6px; background: var(--border-color); border-radius: 4px; position: relative; }
.step.active { background: var(--color-blue-primary); width: 48px; }
.step.completed { background: var(--color-blue-primary); }

.step-dot {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-secondary);
  opacity: 0;
}

.step.active .step-dot { opacity: 1; color: var(--color-blue-primary); }

.step-title { font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; }
.step-desc { color: var(--text-secondary); margin-bottom: 2.5rem; }

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.option-card {
  padding: 1.5rem;
  border-radius: 20px;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-card:hover {
  border-color: var(--color-blue-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 102, 204, 0.1);
}

.btn-flex { display: flex; align-items: center; justify-content: center; gap: 8px; }

.option-card.selected { border-color: var(--color-blue-primary); background: rgba(0, 102, 204, 0.03); }

.option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.option-icon { width: 32px; height: 32px; color: var(--color-blue-primary); }
.option-price { font-weight: 800; color: var(--color-blue-primary); }

.option-card h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; }
.option-card p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.4; }
.option-footer { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }

.calendar-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; }
@media (max-width: 640px) { .calendar-layout { grid-template-columns: 1fr; } }
.date-input { 
  width: 100%; 
  padding: 1rem; 
  border-radius: 12px; 
  border: 1px solid var(--border-color); 
  background: var(--bg-primary); 
  color: var(--text-primary);
  font-family: inherit; 
  font-size: 1rem; 
}

.flex-gap { display: flex; gap: 1rem; }

.slots-header {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.slots-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
.slot-btn { 
  padding: 0.75rem; 
  border-radius: 10px; 
  border: 1px solid var(--border-color); 
  background: var(--bg-primary); 
  color: var(--text-primary);
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.2s; 
}
.slot-btn:hover { border-color: var(--color-blue-primary); color: var(--color-blue-primary); }
.payment-options { display: flex; flex-direction: column; gap: 1rem; }
.slot-btn.selected { background: var(--color-blue-primary); border-color: var(--color-blue-primary); color: white !important; }

.details-form .form-row { display: flex; gap: 1.5rem; }
.form-group { margin-bottom: 1.5rem; }
.form-group.half { flex: 1; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.875rem 1.25rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-family: inherit; font-size: 1rem; }
.readonly-input { background: #f8fafc !important; cursor: not-allowed; color: var(--text-secondary) !important; border-style: dashed; }

.summary-card { background: var(--bg-primary); padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem; border: 1px dashed var(--border-color); }
.review-card { padding: 2rem; background: var(--bg-primary); border-style: solid; }
.summary-section { display: flex; flex-direction: column; gap: 0.75rem; }
.section-label { font-size: 0.7rem; text-transform: uppercase; color: var(--color-blue-primary); font-weight: 800; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
.summary-line { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.95rem; }
.summary-line.description { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
.summary-line.description p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; background: rgba(0, 0, 0, 0.03); padding: 0.75rem 1rem; border-radius: 10px; width: 100%; border: 1px solid var(--border-color); }
.summary-divider { height: 1px; background: var(--border-color); margin: 1.25rem 0; }
.total { font-size: 1.2rem; color: var(--color-blue-primary); font-weight: 900; }
.btn-paystack { background: #3bb75e; color: white; }
.btn-paystack:hover { background: #2f9a4e; }

/* Success State */
.success-container { max-width: 600px; margin: 0 auto; padding: 4rem 2rem; }
.success-icon-wrapper { width: 80px; height: 80px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; }
.success-icon { width: 48px; height: 48px; color: #10b981; }

/* Dashboard List */
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.consultations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.consultation-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.c-header { display: flex; justify-content: space-between; align-items: center; }
.c-type { font-weight: 800; font-size: 1rem; }

.c-status { padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
.c-status.confirmed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.c-status.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.c-status.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.c-info { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 4px; }
.btn-full { width: 100%; margin-top: 0.5rem; }

@media (max-width: 640px) {
  .summary-line:not(.description) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  .summary-line:not(.description) span:first-child {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
  .review-card { padding: 1.25rem; }
}

.loader { width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: var(--color-blue-primary); border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.py-xl { padding: 4rem 0; }
.mt-3 { margin-top: 1rem; }
.mt-5 { margin-top: 2rem; }
.mt-6 { margin-top: 2.5rem; }

.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 2rem;
  border: 1px dashed var(--border-color);
  border-radius: 28px;
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  background: rgba(0, 102, 204, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: var(--color-blue-primary);
}

.empty-state-card h3 {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.empty-state-card p {
  color: var(--text-secondary);
  max-width: 440px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.icon-xl { width: 32px; height: 32px; }
</style>
