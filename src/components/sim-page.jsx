import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { SeoMeta } from '@/components/seo-meta';
import { ReadingProgress } from '@/components/reading-progress';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import { useReducedMotion } from '@/lib/use-reduced-motion';

function HeroMedia({ src, alt, slug, video }) {
  const reducedMotion = useReducedMotion();
  const [videoOk, setVideoOk] = useState(Boolean(video));
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border hairline bg-surface/40">
      {video && videoOk ? (
        <video
          src={video}
          poster={src}
          autoPlay={!reducedMotion}
          loop
          muted
          playsInline
          controls
          preload="metadata"
          onError={() => setVideoOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : imgOk ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="object-cover"
          priority
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="dotgrid absolute inset-0 flex items-center justify-center opacity-60">
          <span className="rounded-md border hairline bg-bg/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
            {video ? 'video' : 'image'} · {slug}
          </span>
        </div>
      )}
    </div>
  );
}

export function SimPage({
  slug,
  title,
  tagline,
  description,
  bodyHtml,
  image,
  imageAlt,
  video,
  tags = [],
  notes = [],
  prev,
  next,
}) {
  return (
    <>
      <SeoMeta
        title={`${title} — EvolutionSim`}
        description={tagline}
        path={`/evolutionsim/${slug}`}
        ogImage={image}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b hairline bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/evolutionsim"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            EvolutionSim
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <ReadingProgress />

      <main id="main" className="pt-14">
        <section className="border-b hairline py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              EvolutionSim · {slug}
            </div>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-fg sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg/80">
              {tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border hairline bg-bg/60 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                <Lock className="h-3 w-3" /> Private repo
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                Demo on request
              </span>
            </div>

            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
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
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 space-y-10">
            <HeroMedia
              src={image}
              alt={imageAlt || `${title} preview`}
              slug={slug}
              video={video}
            />

            {description && (
              <div className="max-w-3xl space-y-4 text-base leading-relaxed text-fg/80">
                {description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {bodyHtml && (
              <div
                className="prose-fn max-w-3xl"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            )}

            {notes.length > 0 && (
              <div className="rounded-lg border hairline bg-surface/40 p-6">
                <div className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
                  Notes
                </div>
                <ul className="space-y-2 text-sm text-fg/80">
                  {notes.map((note, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="border-t hairline py-12">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6">
            {prev ? (
              <Link
                href={`/evolutionsim/${prev.slug}`}
                className="inline-flex items-center gap-2 rounded-md border hairline bg-bg/60 px-4 py-2 font-mono text-xs text-fg/85 transition-colors hover:text-accent hover:border-accent/40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/evolutionsim/${next.slug}`}
                className="inline-flex items-center gap-2 rounded-md border hairline bg-bg/60 px-4 py-2 font-mono text-xs text-fg/85 transition-colors hover:text-accent hover:border-accent/40"
              >
                {next.title}
                <ArrowRight className="h-3.5 w-3.5" />
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
