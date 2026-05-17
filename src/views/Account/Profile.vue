<template>
  <div class="profile-container">
    <!-- 1. Profile Identity Header -->
    <div class="profile-header-card glass-card">
      <div class="user-avatar-hero">
        {{ (user.first_name?.[0] || '') + (user.last_name?.[0] || '') || 'U' }}
      </div>
      <div class="user-info-hero">
        <h2>{{ user.first_name || 'User' }} {{ user.last_name || '' }}</h2>
        <p class="user-email-hero">{{ user.email }}</p>
        <div class="user-badges">
          <span class="badge badge-verified">Verified Account</span>
          <span class="badge badge-date">Member since {{ getJoinYear(user.memberSince) }}</span>

        </div>
      </div>
    </div>

    <div class="profile-content-grid">
      <!-- 2. Primary Column (Settings & Addresses) -->
      <div class="profile-column main-col">
        <section class="section-card glass-card">
          <div class="section-header">
            <UserIcon class="icon-inline" />
            <h3>Personal Information</h3>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" v-model="user.first_name" placeholder="Enter first name" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" v-model="user.last_name" placeholder="Enter last name" />
            </div>
            <div class="form-group full-width">
              <label>Phone Number</label>
              <input type="tel" v-model="user.phone" placeholder="+234 ..." />
            </div>
          </div>
          <button class="btn btn-primary mt-6" @click="saveProfile">Update Profile</button>
        </section>

        <section class="section-card glass-card">
          <div class="section-header">
            <PackageIcon class="icon-inline" />
            <h3>Saved Addresses</h3>
            <button class="btn-text">+ Add New</button>
          </div>
          <div class="address-grid">
            <div v-for="address in addresses" :key="address.id" class="address-card">
              <div class="address-type-row">
                <span class="type-tag">{{ address.type }}</span>
                <span v-if="address.isDefault" class="default-tag">Default</span>
              </div>
              <p class="address-body">{{ address.fullAddress }}</p>
              <div class="address-footer">
                <button class="btn-link">Edit</button>
                <button class="btn-link delete">Delete</button>
              </div>
            </div>
            <div v-if="addresses.length === 0" class="empty-state">
               <p>No addresses saved yet.</p>
            </div>
          </div>
        </section>
      </div>

      <!-- 3. Side Column (Referrals & Preferences) -->
      <div class="profile-column side-col">
        <section class="section-card glass-card highlight-card">
          <div class="section-header">
            <ReferralsIcon class="icon-inline" />
            <h3>Referrals & Rewards</h3>
          </div>
          <div class="referral-widget">
            <div class="reward-stats-hero">
              <div class="stat-box">
                <span class="stat-num">{{ referralData.count }}</span>
                <span class="stat-lbl">Joined</span>
              </div>
              <!-- <div class="stat-box">
                <span class="stat-num">{{ referralData.earnings }}</span>
                <span class="stat-lbl">Units</span>
              </div> -->
            </div>

            <div class="referral-code-wrapper">
              <label>Your Referral Code</label>
              <div class="copy-box">
                <code>{{ referralData.code || 'NOCODE' }}</code>
                <button class="btn-copy-icon" @click="copyReferralCode" title="Copy Code">
                  <CopyIcon class="icon-xs" />
                </button>
              </div>
            </div>

            <div class="referral-link-wrapper mt-4">
              <label>Your Referral Link</label>
              <div class="copy-box link-box">
                <span class="link-text">{{ generateReferralLink() }}</span>
                <button class="btn-copy-icon" @click="copyReferralLink" title="Copy Link">
                  <CopyIcon class="icon-xs" />
                </button>
              </div>
            </div>

            <div class="referrals-list-wrapper mt-6">
              <label>Users You've Referred</label>
              <div class="referrals-list">
                <div v-for="ref in referralsList" :key="ref.id" class="referral-item">
                  <div class="ref-user-avatar">{{ ref.first_name?.[0] || 'U' }}</div>
                  <div class="ref-user-details">
                    <p class="ref-name">{{ ref.first_name }} {{ ref.last_name }}</p>
                    <p class="ref-date">Joined {{ new Date(ref.created_at).toLocaleDateString() }}</p>
                  </div>
                </div>
                <div v-if="referralsList.length === 0" class="empty-referrals">
                  <p>You haven't referred anyone yet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="section-card glass-card">
          <div class="section-header">
            <SettingsIcon class="icon-inline" />
            <h3>Notifications</h3>
          </div>
          <div class="settings-stack">
            <div class="setting-row">
              <div class="setting-meta">
                <span class="setting-title">Email Alerts</span>
                <span class="setting-sub">Orders & Promotions</span>
              </div>
              <label class="switch-md">
                <input type="checkbox" v-model="settings.email" />
                <span class="slider-md"></span>
              </label>
            </div>
            <div class="setting-row">
              <div class="setting-meta">
                <span class="setting-title">SMS Status</span>
                <span class="setting-sub">Delivery Updates</span>
              </div>
              <label class="switch-md">
                <input type="checkbox" v-model="settings.sms" />
                <span class="slider-md"></span>
              </label>
            </div>
            <button class="btn btn-outline-full mt-4" @click="saveProfile">Save Preferences</button>
          </div>
        </section>

        <section class="section-card glass-card danger-zone">
          <h3>Security</h3>
          <p class="text-xs-dim">Managed your account security and data</p>
          <div class="danger-actions mt-3">
            <button class="btn-text-danger">Deactivate Account</button>
          </div>
        </section>
      </div>
    </div>

    <!-- 4. Footer Sections (Favorites & Activity) -->
    <div class="profile-footer-area">
      <section class="section-card glass-card">
          <div class="section-header">
            <HeartIcon class="icon-inline" />
            <h3>Favourite Items</h3>
            <router-link to="/marketplace" class="btn-text-action">Explore More</router-link>
          </div>
        <div class="favorites-scroller">
          <div v-for="item in favorites" :key="item.id" class="fav-mini-card">
            <div class="fav-img">
              <PackageIcon class="icon-sm" />
            </div>
            <div class="fav-data">
              <p class="fav-name">{{ item.name }}</p>
              <p class="fav-price">{{ item.price }}</p>
            </div>
            <button class="fav-del-btn"><TrashIcon class="icon-xs" /></button>
          </div>
          <div v-if="favorites.length === 0" class="empty-state-inline">
            <p>You haven't favorited any items yet.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  User as UserIcon,
  Users as ReferralsIcon,
  Heart as HeartIcon,
  Settings as SettingsIcon,
  Package as PackageIcon, 
  Trash2 as TrashIcon,
  Copy as CopyIcon
} from 'lucide-vue-next';

