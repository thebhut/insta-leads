import { MetadataRoute } from 'next';
import { CITIES, NICHES } from '@/lib/pSEO';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://instaleads.app'; // Replace with your actual production URL

  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  const hubPages: MetadataRoute.Sitemap = [];
  
  // Add City Hubs
  for (const city of CITIES) {
    hubPages.push({
      url: `${baseUrl}/leads/${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Add Niche Hubs
  for (const niche of NICHES) {
    hubPages.push({
      url: `${baseUrl}/leads/niche/${niche}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Add Viral Reports
  const reportPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/reports/top-us-cities-without-websites`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95, // High priority for viral datasets
    }
  ];

  // Generate the programmatic SEO URLs dynamically
  const programmaticPages: MetadataRoute.Sitemap = [];
  
  // STRATEGY: Gradual Indexing Rollout
  // TEMPORARY FIX: Reducing to 3 cities and 3 niches to stay under Hostinger's 1-hour FTP timeout
  const crawlCities = CITIES.slice(0, 3);
  const crawlNiches = NICHES.slice(0, 3);

  for (const city of crawlCities) {
    for (const niche of crawlNiches) {
      // 1. Missing Website Leads
      programmaticPages.push({
        url: `${baseUrl}/leads/${city}/${niche}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });

      // 2. Broad Local Directory
      programmaticPages.push({
        url: `${baseUrl}/directory/${city}/${niche}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      // 3. Trending & Viral Data
      programmaticPages.push({
        url: `${baseUrl}/trends/${city}/${niche}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  return [...defaultPages, ...reportPages, ...hubPages, ...programmaticPages];
}
