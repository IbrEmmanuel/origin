/**
 * Shared Paystack Inline helper — checkout, orders, consultations.
 * Public key must be set at build time: VITE_PAYSTACK_PUBLIC_KEY=pk_test_… | pk_live_…
 */
import { env, isPaystackKeyConfigured } from '@/config/env';

export function getPaystackPublicKey() {
  return isPaystackKeyConfigured(env.paystackPublicKey) ? env.paystackPublicKey : null;
}

export function isPaystackConfigured() {
  return Boolean(getPaystackPublicKey());
}

export function isPaystackTestMode() {
  const key = getPaystackPublicKey();
  return !key || key.startsWith('pk_test_');
}

/** Convert Naira amount to integer kobo (Paystack requirement). */
export function toKobo(amountNaira) {
  const n = Number(amountNaira);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

export function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.PaystackPop) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[data-paystack="inline"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Paystack'))
      );
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.dataset.paystack = 'inline';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.body.appendChild(script);
  });
}

/**
 * Open Paystack popup. Throws if key missing / amount invalid / script fails.
 * @param {object} opts
 * @param {string} opts.email
 * @param {number|string} opts.amountNaira
 * @param {object} [opts.metadata]
 * @param {string} [opts.reference]
 * @param {(response: { reference: string }) => void} opts.onSuccess
 * @param {() => void} [opts.onClose]
 */
export async function openPaystackPopup({
  email,
  amountNaira,
  metadata = {},
  reference,
  onSuccess,
  onClose
}) {
  const key = getPaystackPublicKey();
  if (!key) {
    throw new Error(
      'Paystack is not configured. Set VITE_PAYSTACK_PUBLIC_KEY in the environment and rebuild.'
    );
  }

  const amount = toKobo(amountNaira);
  if (amount < 100) {
    throw new Error('Invalid payment amount (minimum ₦1.00).');
  }

  const customerEmail = String(email || '').trim();
  if (!customerEmail || !customerEmail.includes('@')) {
    throw new Error('A valid customer email is required for payment.');
  }

  await loadPaystackScript();
  if (!window.PaystackPop) {
    throw new Error('Paystack failed to initialize.');
  }

  const handler = window.PaystackPop.setup({
    key,
    email: customerEmail,
    amount,
    currency: 'NGN',
    ref: reference || undefined,
    metadata: {
      ...metadata,
      test_mode: key.startsWith('pk_test_')
    },
    callback: (response) => {
      try {
        onSuccess?.(response);
      } catch (err) {
        console.error('Paystack success handler error', err);
      }
    },
    onClose: () => {
      try {
        onClose?.();
      } catch (err) {
        console.error('Paystack close handler error', err);
      }
    }
  });

  handler.openIframe();
}
