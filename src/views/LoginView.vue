<template>
  <div class="auth-tech">
    <div class="grid-lines" aria-hidden="true"></div>
    <div class="glow glow-a" aria-hidden="true"></div>
    <div class="glow glow-b" aria-hidden="true"></div>

    <header class="topbar">
      <router-link to="/" class="brand">
        <img src="../assets/logo.png" alt="" class="brand-logo" />
        <div class="brand-copy">
          <strong>ORIGIN</strong>
          <span>Access Console</span>
        </div>
      </router-link>
      <div class="top-actions">
        <button
          type="button"
          class="icon-btn"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <component :is="isDark ? SunIcon : MoonIcon" />
        </button>
      </div>
    </header>

    <main class="stage">
      <aside class="rail" aria-hidden="true">
        <p class="rail-kicker">ORIGIN ELECTRIC</p>
        <h2>Power systems.<br />One signed-in workspace.</h2>
        <ul class="rail-points">
          <li>Orders &amp; installs</li>
          <li>Vendor catalog &amp; bulk upload</li>
          <li>Consultations &amp; wallet</li>
        </ul>
      </aside>

      <section class="panel">
        <header class="panel-head">
          <p class="eyebrow">Account access</p>
          <h1>Sign in</h1>
          <p class="sub">Manage orders, products, and your energy workspace.</p>
        </header>

        <div v-if="hasSession" class="session-card">
          <div>
            <strong>You’re already signed in</strong>
            <p>{{ sessionLabel }}</p>
          </div>
          <div class="session-actions">
            <router-link to="/account/dashboard" class="btn primary">Dashboard</router-link>
            <button type="button" class="btn ghost" :disabled="isLoggingOut" @click="handleLogout">
              {{ isLoggingOut ? 'Signing out…' : 'Logout' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="error-banner" role="alert">{{ error }}</div>

        <form class="form" @submit.prevent="handleLogin">
          <label class="field">
            <span>Email</span>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="username"
              inputmode="email"
              placeholder="you@company.com"
              required
            />
          </label>

          <label class="field">
            <span>Password</span>
            <div class="password-row">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
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
          </label>

          <div class="form-meta">
            <label class="remember">
              <input v-model="rememberMe" type="checkbox" />
              <span>Remember me</span>
            </label>
            <router-link to="/forgot-password" class="link">Forgot password?</router-link>
          </div>

          <button type="submit" class="btn primary wide" :disabled="isLoading">
            <span v-if="isLoading" class="loader" aria-hidden="true"></span>
            <span>{{ isLoading ? 'Authenticating…' : 'Sign in' }}</span>
          </button>
        </form>

        <div class="divider"><span>or</span></div>

        <button type="button" class="btn google wide" :disabled="isLoading" @click="loginWithGoogle">
          <svg class="g-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </section>
    </main>

    <!-- Justified modern tech dock -->
    <nav class="dock" aria-label="Quick actions">
      <div class="dock-track">
        <router-link to="/" class="dock-item">
          <span class="glyph"><HomeIcon /></span>
          <span class="label">Home</span>
        </router-link>
        <router-link to="/signup" class="dock-item">
          <span class="glyph"><UserPlusIcon /></span>
          <span class="label">Register</span>
        </router-link>
        <router-link to="/forgot-password" class="dock-item">
          <span class="glyph"><KeyIcon /></span>
          <span class="label">Reset</span>
        </router-link>
        <button
          type="button"
          class="dock-item danger"
          :disabled="(!hasSession && !isLoggingOut)"
          @click="handleLogout"
        >
          <span class="glyph"><LogOutIcon /></span>
          <span class="label">{{ isLoggingOut ? '…' : 'Logout' }}</span>
        </button>
      </div>
    </nav>

    <ReferralModal
      :isOpen="isReferralModalOpen"
      @close="completeGoogleLogin(null)"
      @submit="completeGoogleLogin"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '@/services/auth.service';
import { getAuthErrorMessage } from '@/services/api';
import { auth, googleProvider } from '@/firebase/config';
import { signInWithPopup, signOut } from 'firebase/auth';
import ReferralModal from '@/components/ReferralModal.vue';
import { useTheme } from '@/composables/useTheme';
import {
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Home as HomeIcon,
  UserPlus as UserPlusIcon,
  KeyRound as KeyIcon,
  LogOut as LogOutIcon
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const { isDark, toggleTheme } = useTheme();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);
const isLoading = ref(false);
const isLoggingOut = ref(false);
const error = ref('');
const sessionTick = ref(0);
const isReferralModalOpen = ref(false);
const googleIdToken = ref(null);

const hasSession = computed(() => {
  sessionTick.value;
  return !!(localStorage.getItem('token') || localStorage.getItem('user'));
});

const sessionLabel = computed(() => {
  sessionTick.value;
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.email || user.name || 'Active Origin session';
  } catch {
    return 'Active Origin session';
  }
});

const refreshSession = () => {
  sessionTick.value += 1;
};

onMounted(() => {
  const saved = localStorage.getItem('remembered_email');
  if (saved) {
    email.value = saved;
    rememberMe.value = true;
  }
  refreshSession();
});

const handleLogout = async () => {
  isLoggingOut.value = true;
  error.value = '';
  try {
    try {
      await signOut(auth);
    } catch {
      /* optional */
    }
    authService.logout();
    localStorage.removeItem('remembered_email');
    email.value = '';
    password.value = '';
    refreshSession();
  } finally {
    isLoggingOut.value = false;
  }
};

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const data = await authService.login(email.value, password.value);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ ...data.user, is_verified: true }));
    if (rememberMe.value) localStorage.setItem('remembered_email', email.value);
    else localStorage.removeItem('remembered_email');
    router.push(route.query.redirect || '/account/dashboard');
  } catch (err) {
    if (err.response?.status === 403 && err.response?.data?.is_verified === false) {
      router.push({ path: '/verify-email', query: { email: email.value } });
    } else {
      error.value = getAuthErrorMessage(err);
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
        if (data.isNewUser) isReferralModalOpen.value = true;
        else finishAuth(data);
      } catch (err) {
        error.value = getAuthErrorMessage(err, 'Google login failed. Please try again.');
      }
    }
  } catch (err) {
    console.error(err);
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
  } finally {
    isLoading.value = false;
  }
};

