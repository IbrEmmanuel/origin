<template>
  <div class="refund-policy-page">
    <div class="container py-xl">
      <div class="policy-card glass-card">
        <h1 class="page-title">Refund Policy</h1>
        <p class="effective-date">Effective Date: May 2026</p>

        <div class="policy-content">
          <p>Origin Electric is committed to delivering reliable solar and electrical solutions. This Refund Policy outlines the terms under which refunds may be granted.</p>

          <section class="policy-section">
            <h2>1. Eligibility for Refunds</h2>
            <p>Refunds may be approved under the following conditions:</p>
            <ul>
              <li>The product delivered is defective or damaged at the time of delivery</li>
              <li>Installation cannot be completed due to issues directly caused by Origin Electric</li>
              <li>The order is cancelled within 48 hours of payment and before procurement or installation begins</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>2. Non-Refundable Situations</h2>
            <p>Refunds will not be granted under the following circumstances:</p>
            <ul>
              <li>Change of mind after 48 hours of payment</li>
              <li>Delays caused by the customer (including site unavailability or restricted access)</li>
              <li>Damage resulting from misuse, negligence, or external factors after installation</li>
              <li>Custom orders or completed installations</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>3. Refund Request Process</h2>
            <p>To request a refund, customers must:</p>
            <ul>
              <li>Send an email to: <a href="mailto:info@originelectricltd.com">info@originelectricltd.com</a></li>
              <li>Include proof of payment and a clear description of the issue</li>
            </ul>
            <p>All requests are reviewed within 3–5 business days.</p>
          </section>

          <section class="policy-section">
            <h2>4. Approved Refunds</h2>
            <ul>
              <li>Approved refunds will be processed within 5–10 business days</li>
              <li>Refunds will be made through the original payment method used</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>5. Service Resolution</h2>
            <p>Where applicable, Origin Electric may provide:</p>
            <ul>
              <li>Repairs</li>
              <li>Replacements</li>
              <li>Adjustments</li>
            </ul>
          </section>

          <section class="policy-section">
            <h2>6. Contact Information</h2>
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
.refund-policy-page {
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
