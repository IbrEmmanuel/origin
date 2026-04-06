<template>
  <div class="auth-page page-padding">
    <div class="container auth-container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <h1>Reset Password</h1>
          <p v-if="!isCodeSent">Enter your email to receive a 6-digit recovery code</p>
          <p v-else>Enter the code sent to your inbox and your new password</p>
        </div>

        <!-- Google User State -->
        <div v-if="isGoogleUser" class="google-user-notice">
          <div class="google-icon-wrapper">
             <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          </div>
          <h3>Google Account Detected</h3>
          <p>Your account is linked with Google Sign-In. You don't need a password to log in.</p>
          
          <router-link to="/login" class="auth-btn google-btn mt-6">
            Go to Login
          </router-link>

          <button @click="isGoogleUser = false" class="btn-text mt-4">
            Try another email
          </button>
        </div>

        <!-- Success/Final Message -->
        <div v-else-if="isDone" class="success-message">

          <CheckCircleIcon class="success-icon" />
          <h3>Password Reset Successful!</h3>
          <p>You can now log in with your new password.</p>
          <router-link to="/login" class="auth-btn primary-btn mt-4">
            Back to Login
          </router-link>
        </div>

        <!-- Multi-step Form -->
        <div v-else>
          <!-- Step 1: Request Code -->
          <form v-if="!isCodeSent" @submit.prevent="handleRequestCode" class="auth-form">
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

            <button type="submit" class="auth-btn primary-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loader"></span>
              <span v-else>Send Reset Code</span>
            </button>
          </form>

          <!-- Step 2: Verify Code & Reset -->
          <form v-else @submit.prevent="handleResetPassword" class="auth-form">
            <div class="timer-badge" :class="{ 'timer-expired': timeLeft <= 0 }">
              <ClockIcon class="icon-sm" />
              <span>Expires in: {{ formatTime(timeLeft) }}</span>
            </div>

            <div class="form-group">
              <label for="code">6-Digit Code</label>
              <div class="input-wrapper">
                <HashIcon class="input-icon" />
                <input 
                  type="text" 
                  id="code" 
                  v-model="resetCode" 
                  placeholder="000 000" 
                  maxlength="6"
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <div class="input-wrapper">
                <LockIcon class="input-icon" />
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="newPassword" 
                  v-model="newPassword" 
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
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <div class="input-wrapper">
                <LockIcon class="input-icon" />
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <p v-if="localError" class="error-text">{{ localError }}</p>

            <button type="submit" class="auth-btn primary-btn" :disabled="isLoading || timeLeft <= 0">
              <span v-if="isLoading" class="loader"></span>
              <span v-else>Reset Password</span>
            </button>

            <button 
              type="button" 
              @click="isCodeSent = false" 
              class="btn-text mt-4" 
              :disabled="isLoading"
            >
              Back to Step 1
            </button>
          </form>
        </div>

        <p v-if="!isDone" class="auth-footer">
          Remembered your password? 
          <router-link to="/login">Back to Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import authService from '@/services/auth.service';
import { 
  Mail as MailIcon, 
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Hash as HashIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon
} from 'lucide-vue-next';

const email = ref('');
const resetCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const isLoading = ref(false);
const isCodeSent = ref(false);
const isGoogleUser = ref(false);
const isDone = ref(false);

const showPassword = ref(false);
const localError = ref('');

const timeLeft = ref(300); // 5 minutes in seconds
let timer = null;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const startTimer = () => {
  if (timer) clearInterval(timer);
  timeLeft.value = 300;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleRequestCode = async () => {
  isLoading.value = true;
  localError.value = '';
  
  try {
    await authService.forgotPassword(email.value);
    isCodeSent.value = true;
    startTimer();
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to send reset code.';
    if (msg.includes('Google Sign-In')) {
      isGoogleUser.value = true;
    } else {
      localError.value = msg;
    }
  } finally {

    isLoading.value = false;
  }
};

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match.';
    return;
  }
  if (newPassword.value.length < 8) {
    localError.value = 'Password must be at least 8 characters.';
    return;
  }

  isLoading.value = true;
  localError.value = '';

  try {
    await authService.resetPassword(email.value, resetCode.value, newPassword.value);
    isDone.value = true;
    if (timer) clearInterval(timer);
  } catch (err) {
    localError.value = err.response?.data?.message || 'Invalid or expired code.';
  } finally {
    isLoading.value = false;
  }
};
</script>


<style scoped>
/* Reuse styles from LoginView.vue */
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

input {
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

.secondary-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border-color);
  margin-top: 1rem;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(0, 102, 204, 0.4);
}

.secondary-btn:hover {
  background: var(--bg-secondary);
}

.timer-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.timer-expired {
  background: #fee2e2;
  color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  margin-top: -0.5rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-speed);
}

.password-toggle:hover {
  color: var(--text-primary);
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  transition: all var(--transition-speed);
  width: 100%;
}

.btn-text:hover {
  color: var(--color-blue-primary);
  text-decoration: underline;
}

.google-user-notice {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
  animation: fadeIn 0.4s ease-out;
}

.google-icon-wrapper {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
}

.google-icon-wrapper img {
  width: 32px;
  height: 32px;
}

.google-user-notice h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.google-user-notice p {
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 300px;
}

.google-btn {
  background: white !important;
  color: #1f2937 !important;
  border: 1.5px solid #e5e7eb !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

.google-btn:hover {
  background: #f9fafb !important;
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-message {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  color: #10b981;
  margin-bottom: 1rem;
}

.success-message h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.success-message p {
  color: var(--text-secondary);
  line-height: 1.6;
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
