import fs from 'fs';
import path from 'path';
import { renderPostHtml } from './content';

const POSTS_DIR = path.join(process.cwd(), 'writeups', 'evolutionsim');

// The four storm writeups are house-style markdown: an `# H1`, an italic dek,
// a `---` rule, then the body. SimPage renders the H1 (title) and dek (tagline)
// from props, so strip everything up to and including that first rule and render
// only the body through the figure/KaTeX/mermaid-aware renderer.
export function getStormPostHtml(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return '';
  const raw = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  let start = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^-{3,}\s*$/.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  const body = lines.slice(start).join('\n');
  return renderPostHtml(body);
}
