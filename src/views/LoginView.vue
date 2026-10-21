<template>
  <div class="login-page">
    <div class="orbits" aria-hidden="true">
      <span class="orb orb-lg"></span>
      <span class="orb orb-md"></span>
      <span class="orb orb-sm"></span>
      <span class="orb orb-xs"></span>
    </div>

    <div class="glass-circle">
      <div class="glass-rim" aria-hidden="true"></div>
      <div class="glass-glint" aria-hidden="true"></div>

      <div class="glass-inner">
        <header class="login-header">
          <h1>LOGIN</h1>
          <span class="title-line" aria-hidden="true"></span>
        </header>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <label for="email">USERNAME</label>
            <div class="field-row">
              <input
                type="email"
                id="email"
                v-model="email"
                autocomplete="username"
                placeholder="***"
                required
              />
            </div>
          </div>

          <div class="field">
            <label for="password">PASSWORD</label>
            <div class="field-row">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                autocomplete="current-password"
                placeholder="***"
                required
              />
              <button
                type="button"
                class="toggle-pw"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <component :is="showPassword ? EyeIcon : EyeOffIcon" />
              </button>
            </div>
          </div>

          <button type="submit" class="sign-in-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>SIGN IN</span>
          </button>
        </form>

        <p class="forgot">
          Forgot your password?
          <router-link to="/forgot-password">Press here</router-link>
        </p>
      </div>
    </div>

    <div class="login-extras">
      <button type="button" class="google-link" @click="loginWithGoogle" :disabled="isLoading">
        <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
      <p class="signup-link">
        No account?
        <router-link to="/signup">Register</router-link>
      </p>
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
import { getAuthErrorMessage } from '@/services/api';
import { auth, googleProvider } from '@/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import ReferralModal from '@/components/ReferralModal.vue';
import {
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
    if (err.response?.status === 403 && err.response?.data?.is_verified === false) {
      router.push({
        path: '/verify-email',
        query: { email: email.value }
      });
    } else {
      error.value = getAuthErrorMessage(err);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1.25rem;
  overflow: hidden;
  background: #353535;
  font-family: var(--font-main), 'Segoe UI', system-ui, sans-serif;
}

/* Soft brand orbs — quieter, less busy */
.orbits {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 26%,
    #ffd27a 0%,
    var(--color-primary-light) 32%,
    var(--color-primary) 62%,
    #e86900 100%
  );
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.28),
    inset -8px -10px 20px rgba(0, 0, 0, 0.14),
    inset 6px 8px 16px rgba(255, 255, 255, 0.28);
  opacity: 0.92;
}

.orb-lg {
  width: clamp(140px, 22vw, 220px);
  height: clamp(140px, 22vw, 220px);
  top: 10%;
  left: 12%;
}

.orb-md {
  width: clamp(72px, 11vw, 110px);
  height: clamp(72px, 11vw, 110px);
  bottom: 14%;
  left: 18%;
}

.orb-sm {
  width: clamp(40px, 6.5vw, 62px);
  height: clamp(40px, 6.5vw, 62px);
  top: 24%;
  right: 20%;
}

.orb-xs {
  width: clamp(28px, 4.5vw, 44px);
  height: clamp(28px, 4.5vw, 44px);
  bottom: 22%;
  right: 16%;
}

/* Circular glass */
.glass-circle {
  position: relative;
  z-index: 1;
  width: min(88vw, 400px);
  height: min(88vw, 400px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: cardIn 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-rim {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(
    150deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(210, 210, 215, 0.5) 22%,
    rgba(110, 110, 115, 0.4) 48%,
    rgba(230, 230, 235, 0.55) 72%,
    rgba(80, 80, 85, 0.5) 100%
  );
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  padding: 5px;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.glass-glint {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 38%;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.2) 60%,
    transparent 100%
  );
  filter: blur(0.8px);
  z-index: 3;
  pointer-events: none;
}

.glass-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: clamp(2.25rem, 7vw, 3.5rem) clamp(2.5rem, 8vw, 3.75rem);
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(28px) saturate(1.4);
  -webkit-backdrop-filter: blur(28px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.login-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.login-header h1 {
  margin: 0;
  font-family: var(--font-main);
  font-size: clamp(1.2rem, 3.5vw, 1.5rem);
  font-weight: 700;
  letter-spacing: 0.28em;
  color: #fff;
  line-height: 1;
  background: none;
  -webkit-text-fill-color: #fff;
}

.title-line {
  display: block;
  width: 56px;
  height: 1.5px;
  margin: 0.7rem auto 0;
  background: rgba(255, 255, 255, 0.9);
}

.login-form {
  width: 100%;
  max-width: 210px;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.field {
  width: 100%;
}

.field label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(20, 20, 20, 0.78);
  margin-bottom: 0.35rem;
}

.field-row {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.88);
  padding-bottom: 0.35rem;
}

.field-row input {
  flex: 1;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  padding: 0.1rem 1.5rem 0 0;
  font-family: inherit;
}

.field-row input::placeholder {
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.4em;
  font-weight: 600;
}

.toggle-pw {
  position: absolute;
  right: 0;
  bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
  opacity: 0.85;
}

.toggle-pw :deep(svg) {
  width: 14px;
  height: 14px;
}

.toggle-pw:hover {
  color: #fff;
  opacity: 1;
}

.sign-in-btn {
  margin-top: 0.85rem;
  align-self: center;
  min-width: 108px;
  height: 34px;
  padding: 0 1.1rem;
  border: none;
  border-radius: 5px;
  background: #2a2a2a;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
  transition: background 0.2s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sign-in-btn:hover:not(:disabled) {
  background: var(--color-primary);
  transform: translateY(-1px);
}

.sign-in-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.forgot {
  margin: 1.15rem 0 0;
  text-align: center;
  font-size: 0.68rem;
  color: rgba(20, 20, 20, 0.8);
  font-weight: 500;
  line-height: 1.4;
}

.forgot a {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
  margin-left: 0.2rem;
}

.forgot a:hover {
  text-decoration: underline;
}

/* Secondary actions outside the circle — keeps glass clean */
.login-extras {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.google-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s ease;
}

.google-link:hover:not(:disabled) {
  color: #fff;
}

.google-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.google-icon {
  width: 15px;
  height: 15px;
}

.signup-link {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
}

.signup-link a {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
  margin-left: 0.2rem;
}

.signup-link a:hover {
  text-decoration: underline;
}

.loader {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
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
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 420px) {
  .glass-circle {
    width: min(92vw, 340px);
    height: min(92vw, 340px);
  }

  .login-form {
    max-width: 180px;
    gap: 1.1rem;
  }

  .login-header {
    margin-bottom: 1.35rem;
  }
}
</style>
