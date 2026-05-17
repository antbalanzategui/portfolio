import { Html, Head, Main, NextScript } from 'next/document';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Antonio Balanzategui',
  url: 'https://antoniobalanzategui.com',
  jobTitle: 'BAS Programmer',
  worksFor: {
    '@type': 'Organization',
    name: 'VCU Health',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Virginia Tech',
  },
  knowsAbout: [
    'Applied statistics',
    'Change-point detection',
    'GPU physics simulation',
    'Computational fluid dynamics',
    'Building automation systems',
  ],
  sameAs: [
    'https://github.com/antbalanzategui',
    'https://www.linkedin.com/in/antbalanzategui/',
  ],
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0a0a0a" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Field Notes — Antonio Balanzategui"
          href="/field-notes/rss.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Case Studies — Antonio Balanzategui"
          href="/case-studies/rss.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </Head>
      <body className="bg-bg text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:border focus:border-accent/40 focus:bg-bg focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-accent"
        >
          Skip to content
        </a>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
