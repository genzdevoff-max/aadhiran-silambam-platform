import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function runHeroVerification() {
  console.log('=== AADHIRAN HERO BACKGROUND ROTATOR VERIFICATION ===\n');

  const outDir = path.resolve('reports/hero_transitions');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      console.log('HTTP ERROR:', res.status(), res.url());
    }
  });

  console.log('[1/4] Navigating to http://localhost:5173/ and inspecting Hero structure...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#hero');

  // Verify requirement: No visible controls in Hero
  const controlsCheck = await page.evaluate(() => {
    const hero = document.querySelector('#hero');
    const prevBtn = hero?.querySelector('button[aria-label*="previous" i], button[aria-label*="prev" i]');
    const nextBtn = hero?.querySelector('button[aria-label*="next" i]');
    const slideButtons = hero?.querySelectorAll('button[aria-label*="slide" i]');
    const allHeroButtons = hero?.querySelectorAll('button');
    const counter = Array.from(hero?.querySelectorAll('*') || []).some(el => /0\d\s*\/\s*0\d/.test(el.textContent || ''));
    const carouselRole = hero?.getAttribute('aria-roledescription') === 'carousel';

    return {
      hasPrevBtn: !!prevBtn,
      hasNextBtn: !!nextBtn,
      slideButtonsCount: slideButtons?.length || 0,
      allHeroButtonsCount: allHeroButtons?.length || 0,
      hasCounter: counter,
      hasCarouselRole: carouselRole
    };
  });

  console.log('Visible Controls Audit inside #hero:');
  console.log(' - Previous Button present:', controlsCheck.hasPrevBtn ? 'FAIL' : 'NONE (PASS)');
  console.log(' - Next Button present:', controlsCheck.hasNextBtn ? 'FAIL' : 'NONE (PASS)');
  console.log(' - Navigation Slide Dots present:', controlsCheck.slideButtonsCount > 0 ? `FOUND ${controlsCheck.slideButtonsCount} (FAIL)` : 'NONE (PASS)');
  console.log(' - All Hero Buttons count:', controlsCheck.allHeroButtonsCount === 0 ? '0 (PASS - No carousel buttons)' : `${controlsCheck.allHeroButtonsCount}`);
  console.log(' - Slide Counter (01/05) present:', controlsCheck.hasCounter ? 'FAIL' : 'NONE (PASS)');
  console.log(' - Carousel ARIA Role present:', controlsCheck.hasCarouselRole ? 'FAIL' : 'NONE (PASS)');

  // Function to inspect active background image and foreground text
  async function getHeroState() {
    return await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      const activeDiv = hero?.querySelector('div[class*="opacity-100"]');
      const activeImg = activeDiv?.querySelector('img');
      const h1Text = hero?.querySelector('h1')?.innerText?.trim();
      const pText = hero?.querySelector('p')?.innerText?.trim();
      const badgeText = hero?.querySelector('.inline-flex span')?.innerText?.trim();
      return {
        activeSrc: activeImg ? activeImg.src : null,
        activeAlt: activeImg ? activeImg.alt : null,
        h1Text,
        pText,
        badgeText,
      };
    });
  }

  // ==========================================
  // [2/4] OBSERVING THREE AUTOMATIC TRANSITIONS
  // ==========================================
  console.log('\n[2/4] Testing Automatic Background Image Transitions (waiting through 3 transitions)...');

  // Initial State (T = 0s)
  const state0 = await getHeroState();
  console.log('\nState 0 (Initial):', {
    image: state0.activeSrc?.split('/').pop(),
    h1: state0.h1Text?.replace('\n', ' '),
    badge: state0.badgeText
  });
  await page.screenshot({ path: path.join(outDir, '01_hero_bg_initial.png') });

  // Wait 5 seconds for Transition 1
  console.log('Waiting 5s for Transition 1 (4.5s interval)...');
  await page.waitForTimeout(5000);
  const state1 = await getHeroState();
  console.log('State 1 (After Transition 1):', {
    image: state1.activeSrc?.split('/').pop(),
    h1: state1.h1Text?.replace('\n', ' '),
    imageChanged: state0.activeSrc !== state1.activeSrc,
    textStationary: state0.h1Text === state1.h1Text && state0.pText === state1.pText
  });
  await page.screenshot({ path: path.join(outDir, '02_hero_bg_transition_1.png') });

  // Wait 5 seconds for Transition 2
  console.log('Waiting 5s for Transition 2...');
  await page.waitForTimeout(5000);
  const state2 = await getHeroState();
  console.log('State 2 (After Transition 2):', {
    image: state2.activeSrc?.split('/').pop(),
    h1: state2.h1Text?.replace('\n', ' '),
    imageChanged: state1.activeSrc !== state2.activeSrc,
    textStationary: state1.h1Text === state2.h1Text && state1.pText === state2.pText
  });
  await page.screenshot({ path: path.join(outDir, '03_hero_bg_transition_2.png') });

  // Wait 5 seconds for Transition 3
  console.log('Waiting 5s for Transition 3...');
  await page.waitForTimeout(5000);
  const state3 = await getHeroState();
  console.log('State 3 (After Transition 3):', {
    image: state3.activeSrc?.split('/').pop(),
    h1: state3.h1Text?.replace('\n', ' '),
    imageChanged: state2.activeSrc !== state3.activeSrc,
    textStationary: state2.h1Text === state3.h1Text && state2.pText === state3.pText
  });
  await page.screenshot({ path: path.join(outDir, '04_hero_bg_transition_3.png') });

  // ==========================================
  // [3/4] RESPONSIVE VIEWPORT TESTING
  // ==========================================
  console.log('\n[3/4] Testing Responsive Layout (Mobile, Tablet, Desktop)...');

  // Mobile 375px
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`- Mobile 375px: Horizontal Overflow=${mobileOverflow ? 'FAIL' : 'NONE (PASS)'}`);
  await page.screenshot({ path: path.join(outDir, '05_hero_mobile_375.png') });

  // Tablet 768px
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`- Tablet 768px: Horizontal Overflow=${tabletOverflow ? 'FAIL' : 'NONE (PASS)'}`);
  await page.screenshot({ path: path.join(outDir, '06_hero_tablet_768.png') });

  // Desktop 1440px
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(1000);
  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`- Desktop 1440px: Horizontal Overflow=${desktopOverflow ? 'FAIL' : 'NONE (PASS)'}`);

  // ==========================================
  // [4/4] SUMMARY & DATA EXPORT
  // ==========================================
  const results = {
    visibleControlsRemoved: !controlsCheck.hasPrevBtn && !controlsCheck.hasNextBtn && controlsCheck.slideButtonsCount === 0 && !controlsCheck.hasCounter,
    transitionsObserved: [
      { step: 0, image: state0.activeSrc, h1: state0.h1Text },
      { step: 1, image: state1.activeSrc, h1: state1.h1Text, imageChanged: state0.activeSrc !== state1.activeSrc },
      { step: 2, image: state2.activeSrc, h1: state2.h1Text, imageChanged: state1.activeSrc !== state2.activeSrc },
      { step: 3, image: state3.activeSrc, h1: state3.h1Text, imageChanged: state2.activeSrc !== state3.activeSrc },
    ],
    textRemainedStationary: (state0.h1Text === state1.h1Text) && (state1.h1Text === state2.h1Text) && (state2.h1Text === state3.h1Text),
    consoleErrors,
    failedRequests
  };

  fs.writeFileSync(path.join(outDir, 'hero_verification_summary.json'), JSON.stringify(results, null, 2));

  console.log('\nVerification Summary:');
  console.log('- Visible Controls Removed:', results.visibleControlsRemoved ? 'PASS' : 'FAIL');
  console.log('- 3 Automatic Transitions Completed:', (state0.activeSrc !== state1.activeSrc && state1.activeSrc !== state2.activeSrc && state2.activeSrc !== state3.activeSrc) ? 'PASS' : 'FAIL');
  console.log('- Foreground Text Remained Stationary:', results.textRemainedStationary ? 'PASS' : 'FAIL');
  console.log('- Console Errors:', consoleErrors.length);
  console.log('- Failed Requests:', failedRequests.length);

  await browser.close();
}

runHeroVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
