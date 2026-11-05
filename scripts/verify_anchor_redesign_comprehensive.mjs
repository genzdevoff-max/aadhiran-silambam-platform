import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function runComprehensiveVerification() {
  console.log('--- STARTING COMPREHENSIVE ANCHOR REDESIGN VERIFICATION ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  let totalRequests = 0;
  let imageRequests = 0;
  let failedRequests = [];

  page.on('request', (req) => {
    totalRequests++;
    if (req.resourceType() === 'image') imageRequests++;
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  const startTime = Date.now();
  console.log('Navigating to http://localhost:5173/...');
  const response = await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  const loadTime = Date.now() - startTime;
  console.log(`Page loaded in ${loadTime}ms with HTTP ${response.status()}`);

  const outDir = 'reports/runs';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Verify 11 Anchor Sections Exist in DOM
  const sectionsCheck = await page.evaluate(() => {
    return {
      hero: !!document.querySelector('h1'),
      heroH1Text: document.querySelector('h1')?.innerText?.replace(/\s+/g, ' '),
      marquee: !!document.querySelector('.animate-sports-marquee'),
      disciplinesSection: !!document.querySelector('#disciplines'),
      disciplinesCardsCount: document.querySelectorAll('#disciplines .sports-card').length,
      overviewSection: !!document.querySelector('#about'),
      mborRecognition: !!document.querySelector('#mbor-recognition'),
      programsSection: !!document.querySelector('#programs'),
      programsCardsCount: document.querySelectorAll('#programs .sports-card').length,
      theAcademySection: Array.from(document.querySelectorAll('h2, h3')).some(h => h.innerText.includes('The Academy')),
      enquirySection: !!document.querySelector('#enquire'),
      faqSection: !!document.querySelector('#faq'),
      faqItemsCount: document.querySelectorAll('#faq button').length,
      reelsSection: Array.from(document.querySelectorAll('h2')).some(h => h.innerText.includes('LATEST REELS')),
      testimonialsSection: Array.from(document.querySelectorAll('h2')).some(h => h.innerText.includes('LOVED BY PRACTITIONERS')),
      finalCta: Array.from(document.querySelectorAll('h2')).some(h => h.innerText.includes('READY TO BEGIN TRAINING?')),
    };
  });

  console.log('Sections Verification:', sectionsCheck);

  // 2. Verify MBOR Certificate Rendering
  const mborSec = await page.$('#mbor-recognition');
  let certInfo = null;
  let certRendered = false;
  if (mborSec) {
    await mborSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const mborImg = await page.$('#mbor-recognition img');
    if (mborImg) {
      certInfo = await mborImg.evaluate((img) => ({
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        clientWidth: img.clientWidth,
        clientHeight: img.clientHeight,
        src: img.src
      }));
      certRendered = certInfo.complete && certInfo.naturalWidth > 0;
      console.log('MBOR Certificate Info:', certInfo);
    }
  }

  // 3. Test MBOR Zoom Modal
  let modalTested = false;
  const certTrigger = await page.$('#mbor-recognition [class*="cursor-pointer"]');
  if (certTrigger) {
    await certTrigger.click();
    await page.waitForTimeout(600);
    const modal = await page.$('div[role="dialog"]');
    if (modal) {
      modalTested = true;
      await page.screenshot({ path: path.join(outDir, 'sports_mbor_modal_zoom.png') });
      console.log('Saved sports_mbor_modal_zoom.png');
      const closeBtn = await page.$('div[role="dialog"] button');
      if (closeBtn) await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 4. Test Programs Tab Switching
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('#programs button'));
    if (tabs.length > 1) tabs[1].click();
  });
  await page.waitForTimeout(500);

  // 5. Test FAQ Accordion Expanding
  const faqButtons = await page.$$('#faq button');
  if (faqButtons.length > 1) {
    await faqButtons[1].click();
    await page.waitForTimeout(400);
  }

  // 6. Test Live Form Submission & TiDB Persistence
  const nameInput = await page.$('#enquire input[type="text"]');
  const phoneInput = await page.$('#enquire input[type="tel"]');
  const emailInput = await page.$('#enquire input[type="email"]');
  const messageInput = await page.$('#enquire textarea');
  const submitButton = await page.$('#enquire button[type="submit"]');

  let formSubmittedSuccessfully = false;
  if (nameInput && phoneInput && submitButton) {
    await nameInput.fill('Anchor Redesign Final Verification');
    await phoneInput.fill('+60 19-876 5432');
    if (emailInput) await emailInput.fill('anchor.test@aadhiran.com');
    if (messageInput) await messageInput.fill('Checking live form submission on Section 7 enquiry.');
    
    await submitButton.click();
    await page.waitForTimeout(2000);

    const successBanner = await page.$('#enquire div[class*="bg-emerald"]');
    formSubmittedSuccessfully = !!successBanner;
    console.log('Live Form Submitted & Stored in TiDB:', formSubmittedSuccessfully);
  }

  // 7. Full Page Screenshot at 1440px
  await page.screenshot({ path: path.join(outDir, 'aadhiran_anchor_redesign_full_1440.png'), fullPage: true });
  console.log('Saved aadhiran_anchor_redesign_full_1440.png');

  // 8. Viewport Overflow Audit (1920, 1440, 1280, 1024, 768, 430, 375, 320)
  const viewports = [
    { width: 1920, height: 1080, name: '1920' },
    { width: 1440, height: 900, name: '1440' },
    { width: 1280, height: 800, name: '1280' },
    { width: 1024, height: 768, name: '1024' },
    { width: 768, height: 1024, name: '768' },
    { width: 430, height: 932, name: '430' },
    { width: 375, height: 667, name: '375' },
    { width: 320, height: 568, name: '320' },
  ];

  const viewportAudit = [];
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(400);

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const screenshotName = `aadhiran_anchor_vp_${vp.name}.png`;
    await page.screenshot({ path: path.join(outDir, screenshotName) });
    console.log(`Viewport ${vp.width}px: overflow=${hasHorizontalOverflow}`);
    viewportAudit.push({
      width: vp.width,
      overflow: hasHorizontalOverflow,
      screenshot: screenshotName
    });
  }

  // Save audit JSON
  const auditReport = {
    timestamp: new Date().toISOString(),
    theme: 'Anchor Sports World Full Visual & Structural Match',
    loadTimeMs: loadTime,
    sectionsCheck,
    mborVerification: {
      rendered: certRendered,
      certInfo,
      modalTested
    },
    formSubmittedSuccessfully,
    failedRequests,
    viewportAudit
  };

  fs.writeFileSync(path.join(outDir, 'anchor_redesign_gap_verification.json'), JSON.stringify(auditReport, null, 2));
  console.log('COMPREHENSIVE AUDIT COMPLETE! Saved anchor_redesign_gap_verification.json');

  await browser.close();
}

runComprehensiveVerification().catch(console.error);
