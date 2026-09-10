import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// The old Lightning showcase (Dielectric Breakdown Model / Takahashi / Heidler)
// described a retired build. The current engine uses field-directed bidirectional
// stepped leaders typed by channel termination, documented in The Storm Engine.
// Keep the URL alive and send it there. The site is a static export, so this is a
// client-side redirect with a no-JS <meta refresh> fallback.
const DEST = '/evolutionsim/storm-engine';

export default function Lightning() {
  const router = useRouter();
  useEffect(() => {
    router.replace(DEST);
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting to The Storm Engine…</title>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="refresh" content={`0; url=${DEST}`} />
      </Head>
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="font-mono text-sm text-muted">
          This page moved to{' '}
          <a href={DEST} className="text-accent underline">
            The Storm Engine
          </a>
          .
        </p>
      </main>
    </>
  );
}
