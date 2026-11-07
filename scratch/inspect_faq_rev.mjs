import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function checkFaqReviewsHtml() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.anchorsportsworld.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const result = await page.evaluate(() => {
      const allSecs = Array.from(document.querySelectorAll('section'));
      const faqSec = allSecs.find(s => s.innerText.includes('FREQUENTLY ASKED'));
      const revSec = allSecs.find(s => s.innerText.includes('LOVED BY PLAYERS'));
      return {
        faqHtml: faqSec ? faqSec.outerHTML.slice(0, 1500) : null,
        revHtml: revSec ? revSec.outerHTML.slice(0, 1500) : null,
      };
    });
    console.log('FAQ HTML:', result.faqHtml);
    console.log('REV HTML:', result.revHtml);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

checkFaqReviewsHtml();
