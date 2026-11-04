import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function capture() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const widths = [1440, 1280, 1024, 768, 430, 375];
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // 1. Capture hero viewport
    await page.screenshot({ path: `reports/runs/redesign_home_${w}.png`, fullPage: false });
    console.log(`Saved redesign_home_${w}.png`);

    // 2. Capture full landing page
    await page.screenshot({ path: `reports/runs/redesign_home_full_${w}.png`, fullPage: true });
    console.log(`Saved redesign_home_full_${w}.png`);
  }

  // 3. Test slide interaction: click Next slide button and capture Slide 2
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const nextBtn = await page.$('button[aria-label="Next photograph"]');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: 'reports/runs/redesign_hero_slide_2_1440.png', fullPage: false });
    console.log('Saved redesign_hero_slide_2_1440.png');
  }

  // 4. Test Video Modal interaction
  const watchReelBtn = await page.$('button[aria-label="Watch Silambam demonstration video"]');
  if (watchReelBtn) {
    await watchReelBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'reports/runs/redesign_video_modal_1440.png', fullPage: false });
    console.log('Saved redesign_video_modal_1440.png');
    // Close modal
    const closeBtn = await page.$('button[aria-label="Close demonstration video"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 5. Capture individual sections in high-resolution on 1440px
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'reports/runs/redesign_section_01_hero_1440.png', clip: { x: 0, y: 0, width: 1440, height: 860 } });
  console.log('Saved redesign_section_01_hero_1440.png');

  // Scroll to Intro (Master Siva quote)
  await page.evaluate(() => window.scrollTo(0, 850));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_02_intro_1440.png', clip: { x: 0, y: 0, width: 1440, height: 850 } });
  console.log('Saved redesign_section_02_intro_1440.png');

  // Scroll to Heritage & Lineage (Grandmaster Mariapakkiam spotlight)
  await page.evaluate(() => window.scrollTo(0, 1680));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_03_lineage_1440.png', clip: { x: 0, y: 0, width: 1440, height: 800 } });
  console.log('Saved redesign_section_03_lineage_1440.png');

  // Scroll to 10-Stage Syllabus
  await page.evaluate(() => window.scrollTo(0, 2460));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_04_syllabus_1440.png', clip: { x: 0, y: 0, width: 1440, height: 850 } });
  console.log('Saved redesign_section_04_syllabus_1440.png');

  // Scroll to Instructors
  await page.evaluate(() => window.scrollTo(0, 3280));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_05_instructors_1440.png', clip: { x: 0, y: 0, width: 1440, height: 800 } });
  console.log('Saved redesign_section_05_instructors_1440.png');

  // Scroll to Visual Stories & Video Showcase
  await page.evaluate(() => window.scrollTo(0, 4050));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_06_visual_stories_1440.png', clip: { x: 0, y: 0, width: 1440, height: 850 } });
  console.log('Saved redesign_section_06_visual_stories_1440.png');

  // Scroll to Events Calendar
  await page.evaluate(() => window.scrollTo(0, 4880));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_07_events_1440.png', clip: { x: 0, y: 0, width: 1440, height: 800 } });
  console.log('Saved redesign_section_07_events_1440.png');

  // Scroll to Achievements & MBOR Certificate
  await page.evaluate(() => window.scrollTo(0, 5650));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_08_achievements_1440.png', clip: { x: 0, y: 0, width: 1440, height: 750 } });
  console.log('Saved redesign_section_08_achievements_1440.png');

  // Scroll to News & CTA
  await page.evaluate(() => window.scrollTo(0, 6380));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'reports/runs/redesign_section_09_news_cta_1440.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved redesign_section_09_news_cta_1440.png');

  await browser.close();
  console.log('All landing page captures complete!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
