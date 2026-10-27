<template>
  <div class="checkout-page">
    <div class="container checkout-container">
      <header class="page-header">
        <h1 class="page-title">Checkout</h1>
        <p class="page-sub">Confirm delivery details, then pay securely with Paystack.</p>
      </header>

      <div v-if="cartItems.length === 0 && !loadingProfile" class="empty-cart glass-card">
        <h2>Your cart is empty</h2>
        <p>Add products from the marketplace before checking out.</p>
        <router-link to="/marketplace" class="primary-btn">Browse marketplace</router-link>
      </div>

      <div v-else class="checkout-layout">
        <!-- Delivery Details -->
        <section class="checkout-form-section glass-card" aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" class="section-title">Delivery Details</h2>

          <div v-if="loadingProfile" class="loading-state" aria-busy="true">
            <span class="loader" aria-hidden="true" />
            <span>Loading your saved addresses…</span>
          </div>

          <div v-else class="address-selection">
            <div v-if="savedAddresses.length > 0" class="saved-addresses">
              <h3 class="subtitle">Saved addresses</h3>
              <div class="address-options" role="listbox" aria-label="Saved addresses">
                <button
                  v-for="addr in savedAddresses"
                  :key="addr.id"
                  type="button"
                  class="address-card"
                  :class="{ selected: selectedAddressId === addr.id }"
                  role="option"
                  :aria-selected="selectedAddressId === addr.id"
                  @click="selectAddress(addr)"
                >
                  <p class="addr-type">{{ addr.type || 'Home' }}</p>
                  <p class="addr-text">{{ addr.fullAddress }}</p>
                </button>
              </div>
              <button type="button" class="text-btn" @click="clearSavedSelection">
                Or enter a new address
              </button>
            </div>

            <form class="new-address-form" @submit.prevent="processCheckout">
              <h3 class="subtitle">
                {{ selectedAddressId ? 'Confirm delivery details' : 'Delivery address' }}
              </h3>

              <div class="form-group">
                <label for="checkout-phone">Contact phone <span class="req">*</span></label>
                <input
                  id="checkout-phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  :class="{ 'is-invalid': fieldErrors.phone }"
                  autocomplete="tel"
                  inputmode="tel"
                  placeholder="08012345678 or +234…"
                  required
                  @blur="validateField('phone')"
                />
                <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>
              </div>

              <div class="form-group">
                <label for="checkout-street">Street / building address <span class="req">*</span></label>
                <input
                  id="checkout-street"
                  v-model="form.street"
                  type="text"
                  class="form-input"
                  :class="{ 'is-invalid': fieldErrors.street }"
                  autocomplete="street-address"
                  placeholder="House number, street, landmark"
                  required
                  @blur="validateField('street')"
                  @input="persistDraft"
                />
                <p v-if="fieldErrors.street" class="field-error">{{ fieldErrors.street }}</p>
              </div>

              <div class="form-row">
                <div class="form-group half">
                  <label for="checkout-city">City <span class="req">*</span></label>
                  <input
                    id="checkout-city"
                    v-model="form.city"
                    type="text"
                    class="form-input"
                    :class="{ 'is-invalid': fieldErrors.city }"
                    autocomplete="address-level2"
                    placeholder="e.g. Ibadan, Abuja, Port Harcourt"
                    required
                    @blur="validateField('city')"
                    @input="persistDraft"
                  />
                  <p v-if="fieldErrors.city" class="field-error">{{ fieldErrors.city }}</p>
                </div>
                <div class="form-group half">
                  <label for="checkout-state">State <span class="req">*</span></label>
                  <input
                    id="checkout-state"
                    v-model="form.state"
                    type="text"
                    class="form-input"
                    :class="{ 'is-invalid': fieldErrors.state }"
                    autocomplete="address-level1"
                    placeholder="e.g. Oyo, FCT, Rivers"
                    required
                    @blur="validateField('state')"
                    @input="persistDraft"
                  />
                  <p v-if="fieldErrors.state" class="field-error">{{ fieldErrors.state }}</p>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group half">
                  <label for="checkout-country">Country <span class="req">*</span></label>
                  <input
                    id="checkout-country"
                    v-model="form.country"
                    type="text"
                    class="form-input"
                    autocomplete="country-name"
                    required
                    @input="persistDraft"
                  />
                </div>
                <div class="form-group half">
                  <label for="checkout-postal">Postal code <span class="optional">(optional)</span></label>
                  <input
                    id="checkout-postal"
                    v-model="form.postalCode"
                    type="text"
                    class="form-input"
                    autocomplete="postal-code"
                    placeholder="If known"
                    @input="persistDraft"
                  />
                </div>
              </div>

              <!-- Map -->
              <div class="form-group map-section">
                <label>Pin delivery location</label>
                <span class="field-note">
                  Search or tap the map to set your pin. Delivery fee is calculated from this location.
                </span>

                <div v-if="mapStatus === 'unavailable'" class="map-fallback" role="status">
                  <p>
                    Map is unavailable
                    {{ mapsKeyConfigured ? '(provider error)' : '(Maps API key not configured)' }}.
                    Enter your full street address above — we’ll request a delivery quotation if a fee cannot be calculated automatically.
                  </p>
                  <button
                    type="button"
                    class="secondary-btn"
                    :disabled="feeStatus === 'loading'"
                    @click="requestFeeWithoutPin"
                  >
                    {{ feeStatus === 'loading' ? 'Checking fee…' : 'Estimate fee from city / state' }}
                  </button>
                </div>

                <template v-else>
                  <input
                    ref="mapSearchInput"
                    type="text"
                    class="map-search-input"
                    placeholder="Search address (e.g. Ring Road, Ibadan)"
                    aria-label="Search delivery address on map"
                    @keydown.enter.prevent
                  />
                  <div class="checkout-map-wrapper">
                    <div ref="mapContainer" class="checkout-map-container" role="application" aria-label="Delivery map" />
                    <div v-if="mapStatus === 'loading'" class="map-overlay">Loading map…</div>
                  </div>
                </template>

                <div v-if="form.latitude && form.longitude" class="coords-display">
                  <span class="coords-badge">
                    Pinned {{ form.latitude.toFixed(5) }}, {{ form.longitude.toFixed(5) }}
                  </span>
                  <span v-if="addressConfirm" class="address-confirm">{{ addressConfirm }}</span>
                  <span v-if="closestPartner" class="closest-partner-info">
                    Nearest hub: {{ closestPartner }}
                    <template v-if="shippingDistance"> ({{ Number(shippingDistance).toFixed(1) }} km)</template>
                  </span>
                </div>
                <p v-if="fieldErrors.location" class="field-error">{{ fieldErrors.location }}</p>
                <p v-if="feeMessage" class="fee-message" :class="`fee-message--${feeStatus}`">
                  {{ feeMessage }}
                </p>
              </div>
            </form>
          </div>
        </section>

        <!-- Order Summary -->
        <aside class="order-summary-section glass-card" aria-labelledby="summary-heading">
          <h2 id="summary-heading" class="section-title">Order Summary</h2>

          <div v-if="cartItems.length === 0" class="empty-summary">No items in cart.</div>

          <ul v-else class="items-preview">
            <li v-for="item in cartItems" :key="item.id" class="summary-item">
              <div class="summary-thumb" aria-hidden="true">
                <img v-if="itemThumb(item)" :src="itemThumb(item)" :alt="''" />
                <span v-else class="thumb-fallback">{{ item.quantity }}×</span>
              </div>
              <div class="summary-meta">
                <p class="name">{{ item.name }}</p>
                <p class="meta-line">
                  Qty {{ item.quantity }} · ₦{{ formatMoney(item.price) }} each
                </p>
              </div>
              <span class="price">₦{{ formatMoney(item.price * item.quantity) }}</span>
            </li>
          </ul>

          <div class="summary-divider" />

          <div class="totals">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₦{{ formatMoney(cartTotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Delivery fee</span>
              <span v-if="feeStatus === 'ok' && deliveryFee !== null">₦{{ formatMoney(deliveryFee) }}</span>
              <span v-else-if="feeStatus === 'loading'" class="muted">Calculating…</span>
              <span v-else-if="feeStatus === 'quote_required'" class="muted">Quotation required</span>
              <span v-else class="muted">Pin address to calculate</span>
            </div>
            <div class="summary-divider" />
            <div class="summary-row total-row">
              <span>{{ feeStatus === 'ok' ? 'Total' : 'Estimated total' }}</span>
              <span v-if="feeStatus === 'ok'">₦{{ formatMoney(grandTotal) }}</span>
              <span v-else class="muted">₦{{ formatMoney(cartTotal) }} + delivery</span>
            </div>
          </div>

          <button
            type="button"
            class="primary-btn pay-btn"
            :class="{ 'is-loading': isProcessing }"
            :disabled="!canPay"
            @click="processCheckout"
          >
            <span v-if="isProcessing" class="loader-sm" aria-hidden="true" />
            {{ payButtonLabel }}
          </button>

          <div class="pay-methods" aria-label="Available payment methods">
            <span
              v-for="ch in paystackChannelLabels"
              :key="ch"
              class="pay-method-chip"
            >{{ ch }}</span>
          </div>
          <p class="pay-channels-note">
            Pay securely via Paystack into Origin Electric’s merchant account.
            Card, bank transfer, bank, USSD, and QR appear when enabled on the Paystack dashboard.
            Bank transfers stay <strong>pending</strong> until server verification — a transfer alone is not a confirmed order.
          </p>

          <div
            v-if="!paystackReady && showConfigDiagnostics"
            class="config-banner"
            role="status"
          >
            <strong>Payments unavailable on this build</strong>
            <p>
              The Paystack public key is missing or still a placeholder. Set
              <code>VITE_PAYSTACK_PUBLIC_KEY</code> in the host environment (Vercel → Settings → Environment Variables)
              and redeploy. The secret key must stay on the API only — never as a <code>VITE_*</code> variable.
            </p>
          </div>
          <p v-else-if="!paystackReady" class="customer-pay-notice" role="status">
            Online payment is temporarily unavailable. You can still review your cart and delivery details.
            Please try again later or contact support.
          </p>

          <p v-if="error" class="error-msg" role="alert">{{ error }}</p>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/composables/useCart';
import {
  openPaystackPopup,
  isPaystackConfigured,
  isPaystackTestMode,
  PAYSTACK_CHANNEL_LABELS
} from '@/composables/usePaystack';
import { env, publicConfigSnapshot } from '@/config/env';
import userService from '@/services/user.service';
import { firstMediaUrl } from '@/utils/mediaUrl';
import { isValidCheckoutPhone } from '@/lib/phone';
import { saveCheckoutDraft, loadCheckoutDraft, clearCheckoutDraft } from '@/lib/checkoutDraft';
import { formatNaira } from '@/lib/commission';

const router = useRouter();
const { cartItems, cartTotal, removeFromCart } = useCart();
const paystackReady = isPaystackConfigured();
const showConfigDiagnostics = Boolean(env.isDev || import.meta.env.DEV);
const paystackChannelLabels = Object.values(PAYSTACK_CHANNEL_LABELS);

const apiRoot = () => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (base === '' || base == null) return '';
  return String(base).replace(/\/$/, '');
};
const apiUrl = (path) => `${apiRoot()}${path.startsWith('/') ? path : `/${path}`}`;

const loadingProfile = ref(true);
const savedAddresses = ref([]);
const selectedAddressId = ref(null);
const isProcessing = ref(false);
const error = ref('');
const fieldErrors = ref({});

const mapContainer = ref(null);
const mapSearchInput = ref(null);
const map = ref(null);
const marker = ref(null);
const mapStatus = ref('loading'); // loading | ready | unavailable
const mapsKeyConfigured = Boolean(env.googleMapsApiKey);
const closestPartner = ref('');
const shippingDistance = ref(0);
const addressConfirm = ref('');

/** ok | loading | need_pin | quote_required | error */
const feeStatus = ref('need_pin');
const feeMessage = ref('');
const deliveryFee = ref(null);

const form = ref({
  phone: '',
  street: '',
  city: '',
  state: '',
  country: 'Nigeria',
  postalCode: '',
  latitude: null,
  longitude: null
});

const formatMoney = (n) => formatNaira(Number(n) || 0);

const grandTotal = computed(() => {
  if (deliveryFee.value == null || !Number.isFinite(Number(deliveryFee.value))) {
    return Number(cartTotal.value) || 0;
  }
  return Number(cartTotal.value) + Number(deliveryFee.value);
});

const canPay = computed(() => {
  if (isProcessing.value) return false;
  if (!paystackReady) return false;
  if (cartItems.value.length === 0) return false;
  if (feeStatus.value !== 'ok' || deliveryFee.value === null) return false;
  return true;
});

const payButtonLabel = computed(() => {
  if (isProcessing.value) return 'Processing…';
  if (!paystackReady) return 'Payment unavailable';
  if (cartItems.value.length === 0) return 'Cart is empty';
  if (feeStatus.value === 'loading') return 'Calculating delivery…';
  if (feeStatus.value === 'need_pin') return 'Pin address to continue';
  if (feeStatus.value === 'quote_required') return 'Delivery quotation required';
  if (feeStatus.value === 'error') return 'Fix delivery fee to pay';
  return isPaystackTestMode() ? 'Pay with Paystack (test)' : 'Pay with Paystack';
});

const itemThumb = (item) => firstMediaUrl(item.images);

const persistDraft = () => {
  saveCheckoutDraft({
    form: { ...form.value },
    selectedAddressId: selectedAddressId.value,
    deliveryFee: deliveryFee.value,
    feeStatus: feeStatus.value,
    addressConfirm: addressConfirm.value
  });
};

watch(
  form,
  () => {
    persistDraft();
  },
  { deep: true }
);

const validateField = (name) => {
  const next = { ...fieldErrors.value };
  if (name === 'phone') {
    next.phone = isValidCheckoutPhone(form.value.phone)
      ? ''
      : 'Enter a valid Nigerian phone (e.g. 08012345678) or international number with country code.';
  }
  if (name === 'street') {
    next.street = form.value.street.trim().length >= 5 ? '' : 'Enter a full street or building address.';
  }
  if (name === 'city') {
    next.city = form.value.city.trim() ? '' : 'City is required.';
  }
  if (name === 'state') {
    next.state = form.value.state.trim() ? '' : 'State is required.';
  }
  if (name === 'location') {
    next.location =
      form.value.latitude && form.value.longitude
        ? ''
        : mapStatus.value === 'unavailable'
          ? ''
          : 'Pin your location on the map (or use city/state estimate if map is unavailable).';
  }
  Object.keys(next).forEach((k) => {
    if (!next[k]) delete next[k];
  });
  fieldErrors.value = next;
  return !next[name];
};

const validateAll = () => {
  validateField('phone');
  validateField('street');
  validateField('city');
  validateField('state');
  if (mapStatus.value !== 'unavailable') validateField('location');
  return Object.keys(fieldErrors.value).length === 0;
};

const clearSavedSelection = () => {
  selectedAddressId.value = null;
};

const selectAddress = (addr) => {
  selectedAddressId.value = addr.id;
  const parts = (addr.fullAddress || '').split(',').map((s) => s.trim()).filter(Boolean);
  form.value.street = parts[0] || addr.fullAddress || '';
  form.value.city = parts[1] || form.value.city || '';
  form.value.state = parts[2] || form.value.state || '';
  form.value.country = form.value.country || 'Nigeria';
  if (addr.fullAddress && mapSearchInput.value) {
    mapSearchInput.value.value = addr.fullAddress;
  }
  addressConfirm.value = addr.fullAddress || '';
  persistDraft();
};

const setFeeOk = (fee, meta = {}) => {
  const n = Number(fee);
  if (!Number.isFinite(n) || n < 0) {
    setFeeQuote('Delivery fee could not be determined for this location.');
    return;
  }
  deliveryFee.value = n;
  feeStatus.value = 'ok';
  feeMessage.value = n === 0 ? 'Free delivery for this location.' : `Delivery fee calculated: ₦${formatMoney(n)}.`;
  if (meta.company_name) closestPartner.value = meta.company_name;
  if (meta.distance != null) shippingDistance.value = meta.distance;
  persistDraft();
};

const setFeeQuote = (msg) => {
  deliveryFee.value = null;
  feeStatus.value = 'quote_required';
  feeMessage.value =
    msg ||
    'Automatic delivery pricing is unavailable for this location. Contact support for a quotation before paying.';
  persistDraft();
};

const setFeeError = (msg) => {
  deliveryFee.value = null;
  feeStatus.value = 'error';
  feeMessage.value = msg || 'Could not calculate delivery fee. Try again or adjust the pin.';
  persistDraft();
};

const updateDeliveryFeeAndCoords = async (lat, lng, opts = {}) => {
  if (lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
    form.value.latitude = parseFloat(lat);
    form.value.longitude = parseFloat(lng);
  }
  feeStatus.value = 'loading';
  feeMessage.value = 'Calculating delivery fee…';
  fieldErrors.value = { ...fieldErrors.value };
  delete fieldErrors.value.location;

  try {
    const token = localStorage.getItem('token');
    const body = {
      city: form.value.city,
      state: form.value.state,
      country: form.value.country,
      street: form.value.street
    };
    if (form.value.latitude != null && form.value.longitude != null) {
      body.latitude = form.value.latitude;
      body.longitude = form.value.longitude;
    }
    const res = await fetch(apiUrl('/api/user/calculate-shipping'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.quote_required || data.requires_quote) {
        setFeeQuote(data.message);
        return;
      }
      const fee = data.delivery_fee ?? data.fee ?? data.amount;
      setFeeOk(fee, data);
      if (opts.formatted_address) addressConfirm.value = opts.formatted_address;
      return;
    }

    if (res.status === 404 || res.status === 501) {
      setFeeQuote('Shipping calculator is not available yet for this location.');
      return;
    }

    const errBody = await res.json().catch(() => ({}));
    setFeeError(errBody.message || `Shipping request failed (${res.status}).`);
  } catch (err) {
    console.error('Failed to calculate shipping fee', err);
    setFeeError('Network error while calculating delivery fee.');
  }
};

const requestFeeWithoutPin = async () => {
  if (!form.value.city.trim() || !form.value.state.trim()) {
    fieldErrors.value = {
      ...fieldErrors.value,
      city: form.value.city.trim() ? undefined : 'City is required for an estimate.',
      state: form.value.state.trim() ? undefined : 'State is required for an estimate.'
    };
    Object.keys(fieldErrors.value).forEach((k) => {
      if (!fieldErrors.value[k]) delete fieldErrors.value[k];
    });
    return;
  }
  // Do not invent coordinates — ask API using city/state (and street) only
  form.value.latitude = null;
  form.value.longitude = null;
  await updateDeliveryFeeAndCoords(null, null, {
    formatted_address: [form.value.street, form.value.city, form.value.state]
      .filter(Boolean)
      .join(', ')
  });
};

const initCheckoutMap = () => {
  if (!mapContainer.value || !window.google?.maps) {
    mapStatus.value = 'unavailable';
    return;
  }

  try {
    const initialCenter = { lat: 9.082, lng: 8.6753 };
    map.value = new google.maps.Map(mapContainer.value, {
      center: initialCenter,
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    map.value.addListener('click', (event) => {
      setPinPosition(event.latLng.lat(), event.latLng.lng());
    });

    if (mapSearchInput.value && google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(mapSearchInput.value, {
        componentRestrictions: { country: 'ng' },
        fields: ['geometry', 'formatted_address', 'address_components']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place?.geometry?.location) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        if (place.formatted_address) {
          form.value.street = form.value.street || place.formatted_address;
          addressConfirm.value = place.formatted_address;
          const comps = place.address_components || [];
          const find = (type) => comps.find((c) => c.types.includes(type))?.long_name;
          form.value.city = find('locality') || find('administrative_area_level_2') || form.value.city;
          form.value.state = find('administrative_area_level_1') || form.value.state;
          form.value.country = find('country') || form.value.country || 'Nigeria';
          form.value.postalCode = find('postal_code') || form.value.postalCode;
        }
        setPinPosition(lat, lng, { formatted_address: place.formatted_address });
        map.value.setZoom(15);
      });
    }

    mapStatus.value = 'ready';

    if (form.value.latitude && form.value.longitude) {
      setPinPosition(form.value.latitude, form.value.longitude, {
        formatted_address: addressConfirm.value,
        skipFee: feeStatus.value === 'ok'
      });
    }
  } catch (err) {
    console.error('Map init failed', err);
    mapStatus.value = 'unavailable';
  }
};

const setPinPosition = (lat, lng, opts = {}) => {
  if (!map.value) {
    form.value.latitude = parseFloat(lat);
    form.value.longitude = parseFloat(lng);
    if (!opts.skipFee) updateDeliveryFeeAndCoords(lat, lng, opts);
    return;
  }
  const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };

  if (!marker.value) {
    marker.value = new google.maps.Marker({
      position: pos,
      map: map.value,
      draggable: true
    });
    marker.value.addListener('dragend', () => {
      const currentPos = marker.value.getPosition();
      updateDeliveryFeeAndCoords(currentPos.lat(), currentPos.lng());
    });
  } else {
    marker.value.setPosition(pos);
  }

  map.value.panTo(pos);
  if (!opts.skipFee) updateDeliveryFeeAndCoords(lat, lng, opts);
  else {
    form.value.latitude = pos.lat;
    form.value.longitude = pos.lng;
  }
};

const loadGoogleMaps = () => {
  if (window.google?.maps?.places) {
    mapStatus.value = 'loading';
    nextTick(() => initCheckoutMap());
    return;
  }

  if (!mapsKeyConfigured) {
    mapStatus.value = 'unavailable';
    return;
  }

  mapStatus.value = 'loading';
  const existing = document.querySelector('script[data-checkout-maps="1"]');
  if (existing) {
    existing.addEventListener('load', () => initCheckoutMap());
    existing.addEventListener('error', () => {
      mapStatus.value = 'unavailable';
    });
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(env.googleMapsApiKey)}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.dataset.checkoutMaps = '1';
  script.onload = () => initCheckoutMap();
  script.onerror = () => {
    mapStatus.value = 'unavailable';
  };
  document.head.appendChild(script);
};

const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login?redirect=/checkout');
    return;
  }

  try {
    const res = await fetch(apiUrl('/api/user/profile'), {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      savedAddresses.value = data.addresses || [];
      if (!form.value.phone) form.value.phone = data.user?.phone || '';

      const draft = loadCheckoutDraft();
      if (draft?.form) {
        form.value = { ...form.value, ...draft.form, country: draft.form.country || 'Nigeria' };
        if (draft.addressConfirm) addressConfirm.value = draft.addressConfirm;
        if (draft.feeStatus === 'ok' && draft.deliveryFee != null) {
          deliveryFee.value = Number(draft.deliveryFee);
          feeStatus.value = 'ok';
        }
      } else {
        const defaultAddr = savedAddresses.value.find((a) => a.isDefault) || savedAddresses.value[0];
        if (defaultAddr) selectAddress(defaultAddr);
      }
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  } finally {
    loadingProfile.value = false;
  }
};

const processCheckout = async () => {
  error.value = '';
  if (!validateAll()) {
    error.value = 'Please fix the highlighted delivery fields.';
    return;
  }

  if (feeStatus.value !== 'ok' || deliveryFee.value === null) {
    error.value =
      feeStatus.value === 'quote_required'
        ? 'Delivery needs a quotation for this location. Contact support before paying.'
        : 'Pin your delivery location so we can calculate the delivery fee.';
    return;
  }

  if (!isPaystackConfigured()) {
    error.value = 'Online payment is temporarily unavailable. Please try again later.';
    if (env.isDev) {
      console.warn('[checkout] Paystack not configured', publicConfigSnapshot());
    }
    return;
  }

  isProcessing.value = true;
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const { default: marketplaceService } = await import('@/services/marketplace.service');
      const validation = await marketplaceService.validateCart(cartItems.value);
      if (validation.available && validation.data?.invalid?.length) {
        const msg = validation.data.invalid
          .map((i) => i.message || `${i.id}: unavailable`)
          .join('; ');
        throw new Error(msg || 'Some cart items failed stock or price validation.');
      }
      if (validation.available && validation.data?.items) {
        validation.data.items.forEach((line) => {
          const item = cartItems.value.find((c) => c.id === line.id);
          if (item && line.price != null) item.price = Number(line.price);
          if (item && line.stock != null) item.stock = Number(line.stock);
        });
      }
    } catch (valErr) {
      if (valErr.message && !valErr.response) throw valErr;
      if (valErr.response && valErr.response.status !== 404) {
        throw new Error(valErr.response.data?.message || 'Cart validation failed');
      }
    }

    const token = localStorage.getItem('token');
    const street =
      form.value.street.trim() ||
      (mapSearchInput.value && mapSearchInput.value.value) ||
      '';

    const checkoutRes = await fetch(apiUrl('/api/user/checkout'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cartItems.value.map((item) => ({ id: item.id, quantity: item.quantity })),
        delivery_street: street,
        delivery_city: form.value.city.trim(),
        delivery_state: form.value.state.trim(),
        delivery_country: form.value.country.trim() || 'Nigeria',
        delivery_postal_code: form.value.postalCode,
        contact_phone: form.value.phone.trim(),
        latitude: form.value.latitude,
        longitude: form.value.longitude,
        delivery_fee: deliveryFee.value
      })
    });

    if (!checkoutRes.ok) {
      const errBody = await checkoutRes.json().catch(() => ({}));
      throw new Error(errBody.message || 'Failed to create order');
    }

    const orderData = await checkoutRes.json();
    const orderId = orderData.orderId || orderData.order_id || orderData.id;
    const amountNaira =
      orderData.total ?? orderData.total_amount ?? orderData.amount ?? grandTotal.value;

    // Never trust a lower client total — use server amount when present
    const payAmount = Number(amountNaira);
    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      throw new Error('Invalid order total returned by server.');
    }

    await openPaystackPopup({
      email: user.email,
      amountNaira: payAmount,
      reference: orderData.payment_reference || undefined,
      metadata: {
        order_id: orderId,
        custom_fields: [
          { display_name: 'Order ID', variable_name: 'order_id', value: String(orderId) }
        ]
      },
      onSuccess: (response) => {
        verifyPayment(response, orderId);
      },
      onClose: () => {
        isProcessing.value = false;
        error.value = 'Payment window closed. Your order is pending payment — you can try again.';
      }
    });
  } catch (err) {
    error.value = err.message || 'An error occurred during checkout.';
    isProcessing.value = false;
  }
};

