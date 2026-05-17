import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SeoMeta } from '@/components/seo-meta';
import { ReadingProgress } from '@/components/reading-progress';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getCaseStudySlugs,
} from '@/lib/case-studies';
import { formatPostDate } from '@/lib/post-format';

export async function getStaticPaths() {
  return {
    paths: getCaseStudySlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) return { notFound: true };

  const all = getAllCaseStudies();
  const idx = all.findIndex((s) => s.slug === study.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return {
    props: {
      study,
      newer: newer ? { slug: newer.slug, title: newer.title } : null,
      older: older ? { slug: older.slug, title: older.title } : null,
    },
  };
}

export default function CaseStudy({ study, newer, older }) {
  return (
    <>
      <SeoMeta
        title={`${study.title} — Case Studies`}
        description={study.description || study.title}
        path={`/case-studies/${study.slug}`}
        type="article"
        publishedTime={study.date}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b hairline bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Case Studies
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <ReadingProgress />

      <main id="main" className="pt-14">
        <article>
          <header className="border-b hairline py-20">
            <div className="mx-auto max-w-3xl px-6">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted">
                {study.topic && (
                  <span className="text-accent">{study.topic}</span>
                )}
                {study.topic && <span className="h-1 w-1 rounded-full bg-fg/30" />}
                <span>{formatPostDate(study.date) || 'Undated'}</span>
                <span className="h-1 w-1 rounded-full bg-fg/30" />
                <span>{study.readingMinutes} min</span>
              </div>
              <h1 className="mt-4 text-balance text-3xl font-medium tracking-tight text-fg sm:text-4xl md:text-5xl">
                {study.title}
              </h1>
              {study.description && (
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg/80">
                  {study.description}
                </p>
              )}
              {study.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-1.5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border hairline bg-bg/60 px-2 py-0.5 font-mono text-[11px] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <section className="py-16">
            <div
              className="prose-fn mx-auto max-w-3xl px-6"
              dangerouslySetInnerHTML={{ __html: study.html }}
            />
          </section>
        </article>

        <section className="border-t hairline py-12">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6">
            {older ? (
              <Link
                href={`/case-studies/${older.slug}`}
                className="inline-flex max-w-[45%] items-center gap-2 rounded-md border hairline bg-bg/60 px-4 py-2 font-mono text-xs text-fg/85 transition-colors hover:text-accent hover:border-accent/40"
              >
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link
                href={`/case-studies/${newer.slug}`}
                className="inline-flex max-w-[45%] items-center gap-2 rounded-md border hairline bg-bg/60 px-4 py-2 font-mono text-xs text-fg/85 transition-colors hover:text-accent hover:border-accent/40"
              >
                <span className="truncate">{newer.title}</span>
                <ArrowLeft className="h-3.5 w-3.5 shrink-0 rotate-180" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
