import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function checkAnchor() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  try {
    console.log('Navigating to anchor...');
    await page.goto('https://www.anchorsportsworld.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);

    const info = await page.evaluate(() => {
      const hero = document.querySelector('section') || document.querySelector('header');
      const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt }));
      const animations = Array.from(document.querySelectorAll('*')).filter(el => {
        const s = window.getComputedStyle(el);
        return s.animationName !== 'none' || s.transitionProperty !== 'all' && s.transitionProperty !== 'none';
      }).length;
      return {
        title: document.title,
        heroHtml: hero ? hero.outerHTML.slice(0, 1000) : null,
        totalImgs: imgs.length,
        imgs: imgs.slice(0, 8),
        animationsCount: animations
      };
    });
    console.log('Info:', JSON.stringify(info, null, 2));
  } catch (e) {
    console.error('Err:', e.message);
  } finally {
    await browser.close();
  }
}

checkAnchor();
