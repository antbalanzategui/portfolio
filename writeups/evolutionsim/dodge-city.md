# Dodge City

*A weather balloon went up on 26 May 2024. That sounding — and nothing else — went into the engine, and a giant-hail supercell came back out: right depth, right intensity, prolific and correctly-structured lightning. None of it was dialled in.*

---

On 26 May 2024 a supercell near Dodge City, Kansas dropped hail the size of grapefruit —
3.5-inch stones. The question worth asking is not whether a simulation can be made to
look like that. It is whether the *actual atmosphere* of that day, handed to a physics
engine with no other information, produces a storm like that on its own.

It does. This is that run.

## THE RULE: REAL AIR IN, NOTHING ELSE

The one discipline that makes this interesting is that **the only input is the
sounding** — the vertical profile of temperature, moisture and wind from a single
weather balloon. No radar, no satellite, no nudging the model toward the answer, no
hand-drawn cloud. A warm bubble is seeded in the modeled Dodge City air and the equations
run.

Everything after that has to *emerge*, or it doesn't happen: the updraft, the anvil, the
rain, the ice, the charge structure, and every lightning bolt.

Under the hood that means the real physics of moist convection — incompressible
Navier–Stokes with a geometric-multigrid pressure solve, bulk microphysics growing cloud
water, rain, ice, snow and graupel, non-inductive charge separation (ice particles trade
charge when they collide in the updraft), and a second field solve for the electric
field. When that field crosses the breakdown threshold a leader grows along it, branching
and stepping, and each flash is typed cloud-to-ground or intracloud by **where its channel
actually ends** — not by a dice roll.

## WHAT CAME OUT

Driven by the Dodge City sounding, the engine produced a deep, violent, electrified
supercell:

- **Cloud top ~14.9 km.** A storm that punches to the tropopause.
- **Peak updraft ~55 m/s.** The kind of engine that lofts and re-lofts hail into
  grapefruit stones. Treat it as a *lower bound* — see below.
- **24 cloud-to-ground strikes, IC:CG ≈ 14.5.** Roughly fourteen in-cloud flashes for
  every one that reaches the ground.

None of those numbers were dialled in. They are what the modeled atmosphere did, and they
line up with the real event: deep enough, with an updraft strong enough and a charge
structure active enough, to match the severity that produced giant hail that day.

![The storm in one image — reflectivity, charge structure and lightning.](/figs/kddc/01_hero_kddc.png "The storm in one image: reflectivity, charge and lightning. Cloud top 14.9 km; updraft reads 26 m/s in this instantaneous slice, 55 m/s at the run peak.")

![The whole life of the storm in ten moments.](/figs/kddc/02_lifecycle.png "The storm's whole life in ten moments — from first convection to a mature, electrified supercell.")

![Radar's-eye view of the cell, regenerated at 128 cubed.](/figs/kddc/04_topdown_reflectivity.png "Radar's-eye view of the cell, regenerated at 128³ from the canonical hero run: 348 in-cloud flashes (IC+CC) and 24 cloud-to-ground — IC:CG ≈ 14.5, the same counts the copy quotes.")

### Where the lightning ratio sits

Observed storms across the US run nearer 1–9 (mean ~3), the high end belonging to
vigorous high-plains storms like this one. The model sits **above** that range, and there
are two reasons worth naming: its lower positive charge pocket — the feature that pulls a
leader down to ground — is weaker than nature's, and 24 ground strikes is a thin sample
to build a ratio on. The ground strikes themselves are abundant and resolution-robust. It
is the *ratio* that runs high.

![Every flash of the storm's life in 3D.](/figs/kddc/03_flash_constellation.png "Every flash of the storm's life in 3D — 24 cloud-to-ground strikes (white) among 348 in-cloud flashes (amber).")

![The emergent three-layer charge structure.](/figs/kddc/05_charge_tripole.png "The emergent three-layer charge structure — a tripole the engine was never told to build, recovered from the field the storm made.")

## THE PART THAT WAS GENUINELY HARD

The dynamics and microphysics were the easy 90%. The lightning was the other 90%.

For a long time this storm threw *no* cloud-to-ground strikes at all — the ratio came back
as pure intracloud, which is wrong for a Plains supercell. Chasing that down was its own
multi-week saga, written up separately as **[Chasing a dead lightning bolt](/evolutionsim/chasing-a-dead-lightning-bolt)**.

The short version: the descending leader's reach was being budgeted in *grid cells*
instead of *metres*. As the mesh got finer the same ~9 km charge-to-ground gap spanned
more cells, and the leader fizzled before it hit the dirt. Scaling the reach to a fixed
physical distance fixed it — and the CG strikes stayed back as the mesh changed, which is
the property that actually matters.

## THE HONEST PART

This is a research model, and it gets held to research honesty:

- It is driven only by the pre-storm sounding. It is **not** radar-initialized data
  assimilation, and it does not resolve the supercell's mesocyclone rotation in its
  current single-direction shear setup. The agreement is one of **depth, intensity,
  precipitation and electrification** — not a cell-by-cell reproduction of the real radar.
- The peak updraft is limited by a stability cap and by grid resolution (the convective
  "gray zone"), so ~55 m/s is a guarded lower bound — a consistency check against observed
  *severity*, not a measured wind.
- The lightning count carries real run-to-run variance (leader wander is the only
  stochastic piece), so the stable, quotable number is the **ratio**, not the exact strike
  tally.

With those caveats stated plainly the headline stands: a real weather-balloon sounding
went in, and a physically faithful giant-hail supercell came out.

---

*Grid 128×96×128 on a GTX 1660. The GPU solves every continuous field each step and the
CPU grows the one stubbornly serial thing — the lightning leader — only at the instant of
breakdown; the two agree to single-precision tolerance, about one part in a million
relative RMS. At matched resolution that runs 5–8× the single-threaded CPU reference, and
it reaches grids the reference cannot practically run at all: a 5.3-million-cell storm
completes its whole lifecycle in about 12 minutes, rendered live and scrubbable on a
slider. Engine detail in [The Storm Engine](/evolutionsim/storm-engine).*
