<template>
  <div class="auth-page page-padding">
    <div class="container auth-container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a recovery link</p>
        </div>

        <div v-if="isSubmitted" class="success-message">
          <CheckCircleIcon class="success-icon" />
          <h3>Check your email</h3>
          <p>We've sent a password reset link to <strong>{{ email }}</strong>. Please check your inbox and follow the instructions.</p>
          <button @click="isSubmitted = false" class="auth-btn secondary-btn">
            Try another email
          </button>
        </div>

        <form v-else @submit.prevent="handleReset" class="auth-form">
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
            <span v-else>Send Recovery Link</span>
          </button>
        </form>

        <p class="auth-footer">
          Remembered your password? 
          <router-link to="/login">Back to Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Mail as MailIcon, 
  CheckCircle as CheckCircleIcon 
} from 'lucide-vue-next';

const email = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);

const handleReset = () => {
  isLoading.value = true;
  // TODO: Implement actual reset logic
  setTimeout(() => {
    isLoading.value = false;
    isSubmitted.value = true;
  }, 1500);
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
