---
title: When the fancy math can't beat a setpoint
date: 2026-06-27
topic: Controls · Building Automation
description: A "the fan won't run" call on a hospital fan-coil unit turned into a study of velocity-form PID, reachability, and why a Pontryagin-optimal controller sometimes makes exactly the same decision a one-line setpoint change would.
tags: [controls, bas, pid, mpc, reachability]
---

*How a "the fan won't run" troubleshooting call turned into a study of velocity-form
PID, limit cycles, and why Model Predictive Control sometimes makes exactly the same
decision a one-line setpoint change would.*

---

## The setup

A fan-coil unit (FCU) serving a comms room wouldn't keep its fan running. The unit
is an Andover Continuum b3 BACnet controller, its sequence written in the old
"Plain English" b3 scripting language. Five little programs run inside it:

- **UnitControl** — the sequencer. Decides fan on/off and the cooling-stage flags.
- **ChwValveCtrl** — modulates the chilled-water valve.
- **FanSpdCtrl** — modulates the ECM fan speed.
- **AlarmMonitor**, **Tmrfnc** — alarms and a timer helper.

Someone on the job had pointed at the PID gains — "the `Kp` and `Kd` are wrong, that's
why the fan won't start." That turned out to be wrong in an interesting way, and
chasing *why* opened up a much better question:

> Could you make this fan run essentially 100% of the time through control alone —
> without just hardcoding "always on"?

To answer it properly I rebuilt the controller in Python, bolted it to a thermal
model of the room, and then — for sport — pitted a full Model Predictive Controller
against the humble PID. Here's what fell out.

---

## Part 1: The PID labels are lying to you

The valve and fan loops share this inline math, run every controller scan:

```
Err = Cv - Setp
adj = (Err * Kp) * 0.01 * |MaxOut - MinOut|
adj = adj - (Lerr - Err) * (100 * Kd)
Out = clamp(Out + adj, MinOut, MaxOut)
Lerr = Err
```

The tell is `Out = Out + adj`. The output **accumulates** the increment — this is a
*velocity-form* (incremental) controller, not a positional one. Expand `adj`:

```
adj = [Kp · 0.01 · span] · Err  +  [100 · Kd] · (Err − Lerr)
```

Because the output integrates `adj` over time, the term multiplying `Err` becomes
**integral** action, and the term multiplying the error *change* `(Err − Lerr)`
becomes **proportional** action. So in this code:

| Displayed as | Actually behaves as |
|---|---|
| `Kp` | **Integral** gain |
| `Kd` | **Proportional** gain |

The valve (`Kp=0.04`, `Kd=0.4`) is really a PI controller whose dominant response is
proportional-to-the-rate-of-error, trimmed by a slow integral. Whatever you call the
knobs, **none of them appears anywhere in UnitControl** — the program that actually
decides whether the fan runs. That's the first nail in the "it's the gains" coffin:
the fan on/off decision is pure logic and timers, with no calculus in it at all.

---

## Part 2: What actually sets the fan's duty cycle

UnitControl turns the fan off when the room drops below `StptCooling − DiffCooling`
(here, 73 − 0.5 = **72.5 °F**). So I swept the things people assume matter — the load,
the PID gains — and measured fan duty cycle.

![Fan duty cycle is flat at 100% across internal load](/figs/fcu/duty_vs_load.png "Fan duty cycle stays at 100% across an order of magnitude of internal cooling load.")

```
Q_load (BTU/hr):  4000  6000  8000 10000 12000 14000 16000
Fan duty (%):      100   100   100   100   100   100   100
Valve Kp:        0.01  0.02  0.04  0.08  0.16  →  duty 100% for all
```

Flat at 100%, across an order of magnitude of load and gain. The reason is almost
embarrassingly simple: **the valve modulates to hold setpoint and can close all the
way to 0%.** So under any positive cooling load the room equilibrates *at* 73 °F and
never reaches the 72.5 °F trip. The fan simply never gets a reason to stop.

![Baseline run: room temperature, fan, valve, and heat flows over time](/figs/fcu/baseline_plot.png "Baseline simulation — fan runs continuously, valve modulates, room sits at setpoint.")

This is the everyday regime: *the fan already runs continuously on its own.* The
occasional dropouts operators see aren't a tuning defect — they're the other regime.

---

## Part 2½: Is the loop even well-tuned? Ask the poles

The gains don't decide whether the fan runs — but they do decide how *gracefully*
the valve holds temperature, and that's a fair question to answer rigorously. So I
linearized the plant about its operating point and wrote the velocity-form controller
as its equivalent continuous PI ($K_{p,c} = 100 \cdot K_d$ proportional,
$K_{i,c} = K_p \cdot 0.01 \cdot \text{span} / dt_\text{scan}$ integral). The closed
loop is second order; here's what the eigenvalues say:

| Unit | Damping ζ | Phase margin | Notes |
|---|---|---|---|
| As-built (`Kp=0.04`) | **0.13** | **14°** | markedly underdamped |
| Working unit (`Kp=0.02`) | 0.18 | 20° | better damped, more margin |

![Closed-loop pole locus and damping vs proportional gain (underdamped)](/figs/fcu/linear_analysis.png "Closed-loop poles and damping vs proportional gain — the as-built unit is markedly underdamped.")

Two real findings fall out:

1. **The as-built valve loop is underdamped** ($\zeta \approx 0.13$, phase margin
   $\sim 14°$ — well under the 30–60° rule of thumb). That *is* the temperature
   overshoot you see in the baseline time-domain plot; it's not noise. Reaching a
   textbook $\zeta = 0.707$ would take roughly $K_d \approx 2.3$, or — more simply —
   *lowering* the integral term.
2. **The "working" unit is the better-tuned one.** Its lower `Kp` (integral gain) buys
   more damping and more phase margin. The earlier instinct to bump `Kp` up made the
   loop *less* stable, not more.

There's also a subtlety worth flagging: because $K_{i,c} \propto 1/dt_\text{scan}$,
the integral gain — and therefore the damping — depends on the controller's scan
rate. Speed up the scan and the loop gets *less* damped. The tuning is silently
coupled to the firmware.

So: the gains can't keep the fan on, but they *can* be improved for smoothness — and
the classical answer (less integral) agrees with the field-observed "good" unit.

---

## Part 3: The only way the fan actually drops out

For the room to fall below 72.5 °F, something has to pull it down while the valve is
already shut. That needs a net heat **sink** — low internal load plus heat loss to
cooler surrounding spaces. Model that and the fan finally cycles:

