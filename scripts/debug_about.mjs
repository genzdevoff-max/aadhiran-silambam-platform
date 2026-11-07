import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  console.log('Scrolled to bottom:', await page.evaluate(() => window.scrollY));

  page.on('console', msg => console.log('CONSOLE:', msg.text()));

  const link = page.locator('footer a[href="/about"]');
  console.log('Link count:', await link.count());
  console.log('Is visible:', await link.isVisible());
  
  await link.click();
  console.log('Clicked link, waiting 100ms...');
  await page.waitForTimeout(100);
  console.log('URL 100ms:', page.url(), 'scrollY:', await page.evaluate(() => window.scrollY));
  
  await page.waitForTimeout(500);
  console.log('URL 600ms:', page.url(), 'scrollY:', await page.evaluate(() => window.scrollY));

  await page.waitForTimeout(1000);
  console.log('URL 1600ms:', page.url(), 'scrollY:', await page.evaluate(() => window.scrollY));

  await browser.close();
})();
