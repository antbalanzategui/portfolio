const SITE_URL = 'https://antoniobalanzategui.com';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildRss({ title, description, pathPrefix, entries }) {
  const feedUrl = `${SITE_URL}${pathPrefix}/rss.xml`;
  const lastBuild = new Date().toUTCString();
  const items = entries
    .map((e) => {
      const link = `${SITE_URL}${pathPrefix}/${e.slug}`;
      const pub = e.date ? new Date(e.date).toUTCString() : lastBuild;
      return [
        '    <item>',
        `      <title>${esc(e.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${pub}</pubDate>`,
        e.description
          ? `      <description>${esc(e.description)}</description>`
          : '',
        e.html
          ? `      <content:encoded><![CDATA[${e.html}]]></content:encoded>`
          : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(title)}</title>
    <link>${SITE_URL}${pathPrefix}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${esc(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}
