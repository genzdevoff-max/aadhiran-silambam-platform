import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
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
    a: m[4] !== undefined ? parseFloat(m[4]) : 1
  };
}

function getContrast(c1, c2) {
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function auditHomepage() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const outDir = 'reports/contrast_audit';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await page.screenshot({ path: path.join(outDir, 'homepage_initial_1440.png'), fullPage: true });

  const audit = await page.evaluate(() => {
    function findEffectiveBg(el) {
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const bg = window.getComputedStyle(cur).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          return { bg, el: cur.tagName + (cur.id ? '#' + cur.id : '') + (cur.className ? '.' + cur.className.split(' ')[0] : '') };
        }
        cur = cur.parentElement;
      }
      return { bg: 'rgb(248, 250, 252)', el: 'html' };
    }

    const textEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, label, input, select'));
    const results = [];

    textEls.forEach(el => {
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

      results.push({
        tag: el.tagName,
        text: text.slice(0, 60),
        fg,
        bg,
        bgEl,
        fontSize,
        fontWeight,
        isLarge
      });
    });

    return results;
  });

  console.log(`Audited ${audit.length} text elements.`);

  const issues = [];
  const compliant = [];

  audit.forEach(item => {
    const fgRgb = parseRgb(item.fg);
    const bgRgb = parseRgb(item.bg);
    if (!fgRgb || !bgRgb) return;

    const ratio = getContrast(fgRgb, bgRgb);
    const minRequired = item.isLarge ? 3.0 : 4.5;
    const passes = ratio >= minRequired;

    const record = {
      ...item,
      ratio: ratio.toFixed(2),
      minRequired,
      passes
    };

    if (!passes) {
      issues.push(record);
    } else {
      compliant.push(record);
    }
  });

  console.log(`Found ${issues.length} potential contrast issues.`);
  console.log('Sample contrast issues:');
  issues.slice(0, 15).forEach(iss => {
    console.log(`- [${iss.tag}] "${iss.text}" | FG: ${iss.fg} vs BG: ${iss.bg} (${iss.bgEl}) | Ratio: ${iss.ratio} (Min: ${iss.minRequired})`);
  });

  fs.writeFileSync(path.join(outDir, 'contrast_audit_results.json'), JSON.stringify({ issues, compliantCount: compliant.length }, null, 2));

  await browser.close();
}

auditHomepage().catch(console.error);
