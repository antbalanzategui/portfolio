import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Lock } from 'lucide-react';
import { SeoMeta } from '@/components/seo-meta';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import { useReducedMotion } from '@/lib/use-reduced-motion';

const sims = [
  {
    slug: 'blackhole',
    title: 'Black Hole',
    tagline: 'GPU-ray-traced M87*, with MAD eruptions and a live tidal-disruption event.',
    image: '/black_hole_thumbnail.png',
    video: '/evolutionsim/blackhole.mp4',
  },
  {
    slug: 'neutron-star-merger',
    title: 'Neutron Star Merger',
    tagline: 'GW170817 from inspiral through two-component kilonova.',
    image: '/neutron_star_merger_thumbnail.png',
    video: '/evolutionsim/neutron-star-merger.mp4',
  },
  {
    slug: 'lightning',
    title: 'Lightning',
    tagline: 'Takahashi electrification coupled to a gauge-invariant DBM.',
    image: '/evolutionsim/lightning.jpg',
    video: '/evolutionsim/lightning.mp4',
  },
  {
    slug: 'snowflake',
    title: 'Snowflake',
    tagline: 'Stellar dendrite from a single seed under Mullins-Sekerka instability.',
    image: '/snowflake_thumbnail.png',
    video: '/evolutionsim/snowflake.mp4',
  },
];

function SimCard({ sim }) {
  const reducedMotion = useReducedMotion();
  const [videoOk, setVideoOk] = useState(Boolean(sim.video));
  const [imgOk, setImgOk] = useState(true);
  return (
    <Link
      href={`/evolutionsim/${sim.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border hairline bg-surface/40 transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg/40">
        {sim.video && videoOk ? (
          <video
            src={sim.video}
            poster={sim.image}
            autoPlay={!reducedMotion}
            loop
            muted
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : imgOk ? (
          <Image
            src={sim.image}
            alt={`${sim.title} simulation preview`}
            fill
            sizes="(min-width: 1024px) 32rem, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="dotgrid absolute inset-0 flex items-center justify-center opacity-60">
            <span className="rounded-md border hairline bg-bg/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              {sim.video ? 'video' : 'image'} · {sim.slug}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-medium tracking-tight text-fg group-hover:text-accent">
            {sim.title}
          </h3>
          <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-accent" />
        </div>
        <p className="text-sm leading-relaxed text-fg/70">{sim.tagline}</p>
      </div>
    </Link>
  );
}

export default function EvolutionSim() {
  return (
    <>
      <SeoMeta
        title="EvolutionSim"
        description="A real-time GPU physics platform spanning thunderstorm electrification, black-hole geodesics, neutron-star mergers, lightning, and snowflake growth."
        path="/evolutionsim"
        ogImage="/black_hole_thumbnail.png"
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
          <div className="mx-auto max-w-5xl px-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              Project writeup · EvolutionSim · Personal research project
            </div>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-fg sm:text-4xl md:text-5xl">
              A GPU physics platform with four sub-simulations
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg/80">
              EvolutionSim is a Rust + wgpu compute platform with a Python physics
              layer. The same fluid / field machinery drives several distinct
              regimes — pick a sim below to read the writeup and watch it run.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border hairline bg-bg/60 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                <Lock className="h-3 w-3" /> Private repo
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                Demo + walkthrough available on request
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {['Rust', 'wgpu', 'WGSL', 'Python', 'Navier–Stokes', 'GPU compute', 'pytest']
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
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted">
                  Simulations
                </div>
                <h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
                  Four regimes, one engine
                </h2>
              </div>
              <p className="hidden max-w-sm text-sm text-muted md:block">
                Each tile opens a dedicated writeup with figures and notes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {sims.map((sim) => (
                <SimCard key={sim.slug} sim={sim} />
              ))}
            </div>
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
