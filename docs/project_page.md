# Signal to Syndrome

<!-- Shared file. Person A's sections ("Summary", "Findings", "Who did what", "What runs where", "The physics in plain language", "Results", "Validation", "Limitations") rewritten for v2 (revision 2.1), Sun 11 Oct 2026, from docs/notes_results.md, DECISIONS.md and data/results/*.json only (plus params/*.json for card values). Person B edits "How to run it", "The five levels" and "Accessibility". Every number carries an HTML comment naming its source file and field. Intervals: square brackets are Wilson 95% for error rates and 95% bootstrap over quantum shots (B = 200) for optimal readout times; paired differences use the paired cluster interval. "Simulated" readout error = the empirical assignment error (`assignment.empirical`, `tauPhysEmpirical`); "the readout model's own estimate" = `assignment.belief`, `tauPhys` (the release check forbids the internal word for it in visible text). Unless stated otherwise, results use the learned decoder, the bit-flip memory (Z basis), d = 3 and hard decoding. -->

**Listening longer to a qubit makes its readout cleaner, but the rest of the code keeps ageing while you listen. Signal to Syndrome lets you find, in your browser, the readout time that actually minimises the logical error of an error-corrected memory, and shows that it is not always the time that gives the cleanest readout.**

<!-- toc: shown on GitHub; tools/make_writeup.mjs drops it, as the level shows each section as its own heading -->
**Contents**

