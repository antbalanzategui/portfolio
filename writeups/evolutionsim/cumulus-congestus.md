# Cumulus Congestus

*Towering cumulus grown from a single sounding — the tower, the cap that stops it, and the flip from wider-than-tall to taller-than-wide all emerge from moist convection. Nothing is sculpted.*

---

A real-time GPU simulation of **cumulus congestus** — the towering cumulus that sits
between a fair-weather sky and a thunderstorm. Same engine that produces 15 km
electrified supercells, same compiled binary, same core kernels. The only thing that
changes is the air you feed it.

## THE SIMULATION, END TO END

Feed the engine a higher-CAPE profile — a deep moist, conditionally-unstable layer
capped by a weak inversion near 6 km — and let it run. Everything after that has to
emerge:

- **Towers grow.** Cloud tops climb from ~2.4 km to ~6.6 km.
- **The aspect ratio flips.** Plume width-to-depth falls from ~1.8, through unity, to
  ~0.4 at its deepest. The clouds become *taller than wide*.
- **The cap holds.** The field decelerates into its inversion instead of running away.
- **No anvil forms.** It stays towering cumulus rather than glaciating into
  cumulonimbus.

Nothing in that list is a setting. There is no "tower height" parameter and no
sculpted cloud shape.

![From the reel: cloud tops rise to ~6.6 km and the width-to-depth ratio falls below 1.](/figs/congestus/01_congestus_regime.png "Tops rise to ~6.6 km and the aspect ratio falls below 1 — a true tower, not a fair-weather puff. Grown from one sounding.")

### The aspect-ratio flip

This is what actually makes congestus *congestus*, and it's the reason the regime is
worth showing at all.

A fair-weather cumulus is a squat puff — wider than it is deep, pinned under an
inversion it cannot break. A congestus is a tower: the plume punches through a weaker
cap and keeps going. The width-to-depth ratio crossing 1.0 *is* the regime change.
It's a geometric signature, not an aesthetic one, and it either happens or it doesn't.

### The cap that stops it

A cumulonimbus freezes at the top, spreads into an anvil, and starts making
lightning. A congestus doesn't get there. It decelerates into its cap and stays a
tower — which is a harder thing to produce than either neighbour, because the run has
to be unstable enough to build a tower and stable enough not to become a storm.

In the growth sequence the cap breach is progressive: the fraction of cloud mass above
the cap reaches ~95% by t = 1500 s.

![A tower is born, in six moments, with the cap-breach inset.](/figs/congestus/05_congestus_growth.png "The growth filmstrip — a tower is born in six moments. The inset tracks cloud mass above the cap, which reaches ~95% by t = 1500 s.")

### Three skies, one core

Congestus is the middle rung of three, and the three together are the actual claim:

- **Fair-weather cumulus** — tops ~2.2 km, aspect ~1.3, wider than tall.
- **Towering congestus** — tops ~6.6 km, aspect down to ~0.4, taller than wide.
- **Deep electrified supercell** — tops ~15 km, full charge structure and lightning.

Humilis to severe, on one engine, separated by nothing but the sounding. An engine
that only makes supercells isn't an engine — it's an effect.

![Updraft efficiency versus CAPE across 11 real soundings.](/figs/congestus/04_regime_map.png "Updraft efficiency versus CAPE across 11 real soundings: maritime storms punch below their fuel — the 'tropical CAPE paradox' — and the engine reproduces it.")

### Making the fine-scale regime run at all

The hardest part of this work wasn't the clouds. It was a boundary condition.

Shallow convection needs **75 m isotropic cells** to resolve individual puffs — the
opposite end of the engine from the ~180–270 m deep-storm runs. At 75 m a domain big
enough for a deep storm is out of reach, but a shallow field fits: 128 × 64 × 128 cells
over a 9.6 km box with a 4.8 km lid.