const finishAuth = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ ...data.user, is_verified: true }));
  router.push(route.query.redirect || '/account/dashboard');
};
</script>

<style scoped>
.auth-tech {
  --ink: var(--text-primary);
  --muted: var(--text-muted);
  --line: var(--border-color);
  --surface: var(--bg-secondary);
  --base: var(--bg-primary);
  --accent: var(--color-primary);

  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  color: var(--ink);
  background: var(--base);
  -webkit-font-smoothing: antialiased;
  padding-bottom: calc(5.75rem + env(safe-area-inset-bottom, 0px));
  transition: background-color 0.3s ease, color 0.3s ease;
}

.grid-lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.35;
  pointer-events: none;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--line) 80%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--line) 80%, transparent) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 75% 60% at 50% 20%, #000 15%, transparent 75%);
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(70px);
}

.glow-a {
  top: -9rem;
  right: -3rem;
  width: min(28rem, 85vw);
  height: min(28rem, 85vw);
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}

.glow-b {
  bottom: 4rem;
  left: -5rem;
  width: min(18rem, 65vw);
  height: min(18rem, 65vw);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

.topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding:
    max(0.85rem, env(safe-area-inset-top))
    max(1rem, env(safe-area-inset-right))
    0.75rem
    max(1rem, env(safe-area-inset-left));
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.brand-logo { height: 34px; width: auto; }

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  min-width: 0;
}

