const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const { randomDelay } = require('../utils/helpers');

const BANNED_USERNAMES = new Set([
    'popular', 'p', 'reel', 'reels', 'explore', 'stories',
    'accounts', 'tv', 'about', 'blog', 'jobs', 'api', 'privacy',
    'legal', 'directory', 'hashtag', 'location', 'shoppingbag',
]);

/**
 * Parse a clean Instagram username from a cite text.
 * Handles: "https://www.instagram.com › username"
 */
function parseUsernameFromCite(cite) {
    // First try: extract from URL format
    const urlMatch = cite.match(/instagram\.com\/([a-zA-Z0-9._]{1,30})\/?/);
    if (urlMatch) {
        const username = urlMatch[1];
        if (!BANNED_USERNAMES.has(username.toLowerCase())) return username;
    }

    // Second try: breadcrumb format
    const segments = cite.split(/[›>\/]/).map(s => s.trim()).filter(Boolean);
    const igIdx = segments.findIndex(s => s.toLowerCase().includes('instagram.com') || s.toLowerCase() === 'instagram');
    if (igIdx === -1) return null;

    const afterIG = segments.slice(igIdx + 1);
    if (afterIG.length === 0) return null;

    let username = null;

    if (afterIG.length >= 1) {
        const first = afterIG[0].split('?')[0].trim();
        const last = afterIG[afterIG.length - 1].split('?')[0].trim();

        const subPages = ['stories', 'reel', 'reels', 'tv', 'p', 'explore'];
        if (subPages.includes(first.toLowerCase())) {
            username = last;
        } else {
            username = first;
        }
    }

    if (!username) return null;
    if (BANNED_USERNAMES.has(username.toLowerCase())) return null;
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) return null;

    return username;
}

/**
 * Try multiple Bing search queries and return all unique Instagram usernames found.
 */
async function searchViaBing(page, businessName, city) {
    const cleanName = businessName.split('|')[0].split(' - ')[0].trim();
    const cityStr = city ? city : '';

    // Try multiple query strategies (More aggressive for Indian businesses)
    const queries = [
        `"${cleanName}" ${cityStr} site:instagram.com`,
        `${cleanName} ${cityStr} instagram official`,
        `${cleanName} ${cityStr} business instagram`,
        `${cleanName} ${cityStr} IG profile`,
    ];

    const allCandidates = [];
    const seenUsernames = new Set();

    for (const q of queries) {
        if (allCandidates.length >= 8) break;

        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(q)}&mkt=en-IN`;

        try {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await randomDelay(800, 1500);
        } catch (e) {
            console.log(`  ⚠ Bing navigate failed for query: ${q}`);
            continue;
        }

        const resultsLoaded = await page.waitForSelector('#b_results li.b_algo', { timeout: 10000 })
            .then(() => true).catch(() => false);

        if (!resultsLoaded) {
            console.log(`  ⚠ Bing results not loaded for: "${q}"`);
            continue;
        }

        const results = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('#b_results li.b_algo'));
            return items.map(item => {
                const titleEl = item.querySelector('h2 a');
                const citeEl = item.querySelector('cite');
                const hrefEl = item.querySelector('h2 a');
                return {
                    title: titleEl ? titleEl.innerText.trim() : '',
                    cite: citeEl ? citeEl.innerText.trim() : '',
                    href: hrefEl ? hrefEl.href : '',
                };
            }).filter(r =>
                r.cite.toLowerCase().includes('instagram.com') ||
                r.href.toLowerCase().includes('instagram.com')
            );
        });

        for (const result of results) {
            // Try to extract username from cite first, then from href
            let username = parseUsernameFromCite(result.cite);
            if (!username && result.href) {
                username = parseUsernameFromCite(result.href);
            }

            if (username && !seenUsernames.has(username.toLowerCase())) {
                seenUsernames.add(username.toLowerCase());
                allCandidates.push(`https://www.instagram.com/${username}/`);
            }
        }

        await randomDelay(500, 1000);
    }

    return allCandidates;
}

/**
 * Try Google search as a fallback to find Instagram profile.
 */
async function searchViaGoogle(page, businessName, city) {
    const cleanName = businessName.split('|')[0].split(' - ')[0].trim();
    const cityStr = city ? city : '';
    
    const queries = [
        `"${cleanName}" ${cityStr} instagram`,
        `${cleanName} ${cityStr} official instagram page`,
    ];

    const allCandidates = [];
    const seenUsernames = new Set();

    for (const q of queries) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;

        try {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await randomDelay(1000, 2000);

            const links = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a[href]'));
                return anchors
                    .map(a => a.href)
                    .filter(href => href && href.includes('instagram.com/'));
            });

            for (const href of links) {
                const username = parseUsernameFromCite(href);
                if (username && !seenUsernames.has(username.toLowerCase())) {
                    seenUsernames.add(username.toLowerCase());
                    allCandidates.push(`https://www.instagram.com/${username}/`);
                }
            }
        } catch (e) {
            console.log(`  ⚠ Google navigate failed for query: ${q}`);
        }
    }

    return allCandidates;
}

/**
 * Extract Instagram profile data from a profile page.
 * Returns null if login-walled or not found.
 * Returns partial data (username only) if we can confirm the profile exists.
 */
