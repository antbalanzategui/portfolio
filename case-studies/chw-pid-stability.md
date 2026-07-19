---
title: Stabilizing a hospital chilled-water system with one PID number
date: 2026-06-27
topic: Controls · Building Automation
description: Two oversized secondary pumps were swinging wildly and never holding pressure. The culprit wasn't a broken sensor or a bad pump — it was a single control-loop gain fighting a hidden transport delay. Here is how the system works, the math behind why it hunted, and how lowering one number fixed it.
tags: [controls, bas, pid, dead-time, chilled-water]
---

*Two oversized pumps were swinging wildly and never holding pressure. The culprit
wasn't a broken sensor or a bad pump — it was a single control-loop gain fighting a
hidden time delay. Here is how the system works, the math behind why it hunted, and
how lowering one number fixed it.*

---

## 1. What a chilled-water system actually does

Large buildings don't cool the air directly — they cool *water*, then use that cold
water everywhere they need it. A central plant chills water to roughly 42 °F, and
that water is pumped out to dozens of air-handling units (AHUs). Each AHU runs
building air across a coil full of the cold water; the air gives up its heat, the
water warms up, and the now-warm water returns to the chiller to be cooled again.
It is a closed loop of heat being collected all over the building and dumped at one
central place.

![Chilled-water plant schematic: chillers, primary/secondary pumps, AHU coils, remote DP sensor](/figs/chw/chw_schematic.png "The plant in one picture. Chillers make cold water; primary pumps move it through the chillers; secondary variable-speed pumps push it out to the building coils. A differential-pressure (ΔP) sensor near the far coil tells the pumps how hard to work.")

Most modern plants split the pumping into two parts, separated by a short pipe
called a **decoupler** (or bypass):

- **Primary pumps** keep a steady flow through the chillers (chillers like constant
  flow).
- **Secondary pumps** — the stars of this story — push water out to the building
  and *vary* their speed to match demand.

## 2. How the secondary pumps decide their speed

The building's demand is constantly changing: as AHU control valves open and close
to hold each zone's temperature, the amount of water the building wants changes
minute to minute. The secondary pumps can't read all those valves, so they use a
clever proxy: **differential pressure (ΔP)** measured out near the most remote
coil.

The logic is simple: if there is enough pressure difference across the far coil,
then *every* coil between here and the plant has enough pressure to get the flow
it needs. So the pumps are given a single job — **hold ΔP at a setpoint** (here,
23 psi). Demand rises, ΔP sags, pumps speed up. Demand falls, ΔP climbs, pumps
slow down.

> **Why variable speed matters.** Pump physics (the "affinity laws") say that flow
> scales with speed, but power scales with the *cube* of speed:
>
> $$ Q \propto N, \qquad P_\text{power} \propto N^3 $$
>
> Running a pump at 50% speed uses roughly **one-eighth** the energy of full speed.
> That cube is why we modulate pumps instead of throttling valves — and it's why a
> pump that *swings* in speed wastes energy and wears itself out.

## 3. The symptom: the pumps were hunting

