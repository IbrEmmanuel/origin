<template>
  <div class="contact-page bg-premium">
    <div class="container page-padding">
      <!-- Hero Header -->
      <div class="text-center intro-section">
        <h1 class="section-title">Get in <span class="grad-blue">Touch</span></h1>
        <p class="section-desc centered">Have questions or ready to start your energy revolution? Our team of experts is here to help you power your future.</p>
      </div>

      <div class="contact-grid">
        <!-- Contact Form Card -->
        <div class="contact-form-wrapper glass-card">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <h3 class="form-title">Send a Message</h3>
            
            <div class="form-group-row">
              <div class="form-group">
                <label for="name">Full Name</label>
                <div class="input-wrapper">
                  <UserIcon class="input-icon" />
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name" 
                    placeholder="John Doe" 
                    required 
                    :disabled="loading"
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
                    v-model="form.email" 
                    placeholder="john@example.com" 
                    required 
                    :disabled="loading"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <div class="input-wrapper">
                <TagIcon class="input-icon" />
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject" 
                  placeholder="How can we help?" 
                  :disabled="loading"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                rows="5" 
                placeholder="Tell us about your project or inquiry..." 
                required
                :disabled="loading"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-submit" :disabled="loading">
              <span v-if="loading" class="loader-sm"></span>
              <span v-else><SendIcon class="icon-sm" /> Send Message</span>
            </button>

            <!-- Status Messages -->
            <Transition name="fade">
              <div v-if="status.message" :class="['status-box', status.type]">
                <CheckCircleIcon v-if="status.type === 'success'" class="icon-sm" />
                <AlertCircleIcon v-else class="icon-sm" />
                {{ status.message }}
              </div>
            </Transition>
          </form>
        </div>

        <!-- Contact Info Side -->
        <div class="contact-info-wrapper">
          <div class="info-cards">
            <!-- Email Card -->
            <div class="info-card glass-card">
              <div class="info-icon-box grad-blue">
                <MailIcon />
              </div>
              <div class="info-text">
                <h4>Email Us</h4>
                <a href="mailto:info@originelectric.com">info@originelectric.com</a>
                <p>Reply within 24 hours</p>
              </div>
            </div>

            <!-- Phone Card -->
            <div class="info-card glass-card">
              <div class="info-icon-box grad-orange">
                <PhoneIcon />
              </div>
              <div class="info-text">
                <h4>Call Us</h4>
                <a href="tel:+2347041880339">+234 704 188 0339</a>
                <p>Mon - Sat, 8am - 6pm</p>
              </div>
            </div>

            <!-- Address Card -->
            <div class="info-card glass-card">
              <div class="info-icon-box grad-blue">
                <MapPinIcon />
              </div>
              <div class="info-text">
                <h4>Visit Office</h4>
                <p class="address-text">Near FHV3+JQ7 Oau Muslim Graduates Association Resource Centre, Ile, Stadium Road, Ife 220101, Osun state, Nigeria</p>
              </div>
            </div>
          </div>

          <!-- Social Connect -->
          <div class="social-connect glass-card">
            <h4>Follow Our Journey</h4>
            <div class="social-links">
              <a href="https://www.facebook.com/OriginElectric" class="social-btn facebook" target="_blank">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/origin_electricltd" class="social-btn instagram" target="_blank">
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@originelectricltd" class="social-btn tiktok" target="_blank">
                <MusicIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Mail as MailIcon, 
  Phone as PhoneIcon, 
  MapPin as MapPinIcon, 
  User as UserIcon, 
  Tag as TagIcon, 
  Send as SendIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Music as MusicIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next';
import contactService from '@/services/contact.service';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const loading = ref(false);
const status = ref({
  type: '',
  message: ''
});

const handleSubmit = async () => {
  loading.value = true;
  status.value = { type: '', message: '' };

  try {
    const response = await contactService.sendMessage(form.value);
    status.value = {
      type: 'success',
      message: response.message
    };
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  } catch (err) {
    status.value = {
      type: 'error',
      message: err.message || 'Failed to send message. Please try again.'
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  padding-bottom: var(--space-xl);
}

.bg-premium {
  background: radial-gradient(circle at 10% 10%, rgba(0, 102, 204, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 90%, rgba(255, 153, 0, 0.05) 0%, transparent 40%);
}

.page-padding {
  padding-top: var(--space-xl);
}

@media (max-width: 992px) {
  .page-padding {
    padding-top: var(--space-xl);
  }
}

.intro-section {
  margin-bottom: var(--space-xl);
}

.centered {
  margin-left: auto;
  margin-right: auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--space-xl);
  align-items: start;
}

@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}

/* Form Styles */
.contact-form-wrapper {
  padding: var(--space-lg);
}

@media (max-width: 768px) {
  .contact-form-wrapper {
    padding: var(--space-md) var(--space-sm);
  }
}

.form-title {
  font-size: 1.75rem;
  margin-bottom: var(--space-md);
  color: var(--text-primary);
}

.form-group-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

@media (max-width: 600px) {
  .form-group-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: var(--color-blue-primary);
}

input, textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  transition: all var(--transition-speed);
}

input {
  padding-left: 48px;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

textarea {
  resize: vertical;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  gap: 12px;
}

.loader-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Status Boxes */
.status-box {
  margin-top: var(--space-md);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 0.95rem;
}

.status-box.success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-box.error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Info Cards Info Side */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.info-card {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
  transition: transform var(--transition-bounce);
}

@media (max-width: 768px) {
  .info-card {
    padding: 1.25rem;
    gap: 1rem;
  }
}

.info-card:hover {
  transform: translateX(10px);
}

.info-icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
}

.info-text h4 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.info-text a {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-blue-primary);
  text-decoration: none;
}

.info-text p {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.address-text {
  line-height: 1.5;
  margin-top: 4px;
}

/* Social Connect Row */
.social-connect {
  padding: var(--space-md);
  text-align: center;
}

@media (max-width: 768px) {
  .social-connect {
    padding: 1.25rem;
  }
}

.social-connect h4 {
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

.social-btn {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all var(--transition-bounce);
  border: 1px solid var(--border-color);
}

.social-btn:hover {
  color: white;
  transform: translateY(-5px) scale(1.1);
}

.social-btn.facebook:hover { background: #1877f2; border-color: #1877f2; }
.social-btn.instagram:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%); border-color: transparent; }
.social-btn.tiktok:hover { background: #000000; border-color: #000000; }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
