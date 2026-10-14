import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// The Cumulus Congestus page is withdrawn. On the corrected engine (physical
// 101.325 kPa surface pressure) the congestus case no longer reproduces: a
// pre-registered 12-arm retune found no setting that passed, so the research
// paper withdrew the result. Keep the URL alive and send it to the engine. The
// site is a static export, so this is a client-side redirect with a no-JS
// <meta refresh> fallback.
const DEST = '/evolutionsim/storm-engine';

export default function CumulusCongestus() {
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
