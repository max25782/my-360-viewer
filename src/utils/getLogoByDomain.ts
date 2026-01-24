/**
 * Domain-based logo configuration utility
 * Supports multiple domains with different logos, works in SSR and PWA
 */

/**
 * Domain to logo mapping configuration
 * Add new domains here as needed
 */
const DOMAIN_LOGO_MAP: Record<string, string> = {
  'seattle-catalog.com': '/logo.png', // Seattle ADU logo
  'la-catalog.com': '/logos/logo-la.svg',
  'alpha-adu.com': '/logo2.png', // ALPHA DREAM CONSTRUCTION logo (PNG with transparent background)
  // Add more domains as needed:
  // 'portland-catalog.com': '/logos/logo-portland.svg',
};

/**
 * Default logo path (fallback)
 */
const DEFAULT_LOGO = '/Website.png';

/**
 * Get logo path based on current domain (client-side)
 * Safe for use in client components and PWA
 * 
 * For localhost testing:
 * - Use hosts file to map domains to 127.0.0.1
 * - Or use URL parameter: ?testDomain=seattle-catalog.com
 */
export function getLogoByDomain(): string {
  if (typeof window === 'undefined') {
    // SSR: return default logo
    return DEFAULT_LOGO;
  }

  let hostname = window.location.hostname;
  
  // Development mode: allow testing via URL parameter
  // Usage: http://localhost:3000?testDomain=seattle-catalog.com
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const urlParams = new URLSearchParams(window.location.search);
    const testDomain = urlParams.get('testDomain');
    if (testDomain) {
      hostname = testDomain;
    }
  }
  
  // Check exact match first
  if (hostname in DOMAIN_LOGO_MAP) {
    return DOMAIN_LOGO_MAP[hostname];
  }

  // Check for subdomain matches (e.g., www.seattle-catalog.com)
  const domainParts = hostname.split('.');
  if (domainParts.length >= 2) {
    const mainDomain = domainParts.slice(-2).join('.');
    if (mainDomain in DOMAIN_LOGO_MAP) {
      return DOMAIN_LOGO_MAP[mainDomain];
    }
  }

  // Fallback to default logo
  return DEFAULT_LOGO;
}

/**
 * Get logo path based on hostname (server-side)
 * Use this in Server Components, middleware, or API routes
 */
export function getLogoByHostname(hostname: string): string {
  // Check exact match first
  if (hostname in DOMAIN_LOGO_MAP) {
    return DOMAIN_LOGO_MAP[hostname];
  }

  // Check for subdomain matches
  const domainParts = hostname.split('.');
  if (domainParts.length >= 2) {
    const mainDomain = domainParts.slice(-2).join('.');
    if (mainDomain in DOMAIN_LOGO_MAP) {
      return DOMAIN_LOGO_MAP[mainDomain];
    }
  }

  // Fallback to default logo
  return DEFAULT_LOGO;
}

/**
 * Get logo alt text based on domain
 */
export function getLogoAltByDomain(): string {
  if (typeof window === 'undefined') {
    return 'Logo';
  }

  const hostname = window.location.hostname;
  
  // Map domains to alt text
  const altMap: Record<string, string> = {
    'seattle-catalog.com': 'Seattle ADU Logo',
    'la-catalog.com': 'LA ADU Logo',
    'alpha-adu.com': 'Alpha Dream Construction Logo',
  };

  const domainParts = hostname.split('.');
  const mainDomain = domainParts.length >= 2 
    ? domainParts.slice(-2).join('.')
    : hostname;

  return altMap[mainDomain] || altMap[hostname] || 'Logo';
}

/**
 * Get all configured domains (useful for debugging or admin panels)
 */
export function getConfiguredDomains(): string[] {
  return Object.keys(DOMAIN_LOGO_MAP);
}
