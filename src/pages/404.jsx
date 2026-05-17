import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';
import { SeoMeta } from '@/components/seo-meta';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';

const suggestions = [
  { href: '/', label: 'Home' },
  { href: '/#work', label: 'Selected work' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/field-notes', label: 'Field Notes' },
  { href: '/evolutionsim', label: 'EvolutionSim' },
];

export default function NotFound() {
  return (
    <>
      <SeoMeta
        title="404 — Page not found"
        description="The page you are looking for doesn't exist."
        path="/404"
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
        <section className="border-b hairline py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border hairline bg-surface/50 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              <Terminal className="h-3 w-3 text-accent" />
              <span>signal 404 · path not in route table</span>
            </div>
            <h1 className="text-balance text-5xl font-medium tracking-tight text-fg sm:text-6xl md:text-7xl">
              404
            </h1>
            <p className="mt-5 text-balance text-2xl font-medium tracking-tight text-fg/85 sm:text-3xl">
              Nothing lives at this URL.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Could be a typo, a link that aged badly, or a page that was here
              once and isn&apos;t anymore. Here&apos;s where to go instead:
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="inline-flex items-center gap-1.5 rounded-md border hairline bg-surface/60 px-3 py-2 font-mono text-xs text-fg/85 transition-colors hover:text-accent hover:border-accent/40"
                >
                  {s.label}
                </Link>
              ))}
            </div>

            <pre className="mt-12 overflow-x-auto rounded-lg border hairline bg-surface/40 p-4 font-mono text-xs leading-relaxed text-muted">
{`$ curl -I <this-url>
HTTP/2 404
content-type: text/html
x-message: gone, but not forgotten`}
            </pre>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