async function extractInstagramData(page, url) {
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await randomDelay(2000, 3000);
    } catch (e) {
        return null;
    }

    let username = null;
    try {
        const pathParts = new URL(url).pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) username = '@' + pathParts[0];
    } catch (e) {}

    // Check title — login wall shows plain "Instagram" or "Login" title
    const title = await page.title().catch(() => '');

    if (title === 'Instagram' || title.toLowerCase().includes('login') || title.toLowerCase().includes('log in')) {
        // Login walled — can't get details but username is still valid
        console.log(`  ⚠ Login wall detected for ${username}`);
        return { instagram_username: username, followers: null, bio: null, loginWalled: true };
    }

    if (title.includes("isn't available") || title.includes('Page Not Found') || title.includes('404')) {
        return null; // Profile doesn't exist
    }

    let followers = null;
    let bio = null;

    // Strategy 1: Meta description
    try {
        const desc = await page.evaluate(() => {
            const el = document.querySelector('meta[name="description"]');
            return el ? el.content : null;
        }).catch(() => null);

        if (desc) {
            // "315K Followers, 75 Following, 6,639 Posts - Name (@user) on Instagram: \"bio\""
            const fm = desc.match(/([\d,\.]+[KkMmBb]?)\s+Followers/i);
            if (fm) followers = fm[1];

            const bm = desc.match(/on Instagram[:\s]*["""'](.+?)["""']?\s*$/s);
            if (bm) bio = bm[1].replace(/\n/g, ' ').trim().substring(0, 300);

            // Also try simpler bio extraction if above failed
            if (!bio) {
                const bm2 = desc.match(/on Instagram:\s*(.+)/s);
                if (bm2) bio = bm2[1].replace(/\n/g, ' ').trim().substring(0, 300);
            }
        }
    } catch (e) {}

    // Strategy 2: Open Graph meta tags
    if (!followers || !bio) {
        try {
            const ogDesc = await page.evaluate(() => {
                const el = document.querySelector('meta[property="og:description"]');
                return el ? el.content : null;
            }).catch(() => null);

            if (ogDesc) {
                const fm = ogDesc.match(/([\d,\.]+[KkMmBb]?)\s+Followers/i);
                if (fm && !followers) followers = fm[1];

                const bm = ogDesc.match(/on Instagram[:\s]*["""'](.+?)["""']?\s*$/s);
                if (bm && !bio) bio = bm[1].replace(/\n/g, ' ').trim().substring(0, 300);
            }
        } catch (e) {}
    }

    // Strategy 3: Try JSON-LD or window._sharedData
    if (!followers || !bio) {
        try {
            const sharedData = await page.evaluate(() => {
                const scripts = Array.from(document.querySelectorAll('script'));
                for (const s of scripts) {
                    if (s.textContent && s.textContent.includes('edge_followed_by')) {
                        try {
                            const match = s.textContent.match(/"edge_followed_by":\{"count":(\d+)\}/);
                            const bioMatch = s.textContent.match(/"biography":"([^"]+)"/);
                            return {
                                followers: match ? match[1] : null,
                                bio: bioMatch ? bioMatch[1] : null,
                            };
                        } catch (e) {}
                    }
                }
                return null;
            }).catch(() => null);

            if (sharedData) {
                if (sharedData.followers && !followers) {
                    const f = parseInt(sharedData.followers);
                    if (f >= 1000000) followers = (f / 1000000).toFixed(1) + 'M';
                    else if (f >= 1000) followers = (f / 1000).toFixed(1) + 'K';
                    else followers = String(f);
                }
                if (sharedData.bio && !bio) bio = sharedData.bio.substring(0, 300);
            }
        } catch (e) {}
    }

    return { instagram_username: username, followers: followers || null, bio: bio || null, loginWalled: false };
}

async function scrapeInstagram(businessName, city) {
    let browser = null;
    const empty = { instagram_username: null, followers: null, bio: null };

    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            locale: 'en-US',
            viewport: { width: 1366, height: 768 },
        });
        const page = await context.newPage();

        console.log(`\n🔍 Searching IG for: "${businessName}"`);

        // Small random delay to avoid hitting Bing simultaneously
        await randomDelay(300, 1500);

        // Step 1: Search via Bing (multi-query strategy)
        let candidates = await searchViaBing(page, businessName, city);

        // Step 2: If Bing found nothing, try Google
        if (candidates.length === 0) {
            console.log(`  🔄 Bing found nothing — trying Google...`);
            candidates = await searchViaGoogle(page, businessName, city);
        }

        if (candidates.length === 0) {
            console.log(`  ❌ No IG candidates found for "${businessName}"`);
            return empty;
        }

        console.log(`  → ${candidates.length} candidate(s): ${candidates.map(u => u.split('/')[3]).map(u => '@' + u).join(', ')}`);

        // Step 3: Try each candidate until we find a non-login-walled profile
        let bestResult = null;

        for (const url of candidates) {
            const result = await extractInstagramData(page, url);

            if (!result) {
                console.log(`  ✗ @${url.split('/')[3]} — profile not found`);
                await randomDelay(800, 1200);
                continue;
            }

            if (result.loginWalled) {
                // Store as fallback but keep trying
                if (!bestResult) {
                    bestResult = { instagram_username: result.instagram_username, followers: null, bio: null };
                }
                console.log(`  ⚠ @${url.split('/')[3]} — login-walled, trying next...`);
                await randomDelay(800, 1200);
                continue;
            }

            // Got full data!
            console.log(`  ✅ @${result.instagram_username} | ${result.followers || '?'} followers`);
            return { instagram_username: result.instagram_username, followers: result.followers, bio: result.bio };
        }

        // Return best partial result if all login-walled
        if (bestResult) {
            console.log(`  ⚠ All login-walled. Returning username: ${bestResult.instagram_username}`);
            return bestResult;
        }

        return empty;

    } catch (e) {
        console.error(`  ❌ Error for "${businessName}":`, e.message);
        return empty;
    } finally {
        if (browser) await browser.close().catch(() => {});
    }
}

module.exports = { scrapeInstagram };
