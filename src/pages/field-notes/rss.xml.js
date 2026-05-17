import { getAllPosts } from '@/lib/posts';
import { buildRss } from '@/lib/rss';

export async function getServerSideProps({ res }) {
  const posts = getAllPosts();
  const xml = buildRss({
    title: 'Field Notes — Antonio Balanzategui',
    description:
      'A running notebook of short entries on whatever currently has my attention — sometimes work, often not.',
    pathPrefix: '/field-notes',
    entries: posts,
  });
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400',
  );
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function FieldNotesRss() {
  return null;
}
