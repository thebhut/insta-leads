// This file contains helpers for generating programmatic SEO content and pseudo-random data

export const CITIES = [
  'new-york', 'los-angeles', 'chicago', 'houston', 'phoenix', 
  'philadelphia', 'san-antonio', 'san-diego', 'dallas', 'austin',
  'jacksonville', 'san-jose', 'fort-worth', 'columbus', 'charlotte',
  'san-francisco', 'indianapolis', 'seattle', 'denver', 'washington',
  'boston', 'el-paso', 'nashville', 'detroit', 'oklahoma-city',
  'portland', 'las-vegas', 'memphis', 'louisville', 'baltimore'
];

export const NICHES = [
  'restaurants', 'gyms', 'salons', 'dentists', 'plumbers', 
  'roofers', 'spas', 'boutiques', 'mechanics', 'cafes',
  'landscapers', 'chiropractors', 'electricians', 'HVAC', 'bakeries',
  'lawyers', 'accountants', 'painters', 'cleaners', 'photographers'
];

export function formatTitle(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getSeededRandom(seedString: string) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getNicheData(city: string, niche: string) {
  const seed = `${city}-${niche}`.toLowerCase();
  const hash = getSeededRandom(seed);
  
  const totalFound = (hash % 800) + 150; 
  const noWebsitePercent = (hash % 40) + 30; 
  const missingWebsites = Math.floor(totalFound * (noWebsitePercent / 100));
  const avgFollowers = ((hash % 150) + 10) * 100; 
  const topFollowers = avgFollowers * ((hash % 5) + 3);
  const growthRate = (hash % 15) + 5; // e.g., growing at 12% MoM
  
  const opportunityScore = (hash % 3) + 8;
  const hoursAgo = (hash % 23) + 1;
  const newThisWeek = (hash % 40) + 5;

  const engagementPhrases = [
    `heavily rely on reels marketing`,
    `show unusually high Instagram engagement`,
    `use Instagram as their primary customer acquisition channel`,
    `are rapidly growing their local audience on social media`,
    `depend almost entirely on direct messages for bookings`
  ];
  const phrase = engagementPhrases[hash % engagementPhrases.length];

  return {
    isSimulated: true, // FLAG FOR UI TRANSPARENCY
    totalFound,
    missingWebsites,
    noWebsitePercent,
    avgFollowers,
    topFollowers,
    growthRate,
    opportunityScore,
    formattedFollowers: avgFollowers > 999 ? (avgFollowers/1000).toFixed(1) + 'k' : avgFollowers.toString(),
    formattedTopFollowers: topFollowers > 999 ? (topFollowers/1000).toFixed(1) + 'k' : topFollowers.toString(),
    hoursAgo,
    newThisWeek,
    microContent: `${formatTitle(city)} ${formatTitle(niche).toLowerCase()} ${phrase}.`
  };
}

export function getRandomItems(array: string[], count: number, exclude?: string) {
  const filtered = array.filter(item => item !== exclude);
  const sorted = [...filtered].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
  const shift = (exclude ? exclude.length : 0) % sorted.length;
  const shifted = [...sorted.slice(shift), ...sorted.slice(0, shift)];
  return shifted.slice(0, count);
}

// Generates directory and trend leads
export function getMockLeads(city: string, niche: string, count: number = 10, type: 'directory' | 'trending' | 'missing-website' = 'directory') {
  const seed = `${city}-${niche}-${type}`.toLowerCase();
  const hash = getSeededRandom(seed);
  const formattedCity = formatTitle(city);
  
  const adjectives = ['Premium', 'Elite', 'Local', 'Urban', 'Central', 'Sunset', 'Sunrise', 'Peak', 'Apex', 'Nova', 'Vital', 'Core'];
  const nouns = ['Studio', 'Hub', 'Collective', 'Spot', 'Corner', 'Lounge', 'Center', 'Works', 'Group', 'Space', 'Haus', 'Lab'];
  
  const leads = [];
  for (let i = 0; i < count; i++) {
    const localHash = hash + i;
    const adj = adjectives[localHash % adjectives.length];
    const noun = nouns[(localHash * 2) % nouns.length];
    
    const name = `${adj} ${formatTitle(niche)} ${noun}`;
    const handle = `@${adj.toLowerCase()}_${niche.toLowerCase()}_${formattedCity.toLowerCase().replace(' ', '')}`;
    
    // Sort followers high to low for directory/trending
    let followers = ((localHash % 100) + 20) * 100;
    if (type === 'trending') followers = followers * ((localHash % 3) + 2);
    
    const growth = (localHash % 20) + 2; // +X% growth

    leads.push({
      id: i,
      name,
      handle,
      followers,
      formattedFollowers: followers > 999 ? (followers/1000).toFixed(1) + 'k' : followers.toString(),
      growth: `+${growth}%`,
      hasWebsite: type === 'missing-website' ? false : (localHash % 2 === 0),
      isTrending: type === 'trending' || localHash % 5 === 0,
      isBlurred: type === 'missing-website' && i >= 2
    });
  }
  
  // Sort by followers for directory pages
  if (type === 'directory' || type === 'trending') {
    leads.sort((a, b) => b.followers - a.followers);
  }
  
  return { isSimulated: true, leads };
}