- [In 30 seconds](#in-30-seconds)
- [Summary](#summary)
- [Findings](#findings)
  - [F1 (headline): a missing error, once modelled, cuts the logical error 4×](#f1-headline-the-data-revealed-a-missing-error-modelling-it-cuts-the-logical-error-4-on-held-out-circuits)
  - [F2: single-qubit readout tuning is enough](#f2-both-platforms-superconducting-case-single-qubit-readout-tuning-is-enough)
  - [F3: optical pumping, not idling, sets the ion's readout time](#f3-trapped-ion-optical-pumping-not-idling-sets-the-readout-time)
- [What this means for trapped ions](#what-this-means-for-trapped-ions)
- [Why a repetition code, and why a simulator?](#why-a-repetition-code-and-why-a-simulator)
- [Who did what](#who-did-what)
- [What it is](#what-it-is)
- [How to run it](#how-to-run-it)
- [The levels](#the-levels)
- [What runs where](#what-runs-where)
- [The physics in plain language](#the-physics-in-plain-language)
- [Results](#results)
- [Validation](#validation)
- [Accessibility](#accessibility)
- [Limitations](#limitations)
- [How to extend the project](#how-to-extend-the-project)
- [References](#references)
- [AI assistance and planning disclosure](#ai-assistance-and-planning-disclosure)
- [Licence](#licence)
<!-- /toc -->

## In 30 seconds

- **Headline: the data alone revealed an error our first decoder missed, and modelling it cuts the logical error 4×.** Detector correlations showed that a fault between a data qubit's two gates is as common as a wrong check reading. The simple decoding graph (data-qubit flips and wrong check readings only) has no edge for it; circuit-level models include it, given the circuit's noise model, while the correlations found it from the detector data alone, as hardware would require. On held-out simulator circuits, adding it takes the trapped-ion d = 5 memory from 0.096% to 0.024%, and going from d = 3 to d = 5 suppresses errors 15× instead of 5×. <!-- source: data/results/stage4_comparison.json (decoderComparison, trapped-ion Z hard, inSample false, source holdout.json -> setting2: d = 3 at 23.02 µs naive 0.00484 [cluster 0.00339, 0.00635], learned 0.00365 [0.00242, 0.00501]; d = 5 at 89.09 µs naive 0.000964 [0.000693, 0.00129], learned 0.000243 [0.000122, 0.000375]; ratios 0.00484/0.000964 = 5.0 and 0.00365/0.000243 = 15.0, naive/learned at d = 5 = 4.0) -->
- **Takeaway: tune readout on one qubit.** On both platforms, the code's best readout time can't be told apart from a single qubit's. <!-- source: data/results/stage4_comparison.json (conclusions.C1, verdict "refuted") -->
- **For trapped ions: idling never sets the readout time.** At the optimum, idling costs 1.2e-6 per round, against 6.1e-4 for readout and 8.7e-3 for gates. <!-- source: data/results/stage4_comparison.json (platforms.trapped-ion.budgetAtOptimum: idle 1.17e-6, readout 6.13e-4, gate 8.68e-3) -->
- **Try it:** [the main project on Qollab](https://qollab.xyz/u/SQuant/main-project) runs in the browser, with nothing to install.

## Summary

Signal to Syndrome compares two readout physics models at fixed gate noise. A trapped ion and a superconducting qubit read out the same IonQ-simulated repetition-code memories, decoded the same way, so every difference comes from the readout, the idling during readout and the cycle time. <!-- source: data/results/stage4_comparison.json (framing) --> Learning the simulator's noise turns soft decoding from a loss into a gain on the ion. On both platforms, the best readout time for the code cannot be told apart from a single qubit's, because the minima are flat. <!-- source: data/results/stage4_comparison.json (findings[F1].plain; conclusions.C1.plain, verdict "refuted") -->

## Findings

### F1 (headline). The data revealed a missing error; modelling it cuts the logical error 4× on held-out circuits

| Held-out ion circuits, at the best readout time | First decoder | Learned decoder | Gain |
|---|---|---|---|
| d = 3, hard decoding | 0.48% | 0.37% | 1.3× (not resolved) |
| d = 3, soft decoding | 1.02% | 0.38% | 2.7× |
| d = 5, hard decoding | 0.096% | 0.024% | **4.0×** |
| d = 5, soft decoding | 0.16% | 0.024% | 6.7× |
| Error suppression from d = 3 to d = 5 (hard) | 5.0× | **15×** | |
| Settings where soft decoding is worse than hard | 13 of 26 | **0 of 26** | |

<!-- source: data/results/stage4_comparison.json (decoderComparison, trapped-ion Z, inSample false, source holdout.json -> setting2: hard d = 3 at 23.02 µs naive 0.00484 [cluster 0.00339, 0.00635], learned 0.00365 [0.00242, 0.00501], ratio 1.33; soft d = 3 at 20.81 µs naive 0.0102 [0.00796, 0.0123], learned 0.00380 [0.00255, 0.00511], ratio 2.68; hard d = 5 at 89.09 µs naive 0.000964 [0.000693, 0.00129], learned 0.000243 [0.000122, 0.000375], ratio 3.97; soft d = 5 at 103.2 µs naive 0.00162 [0.00130, 0.00198], learned 0.000242 [0.000129, 0.000387], ratio 6.68; suppression 0.00484/0.000964 = 5.0 and 0.00365/0.000243 = 15.0); data/results/stage4_comparison.json (findings[F1].numbers.outOfSample: softWorseCount naive 13, learned 0, pointsPerDecoder 26) -->

The gain grows with distance; at d = 3 with hard decoding, the two decoders' intervals overlap, so that gain is not resolved. The headline uses hard decoding, where only the noise model changes; the soft gains also include repairing the first decoder's soft decoding, which was worse than hard.

The learned decoder also makes the distance pay off: with the first decoder, two extra data qubits suppress the logical error 5×; with the learned one, 15×. Here is how we found it.


Soft decoding uses how confident each readout was. With our first, naive decoder (one calibrated error rate for every edge) it made the ion worse: soft was above hard beyond the intervals at 13 of 39 points, for example 0.0074 [0.0065, 0.0084] against 0.0035 [0.0029, 0.0042] at 20 µs. <!-- source: data/results/stage2_ion_v2b.json (validation.C2 softAboveBeyondIntervals, naive: 13 of 39; series naive d = 3 at τ = 20 µs: soft pL 0.007375 [0.006495, 0.008373], hard 0.003469 [0.002881, 0.004175]); docs/notes_results.md (Verdicts v2, F1) --> That decoder misses a whole class of errors: a fault between a data qubit's two gates lights a diagonal pair of detectors, and the simulator produces it as often as a wrong check reading (0.0099 against 0.0100 per edge). <!-- source: data/results/dem_forte1.json (banks, d3 r3: diag 0.0099, time 0.0100) --> The learned decoder adds diagonal edges and learns one rate per edge class from detector correlations. Soft is then never above hard (0 of 39 points, both memories). <!-- source: data/results/stage2_ion_v2b.json, stage2_ion_x_v2b.json (validation.C2, learned: 0 of 39 each; paired: 0 of 39 each) --> **This holds out of sample:** on 12 banks from new simulator seeds, decoded with rates learned only from the original banks, soft is worse than hard at 13 of 26 points with the naive decoder and 0 of 26 with the learned one (at 20 µs, soft minus hard: +0.0053 [+0.0037, +0.0071] naive, +0.0001 [−0.0003, +0.0005] learned). <!-- source: data/results/holdout.json (params.banksUsed: 12 of 12; setting2.softWorseCount naive 13, learned 0, pointsPerDecoder 26); data/results/stage4_comparison.json (findings[F1].numbers.outOfSample.example_d3_tau20.pairedSoftMinusHard: naive 0.00528 [0.00373, 0.00711], learned 0.00009 [−0.00028, 0.00050]) --> F1 was found after seeing the data and is shown for the ion only. <!-- source: data/results/stage4_comparison.json (findings[F1].statement); docs/notes_results.md (F1 out of sample) --> ![Learn the noise, step 3: detector-pair correlations, the learned graph with its diagonal edges, and the held-out test](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/learnnoise.png?raw=true)

**Which part does the work? An ablation.** The learned decoder makes two changes: it adds the diagonal edges, and it learns one rate per edge class. On the same held-out banks, with the same seeds for every model, we switched them on one at a time (ion readout at 20 µs for d = 3 and 100 µs for d = 5, the grid points nearest the optima):

| Held-out logical error | First decoder | + diagonal edges only (one uniform rate) | + learned rates only (no diagonal edges) | Learned decoder (both) |
|---|---|---|---|---|
| d = 3, hard | 0.48% | 0.40% | 0.48% | 0.37% |
| d = 3, soft | 1.02% | 0.40% | 0.48% | 0.38% |
| d = 5, hard | 0.097% | **0.022%** | 0.089% | 0.026% |
| d = 5, soft | 0.16% | **0.019%** | 0.096% | 0.022% |

<!-- source: data/results/ablation.json (rows; Wilson 95%, R = 4: d3 hard naive 0.00478 [0.00408, 0.00560], diagOnly 0.00403 (minus naive −0.00075 [−0.00137, −0.00025]), ratesOnly 0.00478 (minus naive 0.0000 [−0.00034, 0.00037]), learned 0.00366; d3 soft naive 0.01016, diagOnly 0.00397, ratesOnly 0.00478, learned 0.00375; d5 hard naive 0.000973 [0.000834, 0.00114], diagOnly 0.000222 [0.000162, 0.000304], ratesOnly 0.000891 (minus naive −0.000094 [−0.000203, 0.000042]), learned 0.000258 [0.000192, 0.000347]; d5 soft naive 0.00160, diagOnly 0.000194, ratesOnly 0.000961, learned 0.000222); tools/ablation.mjs -->

The diagonal edges carry the gain: alone, at one uniform rate, they take d = 5 from 0.097% to 0.022% with hard decoding and from 0.16% to 0.019% with soft decoding, while learned rates alone leave hard decoding unresolved (0.089%). Once the diagonal edges are in, learning the rates adds nothing we can resolve: the full learned decoder lies inside the uniform-rate version's 95% interval at all four points. Learned rates alone do repair soft decoding, but only back to the hard-decoding level (d = 5: 0.16% → 0.096%): the single calibrated rate (0.012 to 0.013) absorbs the missing diagonal errors and sits about 40% above the learned space and time rates (0.007 to 0.010), so it outweighs each readout's confidence. So the finding is the missing error, not finely tuned rates: the detector correlations exposed the diagonal edges, and the rates they measured show that one uniform rate is close enough. A circuit-level error model built from the circuit would also contain the diagonal edges, but only if its noise model is known; on hardware it is not, and detector correlations need nothing but the measured shots. <!-- source: data/results/ablation.json (rows: diagOnly Wilson 95% d3 hard [0.00339, 0.00479], d3 soft [0.00334, 0.00472], d5 hard [0.000157, 0.000304], d5 soft [0.000131, 0.000268]; learned 0.00366, 0.00375, 0.000263, 0.000219; fit: pGate d3 0.0124, d5 0.0131; trained space 0.0082 / 0.0073, time 0.0100 / 0.0096) -->

**The learned model checks out as a model.** Rates re-learned from the held-out banks match those learned from the training banks (d = 5: space 0.0073 against 0.0071, time 0.0096 against 0.0094, diagonal 0.0091 against 0.0094). Learned from each of 16 banks on its own (d = 3, 5 and 7, original and held out), they stay within 0.0067–0.0088 (space), 0.0088–0.0106 (time) and 0.0081–0.0107 (diagonal). And detector pairs on the other diagonal, which no single error joins, show an effective rate of 6 × 10⁻⁵ on the held-out d = 5 banks, 150× below the diagonal edges: the model has the edges the circuit implies, and no others. <!-- source: data/results/ablation.json (fit: d5 trained space 0.00732542, time 0.00964432, diag 0.00914783; heldout space 0.00707225, time 0.00941461, diag 0.00938281, heldoutAntiDiag 0.0000612402; stability: 16 banks, space 0.00672–0.00879, time 0.00879–0.0106, diag 0.00815–0.0107) -->

### F2. Both platforms, superconducting case: single-qubit readout tuning is enough

**Takeaway:** the code's best readout time can't be told apart from a single qubit's, so calibrating readout on one qubit is enough. The superconducting qubit is the case where idling could have moved it.


The simulated superconducting readout error is lowest at τ*_phys = 0.910 µs. <!-- source: data/results/stage3_sc_dense.json (optima.tauPhysEmpirical = 0.909707) --> Meanwhile the data qubits wait and decay with probability ½(1 − e^(−τ/T1)) per round, 0.0070 at 0.7 µs. <!-- source: data/results/stage3_sc_dense.json (budget.idle at 0.7 µs = 0.00695) --> **One-line estimate:** the code's optimum sits where the falling readout error and the rising idle error have equal and opposite slopes, the minimum of their sum: 0.75 µs on the simulated readout curve. <!-- source: computed from data/results/stage3_sc_dense.json: minimum over x.values of assignment.empirical + budget.idle is 0.01275 at τ = 0.75 µs (readout 0.00531 + idle 0.00744) --> **The simulation agrees:** the logical optimum is 0.710 µs [0.662, 0.990], and lies below τ*_phys in 8 of 9 resolved cases. <!-- source: data/results/stage3_sc_dense.json (optima.tauLog, learned d = 3 hard: 0.709963 [0.66208, 0.990054]); docs/notes_results.md (Verdicts v2, C1 superconducting: 8 of 9 resolved rows) --> **But the shift is not resolved:** the logical error is flat across the valley (0.0065 to 0.0073 from 0.65 to 1.0 µs), only 1 of 8 intervals at d = 3 and 5 lies wholly below τ*_phys, and pL(0.9 µs) − pL(0.75 µs) = +0.0004 [−0.0004, +0.0013] is not above zero. <!-- source: docs/notes_results.md (Verdicts v2, C1 superconducting: flat valley 0.0065–0.0073; only X d = 3 soft below 0.910); data/results/stage4_comparison.json (conclusionDetail.C1.superconducting.cases["Z d3 hard"].shiftDelta: 0.0004375 [−0.000360, 0.00134]) --> The readout model's own estimate, which ignores ring-up, would give 0.45 µs, outside every interval. <!-- source: computed from data/results/stage3_sc_dense.json: minimum of assignment.belief + budget.idle at τ = 0.45 µs; lowest lower bound of optima.tauLog (learned, d = 3 and 5) is 0.518 µs --> *Figure: Level 3, superconducting qubit.*

### F3. Trapped ion: optical pumping, not idling, sets the readout time

**Takeaway:** the ion case of F2, for a different reason. Idling is too small to matter, and the readout optimum comes from the ion's own optical pumping.


The ion's readout error falls as photons accumulate, then rises because the detection light pumps the ion between states. <!-- source: docs/notes_results.md (Stage 2, F1-ion: "driven by dark→bright pumping") --> Its simulated minimum is τ*_phys = 23.0 µs (5.7e-4 at 20 µs); without pumping the model's error falls all the way to the end of the grid at 500 µs.¹ <!-- source: data/results/stage2_ion_v2b.json (optima.tauPhysEmpirical = 23.0163; assignment.empirical at 20 µs = 5.70e-4); docs/notes_results.md (Stage 2, F1-ion: no pumping, lowest at the grid end) --> Idling plays no part. At the optimum the idle error is 1.2e-6 per round, against 6.1e-4 for readout and 8.7e-3 for gates, and the logical optimum's interval, 23.0 µs [20.0, 47.5], contains τ*_phys. <!-- source: data/results/stage4_comparison.json (platforms.trapped-ion.budgetAtOptimum: idle 1.17e-6, readout 6.13e-4, gate 8.68e-3; tauLog.hard d = 3: 23.02 [19.98, 47.48]) --> Measurement crosstalk, a neighbour's detection light flipping a waiting qubit, is sourced at 1.67e-5 /µs, a lower bound. At that rate every interval contains τ*_phys; an optimum wholly below it appears only at 1e-3 /µs, about 60 times higher, where crosstalk rivals gate noise. <!-- source: params/ion.json (crosstalk_rate_per_us, crosstalk_scan_per_us); DECISIONS.md; docs/notes_results.md (Verdicts v2, C1 ion (b) and (c)); data/results/stage2_ion_v2b.json, stage2_ion_x_v2b.json (crosstalkScan) --> *Figure: Level 3, trapped ion.*

¹ The IonQ simulator (forte-1) shows no measurable readout error of its own: at most 3.7 × 10⁻⁴ per measurement (95% bound; V19), and the two flips seen are consistent with gate error. <!-- source: DECISIONS.md (footnote wording) -->

## What this means for trapped ions

- **Readout time and memory lifetime are separate knobs on an ion.** At the ion's best readout time (23.0 µs), waiting qubits lose 1.2e-6 per round to decay, against 6.1e-4 for readout and 8.7e-3 for gates: idling is about 500× smaller than readout and 7000× smaller than gates. The readout can be tuned for the cleanest reading without trading against the memory. <!-- source: data/results/stage4_comparison.json (platforms.trapped-ion.budgetAtOptimum: tau_us 23.02, idle 1.17342e-6, readout 6.13355e-4, gate 8.67893e-3; ratios 523 and 7396) -->
- **Gates, not readout timing, set the logical error.** At the optimum, the gate error per round is about 14× the readout error, so better gates are what would lower the code's error. <!-- source: data/results/stage4_comparison.json (platforms.trapped-ion.budgetAtOptimum: gate / readout = 14.1) -->
- **A crosstalk budget.** Measurement crosstalk, a neighbour's detection light flipping a waiting ion, adds 2.0e-4 per round at the published rate (1.67e-5 /µs), and never moves the optimum. An optimum wholly below the single-qubit one appears only at 1e-3 /µs, about 60× higher. So mid-circuit ion readout keeps its best timing as long as crosstalk stays below about 1e-3 /µs. <!-- source: data/results/stage4_comparison.json (platforms.trapped-ion.budgetAtOptimum.crosstalk 1.95921e-4); params/ion.json (crosstalk_rate_per_us); docs/notes_results.md (Verdicts v2, C1 ion (b) and (c)); data/results/stage2_ion_v2b.json (crosstalkScan) -->
- **Per microsecond of storage, the ion's logical error is far lower** (2.8e-7 against 2.1e-3 for the superconducting arm, d = 3); per second, the superconducting arm runs about 3800× more rounds. This is not a platform ranking: both arms carry the same simulated IonQ gate noise (see "Limitations"). <!-- source: data/results/stage4_comparison.json (platforms.*.perMicrosecond.hard d = 3: 2.836e-7 and 2.115e-3; conclusions.C3 note, cycle ratio 3787) -->

## Why a repetition code, and why a simulator?

- **It isolates readout.** The question is how readout physics sets the logical error. A repetition code has little else in the way: its decoder is exact minimum-weight matching (checked against PyMatching, though not a maximum-likelihood decoder), so with the decoding graph held fixed, every change in the logical error comes from readout, idling or the noise model.
- **A controlled comparison needs shared gate noise.** Both platforms decode the same IonQ-simulator measurement banks, so the two arms differ only in readout physics, idling and cycle time. Real hardware can't hold the gate noise fixed between two platforms. <!-- source: docs/notes_results.md (Verdicts); DECISIONS.md -->
- **It still covers the whole loop:** Qiskit circuits on IonQ's forte-1 noise model in native gates, bit-flip and phase-flip memories, d = 3, 5 and 7, an exact minimum-weight matching decoder checked against PyMatching, and a live run that submits a fresh job.
- **The next step is hardware, and the learned decoder is built for it.** It learns its noise model from detector data alone, so one d = 3 bank on Forte hardware would let us compare the learned edge rates with the simulator's. A surface code needs a 2-D detector layout and new edge classes; the matching decoder already works on any graph, and the correlation method that learns the rates carries over.

## Who did what

The authors chose the physics, sourced the parameters, diagnosed why soft decoding failed and decided to learn the error model from the data. The code was written with Claude Code under their direction (see "AI assistance and planning disclosure" below). <!-- source: README.md (Authors; AI assistance and planning disclosure) -->

## What it is

Signal to Syndrome is an open-source lab, published and runnable on Qollab, that shows how qubit-readout physics sets the logical error rate of a repetition-code memory. The circuits are written in Qiskit and run on IonQ's simulator with the forte-1 noise model, submitted in native gates so that IonQ's optimiser does not remove them. Readout is modelled classically in JavaScript (flat, trapped-ion and superconducting models), and the syndromes are decoded by our own exact minimum-weight matching decoder. <!-- source: README.md -->

It is a controlled comparison of readout physics, not a hardware benchmark: both platforms decode the same IonQ-simulator measurement banks with the same gate noise, so every difference between them comes from the readout model, the idle errors and the cycle time. <!-- source: docs/notes_results.md (Verdicts); DECISIONS.md -->

Authors: Soumyajit Pal (physics and data) and Sahil Prabhudesai (decoder, interface and platform). <!-- source: README.md -->

## How to run it

- **Source code:** https://github.com/sahilmp/QEC_signal_to_syndrome (MIT). The page on Qollab is a minified build of this repository; the readable source, tests, measurement banks and analysis scripts are there.
- **On Qollab:** open the main project, https://qollab.xyz/u/SQuant/main-project, in a Chromium-based browser (Chrome, Edge or Opera) and run it. Nothing needs installing: the page makes no network requests and all measurement banks and results are embedded. <!-- source: README.md --> Pick a level with the buttons at the top; each level opens with a short explanation. The bank generator that produced the measurement data is a separate project: https://qollab.xyz/u/SQuant/signal-to-syndrome-bank-genera. <!-- source: README.md; DECISIONS.md (Person B, published links) -->
- **Live run (optional):** pick IonQ Forte 1 in Qollab's Select QPU dialog, open Level 4 and press the live-run button under "Run a fresh experiment". Each press submits one new d = 3, r = 3 memory experiment (logical 0, 200 shots) <!-- source: src/ui/liverun.js; DECISIONS.md (Person B, live-run note) --> to the IonQ simulator with the forte-1 noise model, in native gates, through the Python helper `live.py`, and decodes the new shots on the page. Expect tens of seconds to a few minutes per job. Qollab allows one job per code run, so each press is one job. <!-- source: DECISIONS.md (platform facts); src/ui/liverun.js --> Outside Qollab the panel links to the bank generator instead.
- **Locally:** with Node.js 20 or later <!-- source: README.md -->, run

  ```bash
  npm install
  npm test
  npm run build
  ```

  The build writes `dist/qollab/` (`index.html`, `main.css`, `main.js`), the three files uploaded to Qollab, and `dist/local/preview.html`, a single file that opens directly in a browser (without the live run). <!-- source: README.md; tools/build.mjs -->
- **Rerun the analysis:** `node tools/sweep.mjs --stage 1` (and `--stage 2`, `--stage 3`, `--stage 4`) regenerates `data/results/*.json`; `node tools/sweep.mjs --diag` prints the V9 fingerprint, which the page also shows under "Diagnostics" at the bottom. <!-- source: docs/notes_results.md; DECISIONS.md (Person A); src/ui/diag.js -->

## The levels

The page opens with a three-step question: guess how long to listen to a qubit, see the answer for the trapped ion or the superconducting qubit, then the twist. A strip of the main findings follows, then six tabs. Every chart has a "Chart values as a table" link under it, and every level works with the keyboard. Screenshots are in [docs/screenshots](https://github.com/sahilmp/QEC_signal_to_syndrome/tree/main/docs/screenshots). <!-- source: DECISIONS.md; src/ui/hero3_text.js (STEP_LABELS); src/ui/main.js (findingsStrip) -->

1. **Be the decoder.** Three data qubits hold one logical bit and two checks compare neighbours. Each shot comes from the stored d = 3 IonQ-simulator bank with flat readout error ε (slider). You read the lit checks and pick the data qubit you think flipped, or no correction; then the decoder's answer, the data readout and whether the logical value survived are shown, and you play ten shots against the decoder. Concept: syndrome → correction. <!-- source: src/ui/level1.js --> ![Level 1](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/level1.png?raw=true)
2. **Time is a dimension.** The same d = 3 code over three rounds, drawn as a space-time grid of detectors: a data-qubit flip lights two neighbours in a row, a wrong check reading lights two in a column, and the decoder's matching is drawn as paths between lit detectors or to a boundary. Step through the shots with a lit detector; the ε slider updates a live estimate (1000 bank shots) on top of the Stage 1 curves for d = 3, 5 and 7. Concept: measurement errors are vertical pairs. <!-- source: src/ui/level2.js --> ![Level 2](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/level2.png?raw=true)
3. **Listen longer?** Choose the trapped ion or the superconducting qubit and move the readout-time slider τ. The ion shows photon-count histograms for bright and dark with the threshold; the superconducting qubit shows the two IQ clouds, the threshold and the signal-to-noise ratio. Charts show the assignment error and the logical error against τ for d = 3, 5 and 7, with the physical optimum τ_phys and the logical optima τ_log marked, and a "Batch" button decodes 200 shots of the d = 3 bank at the current τ. Concept: physical optimum against logical optimum. <!-- source: src/ui/level3.js --> ![Level 3, trapped ion](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/level3-ion.png?raw=true) ![Level 3, superconducting](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/level3-sc.png?raw=true)
4. **Trust but verify.** The same shot is decoded twice, side by side: hard decoding treats every reading as equally reliable, soft decoding uses each reading's confidence. Lit detectors are shaded by confidence (solid fill and thick ring: trustworthy; faint fill and thin ring: doubtful), each panel shows its matching and whether the logical value was kept, and a tally counts 20 shots. A chart compares hard and soft logical error against τ for the chosen distance. This level also holds the live-run panel. <!-- source: src/ui/level4.js; src/ui/liverun.js --> ![Level 4, trapped ion](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/level4-ion.png?raw=true) ![Level 4, superconducting](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/level4-sc.png?raw=true)
- **Learn the noise.** Find an error the first decoder cannot see, then let the data teach it. Three steps: inject a fault on a data qubit between its two CNOTs, which lights a diagonal pair of detectors; ask the naive decoder, which has no single error that explains that pair; then switch to the learned graph, which estimates a rate for every kind of detector pair (including the diagonal ones) from the stored shots, and compare the two decoders' logical error, starting with the held-out test. Concept: the decoder is only as good as its error model (F1). <!-- source: src/ui/learnnoise.js -->
5. **Two readout models, same gates.** Both arms decode the same IonQ-simulated circuits; only the readout model, the idle physics and the cycle time differ. A trade-off chart puts error per round against rounds per second, per-µs charts show each platform on its own readout-time axis, hard or soft, with the Stage 4 values at τ*_log, followed by the hypotheses with their verdicts, the comparison and sensitivity tables, and every parameter card with its sources and units. Optima resting on fewer than 10 logical errors are marked "not resolved". <!-- source: src/ui/level5.js (level5v2) --> ![Level 5](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/docs/screenshots/level5-preview.png?raw=true)

A switch under the title chooses the bit-flip memory (Z basis, the default) or the phase-flip memory (X basis); it sets the hero and Levels 3–5, and "Learn the noise" has its own memory selector. Levels 1 and 2, the shots in Level 4, the hero's twist and the sensitivity table stay in the bit-flip memory and say so. The held-out test ran on bit-flip circuits only, so the phase-flip learned results are labelled in sample. <!-- source: src/ui/features.js (phaseFlip: true); src/ui/main.js (BIT_FLIP_ONLY); src/ui/level3.js (learnedLabel); src/ui/hero3_text.js (TWIST_TITLE); data/results/holdout.json (trainedOn, heldout: rep_* banks only) -->

## What runs where

| Part | Where it runs | Notes |
|---|---|---|
| Repetition-code circuits, bit-flip and phase-flip memories | **IonQ simulator**, forte-1 noise model, native gates, submitted from Qiskit on Qollab | A fresh ancilla per check and round, all measured at the end; 4000 shots and one fixed seed per bank, plus 12 held-out banks. <!-- source: qollab/bank_generator.py (build_memory_circuit, provenance mode "fresh-ancilla"); DECISIONS.md --> |
| Injection checks (V4, V13) and the readout-error check (V19) | **IonQ simulator**, `ideal` and forte-1 | <!-- source: DECISIONS.md; docs/notes_results.md (v2 check table) --> |
| Live run (optional) | **IonQ simulator**, forte-1, through `live.py` on Qollab | 200 shots per press. <!-- source: DECISIONS.md (Person B, live-run note) --> |
| Readout (flat, trapped-ion, superconducting), idle errors, ion crosstalk | **Classical**, JavaScript in the browser (and Node.js for the sweeps) | Applied to the measured bits. |
| Learning the error model; decoding | **Classical**, JavaScript; rates from detector correlations, exact minimum-weight matching | |
| PyMatching comparison (V2, V2b), circuit tests (V3) | **Classical**, local Python | Not shipped. <!-- source: DECISIONS.md (Person B, V2b) --> |

The simulator contributes the gate noise: correlated faults through the circuit, including the diagonal detector pairs, as frequent as wrong check readings. <!-- source: data/results/dem_forte1.json (banks, d3 r3: diag 0.0099, time 0.0100) --> Readout, idling and crosstalk are classical models applied to the measured bits; the idle-injection rule matches explicit gates on the simulator bit for bit (V4, V13). <!-- source: docs/notes_results.md (Stage 3 validation V4; v2 check table V13) --> **Does forte-1 add readout error of its own? No measurable amount:** 0 of 20 000 qubits prepared in 0 read 1, and 2 of 20 000 prepared in 1 read 0 (at most 3.7 × 10⁻⁴, 95% bound), consistent with gate error. So ε is the whole measurement error in the pipeline, not an addition to the simulator's. <!-- source: DECISIONS.md (0 / 20 000, upper bound 1.9e-4; 2 / 20 000 = 1.0e-4 [2.7e-5, 3.7e-4]) -->

## The physics in plain language

**The code.** A repetition code stores one bit in d data qubits and repeatedly compares neighbours with ancillas. A comparison that changes between rounds (a detector event) marks an error; the decoder finds the likeliest errors explaining all events and corrects the bit. We use d = 3, 5 and 7 with r = 3 rounds. <!-- source: docs/notes_results.md (Stage 1) -->

**The two readouts.** A trapped ion is read by counting fluorescence photons for a time τ; the card uses published lab rates for ¹⁷¹Yb⁺ (0.472 counts/µs bright; pumping 3.41e-4 /µs bright→dark, 1.64e-5 /µs dark→bright). <!-- source: params/ion.json (R_bright_per_us, gamma_bright_to_dark_per_us, gamma_dark_to_bright_per_us); DECISIONS.md --> A superconducting qubit is read by integrating a resonator signal; the card is representative (χ/2π = 1 MHz, κ/2π = 2 MHz, n̄ = 5 illustrative, η = 0.3, T1 = 50 µs, ring-up on). <!-- source: params/sc.json --> A cycle is the gate layers plus τ plus reset: 2(d − 1) sequential gates of 970 µs and a 50 µs reset for the ion, 2 layers of 0.042 µs and a 0.25 µs reset for the superconducting qubit. <!-- source: params/cycle.json; DECISIONS.md -->

**Phase-flip memory and T2.** The bit-flip memory protects against flips between 0 and 1; the phase-flip memory runs the same code in the rotated basis, protecting against flips of the relative sign. A waiting qubit loses its bit value on the decay time T1 and its phase on the coherence time T2 (never more than 2T1), so the phase-flip idle error is ½(1 − e^(−τ/T2)). Our superconducting card has T2 = 77 µs, longer than T1 = 50 µs, so phase-flip idling is the smaller error. <!-- source: params/sc.json (T1_us, T2_us); DECISIONS.md -->

**Crosstalk.** Reading one ion means shining light that a waiting neighbour can scatter, disturbing it. It adds an idle error, ½(1 − e^(−Γτ)), during every readout. Γ = 1.67e-5 /µs comes from a published measurement on ions 110 µm apart, taken with a technique that suppresses crosstalk more than tenfold; ions in one chain sit much closer, so the true value is probably higher, and we scan up to 1e-3 /µs. <!-- source: params/ion.json (crosstalk_rate_per_us, crosstalk_scan_per_us); DECISIONS.md -->

**The detector error model.** Each kind of fault lights a characteristic pair of detectors: a data-qubit flip two neighbours in one round, a wrong check reading one check in two rounds, a fault between a data qubit's two gates a diagonal pair. The decoder needs each pair's probability. The naive decoder uses one calibrated rate and has no diagonal edges; the learned decoder measures how often each pair fires together, solves for one rate per class, and adds the diagonal edges. <!-- source: DECISIONS.md -->

**Hard and soft decoding.** A hard decoder sees only the bit each readout reports. A soft decoder also uses how confident each readout was and makes uncertain readings cheaper to blame for an error.

## Results

The hypotheses were registered before the reruns, each with its refutation condition. <!-- source: docs/notes_results.md (v2 hypotheses, pre-registered Sat 10 Oct) --> Verdicts use the learned decoder, both memories and full statistics. Brackets are 95% intervals (Wilson for error rates, bootstrap for optimal readout times); an optimum with half or more of its bootstrap samples tied is unresolved and enters no verdict. <!-- source: data/results/stage4_comparison.json (decoder; conclusions); docs/notes_results.md (Tie rule) -->

| | Hypothesis (short) | Verdict | Why |
|---|---|---|---|
| C1 | Superconducting: the code's optimum comes before the single-qubit optimum. Ion: no idle-driven optimum without crosstalk; an earlier one at the sourced crosstalk rate | **Refuted** | Superconducting: 1 of 8 intervals at d = 3 and 5 lies below 0.910 µs (F2). Ion: no earlier optimum at the sourced rate (F3) <!-- source: data/results/stage4_comparison.json (conclusions.C1 verdict, note; conclusionDetail.C1) --> |
| C2 | Soft decoding at or below hard at every τ, with most gain where readouts are short | **Held** | Soft above hard at 0 of 240 points; largest gain at short τ <!-- source: data/results/stage4_comparison.json (conclusions.C2 note: 0 of 39 + 81 + 39 + 81) --> |
| C3 | Neither dominates: the ion has the lower error per round, the superconducting qubit more rounds per second | **Held**, descriptive: the outcome is fixed by construction | Shared gate noise and cycles about 3800× apart: it could not fail with these cards <!-- source: data/results/stage4_comparison.json (conclusions.C3, informative false; platforms.*.perMicrosecond.hard[d = 3].cycle_us: 3953.02 and 1.043963, ratio 3787) --> |
| C4 | The readout error at which d = 5 beats d = 3 is similar on both platforms | **Undetermined** | Ion: 0.237 [0.210, 0.266] at 1.56 µs (hard). Superconducting: d = 5 below d = 3 everywhere, no crossing <!-- source: data/results/stage4_comparison.json (platforms.trapped-ion.breakEven.empiricalAxis.hard; platforms.superconducting.breakEven note; conclusions.C4) --> |
| C5 | The learned error model lowers the logical error against the naive one everywhere at the optimum, out of sample | **Held** | Learned above naive in 0 of 15 resolved cases, below in 13; out of sample only for the ion bit-flip memory, d = 3 and 5 <!-- source: data/results/stage4_comparison.json (conclusions.C5 note; decoderComparison) --> |
| C6 | In the phase-flip memory the superconducting optimum is shorter than in the bit-flip memory when T2 < T1 | **Not applicable** with the card (T2 = 77 µs > T1 = 50 µs). T2 < T1 variant: **undetermined** | Variant T2 = 25 µs (illustrative): shorter in all 4 point estimates, intervals overlap <!-- source: data/results/stage4_comparison.json (conclusions.C6); params/sc.json (T1_us, T2_us); data/results/stage3_sc_x_T2_25.json (provenance.overrides T2_us = 25) --> |
| O4 | Detector-rate ratio, phase-flip to bit-flip banks | Measurement, no verdict | 1.000 to 1.041; all 5 intervals contain 1 <!-- source: data/results/dem_forte1.json (ratioXoverZ); DECISIONS.md --> |

**Changed since the first version:** C2 was called refuted on the ion, an artefact of the naive decoder (F1); the superconducting C1 held with the naive decoder on a coarse grid, where the dense grid shows a flat valley. <!-- source: docs/notes_results.md (Verdicts v2, "Decoder artefacts in v1"; C1 superconducting, "Changed from v1") -->

**Deviations from the registered plan, all decided after seeing data:** <!-- source: DECISIONS.md; data/results/stage4_comparison.json (conclusions.*.deviations) -->

- **The crosstalk flag (C1, ion).** The registered rule used the point estimate of the optimum, which flips with noise in a flat minimum: at the sourced rate it finds an earlier optimum in the phase-flip memory but not in the bit-flip memory. We also report whether the whole interval lies below τ*_phys, and the paired difference pL(20 µs) − pL(15 µs); both refute the clause in both memories. C1 is refuted either way, because its superconducting part is. <!-- source: DECISIONS.md; docs/notes_results.md (Verdicts v2, C1 ion (b)) -->
- A 27-point superconducting grid replaced the 12-point one (on the coarse grid C1 held at d = 3); the tie rule, the C6 variant card and the descriptive C3 were added; cluster and paired intervals sit beside the Wilson ones and change no verdict. <!-- source: DECISIONS.md; docs/notes_results.md (Where a cluster or paired result changes a verdict) -->

**The trade-off.** At its optimum (d = 3) the ion has a logical error of 0.00112 [0.00093, 0.00135] per round at 253 rounds per second, the superconducting qubit 0.00221 [0.00193, 0.00253] at 958 000 rounds per second. <!-- source: data/results/stage4_comparison.json (conclusions.C3 note; platforms.*.perRound.hard d = 3) --> Along the grids the ion stays at 0.0011–0.0019 per round from 10 to 500 µs (226–254 rounds per second), the superconducting qubit at 0.0022–0.0069 from 0.5 to 3 µs (300 000–1 200 000). <!-- source: data/results/stage4_comparison.json (platforms.*.tradeoff["3"].hard: perRound, roundsPerSecond) --> Neither wins on both axes: the ion is about twice as accurate per round, the superconducting qubit about 3800 times faster. Per microsecond of storage the ion's error is far lower (2.8e-7 against 2.1e-3); a task needing a fixed number of rounds, which we did not measure, would favour the faster clock. <!-- source: data/results/stage4_comparison.json (platforms.*.perMicrosecond.hard d = 3: 2.84e-7, 2.12e-3); docs/notes_results.md (Verdicts, C3: time to finish a fixed number of logical operations not measured) --> In sensitivity runs, halving the superconducting η raises its error at 0.7 µs by 0.0057 [0.0042, 0.0072]; changing the ion's pumping rate has no resolved effect. <!-- source: data/results/stage4_comparison.json (sensitivity[*].pairedVsBaseline: eta 0.5 +0.0056875 [0.0041875, 0.0071875]; gamma_dark_to_bright 0.5 and 2 intervals contain 0) -->

## Validation

| ID | Check | Outcome |
|---|---|---|
| V1 | Flat readout flips with probability ε | **Pass** <!-- source: docs/notes_results.md (Stage 1 validation) --> |
| V2, V2b | Our decoder against PyMatching, without and with diagonal edges | **Pass:** 0 cost mismatches <!-- source: DECISIONS.md (Person B, V2; V2b) --> |
| V3 | Circuits on Qiskit's ideal simulator give the predicted bits | **Pass** <!-- source: DECISIONS.md (Person B, live-run note) --> |
| V4 | Idle-error injection rule against explicit gates on IonQ's ideal simulator | **Pass**, bit for bit <!-- source: docs/notes_results.md (Stage 3 validation) --> |
| V5 | Gate-noise floor consistent across banks | **Pass**, one pair of intervals just misses <!-- source: docs/notes_results.md (Stage 1 validation) --> |
| V6 | Logical 0 against logical 1 | **Pass**, 1 difference in 48 comparisons, no pattern <!-- source: docs/notes_results.md (v2 Stage 1 rerun) --> |
| V7 | Ion sampler against Poisson tails | **Pass** <!-- source: docs/notes_results.md (v2 check table) --> |
| V8 | Superconducting sampler against the analytic error | **Pass** <!-- source: docs/notes_results.md (v2 check table) --> |
| V9, V9L | Browser against Node.js fingerprint | Node.js and the local preview agree (`53933f98`); on Qollab **not yet redone** <!-- source: DECISIONS.md (Person A, V9 fingerprint; Person B, B44 entry, local preview) --> |
| V10 | Confidence calibration where the model is exact | **Pass** <!-- source: docs/notes_results.md (v2 check table) --> |
| V10r | Calibration with ring-up in the model | **Not run** <!-- source: docs/signal-to-syndrome-team-checklist.md (not done) --> |
| V11 | Learned decoder at ε = 0 and 1e-9 | **Pass** <!-- source: docs/notes_results.md (v2 Stage 1 rerun) --> |
| V12 | (a) Rates recovered on synthetic data; (b) learned against naive, one logical state's bank to the other's | (a) **Pass**; (b) **Fail**: too few errors at d = 5, replaced by V18 <!-- source: DECISIONS.md --> |
| V13 | Phase-flip circuits and injection | **Pass** <!-- source: docs/notes_results.md (v2 check table) --> |
| V14 | Idle physics per memory; T2 ≤ 2T1; crosstalk | **Pass** <!-- source: tests/ion.test.js (V14), npm test Sun 11 Oct 406/406 --> |
| V15 | Trade-off values by hand, one point per platform | **Pass**, 3 significant figures <!-- source: DECISIONS.md (V15) --> |
| V16 | Fault-to-detector map of "Learn the noise" | **Pass** <!-- source: DECISIONS.md (Person B, V16) --> |
| V17 | Cluster and paired intervals | **Pass** <!-- source: tests/stats.test.js (V17), npm test Sun 11 Oct 406/406; docs/notes_results.md (v2b files carry the v2 rerun pL values) --> |
| V18 | Learned against naive, held-out banks | **Pass** <!-- source: data/results/holdout.json (setting1); docs/notes_results.md (V18) --> |
| V19 | Does the simulator add readout error | **No measurable amount** (≤ 3.7 × 10⁻⁴) <!-- source: DECISIONS.md --> |

## Accessibility

- **Keyboard:** every control (level buttons, sliders, platform choices, qubit buttons, the live-run button) can be reached and used with the keyboard, the tab order follows the visual order, and focus is always visible (a 3 px outline). Choosing a level moves focus to its heading. <!-- source: DECISIONS.md; src/ui/main.js -->
- **Charts and pictures:** every chart and histogram has a values table, and the qubit grids and charts have text descriptions for screen readers. <!-- source: DECISIONS.md -->
- **Colour:** a colour-blind-safe palette, and nothing relies on colour alone: series also differ by marker shape, histograms by solid and hatched bars, and in Level 1 "your pick" and "decoder's pick" are written on the qubit. <!-- source: DECISIONS.md; src/ui/level3.js --> The lowest text contrast pair is 4.83:1 <!-- source: DECISIONS.md -->, above the plan target of 4.5:1. <!-- source: plan §18 -->
- **Small screens:** the layout was checked at 360 px width; wide tables scroll inside their own box and charts are redrawn larger below 600 px. <!-- source: DECISIONS.md -->
- **Motion:** nothing animates. <!-- source: DECISIONS.md -->

## Limitations

- **Not a hardware benchmark or a platform ranking.** Both readout models are classical, with literature parameters, on the same simulated IonQ gate noise; so the superconducting arm carries trapped-ion gate noise. <!-- source: plan §20; data/results/stage4_comparison.json (framing) -->
- **The ion card is a published lab setup** (Crain et al. 2019), not measured Forte values; its T1 is the low end of the range given for IonQ Aria. <!-- source: DECISIONS.md; params/ion.json -->
- **The crosstalk value is a lower bound,** measured on ions 110 µm apart with a technique that suppresses crosstalk more than tenfold. That one chain's ions are read mid-circuit without shielding or shuttling is our assumption. <!-- source: DECISIONS.md -->
- **The superconducting card is representative, not one device;** n̄ = 5 and the C6 variant T2 = 25 µs are illustrative. <!-- source: params/sc.json; DECISIONS.md -->
- **The superconducting readout model's own estimate ignores ring-up:** it puts τ*_phys at 0.577 µs against the simulated 0.910 µs, and its confidence values are too high at short τ. We quote the simulated value; a variant with ring-up in the model was not run. <!-- source: data/results/stage4_comparison.json (platforms.superconducting.tauPhys: belief 0.577124, empirical 0.909707); docs/notes_results.md (Ring-up mismatch) -->
- **Learned rates are in sample except where held-out banks exist** (the ion bit-flip memory at d = 3 and 5, and V18); the learned model has one rate per edge class, not per edge. <!-- source: data/results/stage4_comparison.json (conclusions.C5.deviations); DECISIONS.md -->
- **The d = 7 optima are unresolved** (ion in both modes, superconducting in soft mode). <!-- source: data/results/stage4_comparison.json (platforms.*.tauLog: unresolved true for ion d = 7 hard and soft, superconducting d = 7 soft) -->
- **Matching ties are broken toward one logical value,** which inflates the naive decoder's error at ε = 0. <!-- source: DECISIONS.md (Person B, V2); docs/notes_results.md (Verdicts v2, artefact 2) -->
- **Sensitivity covers three parameters** (ion dark→bright pumping, superconducting η and T1, each halved and doubled); halving T1 would break T2 ≤ 2T1 and was not run. <!-- source: data/results/stage4_comparison.json (sensitivity, sensitivityNote); DECISIONS.md (Sensitivity) -->
- **Small codes:** d up to 7, r = 3; no threshold is extrapolated. Each memory protects against one kind of error. Idle errors use the Pauli-twirling approximation; the ion model allows at most one state change per window. <!-- source: plan §20 -->
- **Untested:** the time to finish a fixed number of logical operations, where a slow cycle would cost the ion. <!-- source: docs/notes_results.md (Verdicts, C3) -->

## How to extend the project

- **Add a readout model:** implement the readout contract, `measure(trueBit, rng) -> { hard, llr }`, `idleFlipProbability()` and `averageAssignmentError()`, in `src/core/readout/`, and add a parameter card with a source for every value in `params/`.
- **Generate new banks:** run `qollab/bank_generator.py` on Qollab, one configuration per run, with the native recipe and a distinct `sampler_seed` per bank; check that the detector rate is above 0. <!-- source: DECISIONS.md (bank generator rules) -->
- **Open problems we found:**
  - One learned rate per edge instead of per edge class (`src/core/dem.js`), and held-out banks for the phase-flip memory and d = 7, whose learned results are in sample. <!-- source: docs/project_page.md (Limitations: learned rates in sample except where held-out banks exist; one rate per edge class); data/results/holdout.json (heldout: rep_d3 and rep_d5 banks only) -->
  - Ring-up in the superconducting belief model (`src/core/readout/sc.js`), which would change every Stage 3 number. <!-- source: docs/notes_results.md (Ring-up mismatch) -->
  - A different tie-break in `matching.js`. <!-- source: DECISIONS.md (Person B, V2) -->
  - A photomultiplier-tube ion setup with lower collection efficiency, and the dark→bright pumping rate, which mainly sets the ion τ*_phys, as sensitivity cases. <!-- source: DECISIONS.md -->
- **Fork it on Qollab** ([fork and remix](https://qollab.xyz/learn/docs/fork-and-remix)) and change the parameter cards. <!-- source: DECISIONS.md (Sources) -->

## References

Readout parameters and cycle times:

- C. Crain et al., Commun. Phys. 2, 97 (2019): [nature.com/articles/s42005-019-0195-8](https://www.nature.com/articles/s42005-019-0195-8)
- S. Noek et al., Opt. Lett. 38, 4735 (2013): [arXiv:1304.3511](https://arxiv.org/abs/1304.3511)
- S. Olmschenk et al. (2007): [arXiv:0708.0657](https://arxiv.org/abs/0708.0657)
- Microsoft Azure Quantum, IonQ provider page: [learn.microsoft.com/azure/quantum/provider-ionq](https://learn.microsoft.com/azure/quantum/provider-ionq)
- T. Walter et al., "Rapid high-fidelity single-shot dispersive readout of superconducting qubits," Phys. Rev. Applied 7, 054020 (2017): [arXiv:1701.06933](https://arxiv.org/abs/1701.06933)
- Robertson et al., "Variational Gibbs State Preparation on Trapped-Ion Devices" (2026): [arXiv:2603.03801](https://arxiv.org/abs/2603.03801)
- Google Quantum AI and Collaborators, "Quantum error correction below the surface code threshold," Nature 638, 920 (2025): [arXiv:2408.13687](https://arxiv.org/abs/2408.13687)
- M. McEwen et al., "Removing leakage-induced correlated errors in superconducting quantum error correction," Nat. Commun. 12, 1761 (2021): [arXiv:2102.06131](https://arxiv.org/abs/2102.06131)

Error correction, decoding and soft information:

- D. Gottesman, *Stabilizer Codes and Quantum Error Correction*, PhD thesis, Caltech (1997): [arXiv:quant-ph/9705052](https://arxiv.org/abs/quant-ph/9705052)
- E. Dennis, A. Kitaev, A. Landahl and J. Preskill, "Topological quantum memory," J. Math. Phys. 43, 4452 (2002)
- J. Edmonds, "Paths, trees, and flowers," Can. J. Math. 17, 449 (1965)
- O. Higgott, "PyMatching: A Python package for decoding quantum codes with minimum-weight perfect matching," ACM Trans. Quantum Comput. 3, 16 (2022)
- Google Quantum AI, "Exponential suppression of bit or phase errors with cyclic error correction," Nature 595, 383 (2021): [arXiv:2102.06132](https://arxiv.org/abs/2102.06132) (the pairwise detector-correlation estimator used to learn the edge rates)
- O. Higgott and C. Gidney, "Sparse Blossom" (2023): [arXiv:2303.15933](https://arxiv.org/abs/2303.15933)
- C. A. Pattison, M. E. Beverland, M. P. da Silva and N. Delfosse, "Improved quantum error correction using soft information" (2021): [arXiv:2107.13589](https://arxiv.org/abs/2107.13589)
- J. Gambetta et al., "Protocols for optimal readout of qubits using a continuous quantum nondemolition measurement," Phys. Rev. A 76, 012325 (2007)
- A. Blais, A. L. Grimsmo, S. M. Girvin and A. Wallraff, "Circuit quantum electrodynamics," Rev. Mod. Phys. 93, 025005 (2021)
- A. H. Myerson et al., "High-fidelity readout of trapped-ion qubits," Phys. Rev. Lett. 100, 200502 (2008)

Statistics:

- E. B. Wilson, J. Am. Stat. Assoc. 22, 209 (1927)
- B. Efron, "Bootstrap methods: another look at the jackknife," Ann. Statist. 7, 1 (1979)

Platform:

- Qollab documentation: [runtime environment](https://qollab.xyz/learn/docs/runtime-environment), [JavaScript Qiskit projects](https://qollab.xyz/learn/docs/js-qiskit-projects), [Python Qiskit projects](https://qollab.xyz/learn/docs/python-qiskit-projects), [ideal vs noise-model simulators](https://qollab.xyz/learn/docs/ideal-vs-noise-model-simulators), [how your circuit is compiled](https://qollab.xyz/learn/docs/how-your-circuit-is-compiled)
- IonQ: [Simulation with noise models](https://docs.ionq.com/guides/simulation-with-noise-models), [Getting started with native gates](https://docs.ionq.com/features/getting-started-with-native-gates), [Native gates in Qiskit](https://docs.ionq.com/sdks/qiskit/native-gates-qiskit)
- [qiskit-ionq](https://github.com/qiskit-community/qiskit-ionq)

<!-- References without a link: the source files give no URL; the plan asks that bibliographic details be verified against the publisher before they appear here. -->

## AI assistance and planning disclosure

The project plan, the execution and team checklists (including the Claude Code prompts in them) and the parameter-card templates were written before the build window opened; they are not part of the repository. No project code was written or run before the window. All code was generated during the window with Claude Code (Anthropic) under the authors' direction, reviewed by the authors, cross-reviewed by the other team member, and checked by tests and the validation checks above. This page and the README were drafted with Claude Code from the repository's own results files and edited by the authors. `docs/qollab_js_api_example.txt` is Qollab's own example of calling the IonQ backend from JavaScript, copied as a disclosed reference. <!-- source: README.md (AI assistance and planning disclosure) -->

## Licence

MIT. See [LICENSE](https://github.com/sahilmp/QEC_signal_to_syndrome/blob/main/LICENSE). <!-- source: README.md -->

This effort is supported by Qollab & IonQ.