```
Q_load = 1000 BTU/hr, envelope loss to 66 °F space  →  fan duty 73.8%, room sags to 72.3 °F
```

That's the "shuts off sometimes, but mostly runs" behavior, and it's *correct*
physics: there is genuinely no cooling demand, so a cooling-driven fan stops.

Which sets up the real question. If the failure is "the room overcools below the
trip," can a sufficiently clever controller prevent it?

---

## Part 4: Bring in the heavy machinery — MPC vs PID

I replaced the script's PID with a proper **nonlinear, input-constrained Model
Predictive Controller**. Every control step it predicts the room-temperature
trajectory over a 10-minute horizon using a *perfect* model of the plant (the most
generous case possible for MPC) and picks the valve position in $[0, 100]$ that
minimizes

$$
J = \sum_k (T_k - T_\text{ref})^2 \;+\; w \cdot \mathrm{relu}(T_\text{floor} - T_k)^2 \;+\; R \cdot (u - u_\text{prev})^2
$$

Then I ran PID and MPC side by side in both regimes.

![MPC vs PID: identical in the heat-sink regime, MPC smoother under load](/figs/fcu/mpc_vs_pid.png "Left: load regime — both hold the fan; MPC uses ~28% less valve travel. Right: heat-sink regime — MPC and PID coincide exactly.")

**Load regime (left):** both keep the room above 72.5 °F; the fan stays on for both.
MPC is genuinely *better* — it settles faster, overshoots less, and uses **28% less
valve travel** (78 vs 108 units of actuator motion). If you care about comfort and
actuator wear, MPC earns its keep here.

**Heat-sink regime (right):** the PID and MPC traces are *indistinguishable*. Both
controllers drive the valve to 0% and the room slides through 72.5 °F on an identical
line. Duty cycle: 73.8% for both. Time below the trip: 26.2% for both. Valve travel:
zero for both.

The optimal controller made exactly the same decision as the dumb one.

---

## Part 5: Why optimality can't win here

This isn't a coincidence or a tuning artifact — it's a hard constraint, and it's worth
stating precisely. The room obeys

$$
\frac{dT}{dt} = \frac{Q_\text{load} - Q_\text{cool}}{C}, \qquad Q_\text{cool} \ge 0
$$

The valve is a **one-directional actuator**: it can only *remove* heat. The least
cooling it can apply is zero. So the most-positive $dT/dt$ the controller can produce
is $Q_\text{load}/C$. If $Q_\text{load}$ is negative — the room is losing heat faster
than its equipment adds it — then $dT/dt < 0$ for **every admissible control input**.
The controller is saturated against its constraint with the room still falling.

No objective function, horizon length, or model fidelity changes that. MPC, LQG,
H∞, reinforcement learning — all of them are, in this moment, commanding "valve = 0,
now please go more negative," and there is no actuator for *more negative*. In
controls language: **you cannot regulate a state in a direction you have no control
authority over.** The fan-off event in the heat-sink regime lives entirely outside
the controllable subspace.

Optimal control optimizes *decisions*. It cannot manufacture *authority*.

---

## Part 5½: The constraint, as a theorem (reachability)

Prose is nice; a theorem is better. For a fixed valve position the room settles to a
steady temperature $T_\text{eq}(u)$. Sweeping the valve 0 → 100% traces the entire
**controllable temperature band** — every temperature the unit can hold. The
*warmest* point of that band is $T_\text{eq}(0)$ (valve shut = least cooling). Hence:

> **Continuous-fan condition.** Control alone can keep the fan on **iff**
> $T_\text{eq}(0) \ge \text{StptCooling} - \text{DiffCooling}$ — the valve-closed
> equilibrium sits at or above the fan-off trip.

![Controllable temperature band and the fan-holdable region map](/figs/fcu/reachable_set.png "Reachability map. Left: holdable region in physical units. Right: nondimensional (β, γ) collapse — every room and unit lives on a single curve.")

For our two regimes:

- **Load:** valve closed, the room only warms (no equilibrium below the trip) →
  $T_\text{eq}(0) = \infty > 72.5$ → **fan holdable.** ✓
- **Heat-sink:** $T_\text{eq}(0) = 67.7\,°F$, the entire controllable band
  $[52.6, 67.7]$ sits *below* the 72.5 trip → **not holdable.** ✗ The critical
  envelope conductance is $UA^* = Q_\text{load}/(\text{trip} - T_\text{out}) \approx
  154$ BTU/hr/°F; the scenario's 600 is far past it.

The right-hand panel nondimensionalizes the whole thing: with $\beta$ =
load/coil-capacity and $\gamma$ = envelope-loss/coil-capacity, the green/red boundary
is a single line. Every FCU, every room, lives somewhere on that chart. That's the
rigorous skeleton under the MPC result — MPC and PID coincide precisely in the red
region, because there the target isn't in the reachable set.

## Part 5¾: The theorem in the wild (Monte Carlo)

Does that boundary actually predict behavior across messy real conditions? I sampled
120 random comm-room scenarios — internal load 0.5–18 kBTU/hr, envelope conductance
0–800, adjacent-space temp 64–80 °F — ran the as-built logic to steady state, and
plotted the fan duty cycle against the predictor $T_\text{eq}(0)$.

![Duty distribution over 120 random conditions, bimodal at the boundary](/figs/fcu/montecarlo.png "Monte Carlo: 120 random scenarios. The bimodal duty distribution splits exactly on the 72.5 °F reachability line.")

The duty distribution is **bimodal**, and the split lands exactly on the theorem's
72.5 °F line: **every** holdable case runs the fan 100%; the not-holdable minority
cycles (≈ 60% duty). **98% of random conditions keep the fan on** — the quantitative
version of "it runs mostly on." The handful that don't are precisely the
cold-surroundings, low-load corner the reachability map paints red.

## Part 5⅞: Two objectives, two disjoint sets of knobs (Sobol indices)

A variance-based global sensitivity analysis (Sobol indices, Saltelli sampling)
closes the loop by *ranking* every parameter's influence on two outcomes at once:
fan holdability and comfort (room-temperature standard deviation).

![Sobol indices: holdability vs comfort have disjoint driver sets](/figs/fcu/sensitivity.png "Sobol indices. Holdability is driven by load/envelope/threshold; comfort is driven by the gains — disjoint columns.")

