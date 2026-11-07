import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function checkDetails() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.anchorsportsworld.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const hero = document.querySelector('section');
      
      // Hero slider elements: controls, dots, text, etc.
      const heroButtons = Array.from(hero.querySelectorAll('button')).map(b => ({
        text: b.innerText,
        label: b.getAttribute('aria-label'),
        classes: b.className
      }));

      // Scroll down and inspect elements with entrance animations
      const allAnim = Array.from(document.querySelectorAll('*')).filter(el => {
        const tr = window.getComputedStyle(el).transition;
        return tr && tr.includes('transform');
      }).map(el => ({
        tag: el.tagName,
        cls: el.className,
        style: el.getAttribute('style')
      })).slice(0, 10);

      return {
        heroButtons,
        allAnim,
        heroHtmlFull: hero ? hero.innerHTML.replace(/\s+/g, ' ').slice(0, 3000) : ''
      };
    });

    console.log('Hero Buttons:', data.heroButtons);
    console.log('Sample Anim elements:', data.allAnim);
    console.log('Hero HTML snippet:', data.heroHtmlFull.slice(0, 1200));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

checkDetails();
