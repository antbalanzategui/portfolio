import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SeoMeta } from '@/components/seo-meta';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import { getAllPosts } from '@/lib/posts';
import { formatPostDate } from '@/lib/post-format';

export async function getStaticProps() {
  const posts = getAllPosts().map(({ html, ...rest }) => rest);
  return { props: { posts } };
}

export default function FieldNotesIndex({ posts }) {
  return (
    <>
      <SeoMeta
        title="Field Notes"
        description="A running notebook of short entries on whatever currently has my attention — sometimes work, often not."
        path="/field-notes"
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
        <section className="border-b hairline py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              ~/antonio · field-notes
            </div>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-fg sm:text-4xl md:text-5xl">
              Field Notes
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg/80">
              A running notebook. Short entries on whatever is currently
              holding my attention — sometimes work, often not.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            {posts.length === 0 ? (
              <div className="rounded-lg border hairline border-dashed bg-surface/40 p-10 text-center font-mono text-xs text-muted">
                No entries yet. Drop a markdown file into <code>/posts</code> to
                publish.
              </div>
            ) : (
              <ul className="divide-y divide-fg/10">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/field-notes/${post.slug}`}
                      className="group grid gap-2 py-6 md:grid-cols-[140px_1fr_auto] md:items-baseline md:gap-6"
                    >
                      <div className="font-mono text-xs uppercase tracking-wider text-muted">
                        {formatPostDate(post.date) || 'Undated'}
                      </div>
                      <div>
                        <div className="text-lg text-fg group-hover:text-accent">
                          {post.title}
                        </div>
                        {post.description && (
                          <div className="mt-1 text-sm text-muted">
                            {post.description}
                          </div>
                        )}
                        {post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {post.tags.map((tag) => (
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
                      <div className="hidden items-center gap-2 md:flex">
                        <span className="font-mono text-[11px] text-muted">
                          {post.readingMinutes} min
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-accent" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
