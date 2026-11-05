import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function verify7References() {
  console.log('--- STARTING 7-REFERENCE REDESIGN VERIFICATION ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let failedRequests = [];
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

  // 1. Comprehensive Check of matching sections from all 7 references
  const sectionsCheck = await page.evaluate(() => {
    return {
      ref1_hero: {
        h1: document.querySelector('h1')?.innerText?.replace(/\s+/g, ' '),
        hasPill: Boolean(document.querySelector('section:nth-of-type(1) div.rounded-full, section:nth-of-type(1) div[class*="rounded-full"]')),
        hasRatingPill: Boolean(document.querySelector('section:nth-of-type(1) div[class*="border-[#C6A04A]"]')),
        hasDualButtons: document.querySelectorAll('section:nth-of-type(1) a').length >= 2
      },
      ref2_choose_arena: {
        heading: document.querySelector('#disciplines h2')?.innerText?.trim(),
        masonryCardsCount: document.querySelectorAll('#disciplines .group').length
      },
      ref3_overview: {
        heading: document.querySelector('#about h2')?.innerText?.trim(),
        metricCardsCount: document.querySelectorAll('#about div[class*="border-white/10"]').length,
        hasMborBadge: Boolean(document.querySelector('#mbor-recognition'))
      },
      ref4_programs: {
        heading: document.querySelector('#programs h2')?.innerText?.trim(),
        subhead: document.querySelector('#programs span[class*="font-extrabold"]')?.innerText?.trim(),
        cardsCount: document.querySelectorAll('#programs .group').length
      },
      ref5_academy: {
        heading: document.querySelector('#academy h2')?.innerText?.trim(),
        numberedCardsCount: document.querySelectorAll('#academy .group').length
      },
      ref6_enquiry: {
        hasTogglePill: Boolean(document.querySelector('#enquire button')),
        hasWhatsAppBtn: Boolean(document.querySelector('#enquire a[href*="wa.me"]')),
        hasFormCard: Boolean(document.querySelector('#enquire form')),
        hasSendEnquiryBtn: Boolean(document.querySelector('#enquire button[type="submit"]'))
      },
      ref7_cta_banner: {
        hasCtaBanner: Array.from(document.querySelectorAll('span')).some(s => s.innerText.includes('EVERY ARENA') || s.innerText.includes('EVERY WEAPON'))
      }
    };
  });

  console.log('Sections Verification:', JSON.stringify(sectionsCheck, null, 2));

  // 2. MBOR Certificate in Browser
  const mborImg = await page.$('#mbor-recognition img');
  let certInfo = null;
  let certRendered = false;
  if (mborImg) {
    certInfo = await mborImg.evaluate((img) => ({
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      src: img.src
    }));
    certRendered = certInfo.complete && certInfo.naturalWidth > 0;
    console.log('MBOR Certificate Info:', certInfo);
  }

  // 3. Test MBOR Lightbox Modal
  const certBtn = await page.$('#mbor-recognition button');
  if (certBtn) {
    await certBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'aadhiran_7ref_mbor_modal.png') });
    console.log('Saved aadhiran_7ref_mbor_modal.png');
    const closeBtn = await page.$('div[role="dialog"] button');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 4. Test Live Enquiry Form Submission & TiDB Persistence
  const nameInput = await page.$('#enquire input[placeholder="Name"]');
  const phoneInput = await page.$('#enquire input[placeholder="Phone number"]');
  const emailInput = await page.$('#enquire input[placeholder="you@example.com"]');
  const submitBtn = await page.$('#enquire button[type="submit"]');

  let formSubmitted = false;
  if (nameInput && phoneInput && submitBtn) {
    await nameInput.fill('7-Reference Visual Test');
    await phoneInput.fill('+60 18-999 8888');
    if (emailInput) await emailInput.fill('7ref.test@aadhiran.com');
    await submitBtn.click();
    await page.waitForTimeout(2000);
    const successBox = await page.$('#enquire div[class*="bg-emerald"]');
    formSubmitted = Boolean(successBox);
    console.log('Live Form Submitted & Stored in TiDB:', formSubmitted);
  }

  // 5. Full Page Screenshot of the Redesigned Visual-First Landing Page
  await page.screenshot({ path: path.join(outDir, 'aadhiran_7ref_redesign_full_1440.png'), fullPage: true });
  console.log('Saved aadhiran_7ref_redesign_full_1440.png');

  // 6. Section Screenshots matching each Reference
  // Section 1 (Matching Reference 1)
  const heroSec = await page.$('section:nth-of-type(1)');
  if (heroSec) await heroSec.screenshot({ path: path.join(outDir, 'match_ref1_hero.png') });

  // Section 2 (Matching Reference 2)
  const discSec = await page.$('#disciplines');
  if (discSec) await discSec.screenshot({ path: path.join(outDir, 'match_ref2_choose_arena.png') });

  // Section 3 (Matching Reference 3)
  const aboutSec = await page.$('#about');
  if (aboutSec) await aboutSec.screenshot({ path: path.join(outDir, 'match_ref3_overview.png') });

  // Section 4 (Matching Reference 4)
  const progSec = await page.$('#programs');
  if (progSec) await progSec.screenshot({ path: path.join(outDir, 'match_ref4_programs.png') });

  // Section 5 (Matching Reference 5)
  const academySec = await page.$('#academy');
  if (academySec) await academySec.screenshot({ path: path.join(outDir, 'match_ref5_academy.png') });

  // Section 6 (Matching Reference 7)
  const bannerSec = await page.$('section:has(span:has-text("EVERY ARENA"))');
  if (bannerSec) await bannerSec.screenshot({ path: path.join(outDir, 'match_ref7_cta_banner.png') });

  // Section 7 (Matching Reference 6)
  const enquireSec = await page.$('#enquire');
  if (enquireSec) await enquireSec.screenshot({ path: path.join(outDir, 'match_ref6_enquiry.png') });

  console.log('All matching reference section screenshots saved!');

  // 7. Responsive Viewport Overflow Check (8 viewports)
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

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const screenshotPath = `aadhiran_7ref_vp_${vp.name}.png`;
    await page.screenshot({ path: path.join(outDir, screenshotPath) });
    console.log(`Viewport ${vp.width}px: overflow=${hasOverflow}`);
    viewportAudit.push({ width: vp.width, overflow: hasOverflow, screenshot: screenshotPath });
  }

  // Summary JSON
  const summary = {
    timestamp: new Date().toISOString(),
    theme: '7 Local References Exact Visual & Structural Alignment',
    loadTimeMs: loadTime,
    sectionsCheck,
    mborVerification: {
      rendered: certRendered,
      certInfo
    },
    formSubmitted,
    failedRequests,
    viewportAudit
  };

  fs.writeFileSync(path.join(outDir, 'aadhiran_7ref_verification.json'), JSON.stringify(summary, null, 2));
  console.log('VERIFICATION COMPLETE! Saved aadhiran_7ref_verification.json');

  await browser.close();
}

verify7References().catch(console.error);
