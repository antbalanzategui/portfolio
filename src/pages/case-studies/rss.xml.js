import { getAllCaseStudies } from '@/lib/case-studies';
import { buildRss } from '@/lib/rss';

export async function getServerSideProps({ res }) {
  const studies = getAllCaseStudies();
  const xml = buildRss({
    title: 'Case Studies — Antonio Balanzategui',
    description:
      'Long-form deep dives on topics that interest me — sometimes related to my work, sometimes not.',
    pathPrefix: '/case-studies',
    entries: studies,
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

export default function CaseStudiesRss() {
  return null;
}
