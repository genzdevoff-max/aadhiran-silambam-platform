import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function checkAnchorFullHero() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.anchorsportsworld.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const hero = document.querySelector('section');
      return {
        heroOuter: hero ? hero.outerHTML : ''
      };
    });
    console.log(data.heroOuter);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

checkAnchorFullHero();
