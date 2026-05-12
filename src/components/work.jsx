import { ArrowUpRight, Lock } from 'lucide-react';

const featured = [
  {
    index: '01',
    title: 'VCU Health — Predictive Maintenance Pipeline',
    role: 'BAS Programmer · Engineered Services, Inc.',
    period: 'Jan 2026 — Present',
    tagline:
      'Predicted a catastrophic exhaust-fan failure three months early from BAS sensor data alone.',
    body: [
      'I build the Python pipeline that ingests 10+ months of BAS trend-log data across 12 sensor channels and runs the full quarterly investigation end-to-end: CUSUM and Mann-Kendall for change-point detection, MEWMA Hotelling T² for multivariate process control, Hawkes self-exciting processes for cascade diagnosis, Kalman/RTS smoothing, Weibull survival, PELT, PCA.',
      'February 2026: the pipeline flagged a mechanical change-point with no corresponding work order. Validated March 19 when EF1 failed catastrophically. VCU Health Pharmacy now formally requests quarterly investigations.',
      'The same investigation also surfaced a separate issue with the BAS historian itself. Hawkes self-exciting analysis put the system at a branching ratio of n*=0.973 — sitting just below the critical threshold, meaning stale-data events across all 12 channels were nearly self-sustaining. I traced the cascade to an ExTL buffer / Maximum Transfer Interval mismatch, and the configuration fix that followed reduced worst-case data staleness from 24 hours to 1 hour, a 96% reduction.',
      'Separately, I decoded the Schneider EBO/Continuum RTU control programs from XML export to find a disabled humidity reset and a hardcoded exhaust-fan loop bypassing the configured PID — both root causes of USP 797/800 compliance drift invisible from sensor data alone.',
    ],
    metrics: [
      ['3 months', 'Lead time on EF1 failure prediction'],
      ['0.973', 'Hawkes branching ratio (near-critical)'],
      ['24h → 1h', 'Worst-case historian staleness'],
      ['~1 week', 'Manual ticket-migration work eliminated'],
    ],
    stack: [
      'Python', 'NumPy/SciPy', 'pandas', 'scikit-learn',
      'CUSUM', 'Mann-Kendall', 'MEWMA', 'Hawkes', 'Kalman/RTS',
      'PELT', 'PCA', 'Weibull', 'Schneider EBO', 'REST APIs',
    ],
    media: {
      placeholder: 'Redacted snippets from the quarterly investigation report — coming soon.',
    },
  },
  {
    index: '02',
    title: 'EvolutionSim — Real-Time Multi-Cell Thunderstorm Simulator',
    role: 'Personal research project',
    period: '2025 — Present',
    tagline:
      'A coupled fluid-dynamics, microphysics, and lightning electrification simulator on the GPU.',
    body: [
      'Real-time multi-cell thunderstorm simulator coupling 6-species Thompson bulk microphysics, Takahashi non-inductive electrification, and a gauge-invariant Dielectric Breakdown Model (Herrera et al. 2025) on a unified 2.4M-cell GPU fluid grid.',
      'Incompressible Navier–Stokes core: Boussinesq buoyancy, Chorin projection, MacCormack semi-Lagrangian advection, Jacobi pressure solve, vorticity confinement. Schemes from Stam (1999), Selle et al. (2008), Fedkiw–Stam–Jensen (2001).',
      '13K-line Python physics layer drives the GPU, verified numerically against published constants — Heidler return-stroke peak current 29,956 A vs 30,000 A target; breakdown field within 1% per Marshall et al. 1995; gauge invariance and charge conservation verified to floating-point. The broader platform is ~330K LoC across Python and Rust, 14 foundation physics modules, 333+ simulation modes, with a 124K-line pytest suite.',
    ],
    metrics: [
      ['2.4M', 'Cells in the unified GPU fluid grid'],
      ['~4,600', 'LoC of WGSL compute shaders'],
      ['333+', 'Simulation modes'],
      ['<1%', 'Deviation from published constants'],
    ],
    stack: [
      'Rust', 'wgpu', 'WGSL', 'Python',
      'Navier–Stokes', 'Boussinesq', 'MacCormack',
      'Thompson microphysics', 'Takahashi electrification',
      'DBM', 'pytest',
    ],
    private: true,
    media: {
      placeholder: 'Private repo — demo and code walkthrough available on request.',
    },
  },
  {
    index: '03',
    title: 'De Novo Protein Folding Simulation',
    role: 'CS 4414 — Issues in Scientific Computing · Team of 4',
    period: 'Spring 2025',
    award: '2nd Place — VTURCS Undergraduate Research Symposium',
    tagline:
      'Predicted the native structure of a 21-residue peptide from sequence alone, without ML.',
    body: [
      'Predicted the native structure of Protein T (NLYIQWLKDGGPSSGRPPPS) — a 21-residue peptide — from sequence alone, without ML or structural databases.',
      'Designed four custom simulated-annealing protocols in AMBER using Langevin dynamics and generalized-Born implicit solvent. Cyclic MSA-MD produced the lowest-energy conformation at −512.26 kcal/mol.',
      'Benchmarked five optimization methods (Differential Evolution, Simulated Annealing, Nelder-Mead, Newton, Steepest Descent) on custom 1D/2D folding-funnel test functions; stochastic methods proved substantially more reliable on rugged energy landscapes.',
    ],
    metrics: [
      ['−512.26', 'kcal/mol lowest-energy conformation'],
      ['4', 'Custom SA protocols'],
      ['21', 'Residues in Protein T'],
    ],
    stack: [
      'AMBER', 'Langevin dynamics', 'Generalized-Born',
      'Simulated annealing', 'Python', 'MD',
    ],
    links: [
      {
        href: '/cs4414-protein-folding.pdf',
        label: 'Read the paper',
      },
    ],
  },
];

