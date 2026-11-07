import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function checkAnchorFaqTestimonials() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.anchorsportsworld.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const content = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim());
      const hasFaq = headings.some(h => /faq|question/i.test(h));
      const hasReviews = headings.some(h => /review|testimonial|word/i.test(h));
      return { headings, hasFaq, hasReviews };
    });
    console.log(content);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

checkAnchorFaqTestimonials();