On this North-building secondary system, the two variable-speed pumps would not
settle. The measured ΔP swung from around 12 psi up to 30 psi (the top of the
sensor's range) and back, seemingly at random, while the pump speed command slammed
between roughly 25% and 100%. The loop was **never at setpoint** — always
overshooting or undershooting. In control terms, this is a **limit cycle**: a
self-sustaining oscillation.

The tempting explanations were a faulty ΔP sensor or pumps that were simply too
big. Both turned out to be wrong (more on how we ruled them out below). The real
cause was in the control loop itself.

> **Why this matters.** This is a hospital plant. Pumps that lurch between 25% and
> 100% every half-minute wear themselves and their drives prematurely, waste energy
> (remember the cube law), and deliver jittery cooling to the spaces downstream. A
> loop that won't hold setpoint isn't a cosmetic nuisance — it is reliability,
> efficiency, and equipment life, all at once.

## 4. The control loop — and the hidden delay

The pump speed is set by a **PID controller**. As implemented, it's really a PI
controller (proportional + integral) with a feed-forward bias:

$$ u \;=\; \underbrace{K_p\,e}_{\text{proportional}} \;+\; \underbrace{K_i\!\int e\,dt}_{\text{integral}} \;+\; \underbrace{b}_{\text{bias}}, \qquad e = \text{SP} - \Delta P_\text{measured} $$

The output $u$ becomes the pump-speed command (0–100%). Here:

- **$K_p$ (proportional gain)** = how hard the loop pushes based on the error
  *right now*. With $K_p = 0.05$, every 1 psi of error moves the pump command ~5%.
- **$K_i$ (integral gain)** = slowly accumulates error to erase any steady offset,
  so the loop reaches setpoint exactly.
- **No derivative term** — correctly, because derivative action amplifies sensor
  noise.

![PID feedback-loop block diagram with the transport dead time to the remote sensor highlighted](/figs/chw/control_loop.png "The feedback loop. The piece that causes trouble: because the ΔP sensor is far out in the building, there is a transport delay (dead time) between the pumps changing speed and the loop actually seeing the result.")

That red block is everything. The sensor sits at the most remote AHU, so when the
pumps change speed, the resulting pressure change takes time to travel out there
and register — a **dead time** $T_d$ of tens of seconds. The controller acts, sees
nothing yet, acts harder, and by the time the delayed result finally arrives it
has already over-done it — so it lurches back the other way. Repeat forever.

> **The driving-with-delayed-steering analogy.** Imagine steering a car toward the
> center of a lane, but the steering responds two seconds late. If you grab the
> wheel hard at every drift (high $K_p$), you will over-correct and swerve back
> and forth. The fix is not a new steering wheel — it's a *gentler hand*. That is
> exactly what lowering $K_p$ does.

## 5. The math: why too much gain + delay = oscillation

Whether a feedback loop is stable comes down to what happens to a disturbance as
it travels around the loop. Every element changes the signal's *size* (gain) and
adds *phase lag* (delay, expressed as an angle). To see it properly, we write each
part as a transfer function in the Laplace variable $s$.

### The plant

The path from pump speed to measured pressure has three behaviors — a gain, a lag,
and a delay:

$$ G(s) \;=\; \frac{g\,e^{-T_d s}}{\tau s + 1} $$

- $g$ — **process gain**, ΔP per % speed. This plant is "stiff": $g \approx 0.85$
  psi/% (a small speed change moves ΔP a lot).
- $\tau$ — a first-order **lag** (pressure easing to its new value), $\sim 9$ s.
- $e^{-T_d s}$ — the transport **dead time** out to the remote sensor,
  $T_d \sim 10$ s.

### The controller

The PI controller, scaled by 100 because its output is a 0–100% speed (the
feed-forward bias only sets the operating point, so it drops out of the dynamics):

$$ C(s) \;=\; 100\left(K_p + \frac{K_i}{s}\right) $$

### The open loop — and the one property that ruins everything

The open-loop response is $L(s) = C(s)\,G(s)$. Evaluate it at a frequency
$s = j\omega$; the dead-time factor is the troublemaker:

$$ \bigl|e^{-j\omega T_d}\bigr| = 1, \qquad \angle\,e^{-j\omega T_d} = -\,\omega T_d $$

**Dead time adds phase lag that grows without bound with frequency, while
subtracting nothing from the gain.** An ordinary lag at least pays for its phase
by shedding gain; dead time gives the phase away for free. That is precisely what
makes a far-away sensor so hard on a control loop.

### The stability test

A loop oscillates if, at the frequency $\omega_{180}$ where the open-loop phase
first reaches −180° — the point where feedback meant to *subtract* the error
instead *adds* to it — the open-loop gain is still $\ge 1$. The total phase is:

$$ \angle L(j\omega) = \underbrace{-\arctan\frac{K_i}{K_p\,\omega}}_{\text{PI: }0\to-90°} \;\underbrace{-\,\arctan(\omega\tau)}_{\text{lag}} \;\underbrace{-\,\omega T_d}_{\text{dead time}} $$

The dead-time term guarantees this crosses −180°. For our representative values
it crosses at $\omega_{180} \approx 0.20$ rad/s — a roughly **31-second**
oscillation, matching the timescale of the observed hunt. The gain at that
frequency (the dead time contributes a factor of 1, remember) is:

$$ \bigl|L(j\omega_{180})\bigr| = \frac{100\,K_p\,g}{\sqrt{(\omega_{180}\tau)^2+1}} $$

### The verdict, in numbers

$$ \bigl|L\bigr|_{K_p=0.05} \approx 2.0 \;\;(+6\text{ dB}) \;\Rightarrow\; \textbf{unstable}, \qquad \bigl|L\bigr|_{K_p=0.02} \approx 0.8 \;\;(-2\text{ dB}) \;\Rightarrow\; \textbf{stable} $$

> **Gain margin, in plain words.** It is the safety factor on loop gain — how
> many times stronger you could make the loop before it tips into oscillation.
> Above 1 (often quoted as a few dB of headroom) means room to spare; below 1
> means you are already over the edge. Lowering $K_p$ is simply buying that
> safety factor back.

The **gain margin** — how much you could multiply the gain before instability,
$1/|L(j\omega_{180})|$ — tells the same story: about **0.5** at $K_p = 0.05$
(already over the edge) versus about **1.2** at $K_p = 0.02$ (back on the safe
side). And the key point: because $|L|$ is *directly proportional to $K_p$*, and
the dead time touches only phase — never gain — the only free lever is $K_p$
itself. Lower it and the entire magnitude curve slides down until it clears the
stability line at $\omega_{180}$. That is the whole fix, in one picture:

![Open-loop Bode plot: at Kp 0.05 the gain is above 1 where phase reaches -180 degrees (unstable); at Kp 0.02 it is below (stable)](/figs/chw/bode.png "Open-loop Bode plot. Top: gain vs frequency — at K_p = 0.05 (crimson) the gain sits ~6 dB above the |L| = 1 line at the crossover; lowering it to 0.02 (teal) drops it below, restoring ~2 dB of margin. Bottom: phase vs frequency, crossing −180° at ω₁₈₀ ≈ 0.20 rad/s. Stability is decided entirely by whether the gain curve is above or below the line at that one frequency.")

These are representative values — every plant's gain, lag, and delay differ, and
the running code also carries a small deadband that adds a little further margin.
The point is structural, not the third decimal place: $K_p = 0.05$ sits well over
the stability edge; $0.02$ sits under it.

Because the swing is driven so hard at $K_p = 0.05$, it grows until it slams into
physical limits — the pump speed against its 25%–100% rails and the ΔP reading
against the top of the sensor's scale. **That is why the "random spikes to 30 psi"
appeared — not a broken sensor, but the oscillation railing against the sensor's
ceiling.**

> **Why you can't fix this by speeding the loop up.** The dead time is physical —
> the sensor is far away and you cannot tune the delay out. Adding gain, or a
> measurement filter (which adds *its own* lag), only pushes the −180° crossover
> to a worse place. On a dead-time-dominated loop the robust move is the
> counterintuitive one: *less gain, slower, steadier.*

## 6. The fix: one number

Reducing $K_p$ scales the loop gain $L$ down at *every* frequency. Drop it enough
and $L(\omega_{180})$ falls below 1 — the oscillation can no longer sustain itself
and decays. We changed a single line in the controller:

```
  pidOut = (err * 0.05) + (intg * 0.0005) + 0.30      ' before
  pidOut = (err * 0.02) + (intg * 0.0005) + 0.30      ' after
```

$$ L_\text{after} = 100(0.02)(0.85) \approx 1.7 \quad\Rightarrow\quad \text{below the oscillation threshold} $$

![Pump differential pressure and speed at Kp 0.05 (hunting) vs Kp 0.02 (stable)](/figs/chw/pid_fix.png "Simulation of the full loop with dead time. At K_p = 0.05 (red) the loop rails ΔP between the sensor limits and slams the pump command 25–100%. At K_p = 0.02 (green) the same disturbance is absorbed: ΔP settles on the 23 psi setpoint and the pump command holds steady. One number, same hardware.")

There is a sharp threshold here — a *stability cliff*. Sweep the gain and the
loop is calm up to a critical value, then abruptly breaks into full oscillation.
The original 0.05 sat well over the edge; 0.02 sits comfortably under it, with
margin to spare.

![DP oscillation amplitude vs proportional gain — the stability cliff, with Kp 0.05 and 0.02 marked](/figs/chw/kp_sweep.png "Oscillation amplitude vs proportional gain. Below a critical K_p the loop is dead calm; above it the amplitude jumps to the rails. The fix moved the loop from the cliff edge back onto solid ground.")

> **Result.** The ΔP hunting and the pump-command swinging stopped immediately.
> The pumps now hold the pressure setpoint smoothly — quieter operation, less
> wear, and steadier comfort downstream. The trade-off is a deliberately slower
> response to load changes, which is exactly what a pressure loop should have:
> *steady beats fast.*

## 7. How we knew it wasn't the sensor

The honest part of this story is that the cause was not obvious. A ΔP reading
jumping at random to the top of its scale looks *exactly* like a failing sensor —
that was the first suspect. The second was simpler still: maybe the pumps were
just oversized. Both were wrong, and ruling them out is what gave confidence to
change a control gain rather than a piece of hardware.

Three independent lines of evidence all pointed to the same place:

- **The local valve was calm.** If the pressure at the remote coil were really
  swinging 12–30 psi, that coil's control valve would be stroking to compensate.
  Instead it sat steady around 53–55%. The *reading* was moving, but the water
  largely was not — a sign the swing was being *driven*, not measured.
- **Removing the deadband made it worse.** As a quick test we removed the small
  deadband that was smoothing the controller's reaction. If the problem were a
  noisy sensor, that change would be roughly neutral. Instead the hunting got
  *worse* — which only makes sense if the loop was over-reacting to its own
  input. That is a controller-gain symptom, not a dead-sensor symptom.
- **A simulation reproduced it with zero sensor noise.** The clincher. Modelling
  the full loop — controller, pumps, stiff plant, and the transport dead time —
  with a perfectly clean signal still produced the exact behavior shown above:
  ΔP railing to the top of scale, the command slamming the limits. If a
  noiseless model hunts identically, the hunt cannot be coming from the sensor.

Only once all three agreed — calm valve, deadband test, noiseless simulation —
was it worth touching a gain. Good diagnoses are usually the convergence of
several cheap experiments, not one clever guess.

## 8. What else could be optimized

Stabilizing the loop was the urgent fix. Several further improvements would push
the system from "stable" toward "optimal":

### Differential-pressure setpoint reset (the big energy win)

Holding a fixed 23 psi is simple but wasteful — most of the time the building
doesn't need that much pressure. A **valve-position reset** (often called
*trim & respond*) continuously lowers the ΔP setpoint until the most-open control
valve in the building is about 90–95% open. Because pump power follows the cube
of speed, even a few psi of setpoint reduction can cut pumping energy
substantially. This is typically the single largest savings opportunity on a
secondary loop.