```
            Holdability ST   Comfort(Tstd) ST
Q_load           0.89             0.28
UA_env           0.41             0.08
T_out            0.43             0.13
valve_Kp         0.00             0.15
valve_Kd         0.00             0.53     <- proportional term dominates comfort
DiffCooling      0.01             0.00
```

The two columns barely overlap. **Fan holdability is driven entirely by load,
envelope, and adjacent temperature — the PID gains score exactly zero.** **Comfort
is driven by the gains** (the proportional `valve_Kd` term most of all) — and
`DiffCooling` scores zero there. So the system hands you two clean, non-interacting
levers: setpoint/threshold geometry for *whether the fan runs*, gains for *how
tightly it holds temperature*. You can tune one without touching the other.

## Part 5⁹⁄₁₀: The bifurcation

Finally, the boundary itself. Sweep the adjacent-space temperature through the
reachability line and the steady fan behavior **bifurcates** — a sharp,
boundary-equilibrium transition from "fan always on" to "fan cuts," exactly at the
predicted $T_\text{out}^* = \text{trip} - Q_\text{load}/UA = 69.5\,°F$:

![Boundary-equilibrium bifurcation: duty jumps 0→100% at the reachability line](/figs/fcu/bifurcation.png "Bifurcation diagram — duty jumps 0→100% at the reachability boundary.")

Below the line the simulated room temperature rides right down the $T_\text{eq}(0)$
predictor, through the trip, and the fan cuts; above it, temperature clamps at
setpoint and the fan holds. The discontinuity is the mathematical signature of the
constraint becoming active. (One practical note baked into the experiment: the
envelope time constant is ~18 hours, so the *asymptotic* boundary is razor-sharp
but a finite observation window smears it — worth remembering before declaring a
unit "fixed" after a short watch.)

---

## Part 6: So what do you actually do?

The goal was reframed perfectly during the investigation: *don't keep the fan on for
its own sake — keep the room above the temperature where the fan would turn off.*
That version **is** solvable, because it's about where you put the threshold, not
about beating physics:

- **Widen `DiffCooling`.** It only sets the fan-off temperature (`StptCooling −
  DiffCooling`). Move it from 0.5 → 1.5–2.0 and the trip drops to ~71 °F — below
  anything the room realistically reaches. In the heat-sink case that took fan duty
  from 73.8% straight to **100%**, with *zero* overcooling risk (when the room is
  below setpoint the valve is already shut; the fan just keeps spinning). It's a
  plain setpoint write — no code change.

- **Or add an explicit run-style rule** (`Fan = On` whenever the unit is enabled).
  The controller already had an orphaned "continuous fan" setpoint that no program
  read; wiring it in is the clean, unconditional version.

Both of those are *policy* — a one-line expression of "I want the fan to run when
cooling isn't needed." That's the honest shape of the answer, and the MPC experiment
is what proves the honest answer is also the complete one.

---

## Part 7: The integral steps down badly — and how to rewrite it

Everything above is about *whether* the fan runs. There's a separate, real defect in
*how* the valve modulates — specifically how the integral steps **down** when cooling
demand falls. Three structural problems in the as-built velocity-form loop:

1. **Asymmetric trigger.** It opens only past `Setp + 0.25` but closes the instant
   the room dips below `Setp` — eager to close, lazy to open. That biases toward
   over-closing and hunting around setpoint.
2. **The step is rate-dominated.** The "Kd = 0.4" term is really proportional-on-rate
   with gain 40. So the down-step size tracks how *fast* the room is cooling, not
   the error — a quick dip yields a slam-shut, then overshoot (the
   $\zeta \approx 0.13$ underdamping).
3. **It amplifies sensor noise.** Because the output *is* the integrator and the
   dominant term is on the rate, every bit of sensor jitter is multiplied straight
   onto the valve.

A controlled experiment — as-built vs a clean positional PI — makes it concrete:

![Velocity-form vs PI valve: down-step overshoot and noise-driven wear](/figs/fcu/stepdown.png "As-built velocity form vs a clean positional PI. Top: load step-down. Bottom: same loops under sensor noise.")

```
(A) load step-down 16000->5000 BTU/hr   valve travel   undershoot below setpoint
    as-built                                  121            0.29 °F  (over-closes)
    PI rewrite (well-damped)                   36            0.00 °F

(B) sensor noise (0.15 °F)              valve travel
    as-built                                27,928   <-- ~4 full strokes/min: actuator-killing
    PI rewrite (well-damped)                 1,583   <-- ~18x less wear
```

The noise panel is the headline: the as-built valve thrashes across its whole range
chasing sensor jitter; the rewrite barely moves. (Honest trade: the well-damped PI
lets the room wander ~0.15 °F more — trivial for a comms room — for roughly an
**order of magnitude** less wear and zero step-down overshoot. An even gentler,
lower-gain PI can push wear lower still, but at the cost of damping — see Part 8.)

### The rewrite, in three tiers

- **Tier 0 — in-place b3 fix (low risk):** symmetric deadband; cut the integral
  ("Kp") roughly an order of magnitude (the linear analysis says it's ~20–30× too
  hot for good damping); normalize the increment by `dt` so it's scan-rate
  independent; add a first-order filter on the room sensor.
- **Tier 1 — proper positional PI (the recommended rewrite):** clean
  $u = K_p \cdot e + K_i \int e$ with **back-calculation anti-windup**, symmetric
  deadband, measurement filter, no raw derivative. dt-normalized and noise-robust.
  This is the `ValvePI` above and it produced the green traces.
- **Tier 2 — advanced, only if warranted:** a **Kalman/observer** on room
  temperature to denoise the error feeding the loop; a **load feedforward** (open
  the valve toward the predicted steady position so the integral does less work —
  smoother step-down); or full **MPC** with explicit valve-rate and actuator-travel
  penalties. MPC is the one place the heavy math *earns* its keep here: not for
  stability (the PI has that) but for formally trading temperature tightness against
  actuator wear — the exact tension this loop gets wrong.

Note the bonus: a better-damped down-step keeps the room nearer setpoint, so it's
less likely to overshoot below the 72.5 °F trip — meaning the *same* fix that
smooths the valve also makes the fan **more** reliably continuous. The two threads
converge.

## Part 8: Picking the tuning — the whole tradeoff in one picture

Here's the part you don't need any math for. Tuning the valve is a tug-of-war
between two things people actually care about:

- **A steady temperature** — the room stays right on target.
- **A long-lived valve** — the valve isn't constantly jerking back and forth (every
  movement is wear).

