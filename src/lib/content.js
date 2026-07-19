import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

let configured = false;
function configureMarked() {
  if (configured) return;
  configured = true;

  marked.setOptions({ gfm: true, breaks: false });

  marked.use(
    markedKatex({
      throwOnError: false,
      output: 'html',
      nonStandard: true,
    }),
  );

  const renderer = {
    image(hrefOrToken, titleArg, textArg) {
      const isToken = hrefOrToken !== null && typeof hrefOrToken === 'object';
      const src = isToken ? hrefOrToken.href : hrefOrToken;
      const titleVal = isToken ? hrefOrToken.title : titleArg;
      const textVal = isToken ? hrefOrToken.text : textArg;
      const alt = textVal || titleVal || '';
      const caption = titleVal || '';

      const m = src.match(/^(.*?)(\.[a-zA-Z0-9]+)$/);
      const lightSrc = src;
      const darkSrc = m ? `${m[1]}_dark${m[2]}` : src;

      const altAttr = escapeAttr(alt);
      const captionHtml = caption
        ? `<figcaption class="fig-caption">${escapeHtml(caption)}</figcaption>`
        : '';

      return `<figure class="fig">
  <img src="${escapeAttr(lightSrc)}" alt="${altAttr}" loading="lazy" class="fig-img fig-img--light" />
  <img src="${escapeAttr(darkSrc)}" alt="${altAttr}" loading="lazy" class="fig-img fig-img--dark" />
  ${captionHtml}
</figure>`;
    },
  };

  marked.use({ renderer });
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function resolveDir(relDir) {
  return path.join(process.cwd(), relDir);
}

export function getEntrySlugs(relDir) {
  const dir = resolveDir(relDir);
  ensureDir(dir);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.(md|mdx)$/, ''));
}

export function getEntryBySlug(relDir, slug) {
  const dir = resolveDir(relDir);
  ensureDir(dir);
  const candidates = ['.md', '.mdx'].map((ext) =>
    path.join(dir, `${slug}${ext}`),
  );
  const fullPath = candidates.find((p) => fs.existsSync(p));
  if (!fullPath) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  configureMarked();
  let html = marked.parse(content);
  // Marked wraps standalone images in <p>; the figure renderer emits a block
  // <figure>, so unwrap the surrounding paragraph to keep the HTML valid.
  html = html.replace(/<p>(\s*<figure class="fig">[\s\S]*?<\/figure>\s*)<\/p>/g, '$1');

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 220));

  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date).toISOString() : null,
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    topic: data.topic || '',
    draft: Boolean(data.draft),
    wordCount,
    readingMinutes: minutes,
    html,
  };
}

export function getAllEntries(relDir, { includeDrafts = false } = {}) {
  const entries = getEntrySlugs(relDir)
    .map((slug) => getEntryBySlug(relDir, slug))
    .filter(Boolean)
    .filter((e) => includeDrafts || !e.draft);

  entries.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  return entries;
}