### Better the measurement, not just the controller

Controlling off a *single* remote sensor makes the loop hostage to that one
location and adds the dead time that caused the hunt. Averaging two or three
remote ΔP sensors (or choosing a better-located tap) gives a steadier, faster
signal and improves both stability and reset accuracy.

### Finish tuning the loop

Lowering $K_p$ removed the instability; a proper tuning pass would then set the
integral time for the best balance of stability and responsiveness now that the
proportional gain has headroom. The remaining deadband — useful while the signal
was rough — could be revisited or replaced with light input filtering once the
measurement is improved.

### Pump staging for efficiency

Thanks to the cube law, *two* pumps at low speed often draw less power than
*one* pump working hard for the same flow. A staging strategy based on measured
load (not just speed thresholds), with sensible minimum run-times, keeps the
plant on the efficient part of the curve and avoids short-cycling.

### Clean up the legacy logic

The converted control program carries a couple of latent quirks — an
emergency-state fall-through that can be reached unintentionally at full speed,
and a lead/lag selection that defaults one pump as lead. Neither bites while the
loop is calm, but both are worth fencing off so future conditions can't trip
them.

---

## The takeaway

The most satisfying fixes are often the smallest. No new sensor, no new pump, no
rip-and-replace — just the recognition that a control loop and a hidden time
delay were at war, and that the loop was simply pushing too hard. Understanding
*why* — the gain, the delay, the −180° crossover — turned a mystifying,
"all-over-the-place" system into a one-line change that held.

*Figures are from a dynamic simulation of the loop calibrated to the observed
behavior. Control changes on live hospital equipment were staged, reviewed by
senior engineering, and reversible. This article is a write-up of the engineering
reasoning, not a tuning recipe — every plant's gains, delays, and dynamics are
different.*
