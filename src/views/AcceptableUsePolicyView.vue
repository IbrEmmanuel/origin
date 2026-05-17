<template>
  <div class="policy-page">
    <div class="container py-xl">
      <div class="policy-card glass-card">
        <h1 class="page-title">Acceptable Use Policy</h1>
        <p class="effective-date">Effective Date: May 2026</p>

        <div class="policy-content">
          <p>This Acceptable Use Policy defines the rules and guidelines for using Origin Electric’s services and payment systems.</p>

          <section class="policy-section">
            <h2>1. Lawful Use</h2>
            <p>All customers must use Origin Electric’s services strictly for lawful purposes. Any illegal, fraudulent, or abusive activity is prohibited.</p>
          </section>

          <section class="policy-section">
            <h2>2. Payment Integrity</h2>
            <p>Customers agree to:</p>
            <ul>
              <li>Provide accurate and complete information during transactions</li>
              <li>Use only payment methods they are authorized to use</li>
              <li>Avoid chargeback abuse or fraudulent disputes</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>3. Proper Use of Services</h2>
            <p>Customers must not:</p>
            <ul>
              <li>Interfere with or tamper with installed systems</li>
              <li>Misuse products or services in ways that compromise safety</li>
              <li>Represent Origin Electric without authorization</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>4. Prohibited Activities</h2>
            <p>The following are strictly prohibited:</p>
            <ul>
              <li>Fraudulent transactions</li>
              <li>Attempted payment manipulation or unauthorized fund usage</li>
              <li>Using Origin Electric’s platform to process payments on behalf of third parties</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>5. Enforcement</h2>
            <p>Origin Electric reserves the right to:</p>
            <ul>
              <li>Decline or cancel transactions</li>
              <li>Suspend or terminate services</li>
              <li>Take appropriate action in response to policy violations</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>6. Policy Updates</h2>
            <p>This policy may be updated periodically. Continued use of our services indicates acceptance of any revisions.</p>
          </section>

          <section class="policy-section">
            <h2>7. Contact Information</h2>
            <p><strong>Origin Electric</strong></p>
            <p>Email: <a href="mailto:info@originelectricltd.com">info@originelectricltd.com</a></p>
            <p>Phone: <a href="tel:+2347041880339">+234 7041880339</a></p>
            <p>Location: Ile ife, Osun state, Nigeria</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.policy-page {
  padding-top: 100px;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem 5rem;
}

.policy-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 3rem;
  box-shadow: var(--shadow-md);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--color-blue-primary);
}

.effective-date {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.policy-content {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-primary);
}

.policy-section {
  margin-top: 2.5rem;
}

.policy-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.policy-content ul {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.policy-content li {
  margin-bottom: 0.5rem;
}

.policy-content a {
  color: var(--color-blue-primary);
  text-decoration: none;
  font-weight: 600;
}

.policy-content a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .policy-card {
    padding: 2rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>