The problem is that the CPU reference uses **periodic** lateral boundaries and the GPU
pressure solve uses **Dirichlet** walls. In a deep-storm run that difference is
invisible — the cell sits mid-domain and never talks to the edges. In a shallow field
that fills the whole box it is fatal: solid walls trap the convective overturning,
the compensating descent has nowhere to go, and the field drives itself into runaway
updrafts.

Three opt-in additions fixed it, and none of them touches a core kernel. All three are
off by default, so the deep-storm path runs exactly the code it ran before:

- **A radiative-convective-equilibrium closure** — prescribed large-scale subsidence
  plus radiative cooling, holding the field in statistical steady state instead of
  letting it erode its own cap and deepen into storms.
- **Plume-scale re-seeding** — periodic re-injection of boundary-layer perturbations,
  so the field keeps generating puffs instead of running down.
- **An absorbing edge sponge** — a Rayleigh layer damping velocities toward the ≈0
  fair-weather base state near the lateral walls.

Between them the sponge supplies the non-reflecting boundary the Dirichlet walls lack,
and the imposed subsidence supplies the compensating descent that periodic recycling
would have provided. That's a GPU-architecture constraint solved on the physics side.
The alternative was rewriting the pressure solver for periodic boundaries — a real
project — and two opt-in terms chosen to reproduce what the missing boundary condition
would have done got the regime running on the engine as it already existed.

## PHYSICS ENGINE

A CPU/GPU hybrid, Rust + `wgpu` + WGSL, 134 compute entry points across 54
shader files. Every continuous field runs on the GPU every step:

- Incompressible Navier–Stokes with a geometric-multigrid pressure projection
- Virtual-potential-temperature buoyancy with CAPE-scaled entrainment
- Conservative flux-form (MPDATA) advection — water closes to machine precision
- Bulk microphysics growing cloud water, rain, ice, snow and graupel

Alongside it sits a double-precision CPU implementation used as a validation oracle.
It is far slower, and it is the thing the GPU gets checked against, kernel by kernel.

For congestus and the shallow field the electrification is simply off. This is pure
moist convection: buoyancy, condensation, entrainment, and a cap.

## VERIFICATION, AND WHAT THIS IS NOT

![Cloud-top height across an entrainment sweep.](/figs/congestus/03_entrainment_sweep.png "Cloud-top height across an entrainment sweep — why the modeled heights are honest, and what parameter tuning cannot move.")

The fair-weather sibling of this run **is** validated. Against the double-precision
reference at matched cloud cover, the GPU field reproduces the statistics that define
shallow-cumulus morphology — cloud-top cap 2.25 km against the reference's 2.16 km,
inter-cloud spacing 1.13 km against 1.01 km, comparable aspect ratio. Its puffs run a
little larger and a little further apart than the reference's (411 m against 375 m
across), so the claim is the field's morphology and scale, not a puff-for-puff
correspondence.

![The GPU shallow-cumulus field against the double-precision reference at matched cloud cover.](/figs/congestus/02_cumulus_field.png "The validated result: the GPU field against the double-precision reference at matched cloud cover. The claim is morphology and scale — cap height, spacing, aspect ratio — not a puff-for-puff match.")

**The congestus is not that.** It is a capability demonstration, not a validated case
study:

- It is verified to be *qualitatively* realistic — correct depth range for
  mid-latitude congestus, correct taller-than-wide morphology, a cap that holds rather
  than running away.
- It is **not** matched against observations, or against the CPU oracle, the way the
  deep-storm supercells and the shallow field are.
- The velocity clamp that bounds the shallow field also caps the congestus updrafts,
  so its peak-updraft magnitude carries **no** quantitative claim.

It's here to show regime breadth on one core, and it sits deliberately outside the
validated set. A good-looking tower shouldn't imply a validation that was never run.

---

*Congestus runs 128 × 64 × 128 cells at 133 m, a 17 km box with an 8.5 km lid; the
fair-weather field runs the same grid at 75 m over 9.6 km. Both on a GTX 1660. Method
and verification detail in §4.9–4.10 of the manuscript.*
