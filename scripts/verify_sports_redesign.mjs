import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function runSportsVerification() {
  console.log('--- STARTING SPORTS-BRAND REDESIGN VERIFICATION ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // Fresh context at 1440x900
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
  console.log('Timing Metrics:', timing);

  // 1. Verify Moving Category Strip (Anchor Sports World Ticker)
  const marquee = await page.$('.animate-sports-marquee');
  const hasMarquee = !!marquee;
  console.log('Sports Category Marquee Found:', hasMarquee);

  // 2. Verify Statistics Section
  const statsCards = await page.$$('.sports-card');
  console.log(`Found ${statsCards.length} sports cards`);

  // 3. Verify MBOR Certificate in Browser
  const mborSec = await page.$('#mbor-recognition');
  let certRendered = false;
  let certInfo = null;
  if (mborSec) {
    await mborSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
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

  // 4. Test Lightbox Modal
  let modalOpened = false;
  const certTrigger = await page.$('#mbor-recognition [class*="cursor-pointer"]');
  if (certTrigger) {
    await certTrigger.click();
    await page.waitForTimeout(800);
    const modal = await page.$('div[role="dialog"]');
    if (modal) {
      modalOpened = true;
      await page.screenshot({ path: 'reports/runs/sports_mbor_modal_1440.png' });
      // Close modal
      const closeBtn = await page.$('div[role="dialog"] button');
      if (closeBtn) await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 5. Capture Section Screenshots at 1440px
  const outDir = 'reports/runs';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await page.screenshot({ path: path.join(outDir, 'sports_home_full_1440.png'), fullPage: true });

  // 6. Test Responsive Viewports (1920, 1440, 1280, 1024, 768, 430, 375, 320)
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

  const viewportResults = [];
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(500);

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const screenshotName = `sports_home_vp_${vp.name}.png`;
    await page.screenshot({ path: path.join(outDir, screenshotName) });
    
    console.log(`Viewport ${vp.width}px: overflow=${hasHorizontalOverflow}`);
    viewportResults.push({
      width: vp.width,
      overflow: hasHorizontalOverflow,
      screenshot: screenshotName
    });
  }

  // 7. Verify Public Routes
  const routes = [
    '/about',
    '/history-lineage',
    '/training-syllabus',
    '/instructors',
    '/achievements',
    '/events',
    '/gallery',
    '/videos',
    '/news',
    '/heritage-works',
    '/partners-press',
    '/contact',
    '/join-training',
    '/privacy-policy'
  ];

  await page.setViewportSize({ width: 1440, height: 900 });
  const routeResults = [];

  for (const r of routes) {
    try {
      const res = await page.goto(`http://localhost:5173${r}`, { waitUntil: 'networkidle', timeout: 15000 });
      const status = res ? res.status() : 500;
      const title = await page.title();
      const safeName = r.replace(/[^a-zA-Z0-9]/g, '_');
      await page.screenshot({ path: path.join(outDir, `sports_page${safeName}_1440.png`) });
      console.log(`Route ${r}: status=${status}`);
      routeResults.push({ path: r, status, title, verified: status === 200 });
    } catch (err) {
      console.error(`Route ${r} error:`, err.message);
      routeResults.push({ path: r, status: 500, error: err.message, verified: false });
    }
  }

  // Save audit summary
  const summary = {
    timestamp: new Date().toISOString(),
    theme: 'Anchor Sports World — Modern Sports-Brand Redesign',
    loadTimeMs: loadTime,
    timing,
    mborVerification: {
      rendered: certRendered,
      modalTested: modalOpened,
      certInfo
    },
    hasMarquee,
    sportsCardsCount: statsCards.length,
    viewportResults,
    routeResults,
    failedRequests
  };

  fs.writeFileSync(path.join(outDir, 'sports_redesign_verification.json'), JSON.stringify(summary, null, 2));
  console.log('SPORTS REDESIGN AUDIT COMPLETE! Saved sports_redesign_verification.json');

  await browser.close();
}

runSportsVerification().catch(console.error);
