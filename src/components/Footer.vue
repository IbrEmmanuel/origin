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
        <h4>Company</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/services">Services</router-link></li>
          <li><router-link to="/projects">Projects</router-link></li>
          <li><router-link to="/blog">Blog</router-link></li>
        </ul>
      </div>
      
      <div class="footer-links">
        <h4>Resources</h4>
        <ul>
          <li><router-link to="/marketplace">Marketplace</router-link></li>
          <li><router-link to="/load-audit">Load Audit</router-link></li>
          <li><router-link to="/origin-talk">Origin Talk AI</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
          <li><router-link to="/vendor-apply">Become a Supplier</router-link></li>
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
  grid-template-columns: 2fr 1fr 1fr 2fr;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.footer-logo {
  height: 52px;
  width: auto;
  margin-bottom: var(--space-sm);
}

.brand-tagline {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.55;
  letter-spacing: 0em;
  max-width: 280px;
  margin-bottom: var(--space-md);
}

.footer-links h4,
.footer-contact h4 {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
  color: var(--color-blue-primary);
}

.footer-links ul li {
  margin-bottom: 0.375rem;
}

.footer-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0em;
  transition: all var(--transition-speed);
}

.footer-links a:hover {
  color: var(--color-blue-primary);
  padding-left: 4px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 0.625rem;
  color: var(--text-secondary);
}

.contact-item a {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.contact-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-group span {
  display: block;
  font-size: 0.85rem;
  line-height: 1.55;
  letter-spacing: 0em;
}

.contact-group strong {
  color: var(--color-blue-primary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-top: 6px;
}

.contact-group span:first-child strong {
  margin-top: 0;
}

.icon-xs {
  width: 15px;
  height: 15px;
  color: var(--color-blue-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.social-icons {
  display: flex;
  gap: 0.625rem;
}

.soc-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all var(--transition-bounce);
}

.soc-btn:hover {
  background: var(--color-blue-primary);
  color: white;
  transform: translateY(-3px);
  border-color: var(--color-blue-primary);
  box-shadow: 0 8px 16px -4px rgba(0, 102, 204, 0.3);
}

.icon-sm {
  width: 17px;
  height: 17px;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-md);
  font-size: 0.82rem;
  letter-spacing: 0.01em;
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

.footer-legal a {
  font-size: 0.82rem;
  letter-spacing: 0.01em;
  transition: color var(--transition-speed);
}

.footer-legal a:hover {
  color: var(--color-blue-primary);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
  }
}

@media (max-width: 768px) {
  .footer-grid {
    gap: var(--space-sm);
  }
  
  .footer-legal {
    gap: var(--space-sm);
  }
}
</style>
