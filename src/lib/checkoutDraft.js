const DRAFT_KEY = 'originelectric_checkout_draft_v1';

/**
 * Persist delivery draft so recoverable payment failures don't wipe the form.
 * @param {object} draft
 */
export function saveCheckoutDraft(draft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * @returns {object|null}
 */
export function loadCheckoutDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch {
    return null;
  }
}

export function clearCheckoutDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
