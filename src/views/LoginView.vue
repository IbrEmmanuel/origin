<template>
  <div class="login-page">
    <div class="login-bg" aria-hidden="true"></div>

    <div class="login-card">
      <header class="login-header">
        <h1>Login</h1>
        <p>Welcome back please login to your account</p>
      </header>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label for="email">User Name</label>
          <div class="field-control">
            <input
              type="email"
              id="email"
              v-model="email"
              autocomplete="username"
              required
            />
            <UserIcon class="field-icon" aria-hidden="true" />
          </div>
        </div>

        <div class="field">
          <label for="password">Password</label>
          <div class="field-control">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="field-icon-btn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <component :is="showPassword ? EyeIcon : EyeOffIcon" class="field-icon" />
            </button>
          </div>
        </div>

        <label class="remember">
          <input type="checkbox" v-model="rememberMe" />
          <span class="remember-box" aria-hidden="true">
            <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5.2L4.2 8.5L11 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span>Remember me</span>
        </label>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>Login</span>
        </button>
      </form>

      <button type="button" class="google-btn" @click="loginWithGoogle" :disabled="isLoading">
        <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <p class="login-footer">
        Don't have an account?
        <router-link to="/signup">Signup</router-link>
      </p>

      <p class="login-brand">Origin Electric</p>
    </div>

    <ReferralModal
      :isOpen="isReferralModalOpen"
      @close="completeGoogleLogin(null)"
      @submit="completeGoogleLogin"
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
  User as UserIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);
const isLoading = ref(false);
const error = ref('');

const isReferralModalOpen = ref(false);
const googleIdToken = ref(null);

onMounted(() => {
  const saved = localStorage.getItem('remembered_email');
  if (saved) {
    email.value = saved;
    rememberMe.value = true;
  }
});

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const data = await authService.login(email.value, password.value);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ ...data.user, is_verified: true }));

    if (rememberMe.value) {
      localStorage.setItem('remembered_email', email.value);
    } else {
      localStorage.removeItem('remembered_email');
    }

    const redirectPath = route.query.redirect || '/account/dashboard';
    router.push(redirectPath);
  } catch (err) {
    if (err.response?.status === 403 && err.response.data.is_verified === false) {
      router.push({
        path: '/verify-email',
        query: { email: email.value }
      });
    } else {
      error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(error.value);
    }
  } finally {
    isLoading.value = false;
  }
};

const loginWithGoogle = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    googleIdToken.value = idToken;

    const urlRef = route.query.ref;
    if (urlRef) {
      await completeGoogleLogin(urlRef);
    } else {
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

const completeGoogleLogin = async (referralCode) => {
  isReferralModalOpen.value = false;
  isLoading.value = true;

  try {
    const data = await authService.googleLogin(googleIdToken.value, referralCode);
    finishAuth(data);
  } catch (err) {
    error.value = err.response?.data?.message || 'Google login failed.';
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
.login-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.login-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(20, 40, 20, 0.25) 0%, rgba(10, 20, 10, 0.45) 100%),
    url('@/assets/login_hills_bg.jpg') center / cover no-repeat;
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  padding: 2.75rem 2.25rem 1.75rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(22px) saturate(1.35);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  color: #fff;
  animation: cardIn 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  margin: 0 0 0.55rem;
  font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
  line-height: 1.1;
  background: none;
  -webkit-text-fill-color: #fff;
}

.login-header p {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.45;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.field {
  position: relative;
}

.field label {
  position: absolute;
  top: -0.5rem;
  left: 0.95rem;
  z-index: 2;
  padding: 0 0.4rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  line-height: 1.2;
  pointer-events: none;
  border-radius: 3px;
}

.field-control {
  position: relative;
  display: flex;
  align-items: center;
}

.field-control input {
  width: 100%;
  height: 52px;
  padding: 0 2.75rem 0 1.1rem;
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  background: transparent;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-control input:focus {
  border-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.12);
}

.field-control input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.field-icon,
.field-icon-btn .field-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.85);
  stroke-width: 1.75;
}

.field-icon {
  position: absolute;
  right: 1.05rem;
  pointer-events: none;
}

.field-icon-btn {
  position: absolute;
  right: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border: none;
  background: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85);
}

.field-icon-btn .field-icon {
  position: static;
  pointer-events: none;
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.15rem;
  font-size: 0.88rem;
  color: #fff;
  cursor: pointer;
  user-select: none;
  width: fit-content;
}

.remember input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.remember-box {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: #5cb85c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: background 0.15s ease, opacity 0.15s ease;
}

.remember-box svg {
  width: 10px;
  height: 10px;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.remember input:checked + .remember-box {
  background: #4caf50;
}

.remember input:checked + .remember-box svg {
  opacity: 1;
  transform: scale(1);
}

.remember input:not(:checked) + .remember-box {
  background: rgba(255, 255, 255, 0.2);
  border: 1.5px solid rgba(255, 255, 255, 0.55);
}

.login-btn {
  margin-top: 0.35rem;
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(90deg, #c5d93a 0%, #4caf50 55%, #2e7d32 100%);
  box-shadow: 0 6px 18px rgba(46, 125, 50, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 8px 22px rgba(46, 125, 50, 0.42);
}

.login-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  transform: none;
}

.google-btn {
  margin-top: 1rem;
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.65);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 18px;
  height: 18px;
}

.login-footer {
  margin: 1.35rem 0 0;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.92);
}

.login-footer a {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  margin-left: 0.2rem;
}

.login-footer a:hover {
  text-decoration: underline;
}

.login-brand {
  margin: 1.1rem 0 0;
  text-align: center;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.04em;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 2.25rem 1.5rem 1.5rem;
    border-radius: 22px;
  }

  .login-header h1 {
    font-size: 2rem;
  }
}
</style>
