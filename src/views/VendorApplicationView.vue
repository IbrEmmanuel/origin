<template>
  <div class="vendor-apply-page">
    <div class="container container-narrow py-xl">
      
      <!-- Initial Welcome / Apply State -->
      <div v-if="status === null && !showForm" class="welcome-card glass-card">
        <div class="vendor-badge">Partner Program</div>
        <h1 class="title">Become an Origin Electric Vendor</h1>
        <p class="description">Grow your business by offering premium solar and electric solutions. Access our vast network and professional tools.</p>
        <div class="benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon"><GlobeIcon /></div>
            <h3>Wide Reach</h3>
            <p>Connect with thousands of potential customers looking for energy solutions.</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon"><ZapIcon /></div>
            <h3>Fast Sales</h3>
            <p>Quickly list and sell your products through our optimized marketplace.</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon"><ShieldIcon /></div>
            <h3>Trusted Platform</h3>
            <p>Join a community of verified suppliers and energy professionals.</p>
          </div>
        </div>
        <button @click="showForm = true" class="btn primary-btn btn-lg">Start Application</button>
      </div>

      <!-- Application Form -->
      <div v-else-if="status === null && showForm" class="form-card glass-card">
        <div class="form-header">
          <button @click="showForm = false" class="back-btn">
            <ArrowLeftIcon class="icon-sm" /> Back
          </button>
          <h2>Vendor Application</h2>
        </div>

        <form @submit.prevent="handleSubmit" class="vendor-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <div class="input-wrapper">
                <UserIcon class="input-icon" />
                <input type="text" id="fullName" v-model="form.full_name" required placeholder="John Doe" />
              </div>
            </div>
            <div class="form-group">
              <label for="storeName">Store Name</label>
              <div class="input-wrapper">
                <StoreIcon class="input-icon" />
                <input type="text" id="storeName" v-model="form.store_name" required placeholder="Origin Solar Store" />
              </div>
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <div class="input-wrapper">
                <PhoneIcon class="input-icon" />
                <input type="tel" id="phone" v-model="form.phone" required placeholder="+234..." />
              </div>
            </div>
            <div class="form-group">
              <label for="businessType">Business Type</label>
              <div class="input-wrapper">
                <BriefcaseIcon class="input-icon" />
                <select id="businessType" v-model="form.business_type" required>
                  <option value="">Select Type</option>
                  <option value="retailer">Retailer</option>
                  <option value="installer">Installer</option>
                  <option value="distributor">Distributor</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="street">Street Address</label>
            <div class="input-wrapper">
              <MapPinIcon class="input-icon" />
              <input type="text" id="street" v-model="form.street" required placeholder="123 Energy Way" />
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label for="city">City</label>
              <input type="text" id="city" v-model="form.city" required placeholder="Lagos" />
            </div>
            <div class="form-group">
              <label for="state">State</label>
              <input type="text" id="state" v-model="form.state" required placeholder="Lagos State" />
            </div>
            <div class="form-group">
              <label for="country">Country</label>
              <input type="text" id="country" v-model="form.country" required placeholder="Nigeria" />
            </div>
          </div>

          <div class="form-group">
            <label for="description">Tell us about your business</label>
            <textarea id="description" v-model="form.description" rows="4" placeholder="Services offered, years in business, current product range, etc."></textarea>
          </div>

          <button type="submit" class="btn primary-btn submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loader"></span>
            <span v-else>Submit Application</span>
          </button>
        </form>
      </div>

      <!-- Pending State -->
      <div v-else-if="status === 'pending'" class="status-card glass-card pending">
        <div class="status-icon-wrapper">
          <ClockIcon class="status-icon" />
        </div>
        <h2>Application Under Review</h2>
        <p>
          Thank you for applying to be an Origin Electric vendor! Our team is currently reviewing your business details and verification documents.
        </p>
        <div class="status-details">
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="detail-value status-tag pending">Pending Review</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Estimated Time</span>
            <span class="detail-value">2-3 Business Days</span>
          </div>
        </div>
        <p class="status-footer">We'll notify you via email ({{ user?.email }}) as soon as your account is activated.</p>
        <router-link to="/" class="btn secondary-btn">Back to Home</router-link>
      </div>

      <!-- Rejected State -->
      <div v-else-if="status === 'rejected'" class="status-card glass-card rejected">
        <div class="status-icon-wrapper">
          <AlertTriangleIcon class="status-icon" />
        </div>
        <h2>Application Rejected</h2>
        <p>Unfortunately, your vendor application has been rejected at this time. This may be due to incomplete information or verification issues.</p>
        <div class="status-details">
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="detail-value status-tag rejected">Rejected</span>
          </div>
        </div>
        <div class="action-group">
          <button @click="status = null; showForm = true" class="btn primary-btn">Re-apply Now</button>
          <router-link to="/contact" class="btn text-btn">Contact Support</router-link>
        </div>
      </div>

      <!-- Approved State: Simple Hub -->
      <div v-else-if="status === 'approved'" class="status-card glass-card approved">
        <div class="status-icon-wrapper">
          <CheckCircleIcon class="status-icon" />
        </div>
        <h2>Welcome to the Network!</h2>
        <p>Your vendor account is active. You can now start managing your products and orders from the dashboard.</p>
        <div class="status-details">
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="detail-value status-tag approved">Approved</span>
          </div>
        </div>
        <router-link to="/account/vendor" class="btn primary-btn">Go to Vendor Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import vendorService from '@/services/vendor.service';
