# Rerun report: results regenerated from the in-window banks (Sun 11 Oct 2026)

## 1. Verdict and headline changes, in plain words

**No verdict label changed.** C1 refuted, C2 held, C3 held (by construction), C4 undetermined, C5 held, C6 not applicable (T2 = 25 µs variant undetermined), O4 a measurement.

**Three headline claims changed, and every place that stated them was rewritten:**

1. **F2 is no longer "single-qubit readout tuning is enough on both platforms".** On the superconducting qubit, in the bit-flip memory, the code's best readout time is now resolved shorter than a single qubit's: 0.729 µs [0.697, 0.844] against 0.910 µs at d = 3, and pL(0.9 µs) − pL(0.75 µs) is resolved above zero at d = 3 and d = 5. Before, it was 0.710 µs [0.662, 0.990], not resolved. The phase-flip memory still shows no resolved shift. For the ion the claim still holds. C1 stays refuted because the registered statement needed the shift in both memories. Rewritten in: the README "In 30 seconds" and F2 paragraph; the project page's In 30 seconds, Summary, F2 heading, takeaway and body, F3 takeaway, C1 row and "Changed since"; the findings-strip F2 card, whose title now follows the data; and the C1 `plain` sentence in `tools/sweep.mjs`.
2. **F1 at d = 5: the ion's d = 5 best readout time is no longer resolved** (27.4 µs, 100% of bootstrap resamples tied). The held-out numbers replicate: first decoder 0.090% → learned 0.021% (4.2×), suppression 15×, and "13 of 26 → 0 of 26" is unchanged. But they are now described as read at the lowest-error grid point, not at a resolved best readout time. C5 now rests on 12 resolved rows (before 15), and is out of sample at d = 3 only.
3. **Ablation:** "once the diagonal edges are in, learned rates add nothing we can resolve" now holds at d = 5 only. At d = 3 the learned decoder (0.32%) falls below the uniform-rate interval. Rates-only at d = 5 is now a small resolved change (0.097% → 0.086%).

**Smaller changes:**
- In-sample naive "13 of 39" → 9 of 39 (paired 18 → 9).
- O4: 4 of 5 intervals contain 1; d5 r5 is 1.048 [1.013, 1.084]. The O4 `plain` sentence now says "looks nearly the same".
- C6 variant: X is shorter in 3 of 4 point estimates (before 4 of 4).
- Cycle ratio about 3700× (before 3800×); per-round accuracy ratio about 1.8× (before about 2×).
- The T1 × 2 sensitivity is no longer resolved.
- V6 now shows no L0/L1 difference.
- Curated Level 4 shots: L0 has 2 soft saves / 69 fails (before 0 / 72), and L1 has 579 saves (before 575).

**Replicated:** the 13 of 26 → 0 of 26 held-out result, the ≈4× gain and 15× suppression at d = 5, the trapped-ion budget (≈500× and ≈7000×), the crosstalk budget (resolved only at 1e-3 /µs, ≈60× the sourced rate), V18 (pass), and the in-sample learned C2 counts (0 of 240).

## 2. Old → new headline numbers (full tables with intervals in `docs/RERUN_DIFF.md`)

