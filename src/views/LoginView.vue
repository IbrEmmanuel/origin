<template>
  <div class="login-page">
    <!-- Floating orange spheres (brand accent) -->
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

        <button type="button" class="google-btn" @click="loginWithGoogle" :disabled="isLoading">
          <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p class="signup-link">
          No account?
          <router-link to="/signup">Register</router-link>
        </p>
      </div>
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
  background: #3a3a3a;
  font-family: var(--font-main), 'Segoe UI', system-ui, sans-serif;
}

/* ── Origin orange gradient orbs ── */
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
    circle at 32% 28%,
    #ffe08a 0%,
    var(--color-primary-light) 28%,
    var(--color-primary) 55%,
    #e86900 78%,
    #c45a00 100%
  );
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.35),
    inset -10px -14px 28px rgba(0, 0, 0, 0.18),
    inset 8px 10px 20px rgba(255, 255, 255, 0.35);
}

.orb-lg {
  width: clamp(160px, 28vw, 280px);
  height: clamp(160px, 28vw, 280px);
  top: 8%;
  left: 10%;
  filter: blur(0.5px);
  animation: floatY 7s ease-in-out infinite;
}

.orb-md {
  width: clamp(90px, 14vw, 150px);
  height: clamp(90px, 14vw, 150px);
  bottom: 12%;
  left: 16%;
  animation: floatY 5.5s ease-in-out infinite reverse;
}

.orb-sm {
  width: clamp(48px, 8vw, 78px);
  height: clamp(48px, 8vw, 78px);
  top: 22%;
  right: 18%;
  animation: floatY 6s ease-in-out infinite 0.6s;
}

.orb-xs {
  width: clamp(36px, 6vw, 56px);
  height: clamp(36px, 6vw, 56px);
  bottom: 20%;
  right: 14%;
  animation: floatY 4.8s ease-in-out infinite 0.3s;
}

/* ── Circular frosted glass ── */
.glass-circle {
  position: relative;
  z-index: 1;
  width: min(92vw, 420px);
  height: min(92vw, 420px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-rim {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.75) 0%,
      rgba(200, 200, 205, 0.55) 18%,
      rgba(120, 120, 125, 0.45) 42%,
      rgba(220, 220, 225, 0.5) 68%,
      rgba(90, 90, 95, 0.55) 100%
    );
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.7);
  padding: 7px;
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
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 42%;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.25) 55%,
    transparent 100%
  );
  filter: blur(1px);
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
  padding: clamp(1.75rem, 6vw, 3rem) clamp(2rem, 7vw, 3.25rem);
  background: rgba(255, 253, 250, 0.18);
  backdrop-filter: blur(22px) saturate(1.35);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: inset 0 0 40px rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.login-header {
  text-align: center;
  margin-bottom: 1.35rem;
}

.login-header h1 {
  margin: 0;
  font-family: var(--font-main);
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  font-weight: 800;
  letter-spacing: 0.18em;
  color: #fff;
  line-height: 1.1;
  background: none;
  -webkit-text-fill-color: #fff;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
}

.title-line {
  display: block;
  width: 72px;
  height: 2px;
  margin: 0.55rem auto 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
}

.login-form {
  width: 100%;
  max-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.field {
  width: 100%;
}

.field label {
  display: block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #1a1a1a;
  margin-bottom: 0.15rem;
}

.field-row {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.85);
  padding-bottom: 0.2rem;
}

.field-row input {
  flex: 1;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  padding: 0.2rem 1.75rem 0.15rem 0;
  font-family: inherit;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.field-row input::placeholder {
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.35em;
}

.field-row input:focus {
  color: #fff;
}

.toggle-pw {
  position: absolute;
  right: 0;
  bottom: 0.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  padding: 0.15rem;
}

.toggle-pw :deep(svg) {
  width: 15px;
  height: 15px;
}

.toggle-pw:hover {
  color: var(--color-primary);
}

.sign-in-btn {
  margin-top: 0.65rem;
  align-self: center;
  min-width: 118px;
  height: 36px;
  padding: 0 1.25rem;
  border: none;
  border-radius: 6px;
  background: #2f2f2f;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sign-in-btn:hover:not(:disabled) {
  background: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(255, 118, 0, 0.35);
}

.sign-in-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.forgot {
  margin: 0.9rem 0 0;
  text-align: center;
  font-size: 0.72rem;
  color: #1a1a1a;
  font-weight: 500;
}

.forgot a {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
  margin-left: 0.15rem;
}

.forgot a:hover {
  text-decoration: underline;
  color: var(--color-orange-dark);
}

.google-btn {
  margin-top: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 30px;
  padding: 0 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.28);
}

.google-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.google-icon {
  width: 14px;
  height: 14px;
}

.signup-link {
  margin: 0.55rem 0 0;
  font-size: 0.7rem;
  color: rgba(26, 26, 26, 0.85);
  text-align: center;
}

.signup-link a {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

.loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 420px) {
  .glass-circle {
    width: min(96vw, 360px);
    height: min(96vw, 360px);
  }

  .login-form {
    max-width: 200px;
    gap: 0.95rem;
  }

  .orb-lg {
    left: -6%;
    top: 4%;
  }

  .orb-md {
    left: -2%;
  }
}
</style>
