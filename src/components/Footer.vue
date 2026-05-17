<template>
  <footer class="main-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="../assets/logo.png" alt="Origin Electric" class="footer-logo" />
        <p class="brand-tagline">Powering Homes & Businesses with Smart Energy Solutions.</p>
        <div class="social-icons">
          <a href="https://www.facebook.com/OriginElectric" class="soc-btn" aria-label="Facebook" target="_blank">
            <FacebookIcon class="icon-sm" />
          </a> 
          <a href="https://www.instagram.com/origin_electricltd" class="soc-btn" aria-label="Instagram" target="_blank">
            <InstagramIcon class="icon-sm" />
          </a> 
          <a href="https://www.tiktok.com/@originelectricltd" class="soc-btn" aria-label="Tiktok" target="_blank">
            <MusicIcon class="icon-sm" />
          </a> 
        </div>
      </div>
      
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/marketplace">Marketplace</router-link></li>
          <li><router-link to="/load-audit">Load Audit</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
          <li><router-link to="/vendor-apply">Are you a supplier?</router-link></li>
        </ul>
      </div>

      <div class="footer-contact">
        <h4>Contact Experts</h4>
        <div class="contact-item">
          <MailIcon class="icon-xs" />
          <a href="mailto:info@originelectricltd.com">info@originelectricltd.com</a>
        </div>
        <div class="contact-item">
          <PhoneIcon class="icon-xs" />
          <a href="tel:+2347041880339">+234 704 188 0339</a>
        </div>
        <div class="contact-item">
          <MapPinIcon class="icon-xs" />
          <div class="contact-group">
            <span><strong>Head Office:</strong> Near OAU Muslim Graduates Association Resource Centre, Stadium Road, Ile-Ife, Osun State.</span>
            <span>
              <strong>Ibadan Office:</strong> Ibadan Contact Office – Oyo State<br/>
              <!-- <a href="tel:+2349130703970">+234 913 070 3970</a> -->
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-flex">
          <p>&copy; 2024 Origin Electric. All Rights Reserved.</p>
          <div class="footer-legal">
            <router-link to="/use-policy">Acceptable Use Policy</router-link>
            <router-link to="/refund-policy">Refund Policy</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
  Facebook as FacebookIcon, 
  Instagram as InstagramIcon, 
  Music as MusicIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon
} from 'lucide-vue-next';
</script>

<style scoped>
.main-footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--space-xl) 0 var(--space-md) 0;
  margin-top: var(--space-xl);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.footer-logo {
  height: 60px;
  width: auto;
  margin-bottom: var(--space-sm);
}

.brand-tagline {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 300px;
  margin-bottom: var(--space-md);
}

.footer-links h4,
.footer-contact h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--color-blue-primary);
}

.footer-links ul li {
  margin-bottom: var(--space-xs);
}

.footer-links a {
  color: var(--text-secondary);
  font-weight: 500;
  transition: all var(--transition-speed);
}

.footer-links a:hover {
  color: var(--color-blue-primary);
  padding-left: 4px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: var(--space-xs);
  color: var(--text-secondary);
}

.contact-item a {
  color: var(--text-primary);
  font-weight: 600;
}

.contact-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-group span {
  display: block;
  font-size: 0.9rem;
}

.contact-group strong {
  color: var(--color-blue-primary);
  font-size: 0.8rem;
  text-transform: uppercase;
  display: block;
  margin-top: 4px;
}

.contact-group span:first-child strong {
  margin-top: 0;
}

.contact-group span:first-child strong {
  margin-top: 0;
}

.icon-xs {
  width: 16px;
  height: 16px;
  color: var(--color-blue-primary);
  flex-shrink: 0;
}

.social-icons {
  display: flex;
  gap: var(--space-sm);
}

.soc-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  transition: all var(--transition-bounce);
}

.soc-btn:hover {
  background: var(--color-blue-primary);
  color: white;
  transform: translateY(-4px);
  border-color: var(--color-blue-primary);
}

.icon-sm {
  width: 18px;
  height: 18px;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.footer-bottom-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.footer-legal {
  display: flex;
  gap: var(--space-md);
}

.footer-legal a:hover {
  color: var(--color-blue-primary);
}

@media (max-width: 768px) {
  .footer-grid {
    gap: var(--space-lg);
  }
}
</style>
