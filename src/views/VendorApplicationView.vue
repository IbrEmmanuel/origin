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
                <input type="tel" id="phone" v-model="form.phone" required placeholder="+234..." inputmode="tel" autocomplete="tel" />
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

          <div class="form-section-label">Store verification</div>

          <div class="form-group">
            <label for="storePhotos">Store / warehouse photos</label>
            <input
              id="storePhotos"
              type="file"
              accept="image/*"
              multiple
              @change="onStorePhotos"
            />
            <p class="field-hint">Upload 1–5 clear photos of your storefront or warehouse (JPG/PNG, max 5&nbsp;MB each).</p>
            <ul v-if="storePhotoNames.length" class="file-list">
              <li v-for="(name, i) in storePhotoNames" :key="i">{{ name }}</li>
            </ul>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="idDoc">ID document (optional)</label>
              <input id="idDoc" type="file" accept="image/*,.pdf" @change="onIdDoc" />
              <p class="field-hint">National ID, passport, or driver’s licence.</p>
            </div>
            <div class="form-group">
              <label for="cacDoc">CAC / business proof (optional)</label>
              <input id="cacDoc" type="file" accept="image/*,.pdf" @change="onCacDoc" />
              <p class="field-hint">Registration certificate if available.</p>
            </div>
          </div>

          <div class="form-section-label">Store location</div>
          <div class="geo-row">
            <button type="button" class="btn secondary-btn geo-btn" :disabled="geoLoading" @click="captureLocation">
              {{ geoLoading ? 'Locating…' : (form.latitude ? 'Update GPS pin' : 'Use my current location') }}
            </button>
            <p v-if="form.latitude && form.longitude" class="geo-coords">
              Pin: {{ Number(form.latitude).toFixed(5) }}, {{ Number(form.longitude).toFixed(5) }}
            </p>
            <p v-else class="field-hint">Geolocation helps admins verify your store address. Allow location when prompted.</p>
            <p v-if="geoError" class="geo-error" role="alert">{{ geoError }}</p>
          </div>

          <button type="submit" class="btn primary-btn submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loader"></span>
            <span v-else>Submit Application</span>
          </button>
        </form>
      </div>

      <!-- Pending State — no dashboard access until admin approves -->
      <div v-else-if="status === 'pending'" class="status-card glass-card pending">
        <div class="status-icon-wrapper">
          <ClockIcon class="status-icon" />
        </div>
        <h2>Waiting for Admin Approval</h2>
        <p>
          Your supplier application is submitted. An Origin Electric admin must approve it in the admin dashboard before you can open the Vendor Dashboard or manage products.
        </p>
        <div class="status-details">
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="detail-value status-tag pending">Pending Admin Approval</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Estimated Time</span>
            <span class="detail-value">2-3 Business Days</span>
          </div>
        </div>
        <p class="status-footer">
          “Go to Vendor Dashboard” appears only after approval. We’ll email {{ user?.email }} when you’re activated.
        </p>
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

      <!-- Approved only — sole place that links into the vendor hub -->
      <div v-else-if="status === 'approved'" class="status-card glass-card approved">
        <div class="status-icon-wrapper">
          <CheckCircleIcon class="status-icon" />
        </div>
        <h2>Approved by Admin</h2>
        <p>Your supplier account is active. You can now manage products, orders, and wallet from the Vendor Dashboard.</p>
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
import api from '@/services/api';
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
  country: 'Nigeria',
  phone: '',
  business_type: '',
  description: '',
  latitude: null,
  longitude: null
});

const storePhotos = ref([]);
const storePhotoNames = ref([]);
const idDoc = ref(null);
const cacDoc = ref(null);
const geoLoading = ref(false);
const geoError = ref('');

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const onStorePhotos = (e) => {
  const files = Array.from(e.target.files || []).slice(0, 5);
  const accepted = [];
  for (const f of files) {
    if (f.size > MAX_PHOTO_BYTES) {
      alert(`${f.name} is larger than 5 MB and was skipped.`);
      continue;
    }
    accepted.push(f);
  }
  storePhotos.value = accepted;
  storePhotoNames.value = accepted.map((f) => f.name);
};

const onIdDoc = (e) => {
  const f = e.target.files?.[0] || null;
  if (f && f.size > MAX_PHOTO_BYTES) {
    alert('ID document must be under 5 MB.');
    e.target.value = '';
    idDoc.value = null;
    return;
  }
  idDoc.value = f;
};

const onCacDoc = (e) => {
  const f = e.target.files?.[0] || null;
  if (f && f.size > MAX_PHOTO_BYTES) {
    alert('CAC document must be under 5 MB.');
    e.target.value = '';
    cacDoc.value = null;
    return;
  }
  cacDoc.value = f;
};

