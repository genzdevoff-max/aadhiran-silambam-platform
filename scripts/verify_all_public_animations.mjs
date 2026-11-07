import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = './reports/public_animations';

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'History & Lineage', path: '/history-lineage' },
  { name: 'Training Syllabus', path: '/training-syllabus' },
  { name: 'Instructors', path: '/instructors' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Events', path: '/events' },
  { name: 'News', path: '/news' },
  { name: 'News Detail', path: '/news/living-legacy-5000-years-kurunji-to-penang' },
  { name: 'Partners & Press', path: '/partners-press' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Videos', path: '/videos' },
  { name: 'Contact', path: '/contact' },
  { name: 'Join Training', path: '/join-training' },
  { name: 'Heritage Works', path: '/heritage-works' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
];

const VIEWPORTS = [
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 812 },
];

async function runVerification() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  console.log('=== STARTING ALL-PAGE SCROLL ANIMATION AUDIT ===\n');

  for (const pageInfo of PAGES) {
    console.log(`\n-----------------------------------------`);
    console.log(`Auditing Page: ${pageInfo.name} (${pageInfo.path})`);
    console.log(`-----------------------------------------`);

    const pageResult = {
      page: pageInfo.name,
      path: pageInfo.path,
      viewports: {},
      reducedMotionPassed: false,
      consoleErrors: [],
    };

    // Test across viewports
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      const pageErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Filter out benign favicon or network fallbacks
          if (!text.includes('favicon') && !text.includes('fallback')) {
            pageErrors.push(text);
          }
        }
      });
      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      try {
        await page.goto(`${BASE_URL}${pageInfo.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });
        // Allow dynamic API responses and lazy components to mount
        await page.waitForTimeout(1000);

        // Initial check: elements in viewport should already be revealed
        const initialTotal = await page.locator('.scroll-reveal').count();
        const initialRevealedCount = await page.locator('.scroll-reveal.is-revealed').count();

        // Scroll step by step dynamically tracking growing page height
        const step = Math.max(250, Math.floor(vp.height * 0.6));
        let currentY = 0;
        let maxScroll = await page.evaluate(() => document.body.scrollHeight);

        while (currentY <= maxScroll + 100) {
          currentY += step;
          await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), currentY);
          await page.waitForTimeout(70);
          maxScroll = await page.evaluate(() => document.body.scrollHeight);
        }

        // Final scroll to absolute bottom
        await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
        await page.waitForTimeout(600);

        // Now evaluate final DOM counts after all dynamic content and scrolls
        const totalRevealElements = await page.locator('.scroll-reveal').count();
        const finalRevealedCount = await page.locator('.scroll-reveal.is-revealed').count();

        // Check if any element remained unrevealed
        const unrevealed = totalRevealElements - finalRevealedCount;

        // Take screenshot of desktop and mobile
        try {
          if (vp.name === 'Desktop' || vp.name === 'Mobile') {
            const safeSlug = pageInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const shotPath = path.join(OUTPUT_DIR, `${safeSlug}_${vp.name.toLowerCase()}.png`);
            await page.screenshot({ path: shotPath, fullPage: false, timeout: 5000 });
          }
        } catch (shotErr) {
          // Non-critical screenshot failure (e.g. font loading network wait)
        }

        pageResult.viewports[vp.name] = {
          total: totalRevealElements,
          initialRevealed: initialRevealedCount,
          finalRevealed: finalRevealedCount,
          unrevealed,
          passed: totalRevealElements > 0 && unrevealed === 0,
        };

        console.log(`  [${vp.name}] Total: ${totalRevealElements} | Initial: ${initialRevealedCount} | Final Revealed: ${finalRevealedCount} | Unrevealed: ${unrevealed} => ${unrevealed === 0 ? 'PASS' : 'FAIL'}`);
      } catch (err) {
        console.error(`  [${vp.name}] Error:`, err.message);
        pageResult.viewports[vp.name] = { error: err.message, passed: false };
      } finally {
        pageResult.consoleErrors.push(...pageErrors);
        await context.close();
      }
    }

    // Test prefers-reduced-motion: reduce
    const reducedMotionContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    });
    const rmPage = await reducedMotionContext.newPage();
    try {
      await rmPage.goto(`${BASE_URL}${pageInfo.path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });
      await rmPage.waitForTimeout(1200);

      const totalElements = await rmPage.locator('.scroll-reveal').count();
      const revealedElements = await rmPage.locator('.scroll-reveal.is-revealed').count();
      const passedRM = totalElements === revealedElements;

      pageResult.reducedMotionPassed = passedRM;
      console.log(`  [Reduced Motion] Elements revealed immediately: ${revealedElements}/${totalElements} => ${passedRM ? 'PASS' : 'FAIL'}`);
    } catch (err) {
      pageResult.reducedMotionPassed = false;
      console.error('  [Reduced Motion] Error:', err.message);
    } finally {
      await reducedMotionContext.close();
    }

    results.push(pageResult);
  }

  await browser.close();

  // Print Summary Table
  console.log('\n======================================================');
  console.log('               SCROLL ANIMATION SUMMARY               ');
  console.log('======================================================');
  let allPassed = true;
  for (const r of results) {
    const dPass = r.viewports.Desktop?.passed ? 'PASS' : 'FAIL';
    const tPass = r.viewports.Tablet?.passed ? 'PASS' : 'FAIL';
    const mPass = r.viewports.Mobile?.passed ? 'PASS' : 'FAIL';
    const rmPass = r.reducedMotionPassed ? 'PASS' : 'FAIL';
    const errCount = r.consoleErrors.length;
    const pageOk = dPass === 'PASS' && tPass === 'PASS' && mPass === 'PASS' && rmPass === 'PASS' && errCount === 0;
    if (!pageOk) allPassed = false;

    console.log(`${r.page.padEnd(22)} | Desktop: ${dPass} | Tablet: ${tPass} | Mobile: ${mPass} | ReducedMotion: ${rmPass} | Errors: ${errCount}`);
  }
  console.log('======================================================');
  console.log(`OVERALL STATUS: ${allPassed ? 'ALL PAGES PASSED' : 'SOME PAGES FAILED'}`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'verification_summary.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), allPassed, results }, null, 2)
  );
}

runVerification().catch(console.error);