You can favor one or the other, but you can't max out both — push for a rock-steady
temperature and the valve has to work harder; let the valve relax and the
temperature drifts a touch more. If you test every reasonable tuning and plot them,
the *best possible* choices form a curve. Nothing can beat that curve — you just
pick where on it you want to live.

![Wear vs comfort tradeoff map with the recommended well-damped tuning](/figs/fcu/pareto_front.png "The wear–comfort Pareto front. The gold star marks the recommended well-damped tuning; the as-built loop isn't on the chart.")

Two things jump out:

1. **There's a clear "sweet spot"** (the gold star) — a *well-damped* tuning (no
   ringing) that's calm on the valve while holding the room within ~0.3 °F. The
   dots are colored by damping; the very-low-wear corner is tempting but those
   tunings *ring*, so the recommendation deliberately stays in the well-damped band.
2. **The current controller isn't even on the chart.** It moves the valve roughly
   **16,000 times an hour** — about **13× more** than the recommended tuning (and
   far more than that vs. a gentler one) — to buy a barely noticeable improvement
   in steadiness. That's an enormous amount of wear for almost nothing.

And here's what those choices actually *look like* on the equipment:

![Three tunings compared: valve thrash vs smooth modulation](/figs/fcu/pareto_timeseries.png "What each tuning feels like at the equipment: as-built (grey fuzz) thrashes the valve; the recommended tunings hold the room with barely any motion.")

The grey fuzz is the current controller — the valve hammering back and forth. Every
proposed tuning (the smooth colored lines) holds the room essentially on target
while barely moving the valve. The room stays comfortable either way; the difference
is whether the valve lives for years or gets shaken to pieces.

**Bottom line:** the recommended well-damped tuning ($K_p \approx 40$,
$K_i \approx 0.015$, $\zeta \approx 0.55$) keeps the room within about a third of a
degree of target while cutting valve wear roughly an order of magnitude. Same
comfort, a fraction of the wear.

---

## The takeaway

The most sophisticated tool in the box converged on the same move as a single
setpoint. That's not a knock on MPC — it's a reminder that **before you optimize,
check what's actually controllable.** Half the value of building the model wasn't
the optimization; it was discovering that the thing everyone wanted to tune (the
gains) couldn't move the outcome, and the thing nobody mentioned (a one-sided
actuator and a threshold) decided everything.

Sometimes the rigorous, convoluted, beautiful math exists precisely to tell you
that the simple lever was right all along.

---

## Techniques used, and what each one decided

| Technique | What it answered |
|---|---|
| **Velocity-form PID algebra** | The `Kp`/`Kd` labels are inverted (integral/proportional); no gains live in the fan-on logic |
| **Lumped-capacitance modeling** | A faithful-enough plant to simulate both regimes |
| **Parameter sweeps** | Duty cycle is flat-100% across load and gains |
| **Linearization + frequency domain** (poles, ζ, phase margin) | The valve loop is *underdamped*; the "working" tune (less integral) is classically better |
| **Nonlinear constrained MPC** | The optimal controller matches the PID exactly in the failure regime |
| **Reachability / invariant-set analysis** | A clean theorem: fan holdable ⇔ $T_\text{eq}(0) \ge \text{trip}$ |
| **Nondimensionalization** | One $(\beta, \gamma)$ chart collapses every room/unit onto a single boundary |
| **Monte Carlo** | The theorem predicts duty cycle across 120 random conditions; 98% hold |
| **Sobol global sensitivity** | Holdability ⟵ load/threshold (gains = 0); comfort ⟵ gains — disjoint levers |
| **Bifurcation analysis** | Sharp continuous-to-cycling transition exactly at the reachability boundary |
| **Positional PI + anti-windup vs velocity form** | The as-built down-step over-closes and amplifies noise ~18×; clean PI fixes both |
| **Pareto / multi-objective optimization** | Maps the wear-vs-comfort tradeoff; finds a well-damped sweet-spot tuning (~order-of-magnitude less wear, same comfort) |

Each one is a different lens, and they all focus on the same point: the outcome is
set by *what's controllable*, not by *how cleverly you control it*.

---

*Built with a from-scratch Python reimplementation of the b3 control scripts, a
lumped-capacitance room/coil thermal model, a vectorized receding-horizon MPC, and
linear / reachability / Monte-Carlo analysis layers. Plant constants are engineering
estimates pending calibration to trend data, so treat the numbers as structural
rather than exact.*

---
---

## Appendix A — Whitepaper

*Controllability, Not Control: An Analytical Study of a Fan-Coil Sequence.*
A whitepaper on the dynamics, optimality, and stochastics of a chilled-water
fan-coil unit (CHoRP FCU_3_447, Andover Continuum b3). This appendix is the
compact, theorem-first restatement of the investigation above.

### Abstract

We give a complete analytical treatment of a chilled-water fan-coil unit whose
fan would not run reliably. Reconstructing the controller from its `b3` script
and coupling it to a lumped-capacitance thermal plant, we prove that the unit's
qualitative behaviour — whether the fan runs continuously, whether it cycles,
how tightly it holds temperature — is governed by **controllability and
constraints**, not by control sophistication. The central result (Theorem 2) is
a reachability condition: continuous fan operation is achievable by control if
and only if the valve-closed equilibrium lies above the staging trip. We show
(Prop 5) that a Pontryagin-optimal controller reduces to *saturate-then-hold*,
and (corollary) issues the **same valve command** as the existing PI loop wherever
the setpoint is unreachable — explaining why a full MPC matches a one-line PI in
the failure regime. We characterize the loop's local dynamics (an underdamped
focus, Prop 4; scan-rate–coupled damping, Prop 6), its stochastic stationary
distribution in closed form (Prop 3, via a Lyapunov equation), and the
wear–comfort Pareto frontier. Each analytical result is checked numerically —
against simulation where a dynamic comparison applies (reachability, stochastic
spread, bifurcation), and by direct computation for the algebraic identities.
The engineering consequences are three setpoint/logic changes, each a corollary
of the theory.

> **Thesis.** *The outcome is set by what is controllable, not by how cleverly
> it is controlled — and that is provable.*

Full proofs: Appendix B (Derivations) below.

### A.1 Formalization

**Plant.** A single lumped capacitance for the conditioned space,

$$C\,\dot T = Q_\text{load}(T) - Q_\text{cool}(T,u),$$

$$Q_\text{cool}(T,u) = Q_\text{design}\,a(s)\,f(u)\,\frac{T - T_\text{chws}}{\Delta T_d}, \qquad Q_\text{load}(T) = Q_\text{int} + UA\,(T_\text{out} - T),$$

