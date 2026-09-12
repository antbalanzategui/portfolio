# The Storm Engine

*A real-time GPU engine where the storm is not drawn — it is solved. Cloud shape, rain, charge structure and every lightning bolt are consequences of the equations, not assets.*

---

Most simulated weather is art directed. A cloud is a texture, a bolt is a spline with a
glow, and the "physics" is a set of parameters tuned until it looks right.

This is the other approach. The engine solves moist convection on a grid, and whatever
comes out of that is what you see. If the atmosphere you feed it can't support a storm,
you don't get one.

## THE PIPELINE, END TO END

Five stages, each computing the next, with feedback loops that close the system.

![The five-stage physics pipeline with governing equations and the feedback loops that close the system.](/figs/engine/fig_schematic_v2.png "The five-stage physics pipeline — governing equations per stage, and the three feedback loops that close the system: latent heat into buoyancy, precipitation and the cold pool into the downdraft, discharge into the field.")

**1 — Environment.** A real radiosonde sounding: temperature, humidity and wind against
height, measured by an actual weather balloon. CAPE and convective inhibition come out
of that profile rather than being set. This is the *only* input.

**2 — Dynamics.** 3D moist Navier–Stokes under the Boussinesq approximation.
Virtual-potential-temperature buoyancy with CAPE-scaled entrainment, conservative
flux-form (MPDATA) advection, and a geometric-multigrid pressure projection enforcing
incompressibility. The flux form is why total water closes to machine precision instead
of quietly leaking.

**3 — Microphysics.** Six-species bulk scheme — vapour, cloud water, rain, ice, snow,
graupel — handling condensation, warm-rain collection, riming, aggregation and melting.
In the two-moment configuration it carries prognostic number concentrations alongside
mass, so particles size-sort as they fall.

**4 — Electrification.** Non-inductive graupel–ice charging: ice particles exchange
charge when they collide in the updraft, with the sign set by temperature and liquid
water content. Charge is then advected with the hydrometeors that carry it, and a second
multigrid solve recovers the electric field from the resulting charge density.

**5 — Lightning.** When the field exceeds the breakdown threshold, a bidirectional
stepped leader grows along it — a branching channel propagating where the field actually
points. Each flash is typed cloud-to-ground, intracloud or cloud-air by **where its
channel terminates.** No height heuristic. No dice roll.

The loops matter as much as the stages. Latent heat from condensation feeds back into
buoyancy. Precipitation loading and the cold pool drive the downdraft. Discharge
neutralizes charge, which changes the field, which changes where the next leader goes.

## WHY IT IS A HYBRID

Everything continuous runs on the GPU. One thing does not.

Stencil computations over structured grids are the archetypal GPU workload — every cell
does the same arithmetic on its neighbours, which is exactly what wide SIMD hardware is
built for. Dynamics, microphysics, charge separation and both multigrid solves all live
there, in Rust + `wgpu` + WGSL across 134 compute entry points in 54 shader
files.

![The GPU compute pipeline in real WGSL dispatch order, with per-kernel parity ticks and the CPU-leader handoff.](/figs/engine/fig_kernels.png "The GPU compute pipeline in real WGSL dispatch order — per-kernel single-precision parity ticks, per-stage bands, and the hand-off to the CPU leader at the breakdown gate.")

The lightning leader doesn't fit that shape. Growing a branching channel is a sequential
graph problem: each step depends on the last, the work per step is tiny and irregular,
and there is nothing to parallelize across. So it stays on the CPU.

The two are joined by a **breakdown gate**. Every step the GPU computes
`max(|E| / E_breakdown)` and reads back a single 4-byte value. Only when that exceeds
unity does control hand off to the CPU leader. The rest of the time nothing crosses the
bus.

That split is measured, not assumed. Profiling the flash handler showed the GPU↔CPU
field round-trip — the thing I was about to optimize — is **1.6%** of per-flash wall
time, while the leader's own multigrid re-solve is **67%**. The I/O was never the
bottleneck. Parallelizing that solve's red-black smoother across 16 cores cut it
**1.9×**, and a faster variant that perturbed the result was rejected: a speedup that
changes the physics isn't a speedup.

In the interactive renderer, stages can run at different cadences — dynamics and
microphysics every second frame, electrification and the lightning path every eighth —
because charge structure evolves far more slowly than the flow that builds it. The
research binary behind every result here does not gate: it advances every continuous term
every step, and computes the breakdown check each step.

## HOW IT IS CHECKED

A second, independent implementation exists purely to disagree with the first.

The CPU reference is written in Python (NumPy/Numba) at **double precision**. It is far
slower and it is not the thing you run — it is the thing you check against, kernel by
kernel. Each GPU kernel is gated against its double-precision counterpart at roughly
**1e-6 relative RMS**: single-precision tolerance, the floor 32-bit arithmetic allows.

That number is the point. It means the GPU engine is not a faster *approximation* of the
physics — it is the same physics, run to the precision the hardware has.

The reference is also upstream of the engine it validates: it builds the initial
condition for every GPU run from the sounding. And it is not frozen — it has received
physics corrections since the parity gates were run, so parity results describe the build
they were measured against, not an eternal guarantee.

Beyond parity, the engine is checked against things it cannot fake:

- **Conservation** — total water closes to machine precision on the double-precision
  reference, ~1e-9 relative on the GPU.
- **Canonical cases** — Kessler, Weisman–Klemp, and Rotunno–Klemp–Weisman.
- **Real soundings** — fourteen of them, spanning CAPE from 0 to 4822 J/kg, reproducing
  the observed continental-versus-maritime updraft contrast.
- **Capped controls** — soundings with real convective inhibition produce *no storm*.
  An engine that always makes a storm has proven nothing.
- **Ensembles** — six seeds separate the exactly-deterministic fluid and microphysics
  solve from the one stochastic component, the leader's wander.

## WHAT IT COSTS

At matched resolution the GPU hybrid runs **5–8× the single-threaded CPU reference**, and
it reaches grids the reference cannot practically run at all. A 5.3-million-cell storm
completes its entire lifecycle in about **12 minutes** on a GTX 1660 — a mid-range
consumer card, not a datacentre part.

The hydrometeor field is written straight into a 3D texture shared with a custom volume
raymarcher, so a finished run can be rendered live and scrubbed through on a timeline.

## THE HONEST PART

- **The pressure solve uses a collocated grid**, which admits odd–even decoupling — the
  classic checkerboard mode. It produces transient grid-scale updraft spikes, bounded by
  a velocity guard. Moving to a staggered arrangement is the known fix and is not done.
- **Deep storms run in the convective gray zone** (~180–270 m cells), where the updraft
  is under-resolved by construction. Peak updraft is therefore a guarded quantity, and on
  some runs the velocity guard is *binding* rather than merely present.
- **Parity is per-kernel.** Each kernel is gated against the double-precision reference
  individually; that is a stronger statement than most GPU ports make and a weaker one
  than end-to-end equivalence.
- **The shear profile is single-direction**, so supercell mesocyclone rotation is not
  resolved. Agreement with observed storms is one of depth, intensity, precipitation and
  electrification — not a cell-by-cell radar match.

None of these are secrets held back from the paper; they are limitations the paper
carries, and they are the difference between a model and a demo.

---

*Rust + wgpu + WGSL, 134 compute kernels across 54 shader files, with a
double-precision Python reference oracle. Runs on a GTX 1660.*
