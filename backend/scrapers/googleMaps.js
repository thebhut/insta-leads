const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const { randomDelay } = require('../utils/helpers');

async function scrapeGoogleMaps(query) {
    let browser = null;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            locale: 'en-US',
        });
        const page = await context.newPage();

        console.log(`Searching Google Maps for: ${query}`);
        
        // Navigate directly to Google Maps search URL
        const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await randomDelay(3000, 4000);

        // The results list panel is a scrollable div. We need its selector.
        // Google Maps results are in a div with role="feed" or a specific class.
        const feedSelector = 'div[role="feed"]';
        await page.waitForSelector(feedSelector, { timeout: 15000 }).catch(() => {
            console.log('Feed panel not found, trying to proceed anyway.');
        });

        const businesses = [];
        const maxResults = 40; // Scrape up to 40 to ensure enough no-website leads
        let noNewResultsCount = 0;
        const maxNoNew = 8; // Try harder before giving up

        while (businesses.length < maxResults && noNewResultsCount < maxNoNew) {
            // Get all business card links currently visible
            const cards = await page.$$(`${feedSelector} a[href*="/maps/place/"]`);
            
            const prevCount = businesses.length;

            for (const card of cards) {
                if (businesses.length >= maxResults) break;

                // Get name from aria-label
                const name = await card.getAttribute('aria-label');
                if (!name || name === 'Results') continue;

                // Skip if we already have this business
                if (businesses.find(b => b.business_name === name)) continue;

                // Click the card to open details
                try {
                    await card.click();
                    await randomDelay(1800, 3000);

                    // Wait for detail panel to appear
                    await page.waitForSelector('button[data-item-id]', { timeout: 8000 }).catch(() => {});

                    // Extract details
                    const address = await page.locator('button[data-item-id="address"]').first().innerText({ timeout: 4000 }).catch(() => null);
                    const phone = await page.locator('button[data-item-id^="phone:tel:"]').first().innerText({ timeout: 4000 }).catch(() => null);
                    const website = await page.locator('a[data-item-id="authority"]').first().getAttribute('href', { timeout: 4000 }).catch(() => null);

                    businesses.push({
                        business_name: name.trim(),
                        phone: phone ? phone.trim() : null,
                        address: address ? address.trim() : null,
                        website: website || null,
                    });
                    console.log(`[${businesses.length}] Found: "${name}" | Phone: ${phone ? phone.trim() : 'N/A'} | Website: ${website ? 'YES' : 'NO'}`);
                } catch (err) {
                    console.log(`Skipping "${name}" due to click/extract error.`);
                }
            }

            if (businesses.length === prevCount) {
                noNewResultsCount++;
                // Scroll more aggressively if we're not finding new results
                await page.evaluate((sel) => {
                    const el = document.querySelector(sel);
                    if (el) el.scrollBy(0, 1200);
                }, feedSelector);
            } else {
                noNewResultsCount = 0;
                // Normal scroll
                await page.evaluate((sel) => {
                    const el = document.querySelector(sel);
                    if (el) el.scrollBy(0, 600);
                }, feedSelector);
            }
            await randomDelay(1500, 2500);
        }

        // Filter only businesses WITHOUT websites (these are the best leads)
        const filtered = businesses.filter(b => !b.website);
        console.log(`Total scraped: ${businesses.length}, Without website: ${filtered.length}`);
        
        // If we got very few no-website results, also include ones with websites
        // so we always return at least 15 candidates for IG lookup
        if (filtered.length < 15) {
            const withWebsite = businesses.filter(b => b.website);
            const extra = withWebsite.slice(0, 15 - filtered.length);
            const combined = [...filtered, ...extra];
            console.log(`Supplementing with ${extra.length} website businesses to reach ${combined.length} total`);
            return combined;
        }
        
        return filtered;

    } catch (e) {
        console.error('Critical error in scrapeGoogleMaps:', e);
        return [];
    } finally {
        if (browser) {
            await browser.close().catch(() => {});
        }
    }
}

module.exports = { scrapeGoogleMaps };