import authService from '@/services/auth.service';
import { 
  ArrowLeft as ArrowLeftIcon, 
  Clock as ClockIcon, 
  CheckCircle as CheckCircleIcon, 
  AlertTriangle as AlertTriangleIcon,
  Globe as GlobeIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  User as UserIcon,
  Store as StoreIcon,
  Phone as PhoneIcon,
  Briefcase as BriefcaseIcon,
  MapPin as MapPinIcon
} from 'lucide-vue-next';

const router = useRouter();
const user = ref(authService.getUser());
const status = ref(null);
const showForm = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(true);

const form = ref({
  full_name: '',
  store_name: '',
  street: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  business_type: '',
  description: ''
});

const fetchStatus = async () => {
  try {
    const data = await vendorService.getStatus();
    status.value = data.status;
  } catch (err) {
    console.error('Failed to fetch vendor status', err);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await vendorService.apply(form.value);
    status.value = 'pending';
    showForm.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to submit application');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchStatus();
});
</script>

<style scoped>
.vendor-apply-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-top: 80px; /* Header offset */
  background-image: 
    radial-gradient(at 100% 0%, rgba(0, 102, 204, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
}

.container-narrow {
  max-width: 800px;
}

/* Welcome Card */
.welcome-card {
  padding: 4rem;
  text-align: center;
  border: 1px solid var(--border-color);
}

.vendor-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--text-primary);
}

.description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.5;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
  text-align: left;
}

.benefit-item h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
.benefit-item p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4; }
.benefit-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue-primary);
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}
.benefit-icon svg { width: 22px; height: 22px; }

/* Form Card */
.form-card {
  padding: 3rem;
  border: 1px solid var(--border-color);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.form-header h2 { font-size: 1.75rem; font-weight: 800; }

.back-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.back-btn:hover { background: var(--border-color); }

.vendor-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 1rem; color: var(--text-secondary); width: 18px; height: 18px; pointer-events: none; }

input, select, textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
}

.input-wrapper input, .input-wrapper select { padding-left: 3rem; }

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

.submit-btn { margin-top: 1rem; padding: 1.125rem; font-size: 1.1rem; font-weight: 800; }

/* Status Cards */
.status-card {
  padding: 5rem 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.status-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.pending .status-icon-wrapper { background: var(--color-blue-light); color: var(--color-blue-primary); }
.rejected .status-icon-wrapper { background: #fee2e2; color: #ef4444; }
.approved .status-icon-wrapper { background: #dcfce7; color: #10b981; }

.status-icon { width: 40px; height: 40px; }

.status-card h2 { font-size: 2.25rem; font-weight: 800; }
.status-card p { color: var(--text-secondary); max-width: 500px; font-size: 1.1rem; line-height: 1.6; }

.status-details {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.detail-item { display: flex; justify-content: space-between; align-items: center; }
.detail-label { font-weight: 600; color: var(--text-secondary); font-size: 0.9rem; }
.detail-value { font-weight: 700; color: var(--text-primary); }

.status-tag { padding: 4px 12px; border-radius: 999px; font-size: 0.8rem; }
.status-tag.pending { background: var(--color-blue-primary); color: white; }
.status-tag.rejected { background: #ef4444; color: white; }
.status-tag.approved { background: #10b981; color: white; }

.status-footer { font-size: 0.9rem !important; opacity: 0.8; }
.action-group { display: flex; align-items: center; gap: 1rem; }
.text-btn { background: transparent; border: none; font-weight: 700; color: var(--color-blue-primary); }

.btn-lg { padding: 1.125rem 3rem; font-size: 1.25rem; }

@media (max-width: 768px) {
  .welcome-card, .form-card, .status-card { padding: 2.5rem 1.5rem; }
  .title { font-size: 2.5rem; }
  .benefits-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .form-grid, .form-grid-3 { grid-template-columns: 1fr; }
  .action-group { flex-direction: column; width: 100%; }
  .action-group .btn { width: 100%; }
  .form-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
