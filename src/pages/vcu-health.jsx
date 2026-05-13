import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';

const figures = [
  {
    index: '01',
    title: 'CUSUM change-point — Room A pressure',
    src: '/01-cusum-change-point.png',
    alt: 'Cumulative-sum chart of Room A pressure with the 5-sigma decision threshold, inferred onset on Dec 30 2025 and first UCL crossing on Jan 25 2026.',
    caption:
      'Univariate CUSUM on Room A pressure against a 5-sigma decision threshold. The statistic first crosses the upper control limit on Jan 25 2026; backing the trajectory out to its inferred onset places the regime change on Dec 30 2025 — roughly three months before EF1 fails catastrophically on Mar 19. This is the first signal in the investigation that something mechanical has shifted, with no corresponding work order in the BAS history.',
  },
  {
    index: '02',
    title: 'Exhaust-fan speed vs. room pressure',
    src: '/02-fan-speed-vs-pressure.png',
    alt: 'Three-period overlay of exhaust-fan command speed, fan feedback speed, and Room A pressure, with the EF mechanical failure annotated on Mar 19 2026.',
    caption:
      'Commanded EF speed (flat at setpoint), measured feedback speed, and Room A pressure across three operating periods. Speed and pressure decouple beginning Jan 23 with the first 0% feedback dropout; Period B is the silent-degradation window in which the control loop is increasingly fighting a failing actuator. Period C begins after the Mar 19 mechanical failure. The inset zooms in on Mar 18–22, the immediate failure neighborhood.',
  },
  {
    index: '03',
    title: 'Sensor staleness heatmap — 12 channels',
    src: '/03-staleness-heatmap.png',
    alt: 'Heatmap of per-channel staleness weight across four rooms and three sensors each, from August 2025 through April 2026, with the Dec 30 2025 change-point marked.',
    caption:
      'Per-channel staleness weight (1 = clean, 0 = stale) for all 12 monitored sensors. Most channels read clean year-round; Room C Pressure begins a sustained degradation around the Dec 30 change-point — the same date the Hawkes self-exciting analysis pinpoints as the cascade onset (branching ratio n* = 0.973, just below the critical threshold). This is the figure that surfaces the historian-side problem, separate from the mechanical failure: an ExTL buffer / Maximum Transfer Interval mismatch downstream of the BAS.',
  },
  {
    index: '04',
    title: 'MEWMA Hotelling T² — 12-sensor system',
    src: '/04-mewma-hotelling.png',
    alt: 'Log-scale plot of the MEWMA Hotelling T-squared statistic for the 12-sensor system with UCL = 13.0 from Lowry et al. 1992, lambda = 0.10, p = 12.',
    caption:
      'Multivariate exponentially-weighted Hotelling T² over the full 12-channel system with UCL = 13.0 (Lowry et al. 1992, λ = 0.10, p = 12). The statistic sits orders of magnitude above the control limit from mid-2025 onward, with order-of-magnitude jumps in late January and early February 2026 — the same window in which the single-variable CUSUM is just beginning to fire. The multivariate view sees the cross-channel coupling that any one univariate chart misses.',
  },
];

export default function VcuHealth() {
  return (
    <>
      <Head>
        <title>VCU Health BAS Investigation — Antonio Balanzategui</title>
        <meta
          name="description"
          content="Four redacted figures from the quarterly BAS investigation report: CUSUM change-point, fan speed vs. room pressure, sensor staleness heatmap, and MEWMA Hotelling T²."
        />
      </Head>

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

      <main className="pt-14">
        <section className="border-b hairline py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              Case study · VCU Health · BAS Programmer
            </div>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-fg sm:text-4xl md:text-5xl">
              Four figures from the quarterly investigation
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg/80">
              Redacted excerpts from the report that flagged a USP 797/800 compliance
              drift and a coupled BAS-historian fault three months before EF1 failed
              catastrophically. Plot axes are kept; site identifiers and absolute
              setpoints are removed.
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {['CUSUM', 'Mann-Kendall', 'MEWMA Hotelling T²', 'Hawkes', 'PELT', 'Kalman/RTS', 'Weibull', 'Python']
                .map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border hairline bg-bg/60 px-2 py-0.5 font-mono text-[11px] text-muted"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 space-y-16">
            {figures.map((fig) => (
              <figure key={fig.index} className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-muted">{fig.index}</span>
                  <h2 className="text-xl font-medium tracking-tight text-fg md:text-2xl">
                    {fig.title}
                  </h2>
                </div>
                <div className="overflow-hidden rounded-lg border hairline bg-surface/40">
                  <Image
                    src={fig.src}
                    alt={fig.alt}
                    width={1600}
                    height={900}
                    sizes="(min-width: 1024px) 64rem, 100vw"
                    className="h-auto w-full dark:invert dark:hue-rotate-180"
                    priority={fig.index === '01'}
                  />
                </div>
                <figcaption className="max-w-3xl text-sm leading-relaxed text-fg/75">
                  {fig.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="border-t hairline py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 rounded-md border hairline bg-bg/60 px-4 py-2 font-mono text-xs text-fg/85 transition-colors hover:text-accent hover:border-accent/40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to selected projects
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