with valve fraction $u \in [0,1]$ (characteristic $f$, $f(0)=0$, $f' > 0$),
fan-speed airflow factor $a(s)$, and $\Delta T_d = T_\text{room,design} -
T_\text{chws}$.

**Controller.** A hybrid automaton: a discrete supervisor (`UnitControl`) with
states {Off, Fan-Off, Cooling, More-Cooling, …} and guards on $T$ and a dwell
timer, wrapping two continuous inner loops (`ChwValveCtrl`, `FanSpdCtrl`) of
velocity-form PID type. The fan is commanded **on** in the cooling states and
**off** in Fan-Off; the down-crossing guard trips at
$T_\text{trip} := \text{Setp} - \text{DiffCooling}$.

**Objectives.** *(i) Availability:* keep the fan running. *(ii) Comfort:*
minimize $\lVert T - \text{Setp} \rVert$. *(iii) Longevity:* minimize valve
travel $\int |\dot u|$.

Calibration note: plant constants are engineering estimates; results are
structural unless stated as validated. §A.9 addresses identification.

### A.2 The controller, dissected

The inner loops update each scan $k$ by
$u_k = \mathrm{sat}(u_{k-1} + a\,e_k + b(e_k - e_{k-1}))$. Telescoping
(**Prop 1**) gives the continuous equivalent

$$u(t) = K_p^c\,e + K_i^c\!\int e, \qquad K_p^c = 100 K_d, \quad K_i^c = \frac{K_p \cdot 0.01 \cdot \text{span}}{T_s}.$$

Two consequences frame the entire study: the script's **`Kd` is the proportional
gain and `Kp` is the integral gain** (the labels are inverted), and
**$K_i^c$ scales as $1/T_s$** — the tuning is coupled to firmware scan rate
(developed in §A.6).

### A.3 Equilibrium and reachability — the spine

Define the fixed-valve equilibrium $T_\text{eq}(u)$ by
$Q_\text{load} = Q_\text{cool}$. It is affine in $T$, strictly **decreasing**
in $u$, so the attainable steady temperatures form
$[\,T_\text{eq}(1),\, T_\text{eq}(0)\,]$.

> **Theorem 2 (continuous-fan condition).** Control alone can keep the fan on
> indefinitely **iff** $T_\text{eq}(0) \ge T_\text{trip}$, where
> $T_\text{eq}(0) = T_\text{out} + Q_\text{int}/UA$. *(Proof: §B, Theorem 2.)*

In words: the warmest the room can be held is with the valve shut; if even that
equilibrium is below the trip, no input prevents the fan from cutting.
Non-dimensionalizing with $\beta = Q_\text{int}/Q_\text{design}$ and
$\gamma = UA \cdot \Delta T_d / Q_\text{design}$ collapses the boundary to a
single curve — every room and unit lives on one chart (Fig. `reachable_set`
above). This theorem is the spine: §A.7 (bifurcation), §A.8 (optimal control),
and §A.9 (stochastics) are all corollaries or quantitative refinements of it.

### A.4 Local dynamics

Linearizing the valve loop about the cooling equilibrium yields a second-order
system with $\zeta = (a_0 + b_0 K_p^c)/(2\sqrt{b_0 K_i^c})$,
$\omega_n = \sqrt{b_0 K_i^c}$ (with $a_0 = g_T/(3600C)$, $b_0 = g_u/(3600C)$).

- **Stability / no oscillation (Prop 4).** $\operatorname{tr} A < 0$,
  $\det A > 0$ ⇒ a **stable focus**; trajectories spiral to the equilibrium.
  The as-built loop is markedly **underdamped**, $\zeta \approx 0.13$, phase
  margin $\approx 14°$ — the source of the temperature overshoot in the time
  domain.
- **Scan-rate coupling (Prop 6).** $\zeta \propto \sqrt{T_s}$: faster scanning
  reduces damping; the sampling transport lag is negligible by comparison.
  Damping is a firmware artifact, not just a gain choice.

![Phase portrait (stable focus) and damping vs controller scan rate](/figs/fcu/dynamics.png "Left: phase portrait — trajectories spiral into the cooling equilibrium (stable focus). Right: damping ζ vs scan rate Tₛ — ζ ∝ √Tₛ.")

A practical reading: the field-preferred "working" tuning (lower integral gain)
is simply the better-damped one.

### A.5 Global / nonlinear behaviour

Combining the stable continuous modes with the hysteretic switching:

> **Prop 4 (global convergence).** The hybrid system has **no limit cycle**; it
> converges to the cooling equilibrium (if holdable) or the off-equilibrium
> (else). At most one fan switch occurs.

Thus duty cycle is not an oscillation property but a *reachability* property.
Sweeping load confirms it is flat at 100% across an order of magnitude (Figs.
`duty_vs_load`, `baseline_plot` above): a modulating valve that can close fully
holds the room at setpoint, so the trip is never reached under load. Crossing
the Theorem-2 boundary produces a sharp **boundary-equilibrium bifurcation** —
duty jumps 0→100% exactly at the predicted point (Fig. `bifurcation` above).

### A.6 Optimal control

Because $Q_\text{cool}$ is affine in $u$, the Pontryagin Hamiltonian is linear
in $u$:

> **Prop 5.** The optimal policy is **bang to setpoint, then a singular arc
> holding $T = \text{Setp}$ at the equilibrium valve** — structurally the
> saturate-then-hold of a well-tuned PI/MPC.
>
> **Corollary.** Where the setpoint is unreachable (Thm 2), the singular arc is
> infeasible and the optimum is $u^* \equiv 0$ — the *same command* as the
> saturated PI (both rail against the constraint; the trajectories coincide).

This is the analytical explanation of the numerical experiment (Fig.
`mpc_vs_pid` above): under load, MPC and PI both hold the fan (MPC merely
smoother, ~28% less valve travel); in the heat-sink regime their trajectories
**coincide** because the target has left the reachable set. Optimal control
optimizes decisions; it cannot manufacture authority.

### A.7 Stochastic analysis

Model the load as Ornstein–Uhlenbeck; the linearized loop is a linear SDE
$dz = Az\,dt + B\,dW$.

> **Prop 3.** The stationary covariance solves the Lyapunov equation
> $A\Sigma + \Sigma A^\top + BB^\top = 0$; temperature is stationary Gaussian
> $T \sim \mathcal{N}(\text{Setp}, \sigma_x^2)$, $\sigma_x^2 = \Sigma_{11}$,
> and the fan-cut probability has the closed form
> $P(T < T_\text{trip}) = \Phi((T_\text{trip} - \text{Setp})/\sigma_x)$.

![Stationary temperature distribution and σ vs load volatility (closed form)](/figs/fcu/stochastic.png "Left: simulated temperature histogram matches the stationary Gaussian. Right: closed-form σₓ tracks simulation across load volatility.")

Validated against simulation: the empirical histogram matches the Gaussian and
$\sigma_x$ matches across load volatility (Fig. `stochastic`). A Monte-Carlo
sweep over random room conditions reproduces the Theorem-2 split — duty is
bimodal at the boundary, 98% of conditions hold (Fig. `montecarlo` above),
and a Sobol decomposition shows **holdability is driven by
load/envelope/threshold (gains contribute zero) while comfort is driven by the
gains** — two disjoint lever sets (Fig. `sensitivity` above).

### A.8 Multi-objective optimization (comfort vs. longevity)

The down-step of the velocity-form loop is asymmetric, rate-dominated, and a
noise amplifier: under sensor noise the as-built valve travels ~18× more than
the recommended well-damped positional PI ($K_p^c = 40$, $K_i^c = 0.015$,
$\zeta \approx 0.55$), and it over-closes on a load step (Fig. `stepdown`
above). Mapping the wear–comfort tradeoff gives a Pareto frontier (Figs.
`pareto_front`, `pareto_timeseries` above); the as-built loop lies far off it.
The frontier is **constrained to the well-damped band** ($\zeta \in [0.5, 0.9]$,
computed in closed form per candidate): the very-low-wear corner is *underdamped*
and only appears attractive over a horizon shorter than the loop's resonance
(an earlier unconstrained "knee" was $\zeta \approx 0.06$ — a horizon artifact,
since corrected). The recommended point cuts wear ~13× versus the as-built
while holding the room to ~0.3 °F.

### A.9 Uncertainty and calibration

The conclusions are structural; the *numbers* depend on $C, Q_\text{int}, UA,
Q_\text{design}, T_\text{chws}$. Dividing the energy balance by $C$ makes it
**linear in the per-$C$ parameters**, so ordinary least squares on
$(1,\, T_\text{out} - T,\, -m\,(T - T_\text{chws}))$ — with
$m = (s/100)(u/100)$ — recovers $Q_\text{int}/C,\, UA/C,\, Q_\text{design}/C$.

**Identifiability.** A *parameter-recovery* test — generating data from the
plant model, then fitting it back — establishes that the estimator is
well-posed and unbiased in the absence of model mismatch (noise-free
$R^2 = 0.996$; $Q_\text{int}, UA, Q_\text{design}$ within ~1–5%, Fig.
`calibration` below). This is a self-consistency check on the *method*, not
validation against real measurements; it cannot detect structural model error,
sensor dynamics, or unmodeled physics. It also surfaces two structural limits:
(i) only *ratios to $C$* are identifiable from temperature alone — absolute
scale needs one anchor (a measured IT load or coil duty); and (ii)
$T_\text{chws}$ is **not** identifiable (the room varies little against
$T - T_\text{chws}$, rendering the coil regressors collinear) and must be
measured. With real trend data — $T_\text{chws}$ trended and one load anchor —
the same machinery would make the numbers unit-specific; **no real trend data
is used in this paper**, so all quantitative results remain
structural/illustrative.

![Plant parameter recovery from a synthetic trend (R² = 0.996)](/figs/fcu/calibration.png "Identifiability check: estimator recovers Q_int, UA, Q_design within ~1–5% on synthetic data (R² = 0.996).")

**Numerical verification.** All analytical claims are checked computationally
(`run_verify.py`, 12/12): the telescoping identity to machine precision
($10^{-15}$), the Lyapunov residual ($10^{-16}$), $\zeta \propto \sqrt{T_s}$
to $10^{-16}$, the stable-focus eigenvalues, the singular-control equilibrium,
and the Theorem-2 boundary against simulation.

### A.10 Synthesis — recommendations as corollaries

1. **Continuous fan under load is already guaranteed** (Thm 2 + §A.5); dropouts
   occur only when the space is a net heat sink — a *reachability* failure, not
   a tuning one. To extend continuity through low-load periods, widen
   `DiffCooling` (lower the trip below the realistic minimum) or add an
   explicit run-style rule. *(Corollary of Thm 2.)*
2. **Re-tune for damping, not tightness.** Adopt the well-damped positional PI
   ($K_p^c \approx 40$, $K_i^c \approx 0.015$, $\zeta \approx 0.55$); the
   as-built $\zeta \approx 0.13$ overshoots and the velocity-form down-step is
   a noise amplifier. *(Cor. of §A.4, §A.8.)*
3. **Don't reach for MPC to keep the fan on.** It is provably no better than
   the PI in the only regime that matters (§A.6); reserve advanced control for
   the comfort/longevity tradeoff (§A.8) if at all.

The recurring lesson: **before optimizing, check what is controllable.** The
most powerful method (MPC) and the most explanatory one (reachability) are not
the same, and it is the latter that tells you when the former is futile.

#### References (selected)

1. I. M. Sobol, *Global sensitivity indices for nonlinear mathematical models*,
   Math. Comput. Simul. 55 (2001) 271–280.
2. A. Saltelli et al., *Global Sensitivity Analysis: The Primer*, Wiley, 2008.
3. L. S. Pontryagin et al., *The Mathematical Theory of Optimal Processes*, 1962.
4. H. K. Khalil, *Nonlinear Systems*, 3rd ed., Prentice Hall, 2002 (Lyapunov
   equation, stability, focus classification).
5. J.-P. Aubin, *Viability Theory*, Birkhäuser, 1991 (controlled-invariant /
   reachable sets).
6. K. J. Åström, T. Hägglund, *Advanced PID Control*, ISA, 2006 (velocity form,
   anti-windup).
7. G. E. Uhlenbeck, L. S. Ornstein, *On the theory of the Brownian motion*,
   Phys. Rev. 36 (1930) 823 (OU process; stationary covariance / Lyapunov).
8. C. M. Bishop, *Pattern Recognition and Machine Learning*, Springer, 2006
   (linear least squares, identifiability).

---
---

## Appendix B — Derivations

Formal results underpinning the control study. Notation: room temperature
$T$ (°F), CHW valve fraction $u \in [0, 1]$, thermal capacitance $C$ (BTU/°F),
chilled-water supply $T_\text{chws}$, design air-side
$\Delta T_d = T_\text{room,design} - T_\text{chws}$. Cooling

$$Q_\text{cool}(T, u) = Q_\text{design}\,a(\text{speed})\,f(u)\,\frac{T - T_\text{chws}}{\Delta T_d}, \qquad f(0) = 0,\; f' > 0,$$

load $Q_\text{load}(T) = Q_\text{int} + UA\,(T_\text{out} - T)$, and the
plant $C\,\dot T = Q_\text{load}(T) - Q_\text{cool}(T, u)$.

Status: **proved** below — Theorem 2 and Propositions 1, 3, 4, 5, 6. Every
claim is **numerically verified** by `run_verify.py` (12/12 checks:
telescoping identity $10^{-15}$, Lyapunov residual $10^{-16}$,
$\zeta \propto \sqrt{T_s}$ to $10^{-16}$, stable-focus eigenvalues,
singular-control equilibrium, Theorem-2 boundary vs simulation).

### Proposition 1 (the velocity-form loop is a scan-coupled PI)

The script updates the valve each scan $k$ (sample time $T_s$) by

$$u_k = \mathrm{sat}_{[0, 100]}\!\big(u_{k-1} + a\,e_k + b\,(e_k - e_{k-1})\big), \quad a = K_p \cdot 0.01 \cdot \text{span},\; b = 100\,K_d,$$

with $e_k = \mathrm{Cv}_k - \mathrm{Setp}$. Ignoring saturation and summing from
$1$ to $n$, the $b$-term telescopes:

$$u_n = u_0 + a\sum_{j=1}^{n} e_j + b\,(e_n - e_0).$$

Identifying $\sum_j e_j \approx T_s^{-1}\!\int_0^{t} e\,d\tau$ gives the
continuous equivalent

$$\boxed{\,u(t) = K_p^c\,e(t) + K_i^c\!\int_0^t e\,d\tau,\quad K_p^c = 100\,K_d,\quad K_i^c = \frac{K_p \cdot 0.01 \cdot \text{span}}{T_s}.\,}$$

**Corollaries.** (i) The displayed $K_d$ is the *proportional* gain and the
displayed $K_p$ is the *integral* gain. (ii) $K_i^c \propto T_s^{-1}$: the
integral action — hence the closed-loop damping — is coupled to the firmware
scan period. (iii) Because the output *is* the accumulator, saturation is
inherently anti-windup, but sensor noise enters directly through
$b\,(e_k - e_{k-1})$. $\quad\blacksquare$

### Theorem 2 (continuous-fan condition / reachability)

The staging logic cuts the fan when $T < T_\text{trip} := \text{Setp} -
\text{DiffCooling}$. Define the fixed-valve equilibrium $T_\text{eq}(u)$ by
$Q_\text{load}(T) = Q_\text{cool}(T, u)$.

**Claim.** Control alone can keep the fan on indefinitely **iff**

$$T_\text{eq}(0) \ge T_\text{trip}, \qquad T_\text{eq}(0) = T_\text{out} + \frac{Q_\text{int}}{UA}.$$

**Proof.** Solving the (affine in $T$) balance,

$$T_\text{eq}(u) = \frac{Q_\text{int} + UA\,T_\text{out} + K(u)\,T_\text{chws}}{K(u) + UA}, \quad K(u) = \frac{Q_\text{design}\,a\,f(u)}{\Delta T_d} \ge 0.$$

Differentiating (quotient rule, then chain rule via $K'(u) > 0$):

$$\frac{dT_\text{eq}}{du} = -\,\frac{K'(u)\,\big(Q_\text{int} + UA\,(T_\text{out} - T_\text{chws})\big)}{\big(K(u) + UA\big)^2} < 0,$$

since $K'(u) = Q_\text{design}\,a\,f'(u)/\Delta T_d > 0$ and the bracket is
positive whenever the room runs warmer than the chilled water (the operating
case; note the bracket $= UA\,(T_\text{eq}(0) - T_\text{chws})$). Thus
$T_\text{eq}$ is strictly decreasing in $u$ and the attainable steady
temperatures form the interval $[\,T_\text{eq}(1),\, T_\text{eq}(0)\,]$, whose
supremum is $T_\text{eq}(0)$ (valve shut, least cooling).

($\Leftarrow$) If $T_\text{eq}(0) \ge T_\text{trip}$, hold $u = 0$. With
$u = 0$ the plant is $C\dot T = Q_\text{load}(T)$, a stable affine system
with attractor $T_\text{eq}(0)$ and $\dot T > 0$ for $T < T_\text{eq}(0)$;
hence $T(t) \to T_\text{eq}(0) \ge T_\text{trip}$ and the fan never cuts.
($\Rightarrow$) If $T_\text{eq}(0) < T_\text{trip}$, then for **every**
admissible $u \ge 0$, $T_\text{eq}(u) \le T_\text{eq}(0) < T_\text{trip}$ and
$\dot T < 0$ above $T_\text{eq}(u)$; so $T$ is driven below $T_\text{trip}$
regardless of the control. $\quad\blacksquare$

**Remark (nondimensional form).** With $\beta = Q_\text{int}/Q_\text{design}$,
$\gamma = UA \cdot \Delta T_d / Q_\text{design}$, the boundary is the single
curve $T_\text{out} + \beta \cdot \Delta T_d / \gamma = T_\text{trip}$ — the
green/red line of the reachability map. This is why MPC and PI coincide in
the heat-sink regime (Cor. of the MPC experiment): the target leaves the
reachable set.

### Proposition 3 (stationary temperature distribution & cut probability)

Linearize about the cooling equilibrium $(T^*, u^*)$; let $x = T - T^*$, $I$
the PI integral state, and model the load fluctuation $q$ as Ornstein–Uhlenbeck
($\dot q = -q/\theta + \sigma_w \dot W$, stationary variance
$\sigma_Q^2 = \sigma_w^2 \theta / 2$). With $g_T = \partial_T Q_\text{cool}$,
$g_u = \partial_u Q_\text{cool}$, $a_0 = g_T/(3600C)$, $b_0 = g_u/(3600C)$,
$g = 1/(3600C)$, the augmented state $z = (x, I, q)$ satisfies the linear SDE
$dz = Az\,dt + B\,dW$,

$$A = \begin{pmatrix} -(a_0 + b_0 K_p^c) & -b_0 & g \\ K_i^c & 0 & 0 \\ 0 & 0 & -1/\theta \end{pmatrix}, \quad B = \begin{pmatrix} 0 \\ 0 \\ \sigma_w \end{pmatrix}.$$

If $A$ is Hurwitz the stationary covariance $\Sigma$ is the unique solution
of the **continuous Lyapunov equation**

$$A\Sigma + \Sigma A^\top + BB^\top = 0,$$

and $T$ is stationary Gaussian, $T \sim \mathcal{N}(T^*, \sigma_x^2)$ with
$\sigma_x^2 = \Sigma_{11}$. The instantaneous fan-cut probability is the
closed form

$$\boxed{\,P(T < T_\text{trip}) = \Phi\!\left(\frac{T_\text{trip} - T^*}{\sigma_x}\right).\,}$$

**Validation.** With an illustrative well-damped tuning ($K_p^c = 25$,
$K_i^c = 0.004$, $\zeta \approx 0.68$, used here only to exercise the loop in
its linear regime), the simulated histogram matches
$\mathcal{N}(73, \sigma_x^2)$ and the closed-form $\sigma_x$ tracks the
simulated standard deviation across load volatility
$\sigma_Q \in [500, 3000]$ (e.g. $\sigma_Q = 2000$: analytic $0.098$, simulated
$0.096$). $\quad\blacksquare$

**Engineering corollary.** Under any realistic load volatility the cut
probability is negligible ($< 10^{-3}$) — i.e. the fan stays on — provided
the loop is well damped; the earlier Pareto "knee" ($K_p^c = 9$,
$K_i^c = 0.09$) is in fact $\zeta \approx 0.06$ and was an artifact of a
too-short optimization horizon. The single operating recommendation (from the
wear–comfort Pareto analysis, §A.8) is the well-damped tuning
$K_p^c \approx 40$, $K_i^c \approx 0.015$ ($\zeta \approx 0.55$); the
$25/0.004$ pair above is simply a second point in the same well-damped
admissible band, used only to validate Prop 3.

### Proposition 4 (global convergence — no limit cycle)

**Claim.** The closed-loop FCU has no nontrivial periodic orbit; from any
initial state it converges to the cooling equilibrium $T^*$ (if
$T_\text{eq}(0) \ge T_\text{trip}$, Thm 2) or to the off-equilibrium
$T_\text{eq}(0)$ (otherwise).

**Proof.** *Continuous modes.* In cooling, the linearized loop matrix
$A = \begin{pmatrix} -(a_0 + b_0 K_p^c) & -b_0 \\ K_i^c & 0 \end{pmatrix}$
has $\operatorname{tr} A = -(a_0 + b_0 K_p^c) < 0$ and $\det A = b_0 K_i^c > 0$,
so both eigenvalues lie in the open left half-plane — a stable focus (every
trajectory spirals into the equilibrium). In the off-mode the plant
$C \dot T = Q_\text{load}(T)$ is affine with a single stable attractor
$T_\text{eq}(0)$. *Switching.* By Thm 2, when holdable the cooling mode drives
$T \to T^* > T_\text{trip}$, so the down-crossing guard $T < T_\text{trip}$
never re-arms; when not holdable the off-mode drives
$T \to T_\text{eq}(0) <$ the on-guard, which therefore never re-arms. Either
way at most one switch occurs, precluding a periodic orbit. $\quad\blacksquare$

**Remark.** A sustained relay limit cycle *would* appear only if cooling were
bang-bang (no valve modulation); the modulating valve is precisely what
collapses the cycle to a fixed point. The deadband can induce a bounded
micro-oscillation of amplitude $\le$ the deadband width.

### Proposition 5 (Pontryagin optimal control = saturate-then-hold)

Minimize $J = \int_0^{t_f} (T - T^*)^2\,dt$ subject to
$\dot T = \big(Q_\text{load}(T) - \kappa(T) u\big)/C$, $\kappa(T) =
Q_\text{design}\,a\,(T - T_\text{chws})/\Delta T_d > 0$, $u \in [0, 1]$.

The Hamiltonian $H = (T - T^*)^2 + \lambda\big(Q_\text{load}(T) -
\kappa(T) u\big)/C$ is **affine in $u$**, with switching function
$\sigma = -\lambda \kappa(T)/C$. Thus

$$u^* = \begin{cases} 1, & \lambda > 0 \\ 0, & \lambda < 0 \\ \text{singular}, & \lambda \equiv 0. \end{cases}$$

On a singular arc $\lambda \equiv 0 \Rightarrow \dot\lambda = 0$; with
$\dot\lambda = -\partial_T H = -\big[2(T - T^*) + \lambda(\cdots)/C\big]$ and
$\lambda = 0$ this forces $T = T^*$, and the singular control is the
equilibrium valve $u_\text{sing} = Q_\text{load}(T^*)/\kappa(T^*)$.

**Optimal policy:** drive at the cooling bound ($u = 0$ or $1$) until $T$
reaches $T^*$, then hold $T = T^*$ on the singular arc — exactly the
saturate-then-hold behaviour of a well-tuned PI/MPC (Fig. `mpc_vs_pid`
above, left).

**Corollary (MPC ≡ PI in the unreachable regime).** If $T^*$ lies below the
reachable band (heat-sink case, Thm 2), the singular arc $T = T^*$ is
infeasible; the switching function keeps $u^* \equiv 0$ throughout. The
optimal controller is therefore identical to the saturated PI — explaining
the observed coincidence of MPC and PID in Fig. `mpc_vs_pid` (right).
$\quad\blacksquare$

### Proposition 6 (scan-rate coupling of damping)

From Prop 1, $K_i^c = K_p \cdot 0.01 \cdot \text{span} / T_s$. The closed-loop
damping

$$\zeta = \frac{a_0 + b_0 K_p^c}{2\sqrt{b_0 K_i^c}} \;\propto\; \frac{1}{\sqrt{K_i^c}} \;\propto\; \sqrt{T_s},$$

so **faster scanning reduces damping** (Fig. `dynamics`, right, above). The
pure sampling/ZOH transport lag adds phase $\approx \omega_c T_s$; at the
operating crossover $\omega_c \sim 1.7 \times 10^{-3}$ rad/s and
$T_s = 0.14$ s this is $\sim 2 \times 10^{-4}$ rad — negligible beside the
gain effect. Hence the firmware coupling is dominated by the integral-gain
scaling, not transport delay. $\quad\blacksquare$
