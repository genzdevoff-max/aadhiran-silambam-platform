import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import path from 'path';

async function captureSections() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const outDir = 'reports/runs';

  // 1. Hero
  const hero = await page.$('section:nth-of-type(1)');
  if (hero) await hero.screenshot({ path: path.join(outDir, 'sec_1_hero.png') });

  // 2. Disciplines
  const disc = await page.$('#disciplines');
  if (disc) await disc.screenshot({ path: path.join(outDir, 'sec_3_disciplines.png') });

  // 3. Overview (More than a martial arts academy)
  const overview = await page.$('#about');
  if (overview) await overview.screenshot({ path: path.join(outDir, 'sec_4_overview.png') });

  // 4. Programs & Classes
  const prog = await page.$('#programs');
  if (prog) await prog.screenshot({ path: path.join(outDir, 'sec_5_programs.png') });

  // 5. The Academy
  const academy = await page.$('section:has(h2:has-text("The Academy"))');
  if (academy) await academy.screenshot({ path: path.join(outDir, 'sec_6_the_academy.png') });

  // 6. Enquiry
  const enquire = await page.$('#enquire');
  if (enquire) await enquire.screenshot({ path: path.join(outDir, 'sec_7_enquiry.png') });

  // 7. FAQ
  const faq = await page.$('#faq');
  if (faq) await faq.screenshot({ path: path.join(outDir, 'sec_8_faq.png') });

  // 8. Reels
  const reels = await page.$('section:has(h2:has-text("LATEST REELS"))');
  if (reels) await reels.screenshot({ path: path.join(outDir, 'sec_9_reels.png') });

  // 9. Reviews
  const reviews = await page.$('section:has(h2:has-text("LOVED BY PRACTITIONERS"))');
  if (reviews) await reviews.screenshot({ path: path.join(outDir, 'sec_10_reviews.png') });

  // 10. Final CTA
  const finalCta = await page.$('section:has(h2:has-text("READY TO BEGIN TRAINING?"))');
  if (finalCta) await finalCta.screenshot({ path: path.join(outDir, 'sec_11_final_cta.png') });

  console.log('All major sections captured successfully!');
  await browser.close();
}

captureSections().catch(console.error);