| Quantity | Old | New |
|---|---|---|
| F1 d = 3 hard, naive → learned | 0.48% → 0.37% (1.3×, not resolved) | 0.48% → 0.32% (1.5×, cluster intervals overlap) |
| F1 d = 3 soft | 1.02% → 0.38% (2.7×) | 1.03% → 0.32% (3.2×) |
| F1 d = 5 hard (the "4×") | 0.096% → 0.024% (4.0×) | 0.090% → 0.021% (4.2×), τ*_log unresolved |
| F1 d = 5 soft | 0.16% → 0.024% (6.7×) | 0.10% → 0.020% (5.0×), τ*_log unresolved |
| Suppression d = 3 → 5 (naive / learned) | 5.0× / 15× | 5.4× / 15× |
| Out of sample, soft worse than hard | 13 of 26 → 0 of 26 | 13 of 26 → 0 of 26 |
| In sample, soft worse than hard (Z naive, Wilson / paired) | 13 / 18 of 39 | 9 / 9 of 39 |
| In sample, learned (Z and X) | 0 of 39 | 0 of 39 |
| Ablation d = 5 hard: naive / diag only / rates only / learned | 0.097 / 0.022 / 0.089 / 0.026% | 0.097 / 0.022 / 0.086 / 0.025% |
| Ablation d = 3 hard: learned | 0.37% | 0.32% (below diagonal-only interval) |
| Ion τ*_phys / τ*_log (Z, d = 3 hard) | 23.0 / 23.0 [20.0, 47.5] µs | 23.0 / 23.5 [17.3, 25.1] µs |
| Superconducting τ*_phys / τ*_log (Z, d = 3 hard) | 0.910 / 0.710 [0.662, 0.990] µs | 0.910 / 0.729 [0.697, 0.844] µs |
| Superconducting τ*_log (X, d = 3 hard) | 0.696 [0.685, 0.946] µs | unchanged |
| Ion τ*_log d = 5 (Z hard) | 89.1 [11.2, 142] µs | 27.4 [27.4, 38.7] µs, UNRESOLVED |
| Intervals below τ*_phys (superconducting, d = 3 and 5) | 1 of 8 | 4 of 8 |
| Ion budget at optimum: idle / readout / gate / crosstalk | 1.17e-6 / 6.13e-4 / 8.68e-3 / 1.96e-4 | 1.20e-6 / 6.20e-4 / 8.89e-3 / 2.00e-4 |
| Readout/idle ("500×"), gate/idle ("7000×"), gate/readout | 523, 7396, 14.1 | 517, 7403, 14.3 |
| Per round at τ*_log, ion / superconducting | 0.00112 / 0.00221 | 0.00117 / 0.00205 |
| Rounds per second, ion / superconducting | 253 / 957 888 | 253 / 940 612 |
| Per µs, ion / superconducting | 2.84e-7 / 2.12e-3 | 2.96e-7 / 1.92e-3 |
| Sensitivity η × 0.5 (paired) | +0.0057 [0.0042, 0.0072] | +0.0065 [0.0049, 0.0081] |
| Sensitivity T1 × 2 | −0.0024, resolved | −0.0004 [−0.0019, +0.0010], not resolved |
| C4 ion break-even | 0.237 [0.210, 0.266] at 1.56 µs | 0.229 [0.201, 0.261] at 1.63 µs |
| C5 resolved rows / learned below naive | 15 / 13 | 12 / 11 |
| O4 range; intervals containing 1 | 1.000–1.041; 5 of 5 | 0.984–1.167; 4 of 5 |
| V18 d = 5 (k naive → learned) | 70 → 37, pass | 66 → 36, pass |
| C1–C6, O4 verdicts | refuted, held, held, undetermined, held, n/a, measurement | same |

## 3. Tests, build and check

- `npm test`: **414 / 414 pass**.
- `npm run build`: twice, **`dist/` byte-identical** across both builds. sha256:
  - `qollab/index.html` 908ebc48…
  - `qollab/main.css` d0287160…
  - `qollab/main.js` 90554361…
  - `local/preview.html` 73fee34b…
- `npm run check`: **149 passed, 0 warned, 0 failed**.
- `tools/ablation.mjs` rerun: `data/results/ablation.json` byte-identical to the first run (same Node, v24.18.1).
- Every bank outside `archive/` (59) has a UUIDv7 job_id time inside the window, and a `date` 11 s to 621 s later. All 34 rerun seeds match the sha256 rule in RERUN_SEEDS.md and the bank files. The spam-check raw files have job_id times inside the window (Sat 10 Oct 17:37 and 17:38 UTC) and carry no `date` field.
- Nothing in `src/`, `tools/`, `tests/`, the build or the release check reads `archive/`. The only mention outside `archive/` is the disclosure text.
- **V9 fingerprint: `53933f98`, unchanged.** `diagnostic()` decodes only the first 1000 shots of `rep_d3_r3_L0` in key order. Those are all the all-zero outcome in both the old bank (3358 such shots) and the new one (3339), so the hash cannot distinguish the two banks. The tests keep asserting `53933f98`, which is the newly generated value.
- Provenance: the regenerated results record `commit` = `16b9a97` (HEAD), but the tree had uncommitted changes when they were run; the files are listed below. They also record Node v24.18.1, where the old files had v24.19.0.

