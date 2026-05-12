import { ArrowUpRight, Download, Github, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b hairline pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      <div className="dotgrid absolute inset-0 -z-10 opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border hairline bg-surface/50 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          BAS Programmer · VCU Health · Richmond, VA
        </div>

        <h1 className="text-balance text-4xl font-medium tracking-tight text-fg sm:text-5xl md:text-6xl">
          I predicted a mechanical failure
          <br className="hidden sm:block" />{' '}
          <span className="text-muted">three months before it happened,</span>
          <br className="hidden sm:block" />{' '}
          from sensor data alone.
        </h1>

        <p className="mt-6 max-w-2xl text-base text-muted sm:text-lg">
          I&apos;m Antonio Balanzategui — a software engineer working at the
          intersection of applied statistics, GPU physics simulation, and
          building-systems control. Predictive maintenance during the day,
          atmospheric fluid dynamics at night.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button variant="default" size="lg" href="#work">
            View work
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="/Antonio_Balanzategui_Resume_1.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4" />
            Résumé
          </Button>
          <div className="ml-1 flex items-center gap-1">
            <a
              href="https://github.com/antbalanzategui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border hairline text-muted transition-colors hover:text-fg"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/antbalanzategui/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border hairline text-muted transition-colors hover:text-fg"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border hairline bg-fg/5 sm:grid-cols-4">
          {[
            ['3 mo', 'Lead time on EF1 failure prediction'],
            ['96%', 'BAS historian staleness reduction'],
            ['2.4M', 'GPU cells in EvolutionSim grid'],
            ['2nd', 'VTURCS Symposium 2025'],
          ].map(([stat, label]) => (
            <div key={stat} className="bg-bg p-4">
              <div className="font-mono text-2xl text-fg">{stat}</div>
              <div className="mt-1 text-xs text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
