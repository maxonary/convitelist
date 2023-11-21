// Get XUID from Gamertag via https://cxkes.me/xbox/xuid

import { chromium } from 'playwright';

export async function getXuidFromUsername(username : string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.cxkes.me/xbox/xuid');

    await page.fill('#xuidForm > div > div.input-group.input-group-lg > input', username);
    await page.click('#xuidForm > div > div.input-group.input-group-lg > button');

    try {
        await page.waitForSelector('#xuidHex', { timeout: 5000 });
        const xuidHex = await page.innerText('#xuidHex');
        return xuidHex;
    } catch (error) {
        return false;
    } finally {
        await browser.close();
    }
}