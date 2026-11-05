import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import path from 'path';

async function verifyMborRendering() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Scroll down to MBOR section
  const mborSection = await page.$('#mbor-recognition');
  if (mborSection) {
    console.log('Scrolling down to MBOR Section (#mbor-recognition)...');
    await mborSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200); // Allow lazy load to complete

    const img = await mborSection.$('img');
    if (img) {
      const details = await img.evaluate((el) => ({
        src: el.src,
        currentSrc: el.currentSrc,
        complete: el.complete,
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight
      }));
      console.log('MBOR Image rendered details in live page:', details);

      // Capture close-up of the rendered MBOR certificate showcase
      const certCard = await mborSection.$('.lg\\:col-span-5');
      if (certCard) {
        await certCard.screenshot({ path: path.resolve('reports/runs/verified_mbor_certificate_rendered.png') });
        console.log('Captured verified_mbor_certificate_rendered.png');
      }

      await mborSection.screenshot({ path: path.resolve('reports/runs/verified_mbor_section_rendered.png') });
      console.log('Captured verified_mbor_section_rendered.png');
    } else {
      console.error('Image element not found in MBOR section!');
    }
  } else {
    console.error('MBOR Section not found!');
  }

  await browser.close();
}

verifyMborRendering().catch(console.error);
