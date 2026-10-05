import type { MetadataRoute } from 'next';
import { ACTIVITIES } from '@/content/activities';
import { CLAIMS } from '@/content/evidence';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://focuslab.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/check',
    '/focus',
    '/activities',
    '/experiments',
    '/insights',
    '/sounds',
    '/learn',
    '/learn/myths',
    '/learn/how-we-rate',
    '/about',
    '/privacy',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const activityRoutes: MetadataRoute.Sitemap = ACTIVITIES.map((activity) => ({
    url: `${baseUrl}/activities/${activity.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const claimRoutes: MetadataRoute.Sitemap = CLAIMS.map((claim) => ({
    url: `${baseUrl}/learn/${claim.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...activityRoutes, ...claimRoutes];
}
