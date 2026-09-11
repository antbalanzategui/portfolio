---
title: Tracing pharmacy controller dropouts to one COV number
date: 2026-09-09
topic: Controls · Building Automation
description: Seven controllers shared a hospital compounding pharmacy's BACnet MS/TP trunk, and the four room controllers among them kept dropping off it. The wiring was clean and the network settings were corrected, and it kept happening. Five packet captures later the cause was one configuration property, set to zero, generating four thousand error frames per capture.
tags: [bacnet, mstp, bas, ecostruxure, packet-capture, cov, troubleshooting]
---

*Seven controllers shared a hospital compounding pharmacy's BACnet MS/TP trunk,
and the four room controllers among them kept dropping off the network. The
wiring was clean, the network settings were corrected, and it kept happening.
Five packet captures later the cause turned out to be one configuration property
on one point, set to zero. Here is how the token ring works, what the captures
actually showed, and the two rounds of correct work that changed nothing.*

---

## 1. What an MS/TP trunk actually does

BACnet MS/TP is a serial network. One twisted pair, RS-485, typically running at
38,400 bits per second, with every controller on the segment sharing that single
pair of conductors. There is no switch and no collision detection. Instead the
nodes pass a **token** around a logical ring: whoever holds the token may
transmit, and when it finishes it hands the token to the next address.

That design has one consequence that governs everything else here. A node can
only speak when the token reaches it. If the trunk is congested, the token takes
longer to come around, and every node waits longer for its turn. Congestion on
MS/TP does not show up as dropped packets the way it would on Ethernet — it
shows up as latency, and past a certain point, as devices being declared dead.

> **Why token rotation is the metric.** Supervisory software declares a device
> offline when it fails to answer within a reply timeout. On MS/TP a device
> cannot answer until the token reaches it, so the *token rotation time* — the
> interval between successive visits of the token to a given node — is an upper
> bound on how fast any device can possibly respond. On a healthy eight-node
> trunk it should sit in the low hundreds of milliseconds. Once it climbs past
> about a second, offline alarms start firing on devices that are working
> perfectly.

The trunk in question ran under **EcoStruxure Building Operation**, Schneider
Electric's building-management platform. Seven field devices sat on the segment —
four room controllers, one per cleanroom, and three RPCs (the air-handler
controllers) added partway through the project — together with an EBO automation
server that also routed between this serial segment and the building's BACnet/IP
side, for eight master nodes in all.

## 2. How a controller reports a value that changes

A supervisory server has two ways to learn a value from a field controller. It
can **poll** — ask repeatedly, on a timer. Or it can **subscribe**, using a
BACnet service called change-of-value, or COV. With COV the server tells the
controller once: *notify me when this value changes.* The controller then pushes
a notification only when something actually happens.

COV is the efficient choice, and on a serial trunk it is usually the right one.
A polled point costs two frames every polling interval, forever. A COV point
costs two frames at subscription time and nothing at all while the value sits
still.

What decides "changes" is a per-object property called **COV Increment**. It is
a deadband. The controller compares the current value against the last value it
reported, and notifies when the difference reaches the increment. Set it to
0.5 °F and you get a notification every half-degree.

> **Confirmed versus unconfirmed.** COV notifications come in two forms.
> *Unconfirmed* is fire-and-forget. *Confirmed* obliges the recipient to send
> back an acknowledgement, and is the default in many systems because it is
> reliable. It is also the reason a single misdirected frame can turn into
> thousands — hold onto this one.

The pharmacy rooms are pressure-critical, so each room controller owns a room
differential-pressure value that the server watches continuously over COV. On
the wire that point is `analog-value:1000`, reading in hundredths of an inch of
water column — roughly −0.10 "wc on the negative-pressure hazardous-drug ante
room.

## 3. The symptom: controllers dropping in groups

The field pattern was distinctive. Controllers did not drop individually and at
random; they dropped in groups of two or three, came back within seconds, and
did it again minutes later. Over two weeks the server logged **13,774
device-offline events**, 96% of them on the four room controllers, and the
pharmacy touchscreens went blank intermittently. Nothing in the schedule or the
equipment load correlated.

More suggestively, plugging in a newly added air-handler controller reliably
knocked room controllers offline. That is the textbook signature of a
physical-layer problem — a termination, polarity, or shield-grounding fault that
one more device on the segment tips over the edge. It is what an experienced
technician should suspect, and it drove the first round of work: verify
topology, add the missing end-of-line resistor, check polarity and grounding.

