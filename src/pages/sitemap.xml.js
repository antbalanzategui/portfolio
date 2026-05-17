import { getAllPosts } from '@/lib/posts';
import { getAllCaseStudies } from '@/lib/case-studies';

const SITE_URL = 'https://antoniobalanzategui.com';

const STATIC_ROUTES = [
  { path: '/', priority: 1.0 },
  { path: '/vcu-health', priority: 0.9 },
  { path: '/evolutionsim', priority: 0.9 },
  { path: '/evolutionsim/blackhole', priority: 0.8 },
  { path: '/evolutionsim/neutron-star-merger', priority: 0.8 },
  { path: '/evolutionsim/lightning', priority: 0.7 },
  { path: '/evolutionsim/snowflake', priority: 0.8 },
  { path: '/case-studies', priority: 0.8 },
  { path: '/field-notes', priority: 0.8 },
];

function urlEntry({ loc, lastmod, priority }) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <priority>${priority.toFixed(1)}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildSitemap(posts, studies) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [];
  for (const r of STATIC_ROUTES) {
    entries.push(urlEntry({ loc: r.path, lastmod: today, priority: r.priority }));
  }
  for (const p of posts) {
    entries.push(
      urlEntry({
        loc: `/field-notes/${p.slug}`,
        lastmod: p.date ? p.date.slice(0, 10) : today,
        priority: 0.6,
      }),
    );
  }
  for (const s of studies) {
    entries.push(
      urlEntry({
        loc: `/case-studies/${s.slug}`,
        lastmod: s.date ? s.date.slice(0, 10) : today,
        priority: 0.7,
      }),
    );
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

export async function getServerSideProps({ res }) {
  const posts = getAllPosts();
  const studies = getAllCaseStudies();
  const xml = buildSitemap(posts, studies);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400',
  );
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
