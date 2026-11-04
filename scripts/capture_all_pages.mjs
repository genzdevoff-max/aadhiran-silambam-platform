import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

const routes = [
  { name: 'about', path: '/about' },
  { name: 'history_lineage', path: '/history-lineage' },
  { name: 'syllabus', path: '/training-syllabus' },
  { name: 'instructors', path: '/instructors' },
  { name: 'achievements', path: '/achievements' },
  { name: 'events', path: '/events' },
  { name: 'news', path: '/news' },
  { name: 'news_detail', path: '/news/malaysia-book-of-records-2022' },
  { name: 'partners', path: '/partners-press' },
  { name: 'gallery', path: '/gallery' },
  { name: 'videos', path: '/videos' },
  { name: 'contact', path: '/contact' },
  { name: 'join', path: '/join-training' },
  { name: 'heritage_works', path: '/heritage-works' },
  { name: 'privacy', path: '/privacy-policy' },
  { name: 'not_found', path: '/some-invalid-page-404' },
  { name: 'admin_login', path: '/admin/login' },
];

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const r of routes) {
    // 1440px desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`http://localhost:5173${r.path}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `reports/runs/page_${r.name}_1440.png`, fullPage: false });

    // 375px mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ path: `reports/runs/page_${r.name}_375.png`, fullPage: false });

    console.log(`Captured ${r.name}`);
  }

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
