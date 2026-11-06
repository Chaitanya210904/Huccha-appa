/**
 * Offline-safe unique ID generator
 */

export function generateId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomPart}`;
}

export function generateReceiptNumber(seq = 1) {
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(4, '0');
  return `REC-${year}-${padded}`;
}

