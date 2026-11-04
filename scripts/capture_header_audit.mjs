import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'reports/runs';

async function audit() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const widths = [1920, 1440, 1280, 1024, 768, 430, 375, 320];
  const auditResults = {
    viewports: {},
    routes: {},
    dropdowns: {},
    timestamp: new Date().toISOString()
  };

  console.log('=== STEP 1: AUDITING VIEWPORT WIDTHS ===');
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // Initial header screenshot
    const initialScreenshotPath = `${OUTPUT_DIR}/header_initial_${w}px.png`;
    await page.screenshot({
      path: initialScreenshotPath,
      clip: { x: 0, y: 0, width: w, height: w >= 1024 ? 140 : 100 }
    });
    console.log(`[Captured] Initial header at ${w}px -> ${initialScreenshotPath}`);

    // Scrolled header screenshot
    await page.evaluate(() => window.scrollTo(0, 350));
    await page.waitForTimeout(300);
    const scrolledScreenshotPath = `${OUTPUT_DIR}/header_scrolled_${w}px.png`;
    await page.screenshot({
      path: scrolledScreenshotPath,
      clip: { x: 0, y: 0, width: w, height: 90 }
    });
    console.log(`[Captured] Scrolled header at ${w}px -> ${scrolledScreenshotPath}`);

    // Reset scroll
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // Measure metrics
    const metrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      const topBar = header ? header.querySelector('.bg-\\[\\#102137\\]') : null;
      const nav = header ? header.querySelector('nav') : null;
      const container = nav ? nav.querySelector('.max-w-7xl') : null;
      const logo = container ? container.querySelector('a[href="/"]') : null;
      const desktopNav = container ? container.querySelector('.hidden.lg\\:flex.items-center.justify-center') : null;
      const desktopCta = container ? container.querySelector('.hidden.lg\\:flex.items-center.shrink-0') : null;
      const mobileToggle = container ? container.querySelector('button[aria-label*="menu"]') : null;

      const isVis = (el) => el ? window.getComputedStyle(el).display !== 'none' : false;
      const getRect = (el) => el ? {
        width: Math.round(el.getBoundingClientRect().width * 10) / 10,
        height: Math.round(el.getBoundingClientRect().height * 10) / 10,
        top: Math.round(el.getBoundingClientRect().top * 10) / 10,
        left: Math.round(el.getBoundingClientRect().left * 10) / 10,
        right: Math.round(el.getBoundingClientRect().right * 10) / 10,
      } : null;

      return {
        viewportWidth: window.innerWidth,
        headerHeight: header ? header.offsetHeight : 0,
        navHeight: nav ? nav.offsetHeight : 0,
        topBarVisible: isVis(topBar),
        containerRect: getRect(container),
        logoRect: getRect(logo),
        desktopNavVisible: isVis(desktopNav),
        desktopNavRect: getRect(desktopNav),
        desktopCtaVisible: isVis(desktopCta),
        desktopCtaRect: getRect(desktopCta),
        mobileToggleVisible: isVis(mobileToggle),
        mobileToggleRect: getRect(mobileToggle),
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth
      };
    });

    auditResults.viewports[w] = metrics;
    console.log(`[Metrics] ${w}px: Nav H=${metrics.navHeight}px, Logo W=${metrics.logoRect?.width}px, DesktopNav Vis=${metrics.desktopNavVisible}, HasOverflow=${metrics.hasHorizontalOverflow}`);

    // Mobile menu open test (< 1024px)
    if (w < 1024) {
      const menuBtn = await page.$('button[aria-label="Open menu"]');
      if (menuBtn) {
        await menuBtn.click();
        await page.waitForTimeout(300);

        const menuDetails = await page.evaluate(() => {
          const menuDropdown = document.querySelector('#mobile-navigation-dropdown');
          const isDropdownVis = menuDropdown ? window.getComputedStyle(menuDropdown).display !== 'none' : false;
          const rect = menuDropdown ? menuDropdown.getBoundingClientRect() : null;
          return {
            menuVisible: isDropdownVis,
            rect: rect ? { top: rect.top, width: rect.width, height: rect.height } : null,
            overflow: document.documentElement.scrollWidth > window.innerWidth
          };
        });

        const menuScreenshotPath = `${OUTPUT_DIR}/header_menu_opened_${w}px.png`;
        await page.screenshot({
          path: menuScreenshotPath,
          clip: { x: 0, y: 0, width: w, height: Math.min(650, 900) }
        });
        console.log(`[Captured] Opened mobile menu at ${w}px -> ${menuScreenshotPath} (Visible: ${menuDetails.menuVisible}, Overflow: ${menuDetails.overflow})`);

        // Close menu
        const closeBtn = await page.$('button[aria-label="Close menu"]');
        if (closeBtn) {
          await closeBtn.click();
          await page.waitForTimeout(200);
        }
      }
    }
  }

  console.log('\n=== STEP 2: AUDITING DESKTOP DROPDOWNS (1440px) ===');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  // Heritage Dropdown
  const heritageBtn = await page.$('button[aria-controls="heritage-dropdown-menu"]');
  if (heritageBtn) {
    await heritageBtn.click();
    await page.waitForTimeout(300);
    const heritageScreenshotPath = `${OUTPUT_DIR}/header_dropdown_heritage_1440px.png`;
    await page.screenshot({
      path: heritageScreenshotPath,
      clip: { x: 0, y: 0, width: 1440, height: 420 }
    });
    console.log(`[Captured] Heritage dropdown -> ${heritageScreenshotPath}`);
    await heritageBtn.click(); // close
    await page.waitForTimeout(200);
  }

  // Archives Dropdown
  const archivesBtn = await page.$('button[aria-controls="archives-dropdown-menu"]');
  if (archivesBtn) {
    await archivesBtn.click();
    await page.waitForTimeout(300);
    const archivesScreenshotPath = `${OUTPUT_DIR}/header_dropdown_archives_1440px.png`;
    await page.screenshot({
      path: archivesScreenshotPath,
      clip: { x: 0, y: 0, width: 1440, height: 420 }
    });
    console.log(`[Captured] Archives dropdown -> ${archivesScreenshotPath}`);
    await archivesBtn.click(); // close
    await page.waitForTimeout(200);
  }

  console.log('\n=== STEP 3: AUDITING ALL 17 PUBLIC ROUTES ===');
  const publicRoutes = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'History & Lineage', path: '/history-lineage' },
    { name: 'Training Syllabus', path: '/training-syllabus' },
    { name: 'Instructors', path: '/instructors' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' },
    { name: 'News', path: '/news' },
    { name: 'News Detail', path: '/news/silambam-malaysia-book-of-records-2022' },
    { name: 'Heritage Works', path: '/heritage-works' },
    { name: 'Partners & Press', path: '/partners-press' },
    { name: 'Contact', path: '/contact' },
    { name: 'Join Training', path: '/join-training' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: '404 Page', path: '/nonexistent-page-test-404' }
  ];

  for (const route of publicRoutes) {
    await page.setViewportSize({ width: 1280, height: 900 });
    const response = await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const routeData = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const logo = nav ? nav.querySelector('a[href="/"]') : null;
      return {
        headerFound: !!document.querySelector('header'),
        navFound: !!nav,
        logoFound: !!logo,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        title: document.title
      };
    });

    const routeScreenshotPath = `${OUTPUT_DIR}/route_${route.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_1280px.png`;
    await page.screenshot({
      path: routeScreenshotPath,
      clip: { x: 0, y: 0, width: 1280, height: 350 }
    });

    auditResults.routes[route.name] = {
      path: route.path,
      status: response ? response.status() : 0,
      ...routeData,
      screenshot: routeScreenshotPath
    };

    console.log(`[Route] ${route.name.padEnd(20)} (${route.path.padEnd(45)}): Header OK: ${routeData.headerFound}, Overflow: ${routeData.hasHorizontalOverflow}`);
  }

  // Write audit summary JSON
  fs.writeFileSync('reports/header_audit_summary.json', JSON.stringify(auditResults, null, 2));
  console.log('\nAudit complete! Saved reports/header_audit_summary.json');

  await browser.close();
}

audit().catch(console.error);
