/**
 * Shared validation helpers (backend).
 * Using the WHATWG URL parser instead of a hand-written regex avoids
 * catastrophic-backtracking (ReDoS) risks and accepts every valid link.
 */

/**
 * Check that a string is a valid http(s) URL with a real hostname.
 * @param {string} value
 * @returns {boolean}
 */
export const isValidHttpUrl = (value) => {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname.includes('.')
    );
  } catch {
    return false;
  }
};

/**
 * Escape user-supplied text before placing it inside an HTML email.
 * @param {unknown} value
 * @returns {string}
 */
export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
