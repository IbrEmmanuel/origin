/**
 * Shared API / auth error message helpers for UI surfaces.
 */

export function getAuthErrorMessage(err, fallback = 'Login failed. Please check your credentials.') {
  if (!err) return fallback;

  if (!err.response) {
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      return 'Cannot reach the API (network/CORS). Use VITE_API_URL=/api with the Vite proxy for local dev, or ask the host to allow CORS from this site on api.originelectricltd.com.';
    }
    if (err.code === 'ECONNABORTED') {
      return 'The server took too long to respond. Please try again.';
    }
    return err.message || fallback;
  }

  const data = err.response.data;
  if (typeof data === 'string' && data.trim()) {
    if (data.includes('<!DOCTYPE') || data.includes('<html')) {
      return 'Cannot reach the server. Please try again in a moment.';
    }
    return data;
  }

  if (data?.message || data?.error) {
    const msg = data.message || data.error;
    if (/imunify|bot-protection|whitelist/i.test(msg)) {
      return 'The API host is still blocking this request (Imunify360). In cPanel/Imunify360: whitelist your IP, or disable bot-protection for api.originelectricltd.com /api/auth/*. Also allow CORS for your site origin.';
    }
    return msg;
  }

  if (err.response.status === 403) {
    return 'The API returned 403 (host firewall). Whitelist your IP in Imunify360 or disable bot-protection on /api/auth/* — this is not an invalid password.';
  }

  if (err.response.status >= 500) {
    return 'Server error. Please try again in a moment.';
  }

  return fallback;
}

export function getApiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return getAuthErrorMessage(err, fallback);
}