const archive = [
  {
    title: 'UTA — Intro to GUI Programming',
    period: 'Aug 2024 — May 2025',
    blurb:
      'Supported 100+ students through OOP design, event-driven programming, GUI architecture, and the math behind 2D graphics at Virginia Tech.',
  },
  {
    title: 'Umineko API',
    period: '2023',
    blurb:
      'Express + MySQL API with a schema-driven query validator that auto-generates middleware routes and per-route error messages. Backing data built via Python web-scraping and external APIs.',
    href: 'https://github.com/antbalanzategui/UminekoAPI',
  },
  {
    title: 'External Quicksort + Buffer Pool',
    period: '2024',
    blurb:
      'Modified Quicksort with LRU buffer pool managing on-disk I/O for sorting large binary data sets. Command-line interface reports cache hits, disk reads/writes, and execution time.',
  },
  {
    title: 'Isotherm Plotting Program',
    period: '2023',
    blurb:
      'Python + Matplotlib tool for density calculations across four equations of state with interactive sliders, plus customizable isotherm plotting.',
    href: 'https://github.com/antbalanzategui/speciesCalculator',
  },
];

function FeaturedCard({ project }) {
  return (
    <article className="group relative grid gap-8 border hairline rounded-xl bg-surface/40 p-6 md:p-10 md:grid-cols-[200px_1fr]">
      <div className="space-y-3">
        <div className="font-mono text-xs text-muted">{project.index}</div>
        <div className="font-mono text-xs uppercase tracking-wider text-muted">
          {project.period}
        </div>
        {project.role && (
          <div className="text-sm text-muted">{project.role}</div>
        )}
        {project.award && (
          <div className="inline-block rounded-md border hairline bg-accent/10 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
            {project.award}
          </div>
        )}
        {project.private && (
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted">
            <Lock className="h-3 w-3" /> Private repo
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-base text-fg/80">{project.tagline}</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-fg/80">
          {project.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {project.metrics && (
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border hairline bg-fg/5 sm:grid-cols-4">
            {project.metrics.map(([stat, label]) => (
              <div key={label} className="bg-bg p-3">
                <div className="font-mono text-base text-fg">{stat}</div>
                <div className="mt-1 text-[11px] leading-snug text-muted">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {project.media?.placeholder && (
          <div className="mt-6 flex items-center justify-center rounded-lg border hairline border-dashed bg-bg/40 p-6 text-center font-mono text-xs text-muted">
            {project.media.placeholder}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="rounded-md border hairline bg-bg/60 px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border hairline bg-bg/60 px-3 py-1.5 font-mono text-xs text-fg/85 transition-colors hover:text-accent hover:border-accent/40"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className="border-b hairline py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              02 / Work
            </div>
            <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
              Selected projects
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm text-muted md:block">
            Three pieces I&apos;d want to talk through over coffee. The rest
            sit below.
          </p>
        </div>

        <div className="space-y-8">
          {featured.map((p) => (
            <FeaturedCard key={p.index} project={p} />
          ))}
        </div>

        <div className="mt-20">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
              Other work
            </h3>
            <div className="h-px flex-1 mx-6 bg-fg/10" />
            <span className="font-mono text-xs text-muted">
              {String(archive.length).padStart(2, '0')}
            </span>
          </div>
          <ul className="divide-y divide-fg/10">
            {archive.map((item) => {
              const Wrapper = item.href ? 'a' : 'div';
              const wrapperProps = item.href
                ? {
                    href: item.href,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }
                : {};
              return (
                <li key={item.title}>
                  <Wrapper
                    {...wrapperProps}
                    className="group grid gap-2 py-5 md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-6"
                  >
                    <div className="font-mono text-xs uppercase tracking-wider text-muted">
                      {item.period}
                    </div>
                    <div>
                      <div className="text-base text-fg group-hover:text-accent">
                        {item.title}
                      </div>
                      <div className="mt-1 text-sm text-muted">
                        {item.blurb}
                      </div>
                    </div>
                    {item.href && (
                      <ArrowUpRight className="hidden h-4 w-4 text-muted group-hover:text-accent md:block" />
                    )}
                  </Wrapper>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
