import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Get authentication token
  const authRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@aadhiran.com', password: 'Admin@Aadhiran2026' })
  }).then(r => r.json());

  if (!authRes.token) {
    throw new Error('Auth failed: ' + JSON.stringify(authRes));
  }

  const page = await context.newPage();
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('aadhiran_admin_token', token);
    localStorage.setItem('aadhiran_admin_user', JSON.stringify(user));
  }, { token: authRes.token, user: authRes.user });

  console.log('Navigating to admin dashboard...');
  await page.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'reports/runs/admin_dashboard_1440.png' });
  console.log('Saved admin_dashboard_1440.png');

  // 2. Syllabus 1440
  console.log('Navigating to admin syllabus...');
  await page.goto('http://localhost:5173/admin/syllabus', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'reports/runs/admin_syllabus_1440.png' });
  console.log('Saved admin_syllabus_1440.png');

  // 3. Albums 1440
  console.log('Navigating to admin albums...');
  await page.goto('http://localhost:5173/admin/albums', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'reports/runs/admin_albums_1440.png' });
  console.log('Saved admin_albums_1440.png');

  // 4. Settings 1440
  console.log('Navigating to admin settings...');
  await page.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'reports/runs/admin_settings_1440.png' });
  console.log('Saved admin_settings_1440.png');

  // 5. Test fixed scrolling on main content
  const mainHandle = await page.$('main');
  if (mainHandle) {
    await page.evaluate((el) => { el.scrollTop = 500; }, mainHandle);
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'reports/runs/admin_scrolled_fixed_sidebar_1440.png' });
    console.log('Saved admin_scrolled_fixed_sidebar_1440.png');
  }

  // 6. Mobile & tablet admin view
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'reports/runs/admin_dashboard_768.png' });
  console.log('Saved admin_dashboard_768.png');

  await page.setViewportSize({ width: 375, height: 800 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'reports/runs/admin_dashboard_375.png' });
  console.log('Saved admin_dashboard_375.png');

  await browser.close();
  console.log('Admin verification captures complete!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
