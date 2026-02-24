import { NextRequest } from 'next/server';
import { getBrandingFromHost, getManifestIcons } from '@/lib/domain-branding';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const host =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    '';

  const branding = getBrandingFromHost(host);
  const icons = getManifestIcons(branding);

  const manifest = {
    name: branding.name,
    short_name: branding.shortName,
    description: 'Interactive 360-degree viewer for virtual tours of Accessory Dwelling Units',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#3730a3',
    categories: ['productivity', 'utilities', 'business'],
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
    icons,
  };

  return new Response(JSON.stringify(manifest), {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      'Vary': 'Host',
    },
  });
}
