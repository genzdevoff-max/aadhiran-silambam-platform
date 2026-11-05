const path = require('path');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Inspect all images on Home page
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => {
      const rect = img.getBoundingClientRect();
      const style = window.getComputedStyle(img);
      return {
        src: img.src,
        alt: img.alt,
        width: rect.width,
        height: rect.height,
        opacity: style.opacity,
        filter: style.filter,
        className: img.className,
      };
    });
  });

  console.log('--- FOUND IMAGES ---');
  images.forEach((img, i) => {
    console.log(`[${i}] ${img.alt || 'no-alt'}`);
    console.log(`    src: ${img.src}`);
    console.log(`    size: ${img.width}x${img.height}, opacity: ${img.opacity}, filter: ${img.filter}`);
  });

  // 2. Count footers
  const footerCount = await page.evaluate(() => document.querySelectorAll('footer').length);
  console.log('--- FOOTER COUNT ---', footerCount);

  // 3. Check for horizontal overflow
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`--- OVERFLOW CHECK --- scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, overflow: ${scrollWidth > clientWidth}`);

  await browser.close();
})().catch(console.error);
