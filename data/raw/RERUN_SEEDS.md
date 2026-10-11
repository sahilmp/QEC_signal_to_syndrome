# Re-run seeds for banks run before the build window

The build window opened Sat 10 Oct 2026, 00:00 IST (Fri 9 Oct 18:30 UTC). Each bank's run time
comes from its IonQ `job_id` (UUIDv7: the first 48 bits are the submission time in Unix ms).
34 banks were run before the window, on Wed 7 Oct (10 `rep_*`) and Thu 8 Oct (24 `v4_*`).
Each is re-run inside the window with the same configuration and a new seed:

    new sampler_seed = first 31 bits of sha256("s2s-rerun-<bank name>")
                     = int(sha256(...).hexdigest(), 16) >> 225

The new seeds are all distinct and in 1..2^31-1. None equals any of the 62 seeds
already in the repo: every bank's `sampler_seed` (including the 12 held-out banks), every
`SEEDS` entry in `qollab/bank_generator.py`, and the two spam-check seeds. None appears as an
integer anywhere else in the repo either.

Configuration is read from each bank's metadata in `data/banks/`. It is what
`bank_generator.py` derives from the bank name, so setting `CONFIG` to the name reproduces it.
For `v4_*`, `inject [[i, k]]` means an X on data qubit i after round k.

## How to run each bank (Qollab, one job per run)

1. Pick IonQ Forte 1 in the Select QPU dialog.
2. At the top of `qollab/bank_generator.py`, set two lines for the bank being run:

   ```python
   CONFIG = "<bank name>"
   ```

   and in the `SEEDS` dict, change that bank's entry to its new seed from the table:

   ```python
       "<bank name>": <new sampler_seed>,
   ```

   Leave `SHOTS = 4000` and `V4_SHOTS = 100` as they are. Change nothing else. For example, for the first row:

   ```python
   CONFIG = "rep_d3_r1_L0"
   SEEDS = {
       "rep_d3_r1_L0": 1085456959,   # was 1012386106
       ...
   ```

3. Run. Check that the console line `<name>: basis ..., seed <n>` shows the new seed.
4. **Save the output from the `BEGIN_BANK <name> ...` line through the `END_BANK <name>` line,
   inclusive, exactly as printed.** That block is the bank. Replace the old raw file with it:
   `data/raw/<name>.txt` for `rep_*`, `data/raw/v4/<name>.txt` for `v4_*`.
5. Assemble it, which checks the sha256 and counts and writes `data/banks/<name>.json`:

   ```bash
   node tools/assemble_bank.mjs data/raw/<name>.txt
   ```

   (`data/raw/v4/<name>.txt` for v4.) Never edit the `date`, `job_id`, seed or sha256 by hand.

After all runs, the `SEEDS` entries for these 34 names hold the new seeds, so the generator
matches the banks. Everything computed from these banks (Stage 1–4 results, fixtures, notes)
has to be regenerated from the new banks.

## Re-run table

The status column says: done (with the new `job_id` and its submission time, UTC), failed (with
the reason; the bank was not ingested), or to run. `date` is written after the job finishes, so it
trails the job_id time by the run time; up to 15 min is accepted (d5_r5 and d7_r3 runs take 7-10
min). The original files of each done bank are in `archive/pre-window/` (see its README), unchanged.