## 4. Files changed, by purpose

**Data and results (regenerated by the tools, nothing hand-edited):**
- `data/results/`: all 16 files.
- `data/curated/curated_shots.json`.
- `data/fixtures/*` and `data/vectors/*` were regenerated with identical content. Git may list them as modified until its stat cache refreshes; `git diff` on them is empty.

**Tools:**
- `tools/sweep.mjs`: wording of two `plain` verdict sentences only. C1 "refuted" now says only the superconducting bit-flip memory wants a shorter readout; O4 now says "looks nearly the same". No calculation changed. Stage 4 was rerun after each edit, and the files differ only in those sentences and the run timings.
- `tools/curate.mjs`: a comment updated to the new counts.
- `tools/make_fixtures.mjs`: see Disclosure.

**Docs and UI:**
- `README.md`, `docs/project_page.md`, `data/writeup/project_page.json` (by `tools/make_writeup.mjs`): every changed number and source comment, plus the rewritten F1, F2, ablation and limitation sentences.
- `docs/notes_results.md`: top note, plus a new section, "Current results: in-window rerun".
- `docs/RERUN_DIFF.md` and `docs/RERUN_REPORT.md`: new.
- `src/ui/findings.js`: the F2 card's title and line now follow the data. Before, the title was hard-coded "Both platforms: tune readout on one qubit", and the line disappeared once the ion optima stopped printing identically. `docs/METHODS.md` has no result numbers and is unchanged.

**Tests, updated to the regenerated values or states only; no tolerance loosened, no assertion removed:**
- `tests/ablation.test.js`: rates-only at d = 5 is now resolved below naive. The test now also asserts it stays above the diagonal-only interval.
- `tests/curate.test.js`: the new counts and averages.
- `tests/findings.test.js`: the new F2 line, and its title tied to the data.
- `tests/hero.test.js`: ion 23.5 µs, superconducting 0.729 µs.
- `tests/hero3_text.test.js`: superconducting Z is now `band`; the ion overlap sentence now has the "overlap within our uncertainty" form.
- `tests/learnnoise.test.js`: V18 66/36; the d7 comparison row; the reversal text.
- `tests/level3.test.js`: 8 errors at the ion d = 5 lowest point.
- `tests/level5.test.js`: tornado values. Two rows are now resolved; T1 × 2 is no longer. The v1 caption changed because the regenerated v1 files now carry cluster bounds.

**Disclosure:**
- `README.md` and `docs/project_page.md`: the required statement, plus the replication sentence naming what did not replicate.
- `README.md` also had "All code … was generated during the build window", which is now "generated with Claude Code". `docs/project_page.md` had "All code was generated during the window", likewise.
- `docs/notes_results.md`: the top note.
- `docs/qollab_js_api_example.txt` and `tools/make_fixtures.mjs`: see section 5.

**Screenshots:** not regenerated (no script exists). See section 6.

## 5. Ambiguous decisions and things not fixed

- **Two leftover date edits restored.** Commit `6581af9` changed two dates that `86766f2` ("Restore original bank dates…") did not revert:
  - the fixture date in `tools/make_fixtures.mjs` (`2026-10-07` → `2026-10-09`);
  - the copy date in `docs/qollab_js_api_example.txt` (`2026-10-05` → `2026-10-09`).

  I restored both to their original values, the conservative choice. The regenerated fixtures now match the committed ones again. **Please confirm 2026-10-05 is the true copy date.** No data file's date, job_id, seed, count or hash was edited.
