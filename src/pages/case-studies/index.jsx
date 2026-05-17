import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SeoMeta } from '@/components/seo-meta';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import { getAllCaseStudies } from '@/lib/case-studies';
import { formatPostDate } from '@/lib/post-format';

export async function getStaticProps() {
  const studies = getAllCaseStudies().map(({ html, ...rest }) => rest);
  return { props: { studies } };
}

export default function CaseStudiesIndex({ studies }) {
  return (
    <>
      <SeoMeta
        title="Case Studies"
        description="Long-form deep dives on topics that interest me — sometimes related to my work, sometimes not. Theory, history, and careful walkthroughs."
        path="/case-studies"
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b hairline bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="pt-14">
        <section className="border-b hairline py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              Case Studies
            </div>
            <h1 className="mt-3 text-4xl font-medium tracking-tight text-fg sm:text-5xl">
              Deep dives
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg/80">
              Long-form essays on subjects I want to understand properly —
              theory, history, mathematics, the occasional careful re-derivation.
              Sometimes related to my day-to-day work; often not. These are the
              pieces I&apos;d want to read; I&apos;m writing them because no one
              else has, in quite the way I&apos;d want them written.
            </p>
            <div className="mt-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest text-muted">
              <span>{String(studies.length).padStart(2, '0')} entries</span>
              <span className="h-1 w-1 rounded-full bg-fg/30" />
              <span>updated as I finish them</span>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6">
            {studies.length === 0 ? (
              <div className="rounded-lg border hairline border-dashed bg-surface/40 p-10 text-center font-mono text-xs text-muted">
                No case studies published yet. Drop a markdown file into{' '}
                <code>/case-studies</code> to publish.
              </div>
            ) : (
              <ol className="space-y-2">
                {studies.map((study, i) => {
                  const number = String(studies.length - i).padStart(3, '0');
                  return (
                    <li key={study.slug}>
                      <Link
                        href={`/case-studies/${study.slug}`}
                        className="group grid gap-3 rounded-lg border hairline border-transparent p-6 transition-colors hover:border-accent/30 hover:bg-surface/50 md:grid-cols-[80px_1fr_auto] md:gap-6"
                      >
                        <div className="font-mono text-xs text-muted">
                          № {number}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-3">
                            {study.topic && (
                              <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
                                {study.topic}
                              </span>
                            )}
                            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                              {formatPostDate(study.date) || 'Undated'}
                            </span>
                          </div>
                          <h2 className="mt-2 text-xl font-medium tracking-tight text-fg group-hover:text-accent md:text-2xl">
                            {study.title}
                          </h2>
                          {study.description && (
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg/70">
                              {study.description}
                            </p>
                          )}
                          {study.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
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
                        <ArrowUpRight className="hidden h-4 w-4 self-start text-muted group-hover:text-accent md:block" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
