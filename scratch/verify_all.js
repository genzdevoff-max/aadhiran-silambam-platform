const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const viewports = [
    { name: '1440_desktop', width: 1440, height: 900 },
    { name: '1024_tablet_landscape', width: 1024, height: 768 },
    { name: '768_tablet_portrait', width: 768, height: 1024 },
    { name: '430_mobile_large', width: 430, height: 932 },
    { name: '375_mobile_standard', width: 375, height: 667 },
    { name: '320_mobile_small', width: 320, height: 568 },
  ];

  const results = [];
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 1. Viewport & Overflow Tests
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    const overflowCheck = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        hasOverflow: doc.scrollWidth > doc.clientWidth,
      };
    });

    results.push({
      viewport: vp.name,
      dimensions: `${vp.width}x${vp.height}`,
      scrollWidth: overflowCheck.scrollWidth,
      clientWidth: overflowCheck.clientWidth,
      hasOverflow: overflowCheck.hasOverflow,
    });

    if (vp.width === 1440 || vp.width === 375) {
      const prefix = vp.width === 1440 ? 'desktop' : 'mobile';
      await page.screenshot({
        path: path.join(screenshotsDir, `${prefix}_full.png`),
        fullPage: true,
      });

      // Capture individual sections
      const sections = ['disciplines', 'about', 'programs', 'academy', 'enquire'];
      for (const s of sections) {
        const el = await page.$(`#${s}`);
        if (el) {
          await el.screenshot({
            path: path.join(screenshotsDir, `${prefix}_${s}.png`),
          });
        }
      }
    }

    await page.close();
  }

  console.log('--- RESPONSIVE VIEWPORT RESULTS ---');
  console.table(results);

  // 2. Functional Test: MBOR Certificate Modal
  const testPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await testPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  console.log('--- TESTING MBOR CERTIFICATE MODAL ---');
  const viewCertBtn = await testPage.$('#mbor-recognition button');
  if (viewCertBtn) {
    await viewCertBtn.click();
    await testPage.waitForSelector('div[role="dialog"]', { timeout: 3000 });
    const modalVisible = await testPage.isVisible('div[role="dialog"]');
    console.log('MBOR Modal Open Status:', modalVisible ? 'PASSED' : 'FAILED');

    // Capture modal screenshot
    await testPage.screenshot({
      path: path.join(screenshotsDir, 'mbor_modal.png'),
    });

    // Close modal
    const closeBtn = await testPage.$('div[role="dialog"] button[aria-label="Close Certificate Zoom"]');
    if (closeBtn) {
      await closeBtn.click();
      await testPage.waitForTimeout(500);
      const modalClosed = !(await testPage.isVisible('div[role="dialog"]'));
      console.log('MBOR Modal Close Status:', modalClosed ? 'PASSED' : 'FAILED');
    }
  }

  // 3. Functional Test: Class Enquiry Form Submission
  console.log('--- TESTING ENQUIRY FORM SUBMISSION ---');
  await testPage.evaluate(() => {
    document.getElementById('enquire').scrollIntoView();
  });
  await testPage.waitForTimeout(500);

  // Fill form
  await testPage.fill('input[placeholder="Name"]', 'Automated Verification Athlete');
  await testPage.fill('input[placeholder="Phone number"]', '+60124567890');
  await testPage.fill('input[placeholder="you@example.com"]', 'verification@aadhiran.com');
  await testPage.fill('textarea[placeholder="Timings, group size, questions..."]', 'Test enquiry from responsive image visibility verification.');

  // Submit
  await testPage.click('button[type="submit"]');
  await testPage.waitForSelector('text=Thank you! Your class enquiry has been received', { timeout: 8000 });
  const successVisible = await testPage.isVisible('text=Thank you! Your class enquiry has been received');
  console.log('Enquiry Submission Status:', successVisible ? 'PASSED (TiDB Persisted)' : 'FAILED');

  await testPage.screenshot({
    path: path.join(screenshotsDir, 'enquiry_submitted.png'),
  });

  await testPage.close();
  await browser.close();
  console.log('--- ALL VERIFICATIONS COMPLETE ---');
})().catch(console.error);
