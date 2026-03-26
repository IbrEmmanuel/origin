<template>
  <div class="content-section">
    <!-- Tab Navigation -->
    <div class="profile-tabs glass-card">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="icon-xs-tab" />
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content mt-6">
      <!-- General Tab -->
      <div v-if="activeTab === 'general'" class="tab-pane">
        <div class="profile-card glass-card">
          <div class="profile-header">
            <div class="user-avatar-lg">{{ (user.first_name?.[0] || '') + (user.last_name?.[0] || '') || 'U' }}</div>
            <div class="profile-meta">
              <h3>{{ user.first_name || 'User' }} {{ user.last_name || '' }}</h3>
              <p>{{ user.email }}</p>
            </div>
          </div>
          <div class="profile-form mt-6">
            <div class="form-grid">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" v-model="user.first_name" placeholder="First Name" />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" v-model="user.last_name" placeholder="Last Name" />
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" v-model="user.phone" placeholder="Phone Number" />
              </div>
            </div>
            <button class="btn btn-primary mt-4" @click="saveProfile">Save Changes</button>
          </div>
        </div>

        <div class="profile-card glass-card mt-6">
          <div class="card-header">
            <h3>Saved Addresses</h3>
            <button class="btn-text">+ Add New</button>
          </div>
          <div class="address-list">
            <div v-for="address in addresses" :key="address.id" class="address-item">
              <div class="address-type">
                <span class="type-tag">{{ address.type }}</span>
                <span v-if="address.isDefault" class="default-tag">Default</span>
              </div>
              <p class="address-text">{{ address.fullAddress }}</p>
              <div class="address-actions">
                <button class="btn-link">Edit</button>
                <button class="btn-link delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Referrals Tab -->
      <div v-if="activeTab === 'referrals'" class="tab-pane">
        <div class="profile-card glass-card">
          <div class="card-header">
            <h3>Referrals & Rewards</h3>
          </div>
          <div class="referral-content">
            <div class="referral-stats">
              <div class="ref-stat">
                <span class="ref-value">{{ referralData.count }}</span>
                <span class="ref-label">Friends Joined</span>
              </div>
              <div class="ref-stat">
                <span class="ref-value">{{ referralData.earnings }}</span>
                <span class="ref-label">Earned (Units)</span>
              </div>
            </div>
            <div class="referral-code-box">
              <p class="label-xs">Your Unique Referral Code</p>
              <div class="code-wrapper">
                <code>{{ referralData.code }}</code>
                <button class="btn-copy">
                  <CopyIcon class="icon-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Favorites Tab -->
      <div v-if="activeTab === 'favorites'" class="tab-pane">
        <div class="profile-card glass-card">
          <div class="card-header">
            <h3>Favourite Items</h3>
            <router-link to="/marketplace" class="text-link">Shop More</router-link>
          </div>
          <div class="favorites-grid">
            <div v-for="item in favorites" :key="item.id" class="favorite-item">
              <div class="item-image-box">
                <PackageIcon class="icon-md" />
              </div>
              <div class="favorite-info">
                <p class="favorite-name">{{ item.name }}</p>
                <p class="favorite-price">{{ item.price }}</p>
              </div>
              <div class="favorite-actions">
                <button class="btn btn-primary btn-xs">Add to Cart</button>
                <button class="btn-icon-delete" title="Remove">
                  <TrashIcon class="icon-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-if="activeTab === 'activity'" class="tab-pane">
        <div class="profile-card glass-card">
          <div class="card-header">
            <h3>Search History</h3>
            <button class="btn-text-sm" @click="clearSearchHistory">Clear All</button>
          </div>
          <div class="history-list">
            <div v-for="search in searchHistory" :key="search.id" class="history-item">
              <div class="history-info">
                <ClockIcon class="icon-xs-dim" />
                <span>{{ search.query }}</span>
              </div>
              <button class="btn-remove">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="tab-pane max-w-2xl">
        <div class="profile-card glass-card">
          <div class="card-header">
            <h3>Account Settings</h3>
          </div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Email Notifications</p>
                <p class="setting-desc">Orders and promotional updates</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.email" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">SMS Notifications</p>
                <p class="setting-desc">Delivery status alerts</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.sms" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Marketing communications</p>
                <p class="setting-desc">Personalized offers and news</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.marketing" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item pt-6 border-t mt-4">
              <div class="security-actions">
                <button class="btn btn-outline btn-full mb-3" @click="saveProfile">Save Preferences</button>
                <button class="btn btn-outline-danger btn-full">Deactivate Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  User as UserIcon,
  Users as ReferralsIcon,
  Heart as HeartIcon,
  Clock as ClockIcon,
  Settings as SettingsIcon,
  Package as PackageIcon, 
  Trash2 as TrashIcon,
  Copy as CopyIcon
} from 'lucide-vue-next';

