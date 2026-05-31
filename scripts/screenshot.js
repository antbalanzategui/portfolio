// Capture a light-mode screenshot of the portfolio for LinkedIn use.
// Usage: node scripts/screenshot.js
// Requires: dev server running at http://localhost:3000

const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = 'C:/Users/antb2/Desktop/job-search/portfolio-shots';
const URL = 'http://localhost:3000/';

async function shoot(page, name, opts = {}) {
  const filename = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: filename, ...opts });
  console.log(`  -> ${filename}`);
}

(async () => {
  const browser = await chromium.launch();
  try {
    // 1920x1080 viewport — desktop "above the fold" shot
    const ctx = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2, // retina-grade for crisp LinkedIn rendering
    });
    const page = await ctx.newPage();

    // Force light mode by setting localStorage before any layout work
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload({ waitUntil: 'networkidle' });

    // Sanity: confirm the html actually got the .light class
    const isLight = await page.evaluate(() =>
      document.documentElement.classList.contains('light'),
    );
    console.log(`light mode applied: ${isLight}`);

    // Give the dotgrid + fonts a beat to settle
    await page.waitForTimeout(800);

    // 1) hero shot — 1920x1080 viewport, above-the-fold only
    console.log('shooting hero...');
    await shoot(page, 'portfolio-hero-1920x1080', { fullPage: false });

    // 2) full-page shot — the entire homepage scroll, scaled appropriately
    console.log('shooting full page...');
    await shoot(page, 'portfolio-full-page', { fullPage: true });

    // 3) 1200x630 OG-ratio crop — same aspect as LinkedIn link previews
    console.log('shooting 1200x630 crop...');
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await shoot(page, 'portfolio-1200x630', { fullPage: false });

    await browser.close();
    console.log('done.');
  } catch (err) {
    console.error(err);
    await browser.close();
    process.exit(1);
  }
})();