It was a reasonable hypothesis, and as it turned out there were *two*
different failures wearing the same description. The plug-in collapse and the
chronic group drops looked alike from the operator's chair, had different
causes, and needed different fixes. Separating them was most of the work, and
the only way to do it was to stop inferring from behaviour and look at the
bus.

## 4. The first captures, and the fix that solved a different problem

EBO version 6.0 added a packet-capture facility that writes standard pcapng
straight from the automation server's own MS/TP port, which makes this cheap —
no protocol analyzer, no breaking into the trunk, nothing to install. Five
usable captures were taken over two weeks, each after a change, specifically so
that each change could be judged.

The first capture showed something that looked like an immediate answer. The
trunk was polling all 128 possible master addresses, because the **maximum
master** setting was still at its default of 127. Only six addresses had
anything on them; the other 120 were being polled for no reason.

Then the second capture caught the plug-in symptom in the act, and it is the
strangest file in the set: **278 valid frames in 584 seconds, against 21,344
CRC failures.** Of the handful of frames that survived intact, every single one
was a Poll For Master. No tokens. No replies. And only two nodes produced
anything readable at all — the two controllers that had just been connected,
which appear nowhere in the other captures from that day.

![Scatter plot of polled address against time for two captures: the anomaly sweeping the full 0 to 127 range with no replies, and a healthy capture confined to addresses 8 and below with replies](/figs/mstp/pfm_sweep.png "Every poll-for-master frame in two captures, plotted by the address being polled. Above: newly connected controllers sweeping the full 128-address range and never getting an answer, so no token ever forms. Below: the same trunk with maximum master set to 8, where polls stay inside the live address range and nearly all of them are answered.")

That is a trunk that never formed a ring. The new controllers came up, swept the
entire 0–126 address range looking for a master, never got an answer, and
meanwhile whatever else was transmitting was being destroyed on the wire. For
nearly ten minutes no node held the token at all.

This is the field symptom — *plugging in a controller knocks the room controllers
offline* — captured directly. And maximum master is squarely implicated: at its
default, every new node's search for a master spans 128 addresses instead of 8,
and on a shared pair that search is not free.

So maximum master went from 127 to 8. The change is visible on the wire in the
next capture: the poll sweep stops at address 8, and the polls get answered.

**That fixed the plug-in collapse.** When the same two controllers were
reconnected permanently two weeks later, the trunk carried all eight nodes
without ever losing the ring.

What it did not fix was the chronic drops. Token rotation moved from 1.426
seconds to 1.401 seconds — **twenty-five milliseconds** — and the room
controllers went on dropping off in groups exactly as before.

![Stacked bar chart of frames per minute by type across five captures, showing the Error and Reject block constant from C1 to C4 and absent in C5](/figs/mstp/frame_composition.png "Frames per minute by type across the five usable captures. The maximum-master change landed between C2 and C3 and does not touch the crimson block. In C5 that block is gone entirely, and the trunk's capacity goes into token passes and real application data instead.")

That chart is why. The poll sweep was never the bottleneck for the chronic
problem. In every capture from C1 to C4, between 660 and 940 frames per minute
were **Error and Reject frames** — protocol-level refusals, traffic that
accomplishes nothing whatsoever. On a 38.4 kbit/s trunk that is most of the
useful capacity spent on failure.

The question stopped being "what is slowing the trunk down" and became "what is
generating four thousand errors, and who is answering them."

## 5. The mechanism: one broadcast, sixty-three answers

Decoding the error frames rather than counting them gave the answer. Every one
of them was a refusal of a `ConfirmedCOVNotification`, and every one was
addressed back to the same controller: the hazardous-drug ante room controller
at MAC 3.

That controller was sending its differential-pressure notifications to the
**global broadcast address** — network `0xFFFF`, hop count 255 — instead of to
the server that had subscribed to them.

![Diagram showing one confirmed COV notification broadcast from an MS/TP controller, flooded by the router to five networks and 63 devices, with all error replies returning over the same serial trunk](/figs/mstp/amplification.png "A confirmed notification sent to the global broadcast address is flooded by every router in the building to every network. Each recipient is obliged to answer, none of them have a matching subscription, so each answers with an error — all of which route back down the same serial trunk to the controller that started it.")

A broadcast is normally harmless. This one was not, because of the word
*confirmed*. Every device that receives a confirmed service is required to
respond. None of them had subscribed to a pressure point in a pharmacy they had
never heard of, so all of them responded with an error.

