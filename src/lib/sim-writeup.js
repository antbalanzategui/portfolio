import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const WRITEUPS_DIR = path.join(process.cwd(), 'writeups', 'evolutionsim');

const DROP_SECTIONS = /^(THUMBNAIL|COMMON THREAD)\b/i;

function txtToMarkdown(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let titleConsumed = false;

  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1] ?? '';

    if (next.match(/^=+\s*$/) && line.trim().length > 0) {
      if (!titleConsumed) {
        titleConsumed = true;
      } else {
        out.push(`# ${line.trim()}`);
        out.push('');
      }
      i += 2;
      continue;
    }

    if (next.match(/^-{3,}\s*$/) && line.trim().length > 0) {
      if (DROP_SECTIONS.test(line.trim())) {
        break;
      }
      out.push(`## ${line.trim()}`);
      out.push('');
      i += 2;
      continue;
    }

    let converted = line
      .replace(/^ {2,3}-\s/, '- ')
      .replace(/^ {2,3}\*\s/, '* ');
    if (converted === line) {
      converted = line.replace(/^ {4}(?! )/, '  ');
    }
    out.push(converted);
    i++;
  }
  return out.join('\n');
}

export function getSimWriteupHtml(slug) {
  const filePath = path.join(WRITEUPS_DIR, `${slug}.txt`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const md = txtToMarkdown(raw);
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(md);
}
