const { scrapeGoogleMaps } = require('../scrapers/googleMaps');
const { scrapeInstagram } = require('../scrapers/instagram');
const pLimit = require('p-limit').default || require('p-limit');

async function processSearch(query) {
    console.log(`\n===== Starting search: "${query}" =====`);
    
    // 1. Scrape Google Maps — now targets up to 40 businesses
    const businesses = await scrapeGoogleMaps(query);
    console.log(`Found ${businesses.length} businesses to process for Instagram`);

    if (businesses.length === 0) {
        return [];
    }

    // 2. Extract city/location from the query for better IG search
    let city = '';
    const queryLower = query.toLowerCase();
    if (queryLower.includes(' in ')) {
        city = query.split(/ in /i).pop().trim();
    } else if (queryLower.includes(' near ')) {
        city = query.split(/ near /i).pop().trim();
    } else {
        // Try to use last meaningful word as city hint
        const words = query.trim().split(/\s+/);
        if (words.length >= 2) city = words[words.length - 1];
    }

    console.log(`Extracted city hint: "${city}"`);

    // 3. Process Instagram lookups with concurrency=2
    //    (sequential was too slow; 2 is safe enough to avoid Bing blocks)
    const limit = pLimit(2);

    const enrichPromises = businesses.map(business =>
        limit(async () => {
            try {
                const igData = await scrapeInstagram(business.business_name, city || business.address);
                return { ...business, ...igData };
            } catch (e) {
                console.error(`Failed IG lookup for "${business.business_name}":`, e.message);
                return { ...business, instagram_username: null, followers: null, bio: null };
            }
        })
    );

    const enrichedBusinesses = await Promise.all(enrichPromises);

    // 4. Sort: businesses with full IG data first, then username-only, then none
    enrichedBusinesses.sort((a, b) => {
        const scoreA = a.instagram_username ? (a.followers ? 2 : 1) : 0;
        const scoreB = b.instagram_username ? (b.followers ? 2 : 1) : 0;
        return scoreB - scoreA;
    });

    console.log(`\n===== Done! Returning ${enrichedBusinesses.length} results =====\n`);
    return enrichedBusinesses;
}

module.exports = { processSearch };
