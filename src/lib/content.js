import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

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

  marked.setOptions({ gfm: true, breaks: false });
  const html = marked.parse(content);

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