.brand-copy strong {
  font-family: var(--font-display), Georgia, serif;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.brand-copy span {
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 700;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.icon-btn {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.icon-btn :deep(svg) { width: 18px; height: 18px; }
.icon-btn:hover {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 40%, var(--line));
}

.stage {
  position: relative;
  z-index: 1;
  width: min(100% - 2rem, 920px);
  margin: 0.75rem auto 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.rail { display: none; }

.panel {
  padding: clamp(1.25rem, 4vw, 1.85rem);
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: var(--shadow-md);
  animation: rise 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-head { margin-bottom: 1.15rem; }

.eyebrow {
  margin: 0 0 0.45rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.panel-head h1 {
  margin: 0;
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(1.7rem, 5vw, 2.2rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.sub {
  margin: 0.45rem 0 0;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.45;
}

.session-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1rem;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--color-success) 35%, var(--line));
  background: var(--status-ok-bg);
  color: var(--status-ok-fg);
}

.session-card strong { color: var(--ink); display: block; margin-bottom: 0.15rem; }
.session-card p { margin: 0; color: var(--text-secondary); font-size: 0.85rem; }

.session-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.error-banner {
  margin-bottom: 0.9rem;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  background: var(--status-err-bg);
  color: var(--status-err-fg);
  border: 1px solid color-mix(in srgb, var(--color-error) 30%, transparent);
  font-size: 0.86rem;
  line-height: 1.4;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.field input,
.password-row {
  width: 100%;
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--base);
  color: var(--ink);
  font: inherit;
  font-size: 1rem;
}

.field input {
  padding: 0.75rem 0.95rem;
  outline: none;
}

.field input:focus,
.password-row:focus-within {
  border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
}

.field input::placeholder { color: var(--muted); }

.password-row {
  display: flex;
  align-items: center;
  padding-right: 0.25rem;
}

.password-row input {
  border: none;
  background: transparent;
  box-shadow: none;
  min-height: 46px;
  flex: 1;
}

.toggle-pw {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-radius: 10px;
}

.toggle-pw :deep(svg) { width: 18px; height: 18px; }
.toggle-pw:hover { color: var(--ink); }

.form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}

.remember input { accent-color: var(--accent); width: 16px; height: 16px; }

.link {
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
}

.link:hover { text-decoration: underline; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  padding: 0 1rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.btn.wide { width: 100%; }
.btn.primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 12px 28px -12px color-mix(in srgb, var(--accent) 70%, transparent);
}
.btn.primary:hover:not(:disabled) { filter: brightness(1.05); }
.btn.ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--border-color-strong, var(--line));
}
.btn.google {
  background: var(--base);
  color: var(--ink);
  border: 1px solid var(--line);
}
.btn:disabled { opacity: 0.65; cursor: not-allowed; }

.g-icon { width: 18px; height: 18px; }

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.05rem 0;
  color: var(--muted);
  font-size: 0.78rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

.loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  padding:
    0 max(0.75rem, env(safe-area-inset-left))
    max(0.65rem, env(safe-area-inset-bottom))
    max(0.75rem, env(safe-area-inset-right));
  pointer-events: none;
}

.dock-track {
  pointer-events: auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  justify-content: space-between;
  align-items: stretch;
  gap: 0.2rem;
  width: min(100%, 440px);
  margin: 0 auto;
  padding: 0.4rem 0.3rem;
  border-radius: 22px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(22px) saturate(1.2);
  -webkit-backdrop-filter: blur(22px) saturate(1.2);
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-height: 56px;
  width: 100%;
  padding: 0.3rem 0.1rem;
  border: none;
  background: transparent;
  color: var(--muted);
  text-decoration: none;
  font-family: inherit;
  border-radius: 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.dock-item:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.glyph {
  width: 36px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}

.glyph :deep(svg) { width: 18px; height: 18px; }

.label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.dock-item.router-link-active,
.dock-item:hover:not(:disabled) {
  color: var(--accent);
}

.dock-item.router-link-active .glyph,
.dock-item:hover:not(:disabled) .glyph {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent);
}

.dock-item.danger:not(:disabled) { color: var(--color-error); }
.dock-item.danger:hover:not(:disabled) .glyph {
  background: color-mix(in srgb, var(--color-error) 14%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-error) 28%, transparent);
}

.dock-item:active:not(:disabled) { transform: scale(0.96); }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 900px) {
  .stage {
    grid-template-columns: 1fr 1.05fr;
    align-items: stretch;
    margin-top: 1.5rem;
  }

  .rail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    padding: 1.75rem;
    border-radius: 20px;
    border: 1px solid var(--line);
    background:
      radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 45%),
      var(--surface);
  }

  .rail-kicker {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .rail h2 {
    margin: 0;
    font-family: var(--font-display), Georgia, serif;
    font-size: clamp(1.6rem, 2.4vw, 2.1rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--ink);
  }

  .rail-points {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.55rem;
    color: var(--text-secondary);
    font-size: 0.92rem;
  }

  .rail-points li {
    padding-left: 0.9rem;
    position: relative;
  }

  .rail-points li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }
}

@media (max-width: 420px) {
  .form-meta { flex-direction: column; align-items: flex-start; }
  .session-actions { grid-template-columns: 1fr; }
}
</style>