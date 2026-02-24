/**
 * Domain-based branding config for multi-domain PWA.
 * Seattle and LA domains get different app names and icons.
 */

export type BrandingVariant = 'seattle' | 'la';

export interface BrandingConfig {
  variant: BrandingVariant;
  name: string;
  shortName: string;
  icons: {
    '180': string;
    '192': string;
    '512': string;
  };
  appleTouchIcons: Array<{ url: string; sizes: string }>;
}

const SEATTLE_DOMAINS = (
  process.env.NEXT_PUBLIC_SEATTLE_DOMAINS ?? 'seattle-domain.com,www.seattle-domain.com'
).split(',').map((d) => d.trim().toLowerCase());

const LA_DOMAINS = (
  process.env.NEXT_PUBLIC_LA_DOMAINS ?? 'la-domain.com,www.la-domain.com'
).split(',').map((d) => d.trim().toLowerCase());

export function getBrandingFromHost(host: string): BrandingConfig {
  const hostLower = host.split(':')[0].toLowerCase();

  if (SEATTLE_DOMAINS.some((d) => hostLower === d || hostLower.endsWith('.' + d))) {
    return SEATTLE_BRANDING;
  }
  if (LA_DOMAINS.some((d) => hostLower === d || hostLower.endsWith('.' + d))) {
    return LA_BRANDING;
  }

  return LA_BRANDING;
}

const SEATTLE_BRANDING: BrandingConfig = {
  variant: 'seattle',
  name: '360 House Viewer - Seattle',
  shortName: '360 Seattle',
  icons: {
    '180': '/icons/sea-180.png',
    '192': '/icons/sea-192.png',
    '512': '/icons/sea-512.png',
  },
  appleTouchIcons: [
    { url: '/icons/sea-180.png', sizes: '180x180' },
  ],
};

const LA_BRANDING: BrandingConfig = {
  variant: 'la',
  name: '360 House Viewer - LA',
  shortName: '360 LA',
  icons: {
    '180': '/icons/la-180.png',
    '192': '/icons/la-192.png',
    '512': '/icons/la-512.png',
  },
  appleTouchIcons: [
    { url: '/icons/la-180.png', sizes: '180x180' },
  ],
};

export function getManifestIcons(branding: BrandingConfig): Array<{
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}> {
  return [
    { src: branding.icons['180'], sizes: '180x180', type: 'image/png' },
    { src: branding.icons['192'], sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
    { src: branding.icons['512'], sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ];
}