**63 distinct devices across 5 BACnet networks** answered. 215 broadcasts went
out during one capture; 4,382 error and reject frames came back — roughly twenty
replies per broadcast, every one of them routed by the server down onto a single
twisted pair. Traffic involving that one controller accounted for **55% of all
frame octets** on the trunk.

The controller was drowning in the replies to its own notifications. Its
neighbours were starved of token time as collateral damage, which is why they
dropped in groups.

## 6. Why COV Increment = 0 never stops reporting

That explains the amplification, but not the trigger. Why was a pressure point
notifying 215 times in six minutes at all?

The controller's COV Increment on that point was set to **0**. The rule a device
applies is:

$$ \text{notify when} \quad \left| PV - PV_\text{last reported} \right| \;\ge\; \text{COV\_Increment} $$

With an increment of zero that comparison becomes $0 \ge 0$, which is **true
even when nothing has changed**. The deadband that is supposed to suppress an
unchanged reading has been given a width of nothing. So the object reported
itself on every program scan, forever, whether or not the pressure moved.

The capture proves the value was not moving. All 215 notifications were decoded
and compared byte for byte.

![Two-panel plot: room differential pressure flat at negative 0.10113 inches water column across 215 notifications, with an event rug below showing the notification cadence](/figs/mstp/static_value.png "Every notification from the point during the worst capture. The reported present-value is identical in all 215 — one distinct value, −0.10113 in. w.c. — and all four status flags are clear throughout. Nothing changed; it reported anyway, every 1.77 seconds on average.")

Not the value. Not a single status bit — in-alarm, fault, overridden and
out-of-service were all clear in every notification. A dithering sensor would
have produced hundreds of distinct payloads. A flapping fault bit would have
shown in the status flags. Neither did.

There were in fact **two independent defects**, which is why the problem was
hard to see. One controller had recorded the subscriber's address incorrectly,
so its notifications went to the broadcast address. And that same point had a
zero increment, so it notified constantly. Three sibling controllers received a
byte-for-byte identical subscription request and answered it correctly — which
is what identified the addressing fault as device-side rather than a
configuration error.

Either defect alone would have been survivable. A zero increment on a correctly
addressed point is waste nobody notices. A broadcast address on a point that
reports twice an hour is invisible. Together, in a 20:1 amplifying topology,
they produced four thousand error frames per capture.

## 7. The fix: one number

Set the COV Increment on that one point to a non-zero value, chosen in the
object's own units and comfortably below the pressure alarm threshold so that a
real excursion still reports promptly.

That is the entire intervention. No rewiring, no firmware, no controller
replacement, no change to the subscription, and no loss of pressure monitoring —
the point still reports every change that matters. Because the value was
genuinely static, any sensible deadband takes it from 215 notifications per six
minutes to essentially none.

The verification capture was taken forty-eight minutes later. **Not one Error or
Reject frame in the entire capture**, against 4,382 in the one before it. No
broadcasts. Median token rotation dropped from 256 ms to 87 ms, and the worst
single rotation from 4.47 s to 1.61 s. All eight nodes were alive when the
capture ended; in the previous capture one had gone silent and never returned.

![Empirical cumulative distribution of token rotation time before and after the fix, showing the 99th percentile moving from 1.55 to 0.93 seconds](/figs/mstp/rotation_ecdf.png "Distribution of token rotation time before and after. The medians differ by less than 200 ms, but the tail — the part that actually causes offline alarms — collapses from 1.55 s to 0.93 s at the 99th percentile.")

The distribution matters more than the average here. A trunk whose *median*
rotation is a comfortable 256 ms can still throw offline alarms all night, because
the alarms are generated by the worst rotations, not the typical ones. Plotting
the same data against time makes that concrete.

![Two-panel time series of token rotation over each capture, with frequent spikes above three seconds before the fix and none after](/figs/mstp/rotation_timeseries.png "Token rotation over each capture. Before, the trunk spikes repeatedly past three seconds — every one of those spikes is a window in which a healthy controller can be declared offline. After, the same trunk never exceeds 1.61 s.")

Those spikes are not a statistical abstraction. Each one is a multi-second
window during which a working controller cannot answer and gets marked dead.
Removing them is the difference between a pharmacy that alarms nightly and one
that does not.

## 8. How we knew it wasn't the wiring

The physical-layer hypothesis deserved a real answer rather than a change of
subject — the field evidence for it was genuinely good.

Every capture carries that answer for free. MS/TP frames are protected by two
checksums, a header CRC-8 and a data CRC-16. Corrupted signalling — a missing
terminator producing reflections, a polarity swap, a grounding problem,
electrical noise — produces frames that fail those checks. **The failure rate is
a direct measurement of signal integrity on the segment.**