const captureLocation = () => {
  geoError.value = '';
  if (!navigator.geolocation) {
    geoError.value = 'Geolocation is not supported in this browser.';
    return;
  }
  geoLoading.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.value.latitude = pos.coords.latitude;
      form.value.longitude = pos.coords.longitude;
      geoLoading.value = false;
    },
    (err) => {
      geoError.value =
        err.code === 1
          ? 'Location permission denied. You can still submit — admin will verify your address manually.'
          : 'Could not read GPS. Check permissions and try again.';
      geoLoading.value = false;
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
};

const buildApplyPayload = () => {
  const hasFiles =
    storePhotos.value.length > 0 || idDoc.value || cacDoc.value;
  if (!hasFiles) {
    return { ...form.value };
  }
  const fd = new FormData();
  Object.entries(form.value).forEach(([key, val]) => {
    if (val == null || val === '') return;
    fd.append(key, String(val));
  });
  storePhotos.value.forEach((file, i) => {
    fd.append('store_photos[]', file);
    fd.append(`store_photo_${i}`, file);
  });
  if (idDoc.value) fd.append('id_document', idDoc.value);
  if (cacDoc.value) fd.append('cac_document', cacDoc.value);
  return fd;
};

const fetchProfile = async () => {
  try {
    const { data } = await api.get('/user/profile');
    if (data && data.user) {
      const full = `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim();
      if (full && !form.value.full_name) {
        form.value.full_name = full;
      }
    }
  } catch (err) {
    console.error('Failed to fetch user profile', err);
  }
};

const fetchStatus = async () => {
  try {
    const data = await vendorService.getStatus();
    const raw = data?.status;
    status.value = raw == null || raw === '' ? null : String(raw).toLowerCase();
  } catch (err) {
    console.error('Failed to fetch vendor status', err);
    status.value = null;
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!storePhotos.value.length && !form.value.latitude) {
    const ok = confirm(
      'No store photos or GPS pin yet. Admins review photos and location for approval. Submit anyway?'
    );
    if (!ok) return;
  }
  isSubmitting.value = true;
  try {
    await vendorService.apply(buildApplyPayload());
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
  fetchProfile();
});
</script>

<style scoped>
.vendor-apply-page {
  min-height: 100svh;
  background-color: var(--bg-primary);
  padding-top: calc(5.5rem + env(safe-area-inset-top, 0px));
  padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
  overflow-x: clip;
  background-image: 
    radial-gradient(at 100% 0%, rgba(0, 102, 204, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
}

.container-narrow {
  max-width: 800px;
  width: 100%;
  padding-left: max(1rem, env(safe-area-inset-left, 0px));
  padding-right: max(1rem, env(safe-area-inset-right, 0px));
  box-sizing: border-box;
}

/* Welcome Card */
.welcome-card {
  padding: clamp(1.5rem, 5vw, 4rem);
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
  font-size: clamp(1.75rem, 7vw, 3.25rem);
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--text-primary);
}

.description {
  font-size: clamp(1rem, 2.8vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.5;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  text-align: left;
}

@media (min-width: 640px) {
  .benefits-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 4rem;
  }
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
  padding: clamp(1.25rem, 4vw, 3rem);
  border: 1px solid var(--border-color);
}

.form-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-header h2 { font-size: clamp(1.25rem, 4vw, 1.75rem); font-weight: 800; }

.back-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 10px 16px;
  min-height: 44px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}
@media (hover: hover) and (pointer: fine) {
  .back-btn:hover { background: var(--border-color); }
}

.vendor-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-grid,
.form-grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .form-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .form-grid-3 { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
}

.form-group { display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
.form-group label { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 1rem; color: var(--text-secondary); width: 18px; height: 18px; pointer-events: none; }

input, select, textarea {
  width: 100%;
  max-width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.input-wrapper input, .input-wrapper select { padding-left: 3rem; }

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

.submit-btn { margin-top: 1rem; padding: 1.125rem; font-size: 1.1rem; font-weight: 800; }

.form-section-label {
  margin: 1.75rem 0 0.85rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.field-hint {
  margin: 0.4rem 0 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.file-list {
  margin: 0.5rem 0 0;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.geo-row {
  margin-bottom: 1rem;
}

.geo-btn {
  width: 100%;
  max-width: 280px;
}

.geo-coords {
  margin: 0.65rem 0 0;
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--color-primary, #ff7600);
}

.geo-error {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #b42318;
}

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
  .action-group { flex-direction: column; width: 100%; }
  .action-group .btn { width: 100%; }
  .btn-lg { width: 100%; padding: 1rem 1.25rem; font-size: 1.05rem; }
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
