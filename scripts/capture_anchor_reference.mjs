import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function captureAnchor() {
  console.log('Navigating to https://www.anchorsportsworld.com/...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    await page.goto('https://www.anchorsportsworld.com/', { waitUntil: 'networkidle', timeout: 45000 });
  } catch (e) {
    console.log('Networkidle timeout or error, proceeding:', e.message);
  }

  const outDir = 'reports/runs';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await page.screenshot({ path: path.join(outDir, 'anchor_reference_full_1440.png'), fullPage: true });
  console.log('Saved anchor_reference_full_1440.png');

  // Also capture viewport screenshots
  const viewports = [
    { width: 1440, height: 900, name: '1440' },
    { width: 768, height: 1024, name: '768' },
    { width: 375, height: 667, name: '375' }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `anchor_reference_vp_${vp.name}.png`) });
    console.log(`Saved anchor_reference_vp_${vp.name}.png`);
  }

  // Extract structural breakdown of the sections
  const structure = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim(),
      classes: h.className
    }));

    const sections = Array.from(document.querySelectorAll('section, main > div, header, footer')).map((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const style = window.getComputedStyle(sec);
      return {
        index: idx,
        tag: sec.tagName,
        id: sec.id,
        className: sec.className.slice(0, 100),
        bg: style.backgroundColor,
        color: style.color,
        height: rect.height,
        textPreview: sec.innerText.slice(0, 200).replace(/\s+/g, ' ')
      };
    });

    return { title: document.title, headings, sections };
  });

  fs.writeFileSync(path.join(outDir, 'anchor_structure.json'), JSON.stringify(structure, null, 2));
  console.log('Saved anchor_structure.json');

  await browser.close();
}

captureAnchor().catch(console.error);
