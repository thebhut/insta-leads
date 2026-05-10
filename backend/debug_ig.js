const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

async function debug() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale: 'en-US',
    });
    const page = await context.newPage();

    const q = 'Beautymanntra Unisex Salon Ahmedabad instagram';
    const url = `https://www.bing.com/search?q=${encodeURIComponent(q)}&mkt=en-IN`;
    
    // Simulate EXACT same flow as scraper module
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (e) {
        console.log('goto threw:', e.message);
        await page.waitForTimeout(2000);
    }
    
    console.log('After goto, URL:', page.url());
    
    const resultsLoaded = await page.waitForSelector('#b_results li.b_algo', { timeout: 10000 })
        .then(() => true).catch(e => { console.log('waitForSelector failed:', e.message); return false; });
    
    console.log('resultsLoaded:', resultsLoaded);
    
    if (resultsLoaded) {
        const count = await page.evaluate(() => document.querySelectorAll('#b_results li.b_algo').length);
        const cites = await page.evaluate(() => Array.from(document.querySelectorAll('#b_results li.b_algo cite')).map(c => c.innerText));
        console.log('algo count:', count);
        console.log('cites:', cites.slice(0,5));
    } else {
        // Check what IS on the page
        const bodySnippet = await page.evaluate(() => document.body.innerText.substring(0, 500));
        console.log('Body:', bodySnippet);
    }
    
    await browser.close();
}

debug().catch(console.error);
