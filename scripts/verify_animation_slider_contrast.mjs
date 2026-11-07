import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function parseRgb(colorStr) {
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  return {
    r: parseInt(m[1], 10),
    g: parseInt(m[2], 10),
    b: parseInt(m[3], 10),
    a: m[4] !== undefined ? parseFloat(m[4]) : 1,
  };
}

function getContrast(c1, c2) {
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runComprehensiveVerification() {
  console.log('--- Starting Comprehensive Animation, Hero Slider & Contrast Verification ---');

  const outDir = 'reports/verification';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

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

  // ==========================================
  // STEP 1: INITIAL HERO & AUTOPLAY SLIDER
  // ==========================================
  console.log('\n[1/5] Testing Automatic Hero Slider Transitions...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('section[aria-roledescription="carousel"]', { state: 'attached' });
  await page.waitForTimeout(1000);

  // Capture Slide 1 initial state
  const slide1Info = await page.evaluate(() => {
    const textCounter = document.querySelector('section[aria-roledescription="carousel"] .font-mono')?.innerText;
    const heroH1 = document.querySelector('section[aria-roledescription="carousel"] h1')?.innerText;
    return { textCounter, heroH1 };
  });
  console.log('Initial Slide 1:', slide1Info);
  await page.screenshot({ path: path.join(outDir, '01_hero_slide_1.png') });

  // Wait 4.8 seconds for automatic transition to Slide 2
  console.log('Waiting 4.8s for automatic slide transition...');
  await page.waitForTimeout(4800);

  const slide2Info = await page.evaluate(() => {
    const textCounter = document.querySelector('section[aria-roledescription="carousel"] .font-mono')?.innerText;
    const heroH1 = document.querySelector('section[aria-roledescription="carousel"] h1')?.innerText;
    return { textCounter, heroH1 };
  });
  console.log('Auto-advanced Slide 2:', slide2Info);
  await page.screenshot({ path: path.join(outDir, '02_hero_slide_2_auto.png') });

  // Test Slider Arrow Controls: Click Next
  console.log('Testing Next control button...');
  await page.click('button[aria-label="Next photograph slide"]');
  await page.waitForTimeout(1300); // Wait for crossfade transition

  const slide3Info = await page.evaluate(() => {
    const textCounter = document.querySelector('section[aria-roledescription="carousel"] .font-mono')?.innerText;
    return { textCounter };
  });
  console.log('After clicking Next:', slide3Info);
  await page.screenshot({ path: path.join(outDir, '03_hero_slide_3_manual.png') });

  // Test Slider Arrow Controls: Click Prev
  console.log('Testing Prev control button...');
  await page.click('button[aria-label="Previous photograph slide"]');
  await page.waitForTimeout(1300);

  const slideBackInfo = await page.evaluate(() => {
    const textCounter = document.querySelector('section[aria-roledescription="carousel"] .font-mono')?.innerText;
    return { textCounter };
  });
  console.log('After clicking Prev:', slideBackInfo);

  // Test Dot Indicators: Click Slide 4 dot
  console.log('Testing Indicator Dot 4...');
  await page.click('button[aria-label="Go to slide 4"]');
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(outDir, '04_hero_slide_4_dot.png') });

  // ==========================================
  // STEP 2: SCROLL-TRIGGERED ENTRANCE ANIMATIONS
  // ==========================================
  console.log('\n[2/5] Testing Scroll-Triggered Entrance Animations & Counter...');
  
  // Scroll to Disciplines section
  await page.evaluate(() => document.getElementById('disciplines')?.scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '05_scroll_disciplines_masonry.png') });

  // Scroll to Overview & Metrics section
  await page.evaluate(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(2000); // Allow counters to animate to final values

  const countersState = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#about .grid.grid-cols-2.lg\\:grid-cols-4 > div')).map((c) => c.innerText.replace(/\s+/g, ' '));
    return cards;
  });
  console.log('Animated Counter values in Overview:', countersState);
  await page.screenshot({ path: path.join(outDir, '06_scroll_overview_counters.png') });

  // Scroll to Programs section
  await page.evaluate(() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '07_scroll_programs_grid.png') });

  // Scroll to Academy section
  await page.evaluate(() => document.getElementById('academy')?.scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '08_scroll_academy.png') });

  // Scroll to FAQ section and test interactive toggle
  await page.evaluate(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  console.log('Testing FAQ accordion toggle...');
  // Click FAQ question 2
  const faqButtons = await page.$$('section#faq button');
  if (faqButtons.length > 1) {
    await faqButtons[1].click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(outDir, '09_scroll_faq_accordion.png') });

  // Scroll to Enquiry section
  await page.evaluate(() => document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '10_scroll_enquiry_form.png') });

  // Scroll to Global Footer
  await page.evaluate(() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '11_scroll_footer.png') });

  // ==========================================
  // STEP 3: FULL PAGE DESKTOP SCREENSHOT
  // ==========================================
  console.log('\n[3/5] Capturing Complete Full-Page Screenshot...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '12_fullpage_desktop_1440.png'), fullPage: true });

  // ==========================================
  // STEP 4: WCAG 2.2 AA TEXT CONTRAST AUDIT
  // ==========================================
  console.log('\n[4/5] Running WCAG 2.2 AA Text Contrast Audit...');
  const contrastAudit = await page.evaluate(() => {
    function findEffectiveBg(el) {
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const style = window.getComputedStyle(cur);
        const bg = style.backgroundColor;
        const bgImg = style.backgroundImage;
        if (bgImg && (bgImg.includes('gradient') || bgImg.includes('060B26') || bgImg.includes('rgb(6, 11, 38)'))) {
          return { bg: 'rgb(6, 11, 38)', el: cur.tagName + (cur.id ? '#' + cur.id : '') + (cur.className ? '.' + cur.className.split(' ')[0] : '') };
        }
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          return { bg, el: cur.tagName + (cur.id ? '#' + cur.id : '') + (cur.className ? '.' + cur.className.split(' ')[0] : '') };
        }
        cur = cur.parentElement;
      }
      return { bg: 'rgb(248, 250, 252)', el: 'html' };
    }

    const textEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, label, input, select'));
    const items = [];

    textEls.forEach((el) => {
      const text = el.innerText?.trim();
      if (!text || text.length === 0) return;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const fg = style.color;
      const { bg, el: bgEl } = findEffectiveBg(el);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight, 10) || 400;
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);

      items.push({
        tag: el.tagName,
        text: text.slice(0, 50),
        fg,
        bg,
        bgEl,
        fontSize,
        fontWeight,
        isLarge,
      });
    });

    return items;
  });

  const contrastIssues = [];
  const contrastPasses = [];

  contrastAudit.forEach((item) => {
    const fgRgb = parseRgb(item.fg);
    const bgRgb = parseRgb(item.bg);
    if (!fgRgb || !bgRgb) return;

    const ratio = getContrast(fgRgb, bgRgb);
    const minRequired = item.isLarge ? 3.0 : 4.5;
    const passes = ratio >= minRequired;

    const record = {
      ...item,
      ratio: Number(ratio.toFixed(2)),
      minRequired,
      passes,
    };

    if (!passes) {
      contrastIssues.push(record);
    } else {
      contrastPasses.push(record);
    }
  });

  console.log(`Contrast Check: ${contrastPasses.length} text elements PASS WCAG 2.2 AA.`);
  console.log(`Contrast Failures: ${contrastIssues.length}`);
  if (contrastIssues.length > 0) {
    console.log('Failing items:');
    contrastIssues.forEach((iss) => {
      console.log(`- [${iss.tag}] "${iss.text}" | FG: ${iss.fg} vs BG: ${iss.bg} (${iss.bgEl}) | Ratio: ${iss.ratio} < ${iss.minRequired}`);
    });
  }

  // ==========================================
  // STEP 5: RESPONSIVE VIEWPORT TESTING (8 VIEWPORTS)
  // ==========================================
  console.log('\n[5/5] Testing 8 Responsive Viewports & Checking Horizontal Overflow...');
  const viewports = [
    { width: 320, height: 600, name: '320_mobile_small' },
    { width: 375, height: 667, name: '375_iphone_se' },
    { width: 430, height: 932, name: '430_iphone_pro_max' },
    { width: 768, height: 1024, name: '768_tablet_portrait' },
    { width: 1024, height: 768, name: '1024_tablet_landscape' },
    { width: 1280, height: 800, name: '1280_laptop' },
    { width: 1440, height: 900, name: '1440_desktop' },
    { width: 1920, height: 1080, name: '1920_ultrawide' },
  ];

  const viewportResults = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(600);

    const overflowCheck = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const overflow = scrollW - clientW;
      return { scrollW, clientW, overflow, hasOverflow: overflow > 1 };
    });

    await page.screenshot({ path: path.join(outDir, `viewport_${vp.name}.png`) });

    viewportResults.push({
      viewport: `${vp.width}x${vp.height}`,
      name: vp.name,
      ...overflowCheck,
    });
    console.log(`- ${vp.name} (${vp.width}px): ScrollWidth=${overflowCheck.scrollW}px, ClientWidth=${overflowCheck.clientW}px, Overflow=${overflowCheck.overflow}px -> ${overflowCheck.hasOverflow ? 'FAIL' : 'PASS'}`);
  }

  // Mobile Swipe Gesture Test
  console.log('\nTesting mobile swipe gesture at 375px...');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const preSwipeSlide = await page.evaluate(() => document.querySelector('section[aria-roledescription="carousel"] .font-mono')?.innerText);

  // Dispatch touch events simulating a swipe left
  await page.evaluate(() => {
    const hero = document.querySelector('section[aria-roledescription="carousel"]');
    if (!hero) return;
    const touchStart = new Touch({ identifier: 1, target: hero, clientX: 300, clientY: 200 });
    const touchEnd = new Touch({ identifier: 1, target: hero, clientX: 100, clientY: 200 });
    hero.dispatchEvent(new TouchEvent('touchstart', { touches: [touchStart], changedTouches: [touchStart], bubbles: true }));
    hero.dispatchEvent(new TouchEvent('touchmove', { touches: [touchEnd], changedTouches: [touchEnd], bubbles: true }));
    hero.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [touchEnd], bubbles: true }));
  });
  await page.waitForTimeout(1300);

  const postSwipeSlide = await page.evaluate(() => document.querySelector('section[aria-roledescription="carousel"] .font-mono')?.innerText);
  console.log(`Mobile Swipe Test: Before: ${preSwipeSlide} -> After: ${postSwipeSlide}`);

  await browser.close();

  const summary = {
    heroSlider: {
      initialSlide: slide1Info,
      autoAdvancedSlide: slide2Info,
      manualNextSlide: slide3Info,
      preSwipe: preSwipeSlide,
      postSwipe: postSwipeSlide,
      success: slide1Info.textCounter !== slide2Info.textCounter,
    },
    counters: countersState,
    contrast: {
      passingCount: contrastPasses.length,
      failingCount: contrastIssues.length,
      issues: contrastIssues,
    },
    viewports: viewportResults,
    consoleErrors,
    failedRequests,
  };

  fs.writeFileSync(path.join(outDir, 'verification_summary.json'), JSON.stringify(summary, null, 2));
  console.log('\nVerification complete! Results written to reports/verification/verification_summary.json');
}

runComprehensiveVerification().catch(console.error);
