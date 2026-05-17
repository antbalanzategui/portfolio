import Head from 'next/head';

const SITE_URL = 'https://antoniobalanzategui.com';
const SITE_NAME = 'Antonio Balanzategui';
const DEFAULT_OG = '/og-image.png';

export function SeoMeta({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG,
  type = 'website',
  publishedTime,
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title?.includes(SITE_NAME)
    ? title
    : title
      ? `${title} — ${SITE_NAME}`
      : SITE_NAME;
  const absoluteOg = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_URL}${ogImage}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteOg} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteOg} />
    </Head>
  );
}
