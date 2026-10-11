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

| # | bank | basis | code | d | r | logical | inject [[i, k]] | shots | mode | noise model | old seed | **new sampler_seed** | original job time (UTC) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `rep_d3_r1_L0` | Z | repetition | 3 | 1 | 0 | — | 4000 | fresh-ancilla | forte-1 | 1012386106 | **1085456959** | 2026-10-07 09:59:32Z |
| 2 | `rep_d3_r1_L1` | Z | repetition | 3 | 1 | 1 | — | 4000 | fresh-ancilla | forte-1 | 756216899 | **1448986146** | 2026-10-07 10:08:14Z |
| 3 | `rep_d3_r3_L0` | Z | repetition | 3 | 3 | 0 | — | 4000 | fresh-ancilla | forte-1 | 1938670837 | **160643811** | 2026-10-07 10:10:06Z |
| 4 | `rep_d3_r3_L1` | Z | repetition | 3 | 3 | 1 | — | 4000 | fresh-ancilla | forte-1 | 706416029 | **176271806** | 2026-10-07 10:13:43Z |
| 5 | `rep_d5_r3_L0` | Z | repetition | 5 | 3 | 0 | — | 4000 | fresh-ancilla | forte-1 | 1086232993 | **481936971** | 2026-10-07 10:15:09Z |
| 6 | `rep_d5_r3_L1` | Z | repetition | 5 | 3 | 1 | — | 4000 | fresh-ancilla | forte-1 | 1127187622 | **947999881** | 2026-10-07 10:21:59Z |
| 7 | `rep_d5_r5_L0` | Z | repetition | 5 | 5 | 0 | — | 4000 | fresh-ancilla | forte-1 | 490727874 | **878392875** | 2026-10-07 10:23:39Z |
| 8 | `rep_d5_r5_L1` | Z | repetition | 5 | 5 | 1 | — | 4000 | fresh-ancilla | forte-1 | 914806892 | **379512397** | 2026-10-07 10:31:59Z |
| 9 | `rep_d7_r3_L0` | Z | repetition | 7 | 3 | 0 | — | 4000 | fresh-ancilla | forte-1 | 347037156 | **1704897894** | 2026-10-07 10:40:27Z |
| 10 | `rep_d7_r3_L1` | Z | repetition | 7 | 3 | 1 | — | 4000 | fresh-ancilla | forte-1 | 178290805 | **1659807629** | 2026-10-07 10:48:17Z |
| 11 | `v4_d3_r3_i0_k0` | Z | repetition | 3 | 3 | 0 | [[0, 0]] (X) | 100 | fresh-ancilla | ideal | 2110077385 | **924473268** | 2026-10-08 11:17:47Z |
| 12 | `v4_d3_r3_i0_k1` | Z | repetition | 3 | 3 | 0 | [[0, 1]] (X) | 100 | fresh-ancilla | ideal | 356644854 | **575478288** | 2026-10-08 11:19:07Z |
| 13 | `v4_d3_r3_i0_k2` | Z | repetition | 3 | 3 | 0 | [[0, 2]] (X) | 100 | fresh-ancilla | ideal | 2139660026 | **916470765** | 2026-10-08 11:20:11Z |
| 14 | `v4_d3_r3_i1_k0` | Z | repetition | 3 | 3 | 0 | [[1, 0]] (X) | 100 | fresh-ancilla | ideal | 1079968443 | **8289140** | 2026-10-08 11:21:19Z |
| 15 | `v4_d3_r3_i1_k1` | Z | repetition | 3 | 3 | 0 | [[1, 1]] (X) | 100 | fresh-ancilla | ideal | 610129654 | **1201272937** | 2026-10-08 11:22:18Z |
| 16 | `v4_d3_r3_i1_k2` | Z | repetition | 3 | 3 | 0 | [[1, 2]] (X) | 100 | fresh-ancilla | ideal | 1328329168 | **684510213** | 2026-10-08 11:23:11Z |
| 17 | `v4_d3_r3_i2_k0` | Z | repetition | 3 | 3 | 0 | [[2, 0]] (X) | 100 | fresh-ancilla | ideal | 1216489182 | **684537896** | 2026-10-08 11:24:07Z |
| 18 | `v4_d3_r3_i2_k1` | Z | repetition | 3 | 3 | 0 | [[2, 1]] (X) | 100 | fresh-ancilla | ideal | 651302763 | **524511490** | 2026-10-08 11:25:46Z |
| 19 | `v4_d3_r3_i2_k2` | Z | repetition | 3 | 3 | 0 | [[2, 2]] (X) | 100 | fresh-ancilla | ideal | 1731069982 | **349836381** | 2026-10-08 11:26:55Z |
| 20 | `v4_d5_r3_i0_k0` | Z | repetition | 5 | 3 | 0 | [[0, 0]] (X) | 100 | fresh-ancilla | ideal | 46082957 | **1023769746** | 2026-10-08 11:28:03Z |
| 21 | `v4_d5_r3_i0_k1` | Z | repetition | 5 | 3 | 0 | [[0, 1]] (X) | 100 | fresh-ancilla | ideal | 722203451 | **871929448** | 2026-10-08 11:29:32Z |
| 22 | `v4_d5_r3_i0_k2` | Z | repetition | 5 | 3 | 0 | [[0, 2]] (X) | 100 | fresh-ancilla | ideal | 1756932967 | **877831782** | 2026-10-08 11:30:40Z |
| 23 | `v4_d5_r3_i1_k0` | Z | repetition | 5 | 3 | 0 | [[1, 0]] (X) | 100 | fresh-ancilla | ideal | 309265062 | **1384702571** | 2026-10-08 11:31:50Z |
| 24 | `v4_d5_r3_i1_k1` | Z | repetition | 5 | 3 | 0 | [[1, 1]] (X) | 100 | fresh-ancilla | ideal | 1285942726 | **1665682839** | 2026-10-08 11:32:49Z |
| 25 | `v4_d5_r3_i1_k2` | Z | repetition | 5 | 3 | 0 | [[1, 2]] (X) | 100 | fresh-ancilla | ideal | 1520817678 | **1459612269** | 2026-10-08 11:33:43Z |
| 26 | `v4_d5_r3_i2_k0` | Z | repetition | 5 | 3 | 0 | [[2, 0]] (X) | 100 | fresh-ancilla | ideal | 2146497581 | **425117121** | 2026-10-08 11:35:19Z |
| 27 | `v4_d5_r3_i2_k1` | Z | repetition | 5 | 3 | 0 | [[2, 1]] (X) | 100 | fresh-ancilla | ideal | 633361251 | **1818322721** | 2026-10-08 11:36:10Z |
| 28 | `v4_d5_r3_i2_k2` | Z | repetition | 5 | 3 | 0 | [[2, 2]] (X) | 100 | fresh-ancilla | ideal | 1019328693 | **1944554199** | 2026-10-08 11:37:14Z |
| 29 | `v4_d5_r3_i3_k0` | Z | repetition | 5 | 3 | 0 | [[3, 0]] (X) | 100 | fresh-ancilla | ideal | 1984527685 | **1647266815** | 2026-10-08 11:38:35Z |
| 30 | `v4_d5_r3_i3_k1` | Z | repetition | 5 | 3 | 0 | [[3, 1]] (X) | 100 | fresh-ancilla | ideal | 1366329564 | **157391396** | 2026-10-08 11:39:31Z |
| 31 | `v4_d5_r3_i3_k2` | Z | repetition | 5 | 3 | 0 | [[3, 2]] (X) | 100 | fresh-ancilla | ideal | 2106019850 | **1344137481** | 2026-10-08 11:40:53Z |
| 32 | `v4_d5_r3_i4_k0` | Z | repetition | 5 | 3 | 0 | [[4, 0]] (X) | 100 | fresh-ancilla | ideal | 1546938092 | **674348008** | 2026-10-08 11:41:46Z |
| 33 | `v4_d5_r3_i4_k1` | Z | repetition | 5 | 3 | 0 | [[4, 1]] (X) | 100 | fresh-ancilla | ideal | 719605923 | **291266045** | 2026-10-08 11:42:37Z |
| 34 | `v4_d5_r3_i4_k2` | Z | repetition | 5 | 3 | 0 | [[4, 2]] (X) | 100 | fresh-ancilla | ideal | 943539033 | **1417194571** | 2026-10-08 11:43:32Z |

