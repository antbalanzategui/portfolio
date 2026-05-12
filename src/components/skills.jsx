const groups = [
  {
    label: 'Languages',
    items: [
      'Python', 'Rust', 'C++', 'Java',
      'JavaScript/TypeScript', 'SQL', 'C', 'R', 'MATLAB',
    ],
  },
  {
    label: 'Scientific stack',
    items: [
      'NumPy', 'SciPy', 'pandas', 'scikit-learn',
      'wgpu/WGSL', 'AMBER', 'LaTeX',
    ],
  },
  {
    label: 'Methods',
    items: [
      'CUSUM', 'Mann-Kendall', 'MEWMA Hotelling T²',
      'PELT change-point', 'Hawkes processes',
      'Kalman/RTS smoothing', 'Weibull survival', 'PCA',
      'Navier–Stokes', 'Simulated annealing',
    ],
  },
  {
    label: 'Systems & web',
    items: [
      'React/Next.js', 'Node/Express', 'PostgreSQL', 'MongoDB',
      'Docker', 'Linux', 'pytest', 'REST APIs', 'EcoStruxure',
    ],
  },
  {
    label: 'Languages (spoken)',
    items: ['English (native)', 'Spanish (proficient)'],
  },
];

export function Skills() {
  return (
    <section id="skills" className="border-b hairline py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              03 / Skills
            </div>
            <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
              Tools &amp; methods
            </h2>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border hairline bg-fg/5 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.label} className="bg-bg p-6">
              <div className="mb-4 flex items-baseline gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  {g.label}
                </span>
                <span className="font-mono text-[11px] text-muted/60">
                  /{g.items.length}
                </span>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border hairline bg-surface/40 px-2 py-1 font-mono text-[12px] text-fg/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
