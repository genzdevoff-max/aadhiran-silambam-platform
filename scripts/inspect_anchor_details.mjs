import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function inspectDetails() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://www.anchorsportsworld.com/', { waitUntil: 'domcontentloaded' });

  const details = await page.evaluate(() => {
    // Hero details
    const hero = document.querySelector('section');
    const heroH1 = hero?.querySelector('h1')?.innerText;
    const heroButtons = Array.from(hero?.querySelectorAll('button, a') || []).map(b => b.innerText.trim());

    // Section colors and layout classes
    const allSecs = Array.from(document.querySelectorAll('section')).map(s => ({
      id: s.id,
      classes: s.className,
      bg: window.getComputedStyle(s).backgroundColor,
      h2: s.querySelector('h2')?.innerText?.trim() || ''
    }));

    return { heroH1, heroButtons, allSecs };
  });

  console.log(JSON.stringify(details, null, 2));
  await browser.close();
}

inspectDetails().catch(console.error);