## Banks run inside the window (kept as they are)

25 banks, plus `spam_forte-1` and `spam_ideal` (Sat 10 Oct 23:07 and 23:08 IST):

- phase-flip memories (Sat 10 Oct 16:00–16:38 IST): `repx_d3_r1_L0`, `repx_d3_r1_L1`, `repx_d3_r3_L0`, `repx_d3_r3_L1`, `repx_d5_r3_L0`, `repx_d5_r3_L1`, `repx_d5_r5_L0`, `repx_d5_r5_L1`, `repx_d7_r3_L0`, `repx_d7_r3_L1`
- V13 injections (Sat 10 Oct 16:25–16:28 IST): `v13_d3_r3_i0_k0`, `v13_d3_r3_i1_k1`, `v13_d3_r3_i2_k2`
- held-out (Sat 10 Oct 22:36–23:01 IST): `rep_d3_r3_L0_h1`, `rep_d3_r3_L1_h1`, `rep_d5_r3_L0_h1`, `rep_d5_r3_L0_h2`, `rep_d5_r3_L0_h3`, `rep_d5_r3_L0_h4`, `rep_d5_r3_L0_h5`, `rep_d5_r3_L1_h1`, `rep_d5_r3_L1_h2`, `rep_d5_r3_L1_h3`, `rep_d5_r3_L1_h4`, `rep_d5_r3_L1_h5`