| # | bank | basis | code | d | r | logical | inject [[i, k]] | shots | mode | noise model | old seed | **new sampler_seed** | original job time (UTC) | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `rep_d3_r1_L0` | Z | repetition | 3 | 1 | 0 | — | 4000 | fresh-ancilla | forte-1 | 1012386106 | **1085456959** | 2026-10-07 09:59:32Z | done: `01a12b6e-131b-7598-bf92-93891d7d84cb` (2026-10-11 14:46:36Z) |
| 2 | `rep_d3_r1_L1` | Z | repetition | 3 | 1 | 1 | — | 4000 | fresh-ancilla | forte-1 | 756216899 | **1448986146** | 2026-10-07 10:08:14Z | done: `01a12b6f-1338-7f12-94e2-7d4598485f57` (2026-10-11 14:47:42Z) |
| 3 | `rep_d3_r3_L0` | Z | repetition | 3 | 3 | 0 | — | 4000 | fresh-ancilla | forte-1 | 1938670837 | **160643811** | 2026-10-07 10:10:06Z | done: `01a12b70-85fe-7837-8c3c-642d7077d8da` (2026-10-11 14:49:17Z) |
| 4 | `rep_d3_r3_L1` | Z | repetition | 3 | 3 | 1 | — | 4000 | fresh-ancilla | forte-1 | 706416029 | **176271806** | 2026-10-07 10:13:43Z | done: `01a12b71-9e40-7028-98d4-7fb9e655d16b` (2026-10-11 14:50:28Z) |
| 5 | `rep_d5_r3_L0` | Z | repetition | 5 | 3 | 0 | — | 4000 | fresh-ancilla | forte-1 | 1086232993 | **481936971** | 2026-10-07 10:15:09Z | done: `01a12b72-a0ef-7190-8493-b742bc2d11ba` (2026-10-11 14:51:35Z) |
| 6 | `rep_d5_r3_L1` | Z | repetition | 5 | 3 | 1 | — | 4000 | fresh-ancilla | forte-1 | 1127187622 | **947999881** | 2026-10-07 10:21:59Z | done: `01a12b74-1c72-71b6-98b8-857d13f6bc49` (2026-10-11 14:53:12Z) |
| 7 | `rep_d5_r5_L0` | Z | repetition | 5 | 5 | 0 | — | 4000 | fresh-ancilla | forte-1 | 490727874 | **878392875** | 2026-10-07 10:23:39Z | done: `01a12b76-80f6-784f-a1cf-da398bcc5234` (2026-10-11 14:55:48Z); date 441 s after job_id time (long config; check allows 15 min) |
| 8 | `rep_d5_r5_L1` | Z | repetition | 5 | 5 | 1 | — | 4000 | fresh-ancilla | forte-1 | 914806892 | **379512397** | 2026-10-07 10:31:59Z | done: `01a12b7f-66ca-70b1-b35d-9e11fd95b93a` (2026-10-11 15:05:32Z); date 441 s after job_id time (long config; check allows 15 min) |
| 9 | `rep_d7_r3_L0` | Z | repetition | 7 | 3 | 0 | — | 4000 | fresh-ancilla | forte-1 | 347037156 | **1704897894** | 2026-10-07 10:40:27Z | done: `01a12b87-9951-7385-9e10-3a0e10ba1029` (2026-10-11 15:14:29Z); date 621 s after job_id time (long config; check allows 15 min) |
| 10 | `rep_d7_r3_L1` | Z | repetition | 7 | 3 | 1 | — | 4000 | fresh-ancilla | forte-1 | 178290805 | **1659807629** | 2026-10-07 10:48:17Z | done: `01a12b91-f70f-72c5-9da2-d64b96ceaebe` (2026-10-11 15:25:48Z); date 400 s after job_id time (long config; check allows 15 min) |
| 11 | `v4_d3_r3_i0_k0` | Z | repetition | 3 | 3 | 0 | [[0, 0]] (X) | 100 | fresh-ancilla | ideal | 2110077385 | **924473268** | 2026-10-08 11:17:47Z | done: `01a12b98-e35c-7036-aebf-f8d5544b8a83` (2026-10-11 15:33:22Z) |
| 12 | `v4_d3_r3_i0_k1` | Z | repetition | 3 | 3 | 0 | [[0, 1]] (X) | 100 | fresh-ancilla | ideal | 356644854 | **575478288** | 2026-10-08 11:19:07Z | done: `01a12b99-cb85-7cfe-a403-00fc251e39e5` (2026-10-11 15:34:21Z) |
| 13 | `v4_d3_r3_i0_k2` | Z | repetition | 3 | 3 | 0 | [[0, 2]] (X) | 100 | fresh-ancilla | ideal | 2139660026 | **916470765** | 2026-10-08 11:20:11Z | done: `01a12b9a-b57c-7e1c-b33b-72e837adc578` (2026-10-11 15:35:21Z) |
| 14 | `v4_d3_r3_i1_k0` | Z | repetition | 3 | 3 | 0 | [[1, 0]] (X) | 100 | fresh-ancilla | ideal | 1079968443 | **8289140** | 2026-10-08 11:21:19Z | done: `01a12b9b-bebb-78da-8134-5233323cb9be` (2026-10-11 15:36:29Z) |
| 15 | `v4_d3_r3_i1_k1` | Z | repetition | 3 | 3 | 0 | [[1, 1]] (X) | 100 | fresh-ancilla | ideal | 610129654 | **1201272937** | 2026-10-08 11:22:18Z | done: `01a12b9c-a873-778d-8b22-cd41380bab0e` (2026-10-11 15:37:29Z) |
| 16 | `v4_d3_r3_i1_k2` | Z | repetition | 3 | 3 | 0 | [[1, 2]] (X) | 100 | fresh-ancilla | ideal | 1328329168 | **684510213** | 2026-10-08 11:23:11Z | done: `01a12b9d-a85f-729c-9407-bcb3d5955698` (2026-10-11 15:38:34Z) |
| 17 | `v4_d3_r3_i2_k0` | Z | repetition | 3 | 3 | 0 | [[2, 0]] (X) | 100 | fresh-ancilla | ideal | 1216489182 | **684537896** | 2026-10-08 11:24:07Z | done: `01a12b9e-c20b-792b-9eb6-27d251dfb1d2` (2026-10-11 15:39:47Z) |
| 18 | `v4_d3_r3_i2_k1` | Z | repetition | 3 | 3 | 0 | [[2, 1]] (X) | 100 | fresh-ancilla | ideal | 651302763 | **524511490** | 2026-10-08 11:25:46Z | done: `01a12b9f-abce-779a-8a24-83c5c9b19f98` (2026-10-11 15:40:46Z) |
| 19 | `v4_d3_r3_i2_k2` | Z | repetition | 3 | 3 | 0 | [[2, 2]] (X) | 100 | fresh-ancilla | ideal | 1731069982 | **349836381** | 2026-10-08 11:26:55Z | done: `01a12ba0-99d8-78a2-9645-571c28f5c702` (2026-10-11 15:41:47Z) |
| 20 | `v4_d5_r3_i0_k0` | Z | repetition | 5 | 3 | 0 | [[0, 0]] (X) | 100 | fresh-ancilla | ideal | 46082957 | **1023769746** | 2026-10-08 11:28:03Z | done: `01a12ba1-6cf2-74b0-a9af-412c835d3859` (2026-10-11 15:42:41Z) |
| 21 | `v4_d5_r3_i0_k1` | Z | repetition | 5 | 3 | 0 | [[0, 1]] (X) | 100 | fresh-ancilla | ideal | 722203451 | **871929448** | 2026-10-08 11:29:32Z | done: `01a12ba2-6a18-786f-aed8-23858fa40855` (2026-10-11 15:43:46Z) |
| 22 | `v4_d5_r3_i0_k2` | Z | repetition | 5 | 3 | 0 | [[0, 2]] (X) | 100 | fresh-ancilla | ideal | 1756932967 | **877831782** | 2026-10-08 11:30:40Z | done: `01a12ba3-7372-7d85-a103-601f7c5641a4` (2026-10-11 15:44:54Z) |
| 23 | `v4_d5_r3_i1_k0` | Z | repetition | 5 | 3 | 0 | [[1, 0]] (X) | 100 | fresh-ancilla | ideal | 309265062 | **1384702571** | 2026-10-08 11:31:50Z | done: `01a12ba4-7855-735c-b727-35f6188785fa` (2026-10-11 15:46:01Z) |
| 24 | `v4_d5_r3_i1_k1` | Z | repetition | 5 | 3 | 0 | [[1, 1]] (X) | 100 | fresh-ancilla | ideal | 1285942726 | **1665682839** | 2026-10-08 11:32:49Z | done: `01a12ba5-6a12-7b07-a025-447cbf27b991` (2026-10-11 15:47:03Z) |
| 25 | `v4_d5_r3_i1_k2` | Z | repetition | 5 | 3 | 0 | [[1, 2]] (X) | 100 | fresh-ancilla | ideal | 1520817678 | **1459612269** | 2026-10-08 11:33:43Z | done: `01a12ba6-48a7-76a6-80cf-b0c9e04d17bd` (2026-10-11 15:48:00Z) |
| 26 | `v4_d5_r3_i2_k0` | Z | repetition | 5 | 3 | 0 | [[2, 0]] (X) | 100 | fresh-ancilla | ideal | 2146497581 | **425117121** | 2026-10-08 11:35:19Z | done: `01a12ba7-321b-7d8b-aa4d-e528d5b83fbd` (2026-10-11 15:49:00Z) |
| 27 | `v4_d5_r3_i2_k1` | Z | repetition | 5 | 3 | 0 | [[2, 1]] (X) | 100 | fresh-ancilla | ideal | 633361251 | **1818322721** | 2026-10-08 11:36:10Z | done: `01a12ba8-35e8-7c4b-9c4a-a65962840670` (2026-10-11 15:50:06Z) |
| 28 | `v4_d5_r3_i2_k2` | Z | repetition | 5 | 3 | 0 | [[2, 2]] (X) | 100 | fresh-ancilla | ideal | 1019328693 | **1944554199** | 2026-10-08 11:37:14Z | done: `01a12ba9-186f-79c9-976e-b25ed4e8cbc7` (2026-10-11 15:51:04Z) |
| 29 | `v4_d5_r3_i3_k0` | Z | repetition | 5 | 3 | 0 | [[3, 0]] (X) | 100 | fresh-ancilla | ideal | 1984527685 | **1647266815** | 2026-10-08 11:38:35Z | done: `01a12baa-0f24-7cde-81d3-997dd8b48302` (2026-10-11 15:52:07Z) |
| 30 | `v4_d5_r3_i3_k1` | Z | repetition | 5 | 3 | 0 | [[3, 1]] (X) | 100 | fresh-ancilla | ideal | 1366329564 | **157391396** | 2026-10-08 11:39:31Z | done: `01a12bab-0a57-73a4-83ed-a763ade40701` (2026-10-11 15:53:12Z) |
| 31 | `v4_d5_r3_i3_k2` | Z | repetition | 5 | 3 | 0 | [[3, 2]] (X) | 100 | fresh-ancilla | ideal | 2106019850 | **1344137481** | 2026-10-08 11:40:53Z | done: `01a12bab-ddfa-76b6-b43b-2b1e92c4b58a` (2026-10-11 15:54:06Z) |
| 32 | `v4_d5_r3_i4_k0` | Z | repetition | 5 | 3 | 0 | [[4, 0]] (X) | 100 | fresh-ancilla | ideal | 1546938092 | **674348008** | 2026-10-08 11:41:46Z | done: `01a12bac-d43a-7136-8739-d65a4278a3b9` (2026-10-11 15:55:09Z) |
| 33 | `v4_d5_r3_i4_k1` | Z | repetition | 5 | 3 | 0 | [[4, 1]] (X) | 100 | fresh-ancilla | ideal | 719605923 | **291266045** | 2026-10-08 11:42:37Z | done: `01a12bad-b65d-7089-bd4b-5197eca57fb3` (2026-10-11 15:56:07Z) |
| 34 | `v4_d5_r3_i4_k2` | Z | repetition | 5 | 3 | 0 | [[4, 2]] (X) | 100 | fresh-ancilla | ideal | 943539033 | **1417194571** | 2026-10-08 11:43:32Z | done: `01a12bae-cd75-78f5-8c80-e12fa96660b3` (2026-10-11 15:57:18Z) |