const activeTab = ref('general');
const isLoading = ref(true);

const tabs = [
  { id: 'general', label: 'General', icon: UserIcon },
  { id: 'referrals', label: 'Referrals', icon: ReferralsIcon },
  { id: 'favorites', label: 'Favorites', icon: HeartIcon },
  { id: 'activity', label: 'Activity', icon: ClockIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const user = ref({ first_name: '', last_name: '', email: '', phone: '' });
const addresses = ref([]);
const favorites = ref([]);
const referralData = ref({ code: '', count: 0, earnings: 0 });
const searchHistory = ref([]);
const settings = ref({ email: true, sms: false, marketing: true });

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
      searchHistory.value = data.searchHistory;
      settings.value = data.settings;
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProfile);

const saveProfile = async () => {
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
      alert('Failed to update profile');
    }
  } catch (err) {
    console.error('Failed to save profile', err);
  }
};

const clearSearchHistory = async () => {
    try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/user/search-history`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        searchHistory.value = [];
    } catch (e) {
        console.error(e);
    }
};
</script>

<style scoped>
.profile-tabs {
  display: flex;
  gap: 8px;
  padding: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.profile-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  flex: 1;
  min-width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--color-blue-primary);
  color: white;
}

.profile-card {
  padding: var(--space-lg);
}

.user-avatar-lg {
  width: 64px;
  height: 64px;
  background: var(--color-blue-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
}

.btn-text {
  background: transparent;
  border: none;
  color: var(--color-blue-primary);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-text-sm {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
}

.text-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  text-decoration: none;
}

/* Address List */
.address-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.address-item {
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-tag {
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-right: 8px;
}

.default-tag {
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 600;
}

.address-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.address-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.btn-link {
  background: transparent;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-blue-primary);
  cursor: pointer;
  padding: 0;
}

.btn-link.delete { color: #ef4444; }

/* Favorites Grid */
.favorites-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.item-image-box {
  width: 56px;
  height: 56px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-info {
  flex: 1;
}

.favorite-name {
  font-weight: 700;
  font-size: 1rem;
}

.favorite-price {
  font-weight: 800;
  color: var(--color-blue-primary);
  font-size: 0.95rem;
}

.favorite-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-icon-delete {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.btn-icon-delete:hover { color: #ef4444; }

/* Referral Section */
.referral-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.ref-stat {
  padding: 24px;
  background: var(--color-blue-light);
  border-radius: var(--radius-lg);
  text-align: center;
}

.ref-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-blue-primary);
}

.ref-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-blue-primary);
  opacity: 0.8;
}

.referral-code-box {
  padding: 24px;
  background: var(--bg-secondary);
  border: 2px dashed var(--color-blue-primary);
  border-radius: var(--radius-lg);
  text-align: center;
}

.label-xs {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.code-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.code-wrapper code {
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-copy {
  background: transparent;
  border: none;
  color: var(--color-blue-primary);
  cursor: pointer;
  display: flex;
  padding: 4px;
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
}

.history-item:last-child { border-bottom: none; }

.history-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

/* Settings */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-label {
  font-weight: 700;
  font-size: 1rem;
}

.setting-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.btn-full { width: 100%; }
.mb-3 { margin-bottom: 0.75rem; }

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input { opacity: 0; width: 0; height: 0; }

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--border-color);
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider { background-color: var(--color-blue-primary); }
input:checked + .slider:before { transform: translateX(20px); }

/* Utilities */
.icon-xs-tab { width: 16px; height: 16px; }
.icon-xs { width: 14px; height: 14px; }
.icon-xs-dim { width: 14px; height: 14px; opacity: 0.5; }
.icon-md { width: 24px; height: 24px; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.pt-6 { padding-top: 1.5rem; }
.border-t { border-top: 1px solid var(--border-color); }
.max-w-2xl { max-width: 600px; }
.btn-xs { padding: 6px 12px; font-size: 0.75rem; }

@media (max-width: 768px) {
  .form-grid, .address-list, .referral-stats {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .profile-tabs {
    padding: 4px;
    border-radius: 12px;
  }
  .tab-btn {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
  .profile-card {
    padding: var(--space-md);
    border-radius: 16px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .user-avatar-lg {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }

  .favorite-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .favorite-info {
    width: 100%;
  }

  .favorite-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .favorite-actions .btn {
    flex: 1;
    margin-right: 12px;
    text-align: center;
    padding: 10px 0;
    font-size: 0.9rem;
  }

  .code-wrapper {
    background: var(--bg-primary);
    padding: 12px;
    border-radius: 8px;
    margin-top: 8px;
  }
  
  .referral-code-box {
    padding: 16px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .switch {
    align-self: flex-start;
  }

  .security-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .security-actions .mb-3 {
    margin-bottom: 0;
  }
}
</style>
