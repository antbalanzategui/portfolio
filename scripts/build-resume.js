// Render resume/resume.html to a print-quality PDF via Chromium.
// Usage: node scripts/build-resume.js
// Output: public/Antonio_Balanzategui_Resume_1.pdf

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML_PATH = path.resolve(__dirname, '..', 'resume', 'resume.html');
const OUT_PORTFOLIO = path.resolve(
  __dirname,
  '..',
  'public',
  'Antonio_Balanzategui_Resume_1.pdf',
);
const OUT_JOBSEARCH =
  'C:/Users/antb2/Desktop/job-search/Antonio_Balanzategui_Resume.pdf';

(async () => {
  if (!fs.existsSync(HTML_PATH)) {
    console.error('missing:', HTML_PATH);
    process.exit(1);
  }
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('file:///' + HTML_PATH.replace(/\\/g, '/'), {
      waitUntil: 'networkidle',
    });

    const pdfOpts = {
      format: 'Letter',
      printBackground: false,
      preferCSSPageSize: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    };

    await page.pdf({ path: OUT_PORTFOLIO, ...pdfOpts });
    fs.copyFileSync(OUT_PORTFOLIO, OUT_JOBSEARCH);

    const size = fs.statSync(OUT_PORTFOLIO).size;
    console.log(`wrote ${OUT_PORTFOLIO}  (${Math.round(size / 1024)} KB)`);
    console.log(`copied to ${OUT_JOBSEARCH}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