## Banks run inside the window (kept as they are)

25 banks, plus `spam_forte-1` and `spam_ideal` (Sat 10 Oct 23:07 and 23:08 IST):

- phase-flip memories (Sat 10 Oct 16:00–16:38 IST): `repx_d3_r1_L0`, `repx_d3_r1_L1`, `repx_d3_r3_L0`, `repx_d3_r3_L1`, `repx_d5_r3_L0`, `repx_d5_r3_L1`, `repx_d5_r5_L0`, `repx_d5_r5_L1`, `repx_d7_r3_L0`, `repx_d7_r3_L1`
- V13 injections (Sat 10 Oct 16:25–16:28 IST): `v13_d3_r3_i0_k0`, `v13_d3_r3_i1_k1`, `v13_d3_r3_i2_k2`
- held-out (Sat 10 Oct 22:36–23:01 IST): `rep_d3_r3_L0_h1`, `rep_d3_r3_L1_h1`, `rep_d5_r3_L0_h1`, `rep_d5_r3_L0_h2`, `rep_d5_r3_L0_h3`, `rep_d5_r3_L0_h4`, `rep_d5_r3_L0_h5`, `rep_d5_r3_L1_h1`, `rep_d5_r3_L1_h2`, `rep_d5_r3_L1_h3`, `rep_d5_r3_L1_h4`, `rep_d5_r3_L1_h5`
