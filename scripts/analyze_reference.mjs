import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function analyze() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://www.indiansilambamfederation.com/', { waitUntil: 'networkidle', timeout: 30000 });

  const data = await page.evaluate(() => {
    // Find all sections
    const sections = Array.from(document.querySelectorAll('section, main > div, header, nav')).map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        width: rect.width,
        height: rect.height,
        bg: style.backgroundColor,
        textSnippet: el.innerText.slice(0, 150).replace(/\n+/g, ' ')
      };
    });

    // Inspect hero
    const firstSection = document.querySelector('section, main > div');
    const heroImages = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      parentClass: img.parentElement?.className || ''
    }));

    return {
      sections: sections.slice(0, 15),
      heroImages: heroImages.slice(0, 10),
      fonts: [document.body.style.fontFamily, window.getComputedStyle(document.body).fontFamily],
      title: document.title
    };
  });

  console.log('Analysis Result:', JSON.stringify(data, null, 2));

  // Capture hero specifically
  await page.screenshot({ path: 'reports/runs/reference_hero_1440.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved reference_hero_1440.png');

  await browser.close();
}

analyze().catch(console.error);
