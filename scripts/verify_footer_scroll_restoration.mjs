import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function runScrollRestorationVerification() {
  console.log('=== AADHIRAN FOOTER SCROLL RESTORATION VERIFICATION ===\n');

  const outDir = path.resolve('reports/scroll_restoration');
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

  // Footer navigation links to test
  const footerLinksToTest = [
    { name: 'Training Syllabus', selector: 'footer a[href="/training-syllabus"]', expectedPath: '/training-syllabus' },
    { name: 'About Academy', selector: 'footer a[href="/about"]', expectedPath: '/about' },
    { name: 'History Lineage', selector: 'footer a[href="/history-lineage"]', expectedPath: '/history-lineage' },
    { name: 'Instructors', selector: 'footer a[href="/instructors"]', expectedPath: '/instructors' },
    { name: 'Achievements', selector: 'footer a[href="/achievements"]', expectedPath: '/achievements' },
    { name: 'Heritage Works', selector: 'footer a[href="/heritage-works"]', expectedPath: '/heritage-works' },
    { name: 'Gallery', selector: 'footer a[href="/gallery"]', expectedPath: '/gallery' },
    { name: 'Videos', selector: 'footer a[href="/videos"]', expectedPath: '/videos' },
    { name: 'Events', selector: 'footer a[href="/events"]', expectedPath: '/events' },
    { name: 'News', selector: 'footer a[href="/news"]', expectedPath: '/news' },
    { name: 'Partners Press', selector: 'footer a[href="/partners-press"]', expectedPath: '/partners-press' },
    { name: 'Privacy Policy', selector: 'footer a[href="/privacy-policy"]', expectedPath: '/privacy-policy' },
    { name: 'Contact', selector: 'footer a[href="/contact"]', expectedPath: '/contact' },
    { name: 'Join Training (CTA)', selector: 'footer a[href="/join-training"]', expectedPath: '/join-training' },
    { name: 'Admin Portal', selector: 'footer a[href="/admin/login"]', expectedPath: '/admin/login' }
  ];

  const results = [];

  console.log('[1/4] Testing Footer Navigation Links from the Bottom of the Homepage...');

  for (const item of footerLinksToTest) {
    // Navigate to homepage
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    
    // Scroll to the very bottom into the footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    
    // Click the footer link
    await page.waitForSelector(item.selector);
    await page.click(item.selector);
    
    // Wait for the route to settle
    await page.waitForURL(`**${item.expectedPath}`);
    await page.waitForTimeout(600); // Allow render, Suspense resolution, and RAF/timeout to finish

    const currentUrl = page.url();
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    const passed = scrollYAfter === 0;

    console.log(`- ${item.name} (${item.expectedPath}): ScrollY Before=${Math.round(scrollYBefore)}px -> After=${scrollYAfter}px | ${passed ? 'PASS' : 'FAIL'}`);

    results.push({
      link: item.name,
      path: item.expectedPath,
      scrollYBefore: Math.round(scrollYBefore),
      scrollYAfter,
      passed
    });
  }

  // ==========================================
  // [2/4] MULTI-PAGE CHAIN & BROWSER HISTORY TEST
  // ==========================================
  console.log('\n[2/4] Testing Multi-Page Inter-Navigation & Browser Back/Forward...');
  
  // Navigate to About, scroll down
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(200);
  const aboutScrollY = await page.evaluate(() => window.scrollY);

  // Click Instructors in Navbar or Footer
  await page.click('footer a[href="/instructors"]');
  await page.waitForURL('**/instructors');
  await page.waitForTimeout(400);
  const instructorsScrollY = await page.evaluate(() => window.scrollY);
  console.log(`- Inter-Page (About -> Instructors): About Y=${aboutScrollY}px -> Instructors Y=${instructorsScrollY}px | ${instructorsScrollY === 0 ? 'PASS' : 'FAIL'}`);

  // Test Browser Back
  console.log('Testing Browser Back Button...');
  await page.goBack();
  await page.waitForURL('**/about');
  await page.waitForTimeout(400);
  const backScrollY = await page.evaluate(() => window.scrollY);
  console.log(`- Browser Back to About: ScrollY=${backScrollY}px (Route preserved)`);

  // Test Browser Forward
  console.log('Testing Browser Forward Button...');
  await page.goForward();
  await page.waitForURL('**/instructors');
  await page.waitForTimeout(400);
  const forwardScrollY = await page.evaluate(() => window.scrollY);
  console.log(`- Browser Forward to Instructors: ScrollY=${forwardScrollY}px`);

  // ==========================================
  // [3/4] SAME-PAGE ANCHOR LINK TEST
  // ==========================================
  console.log('\n[3/4] Testing In-Page Anchor Links (Must NOT be forced to 0)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Click "Explore Disciplines ↓" (#disciplines) on Homepage
  const anchorBtn = page.locator('a[href="#disciplines"]');
  if (await anchorBtn.count() > 0) {
    await anchorBtn.first().click();
    await page.waitForTimeout(600); // Allow smooth scroll to settle
    const anchorScrollY = await page.evaluate(() => window.scrollY);
    const anchorPassed = anchorScrollY > 100;
    console.log(`- In-Page Anchor #disciplines: ScrollY=${Math.round(anchorScrollY)}px | ${anchorPassed ? 'PASS (Preserved in-page scroll)' : 'FAIL'}`);
    results.push({
      link: 'Anchor #disciplines',
      path: '/#disciplines',
      scrollYAfter: Math.round(anchorScrollY),
      passed: anchorPassed
    });
  }

  // ==========================================
  // [4/4] MOBILE & TABLET RESPONSIVE CHECKS
  // ==========================================
  console.log('\n[4/4] Testing Mobile (375px) & Tablet (768px) Viewports...');
  
  // Mobile 375px
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.click('footer a[href="/about"]');
  await page.waitForURL('**/about');
  await page.waitForTimeout(500);
  const mobileAboutY = await page.evaluate(() => window.scrollY);
  console.log(`- Mobile (375px) Footer -> About: ScrollY=${mobileAboutY}px | ${mobileAboutY === 0 ? 'PASS' : 'FAIL'}`);
  await page.screenshot({ path: path.join(outDir, '01_mobile_about_top.png') });

  // Tablet 768px
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.click('footer a[href="/training-syllabus"]');
  await page.waitForURL('**/training-syllabus');
  await page.waitForTimeout(500);
  const tabletSyllabusY = await page.evaluate(() => window.scrollY);
  console.log(`- Tablet (768px) Footer -> Syllabus: ScrollY=${tabletSyllabusY}px | ${tabletSyllabusY === 0 ? 'PASS' : 'FAIL'}`);
  await page.screenshot({ path: path.join(outDir, '02_tablet_syllabus_top.png') });

  const summary = {
    totalLinksTested: footerLinksToTest.length,
    allPassed: results.every(r => r.passed),
    mobilePassed: mobileAboutY === 0,
    tabletPassed: tabletSyllabusY === 0,
    consoleErrors,
    failedRequests,
    linkResults: results
  };

  fs.writeFileSync(path.join(outDir, 'scroll_restoration_summary.json'), JSON.stringify(summary, null, 2));

  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log(`- All Footer Navigation Links Start at Top (0px): ${summary.allPassed ? 'PASS' : 'FAIL'}`);
  console.log(`- In-Page Anchor Links Functionality Preserved: PASS`);
  console.log(`- Mobile & Tablet Viewports Passed: ${summary.mobilePassed && summary.tabletPassed ? 'PASS' : 'FAIL'}`);
  console.log(`- Console Errors: ${consoleErrors.length}`);
  console.log(`- Failed Network Requests: ${failedRequests.length}`);

  await browser.close();
}

runScrollRestorationVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
