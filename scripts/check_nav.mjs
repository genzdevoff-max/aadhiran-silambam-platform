import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';

async function check() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  const testWidths = [1920, 1440, 1280, 1024, 768, 430, 375, 320];
  for (const w of testWidths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const navDetails = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const logo = nav.querySelector('a[href="/"]');
      const desktopNav = nav.querySelector('.hidden.lg\\:flex.items-center.justify-center');
      const desktopCta = nav.querySelector('.hidden.lg\\:flex.items-center.shrink-0');
      const mobileToggle = nav.querySelector('button[aria-label*="menu"]');
      
      const isVisible = (el) => el ? window.getComputedStyle(el).display !== 'none' : false;

      return {
        viewportWidth: window.innerWidth,
        navHeight: nav.offsetHeight,
        logoWidth: logo ? logo.offsetWidth : 0,
        desktopNavVisible: isVisible(desktopNav),
        desktopNavWidth: desktopNav ? desktopNav.offsetWidth : 0,
        desktopCtaVisible: isVisible(desktopCta),
        desktopCtaWidth: desktopCta ? desktopCta.offsetWidth : 0,
        mobileToggleVisible: isVisible(mobileToggle),
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth
      };
    });
    console.log(`Width ${w}px:`, JSON.stringify(navDetails));
  }
  await browser.close();
}

check().catch(console.error);
