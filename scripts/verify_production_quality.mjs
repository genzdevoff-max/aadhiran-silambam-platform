import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function runVerification() {
  console.log('--- STARTING PRODUCTION VERIFICATION & PERFORMANCE AUDIT ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // 1. Fresh incognito context (zero cache)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Track network requests and image metrics
  let totalRequests = 0;
  let imageRequests = 0;
  let imageTransferBytes = 0;
  let failedRequests = [];
  let mborRequest = null;
  let heroImageRequest = null;

  page.on('request', (req) => {
    totalRequests++;
    const url = req.url();
    if (req.resourceType() === 'image') {
      imageRequests++;
      if (url.includes('298977c4') || url.includes('mbor-certificate')) {
        mborRequest = { url, method: req.method() };
      }
      if (url.includes('30f575ff') || url.includes('b417be8b')) {
        heroImageRequest = { url, start: Date.now() };
      }
    }
  });

  page.on('response', async (res) => {
    const url = res.url();
    const status = res.status();
    if (status >= 400) {
      failedRequests.push({ url, status });
    }
    if (res.request().resourceType() === 'image') {
      try {
        const buf = await res.body();
        imageTransferBytes += buf.length;
      } catch (e) {}
    }
  });

  const startTime = Date.now();
  console.log('Navigating to http://localhost:5173/...');
  const response = await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  const loadTime = Date.now() - startTime;
  console.log(`Page loaded in ${loadTime}ms with HTTP ${response.status()}`);

  // Performance timings
  const timing = await page.evaluate(() => {
    const perf = window.performance;
    const paint = perf.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    const nav = perf.getEntriesByType('navigation')[0] || {};
    return {
      fcp: Math.round(fcp),
      domInteractive: Math.round(nav.domInteractive || 0),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
      loadEvent: Math.round(nav.loadEventEnd || 0)
    };
  });

  console.log('Browser Timing Metrics:', timing);

  // Verify MBOR Certificate in Browser
  const mborSec = await page.$('#mbor-recognition');
  if (mborSec) {
    await mborSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }
  const mborCertImg = await page.$('#mbor-recognition img');
  let certRendered = false;
  let certDimensions = { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 };

  if (mborCertImg) {
    certDimensions = await mborCertImg.evaluate((img) => ({
      width: img.clientWidth,
      height: img.clientHeight,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      currentSrc: img.currentSrc
    }));
    certRendered = certDimensions.complete && certDimensions.naturalWidth > 0;
  }

  console.log('MBOR Certificate Verification:', {
    foundInDOM: !!mborCertImg,
    renderedSuccessfully: certRendered,
    dimensions: certDimensions
  });

  // Check hero image rendering
  const heroSlider = await page.$('[role="region"][aria-label="Silambam action photo showcase"]');
  const heroFirstImg = heroSlider ? await heroSlider.$('img') : null;
  let heroRendered = false;
  if (heroFirstImg) {
    const heroInfo = await heroFirstImg.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      src: img.src
    }));
    heroRendered = heroInfo.complete && heroInfo.naturalWidth > 0;
    console.log('Hero First Image Status:', heroInfo);
  }

  // Ensure output directory exists
  const runsDir = path.resolve('reports/runs');
  if (!fs.existsSync(runsDir)) {
    fs.mkdirSync(runsDir, { recursive: true });
  }

  // 1. Capture Full Page & Targeted Sections at 1440px
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(600);

  // Full page 1440px
  await page.screenshot({ path: path.join(runsDir, 'final_redesign_home_full_1440.png'), fullPage: true });

  // Focused captures:
  // 1. Header
  const headerElem = await page.$('header');
  if (headerElem) {
    await headerElem.screenshot({ path: path.join(runsDir, 'final_section_01_header_1440.png') });
  }

  // 2. Hero Section
  const heroSection = await page.$('section:has(h1)');
  if (heroSection) {
    await heroSection.screenshot({ path: path.join(runsDir, 'final_section_02_hero_1440.png') });
  }

  // 3. Credibility Bar
  const credSection = await page.$('section:has-text("National & Global Recognitions")');
  if (credSection) {
    await credSection.screenshot({ path: path.join(runsDir, 'final_section_03_credibility_1440.png') });
  }

  // 4. Intro (Master Siva)
  const introSection = await page.$('section:has-text("Preserving Tradition • Promoting Excellence")');
  if (introSection) {
    await introSection.screenshot({ path: path.join(runsDir, 'final_section_04_intro_siva_1440.png') });
  }

  // 5. Lineage & History (Grandmaster Mariapakkiam in Heritage Navy)
  const lineageSection = await page.$('section:has-text("5,000-Year Kurunji Mountain Martial Lineage")');
  if (lineageSection) {
    await lineageSection.screenshot({ path: path.join(runsDir, 'final_section_05_lineage_1440.png') });
  }

  // 6. Syllabus
  const syllabusSection = await page.$('section:has-text("The 10-Stage Traditional Syllabus")');
  if (syllabusSection) {
    await syllabusSection.screenshot({ path: path.join(runsDir, 'final_section_06_syllabus_1440.png') });
  }

  // 7. Instructors
  const instSection = await page.$('section:has-text("Masters & Lineage Custodians")');
  if (instSection) {
    await instSection.screenshot({ path: path.join(runsDir, 'final_section_07_instructors_1440.png') });
  }

  // 8. Visual Stories
  const visualSection = await page.$('section:has-text("Authentic Silambam in Motion")');
  if (visualSection) {
    await visualSection.screenshot({ path: path.join(runsDir, 'final_section_08_visual_stories_1440.png') });
  }

  // 9. MBOR Certificate & Accolades
  const mborSection = await page.$('#mbor-recognition');
  if (mborSection) {
    await mborSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await mborSection.screenshot({ path: path.join(runsDir, 'final_section_09_mbor_certificate_1440.png') });
  }

  // 10. Enrolment Banner
  const enrollSection = await page.$('section:has-text("Begin Your Silambam Journey Today")');
  if (enrollSection) {
    await enrollSection.screenshot({ path: path.join(runsDir, 'final_section_10_enrolment_1440.png') });
  }

  // Test Certificate Modal interaction
  if (mborCertImg) {
    await mborCertImg.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(runsDir, 'final_mbor_certificate_modal_1440.png') });
    console.log('Saved final_mbor_certificate_modal_1440.png');
    // Close modal
    const closeBtn = await page.$('button[aria-label="Close certificate lightbox"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // Test viewports: 1280px, 1024px, 768px, 430px, 375px, 320px
  const testViewports = [1280, 1024, 768, 430, 375, 320];
  const viewportResults = [];

  for (const w of testViewports) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(400);

    // Check horizontal scroll / overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    await page.screenshot({ path: path.join(runsDir, `final_redesign_home_${w}.png`), fullPage: false });
    await page.screenshot({ path: path.join(runsDir, `final_redesign_home_full_${w}.png`), fullPage: true });

    viewportResults.push({
      width: w,
      horizontalOverflow: hasHorizontalOverflow,
      screenshot: `final_redesign_home_${w}.png`
    });
    console.log(`Viewport ${w}px: overflow=${hasHorizontalOverflow}`);
  }

  // Test Public Routes
  const publicRoutes = [
    { path: '/about', name: 'about' },
    { path: '/history-lineage', name: 'history_lineage' },
    { path: '/training-syllabus', name: 'syllabus' },
    { path: '/instructors', name: 'instructors' },
    { path: '/achievements', name: 'achievements' },
    { path: '/events', name: 'events' },
    { path: '/gallery', name: 'gallery' },
    { path: '/videos', name: 'videos' },
    { path: '/news', name: 'news' },
    { path: '/heritage-works', name: 'heritage_works' },
    { path: '/partners-press', name: 'partners_press' },
    { path: '/contact', name: 'contact' },
    { path: '/join-training', name: 'join_training' },
    { path: '/privacy-policy', name: 'privacy_policy' }
  ];

  const routeResults = [];
  for (const r of publicRoutes) {
    try {
      const res = await page.goto(`http://localhost:5173${r.path}`, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(300);
      const title = await page.title();
      await page.screenshot({ path: path.join(runsDir, `final_page_${r.name}_1440.png`), fullPage: false });
      routeResults.push({ path: r.path, status: res.status(), title, verified: res.status() === 200 });
      console.log(`Route ${r.path}: status=${res.status()}`);
    } catch (err) {
      routeResults.push({ path: r.path, status: 'ERROR', error: err.message, verified: false });
      console.error(`Route ${r.path} failed:`, err.message);
    }
  }

  await browser.close();

  const auditSummary = {
    mborVerification: {
      rendered: certRendered,
      naturalDimensions: `${certDimensions.naturalWidth}x${certDimensions.naturalHeight}`,
      renderedDimensions: `${certDimensions.width}x${certDimensions.height}`,
      currentSrc: certDimensions.currentSrc
    },
    heroVerification: {
      rendered: heroRendered
    },
    performanceMetrics: {
      fcp: `${timing.fcp}ms`,
      domContentLoaded: `${timing.domContentLoaded}ms`,
      loadTime: `${loadTime}ms`,
      totalRequests,
      imageRequests,
      imageTransferKb: Math.round(imageTransferBytes / 1024),
      failedRequestsCount: failedRequests.length,
      failedRequests
    },
    viewportResults,
    routeResults
  };

  fs.writeFileSync(
    path.join(runsDir, 'final_verification_summary.json'),
    JSON.stringify(auditSummary, null, 2)
  );
  console.log('AUDIT COMPLETE! Saved final_verification_summary.json');
}

runVerification().catch(console.error);
