export function About() {
  return (
    <section id="about" className="border-b hairline py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-[180px_1fr]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              01 / About
            </div>
          </div>
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-fg/90">
            <p>
              I graduated from{' '}
              <span className="text-fg">Virginia Tech</span> in May 2025 with a
              BS in Computer Science. Most of my interesting work sits at the
              edge of software and physical systems — sensors, control loops,
              fluid dynamics, atmospheric electrification — where the
              measurements lie and the math has to do the heavy lifting.
            </p>
            <p>
              I&apos;m a <span className="text-fg">BAS Programmer</span> at{' '}
              <span className="text-fg">VCU Health</span>. The
              statistical-analysis work wasn&apos;t part of the original role —
              I carved it out over my first three months as a side
              investigation into BAS trend-log data, and Pharmacy regulatory
              compliance leadership has since formalized it as a quarterly
              deliverable. On nights and weekends I&apos;m building{' '}
              <span className="text-fg">EvolutionSim</span>, a real-time
              multi-cell thunderstorm simulator on the GPU, because turbulent
              flow with charge transport is one of the most beautiful problems
              I&apos;ve found.
            </p>
            <p className="text-muted">
              Previously: undergraduate TA for VT&apos;s Intro to GUI
              Programming course, 2nd place at the VTURCS undergraduate
              research symposium for de novo protein folding, Pollard Scholar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