![Bar chart on a log scale of the percentage of frames failing CRC in each capture, with four captures between 0.044 and 0.142 percent and one anomaly capture at 98.7 percent](/figs/mstp/crc_rate.png "Frames failing CRC, log scale. The four usable fault captures sit between 0.044% and 0.142%. The anomaly capture — the collapse from section 4, where the ring never formed — sits at 98.7%, three orders of magnitude higher.")

Across the usable captures the CRC failure rate ran between **0.044% and
0.142%**. That is a healthy RS-485 segment. A real termination or polarity fault
does not look like this.

We know precisely what it does look like, because the anomaly capture from
section 4 is one — **98.7% of the bus unreadable**. Whatever the underlying
cause, the electrical signature of a bus in trouble is the same: garbage in the
percent range, not the hundredths. That capture initially looked like a failed
measurement. It turned out to be the most useful control in the set, because it
made the 0.09% readings in the other four captures interpretable rather than
merely low.

The end-of-line resistor called for by the submittal was still installed,
because it is correct practice. It was not the fix, and the captures said so
before further labour was spent chasing down that path.

## 9. What else could be optimized

The verification capture closed the case but did not leave a perfect trunk, and
it is worth being honest about what remained.

- **A sibling controller still carries a zero COV Increment** on the same point.
  It became the largest single talker on the trunk after the fix — 497
  notifications in 321 seconds, with only six distinct values among them. It is
  unicasting rather than broadcasting, so it never caused visible harm, but it
  is the same defect and the same one-property correction.
- **The server re-subscribes roughly every 13 seconds** per object, against a
  configured subscription lifetime of eight hours. Some of that is the
  offline-detection loop feeding itself: devices drop, the server re-establishes
  subscriptions, the extra traffic contributes to more drops. It should settle
  now that the drops have stopped — worth confirming with another capture rather
  than assuming.
- **Maximum master sits at 8** on a trunk whose highest live address is 7, so it
  still polls one address that will never answer. Thirty-six wasted polls in
  five minutes. Genuinely trivial, and mentioned only because it is exactly the
  class of finding that looked important in capture one.

## 10. The takeaway

The instinct on a misbehaving serial trunk is to suspect the physical layer, and
that instinct is usually right. Here it was wrong, and the thing that proved it
wrong was measuring the bus rather than reasoning about it.

Three habits did the actual work.

**Measure the intervention, not just the symptom.** The maximum-master change
was correct practice and is still in place. It also moved token rotation by 25
milliseconds, and the only reason that is known is that a capture was taken
immediately afterward. Without the before-and-after it would have been
remembered as part of the fix, and the real cause would have stayed hidden
behind it.

**Decode payloads, not just frame counts.** The frame counts were available from
the very first capture and said only "busy." The answer required decoding 215
application payloads and noticing that every one of them was identical. Counting
finds load; decoding finds cause.

**Keep the broken capture.** The 98.7%-CRC capture looked like a wasted
measurement and was very nearly deleted. It became the control case that turned
a clean physical layer into a positive finding rather than an absence of
evidence.

**Do not assume one symptom means one fault.** "Controllers keep dropping off"
turned out to be two unrelated failures with two unrelated fixes. The
maximum-master change was not wasted work — it solved the plug-in collapse, and
that collapse is sitting there in capture two. It simply had nothing to do with
the chronic drops, and treating both as a single problem is what made the first
two weeks feel unproductive.

The chronic fix was one property, on one object, on one controller. Finding it
took five captures, and four of those five were spent ruling things out. That ratio is
normal, and budgeting for it is the difference between a diagnosis and a guess.

---

*Method: captures were taken with the packet-capture facility built into
EcoStruxure Building Operation 6.0, on the automation server's MS/TP port,
written as standard pcapng with the BACnet MS/TP link type. Analysis used a
purpose-built parser — EBO splits frames across capture-record boundaries, so
frames were recovered from the reassembled byte stream and validated against
both CRCs rather than parsed per record, which recovered 117 frames in one
capture that per-record parsing dropped. Token rotation was measured as the interval between successive token
receipts at a fixed node. Every figure is generated directly from the capture
files.*

*Limits: one observation point per capture, at the automation server's
transceiver. The two capture days are not like-for-like — the trunk grew from
six nodes to eight between them. Captures are five- to fourteen-minute windows
and do not span the specific plug-in event the original field testing
identified.*

*Site, organization, personnel, addresses, network numbers and device
identifiers have been removed or generalized. All figures are the measured
values.*