const isLoading = ref(true);
const user = ref({ first_name: '', last_name: '', email: '', phone: '' });
const addresses = ref([]);
const favorites = ref([]);
const referralData = ref({ code: '', count: 0, earnings: 0 });
const referralsList = ref([]);
const settings = ref({ email: true, sms: false, marketing: true });

const getJoinYear = (dateString) => {
    if (!dateString) return new Date().getFullYear();
    return new Date(dateString).getFullYear();
};

const copyReferralCode = () => {

    if (!referralData.value.code) return;
    navigator.clipboard.writeText(referralData.value.code);
    alert('Referral code copied to clipboard!');
};

const generateReferralLink = () => {
    if (!referralData.value.code) return '';
    return `${window.location.origin}/signup?ref=${referralData.value.code}`;
};

const copyReferralLink = () => {
    const link = generateReferralLink();
    if (!link) return;
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
};


const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      user.value = data.user;
      addresses.value = data.addresses;
      favorites.value = data.favorites;
      referralData.value = data.referralData;
      
      // Fetch referrals list
      const refResponse = await fetch(`${baseUrl}/api/user/referrals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (refResponse.ok) {
        referralsList.value = await refResponse.json();
      }
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProfile);

const saveProfile = async () => {
  // Frontend Validation
  if (!user.value.first_name?.trim() || !user.value.last_name?.trim() || !user.value.phone?.trim()) {
    alert('Please fill out all personal information fields (First Name, Last Name, Phone).');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/profile`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: user.value.first_name,
        last_name: user.value.last_name,
        phone: user.value.phone,
        settings: settings.value
      })
    });
    
    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Failed to update profile');
    }
  } catch (err) {
    console.error('Failed to save profile', err);
    alert('An unexpected error occurred while saving your profile.');
  }
};

</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
}

/* 1. Header Hero Card */
.profile-header-card {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 32px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}

.user-avatar-hero {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--color-blue-primary), var(--color-blue-dark));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  box-shadow: 0 10px 20px rgba(0, 102, 204, 0.2);
}

.user-info-hero h2 {
  font-size: 1.75rem;
  margin-bottom: 4px;
}

.user-email-hero {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 12px;
}

.user-badges {
  display: flex;
  gap: 12px;
}

.badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-verified {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-date {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

/* 2. Content Grid */
.profile-content-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--space-md);
}

