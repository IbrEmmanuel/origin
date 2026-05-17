<template>
  <div class="auth-page page-padding">
    <div class="container auth-container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join Origin Electric for smart energy management</p>
        </div>

        <form @submit.prevent="handleSignup" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <div class="input-wrapper">
              <UserIcon class="input-icon" />
              <input 
                type="text" 
                id="name" 
                v-model="name" 
                placeholder="John Doe" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <MailIcon class="input-icon" />
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="name@example.com" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <LockIcon class="input-icon" />
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="password-toggle"
              >
                <component :is="showPassword ? EyeOffIcon : EyeIcon" class="icon-sm" />
              </button>
            </div>
            <p class="input-hint">Must be at least 8 characters long</p>
          </div>

          <div class="terms-check">
            <input type="checkbox" id="terms" v-model="acceptTerms" required />
            <label for="terms">I agree to the <router-link to="/use-policy" target="_blank">Acceptable Use Policy</router-link> and <router-link to="/refund-policy" target="_blank">Refund Policy</router-link></label>
          </div>

          <div class="form-group">
            <label for="referral_code">Referral Code (Optional)</label>
            <div class="input-wrapper">
              <ReferralsIcon class="input-icon" />
              <input 
                type="text" 
                id="referral_code" 
                v-model="referralCode" 
                placeholder="ENTER CODE" 
                :readonly="isReferralReadonly"
                :class="{ 'readonly-input': isReferralReadonly }"
              />
            </div>
            <p v-if="isReferralReadonly" class="input-hint success-text">Referral applied!</p>
          </div>


          <button type="submit" class="auth-btn primary-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <button @click="signupWithGoogle" class="auth-btn google-btn">
          <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <p class="auth-footer">
          Already have an account? 
          <router-link to="/login">Login</router-link>
        </p>
      </div>
    </div>

    <!-- Referral Modal for New Google Users -->
    <ReferralModal 
      :isOpen="isReferralModalOpen" 
      @close="completeGoogleSignup(null)" 
      @submit="completeGoogleSignup"
    />

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '@/services/auth.service';
import { auth, googleProvider } from '@/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import ReferralModal from '@/components/ReferralModal.vue';
import { 
  Mail as MailIcon, 
  Lock as LockIcon, 
  User as UserIcon,
  Users as ReferralsIcon,
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon 
} from 'lucide-vue-next';


const router = useRouter();
const route = useRoute();

const name = ref('');
const email = ref('');
const password = ref('');
const referralCode = ref('');
const isReferralReadonly = ref(false);
const acceptTerms = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const error = ref('');

// Google Auth State
const isReferralModalOpen = ref(false);
const googleIdToken = ref(null);


onMounted(() => {
  if (route.query.ref) {
    referralCode.value = route.query.ref;
    isReferralReadonly.value = true;
  }
});


const handleSignup = async () => {
  if (!acceptTerms.value) {
    alert('Please accept the terms and conditions');
    return;
  }
  
  isLoading.value = true;
  error.value = '';
  
  try {
    const data = await authService.register(email.value, password.value, referralCode.value, name.value);


    
    // Store token and unverified user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to verify email with email as query param
    // Redirect to verify email with email as query param, passing along any redirect
    const verifyPath = {
      path: '/verify-email',
      query: { 
        email: email.value,
        ...(route.query.redirect ? { redirect: route.query.redirect } : {})
      }
    };
    router.push(verifyPath);
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed.';
    alert(error.value);
  } finally {
    isLoading.value = false;
  }
};

const signupWithGoogle = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    googleIdToken.value = idToken;

    // Check if we already have a referral in the URL or input field
    const refCodeToUse = route.query.ref || referralCode.value;
    if (refCodeToUse) {
      await completeGoogleSignup(refCodeToUse);
    } else {
      // Check if user is new
      try {
        const data = await authService.googleLogin(idToken);
        if (data.isNewUser) {
          isReferralModalOpen.value = true;
        } else {
          finishAuth(data);
        }
      } catch (err) {
        console.error('Initial Google Login failed', err);
        error.value = 'Google login failed. Please try again.';
      }
    }
  } catch (err) {
    console.error('Firebase Google Auth Error:', err);
    error.value = 'Failed to connect to Google.';
  } finally {
    isLoading.value = false;
  }
};

const completeGoogleSignup = async (referralCode) => {
  isReferralModalOpen.value = false;
  isLoading.value = true;

  try {
    const data = await authService.googleLogin(googleIdToken.value, referralCode);
    finishAuth(data);
  } catch (err) {
    error.value = err.response?.data?.message || 'Google signup failed.';
    alert(error.value);
  } finally {
    isLoading.value = false;
  }
};


const finishAuth = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ ...data.user, is_verified: true }));
  const redirectPath = route.query.redirect || '/account/dashboard';
  router.push(redirectPath);
};

</script>

<style scoped>
/* Reuse styles from LoginView.vue - ideally these would be in a shared CSS or component */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  padding: var(--space-xl) var(--space-md);
}

.auth-container {
  width: 100%;
  max-width: 540px;
  position: relative;
  z-index: 1;
}

.auth-card {
  padding: 3rem;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  animation: slideUp 0.6s var(--transition-bounce);
}

.auth-header {
  text-align: center;
}

.auth-logo {
  height: 60px;
  margin-bottom: 1.5rem;
}

.auth-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text-primary), var(--color-blue-primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.auth-header p {
  color: var(--text-secondary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
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
  width: 18px;
  height: 18px;
  pointer-events: none;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-speed);
}

input:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

.input-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.success-text {
  color: #10b981 !important;
  font-weight: 600;
}

.readonly-input {
  background: var(--bg-primary) !important;
  border-style: dashed !important;
  cursor: not-allowed;
}


.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.terms-check {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.terms-check input {
  margin-top: 0.2rem;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.terms-check a {
  color: var(--color-blue-primary);
  font-weight: 600;
  text-decoration: none;
}

.auth-btn {
  width: 100%;
  padding: 1rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-speed);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.primary-btn {
  background: var(--color-blue-primary);
  color: white;
  border: none;
  box-shadow: 0 10px 20px -5px rgba(0, 102, 204, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(0, 102, 204, 0.4);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.google-btn {
  background: white;
  color: #1f2937;
  border: 1.5px solid #e5e7eb;
}

.google-btn:hover {
  background: #f9fafb;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.auth-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.auth-divider span {
  padding: 0 1rem;
}

.auth-footer {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.auth-footer a {
  color: var(--color-blue-primary);
  font-weight: 700;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .auth-page {
    padding: var(--space-md) var(--space-sm);
  }

  .auth-container {
    padding: 0 var(--space-sm);
  }

  .auth-card {
    padding: 2rem;
  }
}
</style>