const verifyPayment = async (response, orderId) => {
  try {
    await userService.verifyPayment(response.reference, orderId);
    cartItems.value.forEach((item) => removeFromCart(item.id));
    clearCheckoutDraft();
    router.push({ path: '/order-success', query: { ref: response.reference, order: orderId } });
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      `Payment could not be verified yet. Keep this Paystack reference: ${response.reference}. Contact support if your bank was charged.`;
    isProcessing.value = false;
  }
};

onMounted(async () => {
  await fetchProfile();
  await nextTick();
  loadGoogleMaps();
});
</script>

<style scoped>
.checkout-page {
  --co-pad: clamp(1rem, 4vw, 1.5rem);
  padding: calc(5.5rem + env(safe-area-inset-top, 0px)) 0
    calc(5.5rem + env(safe-area-inset-bottom, 0px));
  min-height: 100svh;
  background: var(--bg-primary, #faf9f7);
  color: var(--text-primary);
  overflow-x: clip;
}

.checkout-container {
  max-width: 1100px;
  margin: 0 auto;
  padding-inline: var(--co-pad);
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0 0 0.35rem;
  font-family: var(--font-display, Georgia, serif);
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.page-sub {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.98rem;
  line-height: 1.5;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}

@media (min-width: 992px) {
  .checkout-layout {
    grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    gap: 1.5rem;
  }
  .order-summary-section {
    position: sticky;
    top: calc(5.5rem + env(safe-area-inset-top, 0px));
  }
}

.glass-card {
  background: var(--bg-secondary, #fff);
  border-radius: var(--radius-lg, 16px);
  padding: clamp(1.15rem, 3vw, 1.75rem);
  border: 1px solid var(--border-color, #e8e4de);
  box-shadow: none;
  min-width: 0;
}

.section-title {
  margin: 0 0 1.15rem;
  font-size: clamp(1.15rem, 2.5vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0 0 0.85rem;
  font-size: 1rem;
  font-weight: 700;
}

.req {
  color: var(--color-primary, #ff7600);
}

.optional {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.85em;
}

.loading-state,
.empty-cart,
.empty-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--text-secondary);
}

.loader {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary, #ff7600);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loader-sm {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  margin-right: 0.4rem;
  vertical-align: -0.15em;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.address-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.address-card {
  text-align: left;
  border: 1.5px solid var(--border-color);
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  background: var(--bg-primary, #faf9f7);
  color: inherit;
  font: inherit;
  min-height: 44px;
  transition: border-color 0.2s ease;
}

.address-card:hover,
.address-card.selected {
  border-color: var(--color-primary, #ff7600);
}

.addr-type {
  font-weight: 700;
  font-size: 0.85rem;
  margin: 0 0 0.25rem;
}

.addr-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.text-btn {
  background: none;
  border: none;
  color: var(--color-primary, #ff7600);
  font-weight: 600;
  cursor: pointer;
  padding: 0.35rem 0;
  min-height: 44px;
  font: inherit;
}

.form-group {
  margin-bottom: 1.1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  font-size: 0.88rem;
}

.form-input,
.map-search-input {
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-color);
  background: var(--bg-primary, #fff);
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 16px; /* prevent iOS Safari zoom */
  box-sizing: border-box;
}

.form-input:focus,
.map-search-input:focus {
  outline: none;
  border-color: var(--color-primary, #ff7600);
  box-shadow: 0 0 0 3px rgba(255, 118, 0, 0.15);
}

.form-input.is-invalid {
  border-color: #c2410c;
}

.field-error {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: #c2410c;
  line-height: 1.4;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

@media (max-width: 560px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.field-note {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 0.65rem;
  display: block;
  line-height: 1.45;
}

.map-fallback {
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md, 12px);
  border: 1px dashed var(--border-color);
  background: var(--bg-primary);
  margin-bottom: 0.75rem;
}

.map-fallback p {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.checkout-map-wrapper {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.checkout-map-container {
  height: min(42vw, 280px);
  min-height: 220px;
  width: 100%;
  background: var(--bg-secondary);
}

.map-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(250, 249, 247, 0.72);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.coords-display {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  font-size: 0.85rem;
}

.coords-badge {
  font-family: ui-monospace, monospace;
  background: rgba(255, 118, 0, 0.08);
  color: var(--color-primary, #ff7600);
  border: 1px solid rgba(255, 118, 0, 0.2);
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.75rem;
}

.address-confirm,
.closest-partner-info {
  color: var(--text-secondary);
  overflow-wrap: anywhere;
}

.fee-message {
  margin: 0.55rem 0 0;
  font-size: 0.85rem;
  line-height: 1.45;
}

.fee-message--ok {
  color: #15803d;
}
.fee-message--quote_required,
.fee-message--error,
.fee-message--need_pin {
  color: #9a3412;
}
.fee-message--loading {
  color: var(--text-secondary);
}

.items-preview {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.summary-item {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 0.65rem;
  align-items: start;
}

.summary-thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  display: grid;
  place-items: center;
}

.summary-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-fallback {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
}

.summary-meta {
  min-width: 0;
}

.summary-meta .name {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.meta-line {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.summary-item .price {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  font-size: 0.9rem;
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1.15rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
  font-size: 0.95rem;
}

.summary-row .muted,
.muted {
  color: var(--text-secondary);
  font-weight: 500;
  text-align: right;
}

.total-row {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: var(--font-main);
  cursor: pointer;
  text-decoration: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}

.primary-btn {
  background: var(--color-primary, #ff7600);
  color: #fff;
  width: 100%;
  margin-top: 1rem;
}

.primary-btn:hover:not(:disabled) {
  filter: brightness(1.05);
}

.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: none;
}

.primary-btn.is-loading {
  opacity: 0.85;
}

.secondary-btn {
  background: transparent;
  color: var(--color-primary, #ff7600);
  border: 1.5px solid var(--color-primary, #ff7600);
  width: 100%;
}

.pay-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.85rem 0 0.5rem;
}

.pay-method-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.55rem;
  border-radius: 2px;
  border: 1px solid var(--border-color, #e5e2dc);
  background: var(--bg-secondary, #f3f1ec);
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: var(--text-secondary, #5c574f);
}

.pay-channels-note {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0.85rem 0 0;
}

.config-banner {
  margin-top: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(194, 65, 12, 0.25);
  background: rgba(255, 237, 213, 0.65);
  color: #9a3412;
  font-size: 0.82rem;
  line-height: 1.5;
}

.config-banner strong {
  display: block;
  margin-bottom: 0.35rem;
}

.config-banner code {
  font-size: 0.78em;
  word-break: break-all;
}

.customer-pay-notice {
  margin: 0.85rem 0 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.error-msg {
  margin: 0.75rem 0 0;
  color: #c2410c;
  font-size: 0.88rem;
  line-height: 1.45;
  text-align: left;
}

@media (max-width: 992px) {
  .checkout-page {
    padding-bottom: calc(6.5rem + env(safe-area-inset-bottom, 0px));
  }
}
</style>
