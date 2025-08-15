/**
 * UNIVERSAL FORMATTERS
 * 🎯 Consistent formatting for SSR and client to avoid hydration mismatches
 */

/**
 * Format price consistently for both server and client
 * Avoids hydration mismatches from toLocaleString() differences
 */
export function formatPrice(price: number): string {
  // Use simple number formatting that's consistent across environments
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format square footage
 */
export function formatSqft(sqft: number): string {
  return sqft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency with dollar sign
 */
export function formatCurrency(amount: number): string {
  return `$${formatPrice(amount)}`;
}

/**
 * Format number with commas (universal)
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
