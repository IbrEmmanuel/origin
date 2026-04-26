<template>
  <div class="auth-page page-padding">
    <div class="container auth-container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <h1>Verify Email</h1>
          <p>We've sent a 6-digit code to <strong>{{ email }}</strong></p>
        </div>

        <form @submit.prevent="handleVerify" class="auth-form">
          <div class="form-group">
            <label>Verification Code</label>
            <div class="otp-container" @click="focusInput">
              <div 
                v-for="(digit, index) in 6" 
                :key="index" 
                class="otp-box"
                :class="{ 'is-active': code.length === index, 'has-value': code.length > index }"
              >
                {{ code[index] || '' }}
              </div>
              <input 
                ref="otpInput"
                type="text" 
                id="code" 
                v-model="code" 
                maxlength="6"
                required 
                class="ghost-input"
                pattern="\d{6}"
                inputmode="numeric"
                autocomplete="one-time-code"
              />
            </div>
          </div>

          <button type="submit" class="auth-btn primary-btn" :disabled="isLoading || code.length !== 6">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Verify Email</span>
          </button>
        </form>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          Verification successful! Redirecting to login...
        </div>

        <p class="auth-footer">
          Didn't receive the code? 
          <a href="#" @click.prevent="handleResend" :class="{ 'disabled-link': isResending }">
            {{ isResending ? 'Sending...' : 'Resend Code' }}
          </a>
        </p>

        <div class="auth-divider">
          <span>or</span>
        </div>

        <button @click="goToSignup" class="auth-btn secondary-btn">
          Register with another email
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '@/services/auth.service'

const router = useRouter()
const route = useRoute()

const email = ref(route.query.email || '')
const code = ref('')
const isLoading = ref(false)
const isResending = ref(false)
const error = ref('')
const success = ref(false)
const otpInput = ref(null)

const focusInput = () => {
  otpInput.value?.focus()
}
const handleVerify = async () => {
  if (!email.value || !code.value) {
    error.value = 'Email and code are required'
    return
  }

  isLoading.value = true
  error.value = ''
  
  try {
    await authService.verify(email.value, code.value)
    
    // Update local session state to reflect verification
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.is_verified = true;
    localStorage.setItem('user', JSON.stringify(user));

    success.value = true
    setTimeout(() => {
      const redirectPath = route.query.redirect || '/account/dashboard';
      router.push(redirectPath)
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Verification failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  if (isResending.value) return
  
  isResending.value = true
  error.value = ''
  
  try {
    await authService.resendCode(email.value)
    alert('A new verification code has been sent to your email.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to resend code. Please try again later.'
  } finally {
    isResending.value = false
  }
}

const goToSignup = () => {
  authService.logout();
  router.push('/signup')
}

onMounted(() => {
  if (!email.value) {
    router.push('/signup')
  } else {
    setTimeout(focusInput, 500);
  }
})
</script>

<style scoped>
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
  gap: 2rem;
  animation: slideUp 0.6s var(--transition-bounce);
}

.auth-header {
  text-align: center;
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

.otp-container {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  position: relative;
  margin-top: 1rem;
}

.otp-box {
  flex: 1;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-color);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: all var(--transition-speed);
}

.otp-box.is-active {
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
  transform: translateY(-2px);
}

.otp-box.has-value {
  border-color: var(--color-blue-primary);
  background: rgba(0, 102, 204, 0.05);
}

.ghost-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
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

.secondary-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1.5px solid var(--border-color);
}

.secondary-btn:hover {
  background: var(--border-color);
  transform: translateY(-1px);
}

.disabled-link {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.error-message {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 1rem;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
}

.success-message {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 1rem;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
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

  .code-input {
    font-size: 1.5rem;
    letter-spacing: 0.25rem;
  }
}
</style>