- **notes_results.md:** the dated v2 sections (Sat 10 and Sun 11 Oct) also used the pre-window `rep_*` banks, not only the sections dated before 10 Oct. Rather than rewrite numbers under old timestamps, I kept every dated section as history, said so in the top note, and added a new current-results section at the end.
- **`plain` sentences in `tools/sweep.mjs`:** I changed wording only, because the old C1 sentence ("In neither qubit type…") had become false and the page shows it. The first rewrite was 27 words and failed the 20-word test, so I shortened the sentence rather than the test.
- **F1 d = 3 hard "not resolved":** the Wilson intervals now separate (the file flag `learnedBelowBeyondIntervals` is true), but the cluster intervals the table quotes overlap. I kept "not resolved", the stricter reading.
- **Old seed `1012386106` in `tests/assemble_bank.test.js`:** this is a synthetic input to a unit test, not a result. Left as is.
- **v4/v13 banks share a counts sha256 with their archived originals.** These are noiseless injection checks with one deterministic outcome (100 shots of one key), so identical counts are expected. Their job_ids and seeds are new.
- **The extract script initially counted a 100%-tied crosstalk row as resolved.** I fixed it to apply the tie rule, as the pipeline does, before RERUN_DIFF.md was written.
- **I ran `git update-index --refresh` once.** It refreshes git's stat cache only; no content or history changed.

## 6. Your next steps, in order

**a) Review**
```
git status
git diff --stat
git diff -- README.md docs/project_page.md docs/notes_results.md src/ui/findings.js tools/sweep.mjs tools/make_fixtures.mjs tools/curate.mjs docs/qollab_js_api_example.txt
git diff -- tests/
```
Then read `docs/RERUN_DIFF.md` and `docs/RERUN_REPORT.md`.

**b) Retake screenshots by hand.** Every screenshot shows data from the re-run banks, so all eight are stale:
- `docs/screenshots/level3-sc.png`: F2 changed. The code's best is now marked earlier.
- `docs/screenshots/learnnoise.png`: held-out numbers.
- `docs/screenshots/level3-ion.png`: also the README's top image. The d = 5 marker is gone.
- `docs/screenshots/level5-preview.png`.
- `docs/screenshots/level4-ion.png`, `docs/screenshots/level4-sc.png`.
- `docs/screenshots/level1.png`, `docs/screenshots/level2.png`.

Use `dist/local/preview.html`.

**c) Commit**, in this order:
```
git add data/results data/curated tools/sweep.mjs tools/curate.mjs
git commit -m "Regenerate all results from the in-window banks"

git add docs/RERUN_DIFF.md docs/RERUN_REPORT.md docs/notes_results.md src/ui/findings.js tests
git commit -m "Update notes, findings card and tests to the regenerated results; add rerun diff and report"

git add README.md docs/project_page.md data/writeup/project_page.json docs/qollab_js_api_example.txt tools/make_fixtures.mjs
git commit -m "Disclose pre-window prototyping; update README and project page to the regenerated results; restore two original dates"

git add docs/screenshots
git commit -m "Retake screenshots with the regenerated results"
```
README.md and project_page.md mix number updates and disclosure wording, so they go in one commit. To separate them, use `git add -p README.md docs/project_page.md` in a terminal.

**d) Push** only after you have reviewed the diff, retaken the screenshots and made all four commits:
```
git push
```

**e) Upload to Qollab** (main project, top level, no folders):
- `dist/qollab/index.html`
- `dist/qollab/main.css`
- `dist/qollab/main.js`
- `qollab/live.py`, uploaded as `live.py`

**f) Redo V9 on Qollab:**
1. Open https://qollab.xyz/u/SQuant/qec-signal-to-syndrome in Chrome or Edge.
2. Run it, scroll to **Diagnostics** at the bottom, and read the fingerprint.
3. Expect **`53933f98`** (V9 and V9L), the same value `node tools/sweep.mjs --diag` prints.
4. Once it matches, the project page's V9 row ("on Qollab not yet redone") can be updated.