.profile-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.section-card {
  padding: var(--space-md);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.section-header h3 {
  font-size: 1.15rem;
  font-weight: 800;
  flex: 1;
}

.icon-inline {
  width: 20px;
  height: 20px;
  color: var(--color-blue-primary);
}

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-group input:focus {
  border-color: var(--color-blue-primary);
  outline: none;
  background: var(--bg-primary);
}

/* Address Grid */
.address-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.address-card {
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.address-card:hover {
  border-color: var(--color-blue-primary);
  transform: translateY(-2px);
}

.address-type-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.type-tag {
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: 800;
  border-radius: 4px;
}

.default-tag {
  font-size: 0.65rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.address-body {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
  min-height: 40px;
}

.address-footer {
  display: flex;
  gap: 12px;
}

/* Referrals */
.highlight-card {
  background: linear-gradient(135deg, var(--bg-secondary), var(--color-blue-light));
  border: 1px solid var(--color-blue-primary);
}

.reward-stats-hero {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-box {
  flex: 1;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.stat-num {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-blue-primary);
}

.stat-lbl {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.copy-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 2px dashed var(--color-blue-primary);
  border-radius: var(--radius-md);
  margin-top: 8px;
}

.copy-box code {
  flex: 1;
  font-family: monospace;
  font-weight: 700;
  font-size: 1.1rem;
}

.btn-copy-icon {
  background: transparent;
  border: none;
  color: var(--color-blue-primary);
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
}

.btn-copy-icon:hover {
  transform: scale(1.1);
}

.link-box {
  border-style: solid;
  border-width: 1px;
}

.link-text {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Referrals List */
.referrals-list-wrapper label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 12px;
  display: block;
}

.referrals-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.referral-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.ref-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}

.ref-user-details .ref-name {
  font-weight: 700;
  font-size: 0.9rem;
}

.ref-user-details .ref-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.empty-referrals {
  text-align: center;
  padding: 24px;
  background: var(--bg-primary);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.85rem;
}


/* Notification Settings */
.settings-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.setting-title {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
}

.setting-sub {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Favorites area */
.profile-footer-area {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.favorites-scroller {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fav-mini-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.fav-img {
  width: 48px;
  height: 48px;
  background: var(--bg-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-data {
  flex: 1;
}

.fav-name { font-weight: 700; font-size: 0.9rem; }
.fav-price { font-weight: 800; color: var(--color-blue-primary); font-size: 0.85rem; }

.fav-del-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

/* Activity History */
.activity-history-list {
  display: flex;
  flex-direction: column;
}

.activity-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-history-item:last-child { border-bottom: none; }

.activity-item-main {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
}

.btn-activity-del {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: var(--text-secondary);
  cursor: pointer;
}

/* Switches */
.switch-md {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}
.switch-md input { opacity: 0; width: 0; height: 0; }
.slider-md {
  position: absolute; cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--border-color);
  transition: .3s;
  border-radius: 24px;
}
.slider-md:before {
  position: absolute; content: "";
  height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}
input:checked + .slider-md { background-color: var(--color-blue-primary); }
input:checked + .slider-md:before { transform: translateX(24px); }

/* Buttons & Utils */
.btn-outline-sm {
  background: transparent;
  border: 1.5px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-outline-full {
  width: 100%;
  background: transparent;
  border: 1.5px solid var(--color-blue-primary);
  color: var(--color-blue-primary);
  padding: 12px;
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
}

.btn-text {
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  border: none;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-text:hover {
  background: var(--color-blue-primary);
  color: white;
}

.btn-text-sm {
  background: var(--bg-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-text-sm:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.btn-text-action {
  background: var(--bg-secondary);
  color: var(--color-blue-primary);
  border: 1px solid var(--border-color);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.72rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-text-action:hover {
  border-color: var(--color-blue-primary);
  background: var(--color-blue-light);
}

.btn-text-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-text-danger:hover {
  background: #ef4444;
  color: white;
}

.text-xs-dim { font-size: 0.75rem; color: var(--text-secondary); }
.empty-state { grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-secondary); }
.empty-state-inline { padding: 20px; text-align: center; color: var(--text-secondary); font-size: 0.85rem; }

.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }

@media (max-width: 1024px) {
  .profile-content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-header-card {
    flex-direction: column;
    text-align: center;
    padding: 24px;
    gap: 16px;
  }
  .header-actions-hero { margin: 0 auto; }
  .form-grid, .address-grid, .profile-footer-area {
    grid-template-columns: 1fr;
  }
  .section-card { padding: 20px; }
  .user-avatar-hero { width: 80px; height: 80px; font-size: 2rem; }
}
</style>
