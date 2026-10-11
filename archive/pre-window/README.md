# Pre-window banks (archived)

These are the original simulator banks run on 7–9 Oct 2026, before the hackathon build window
opened (Sat 10 Oct 2026, 00:00 IST = Fri 9 Oct 18:30 UTC). They are kept here unchanged, for
transparency. Each was re-run inside the window with the same configuration and a new seed
(see `data/raw/RERUN_SEEDS.md`); the re-run replaces it in `data/raw/` and `data/banks/`.

Nothing in `src/`, `tools/`, the build or the release check reads from `archive/`.

- `raw/` holds the original console text, in the same layout as `data/raw/` (`raw/v4/` for `v4_*`).
- `banks/` holds the `data/banks/*.json` files that `tools/assemble_bank.mjs` built from them.

The run time is the submission time in the IonQ `job_id` (UUIDv7: first 48 bits = Unix ms).

| bank | raw file | bank file | job_id | job_id time (UTC) | sampler_seed |
|---|---|---|---|---|---|
| `rep_d3_r1_L0` | `raw/rep_d3_r1_L0.txt` | `banks/rep_d3_r1_L0.json` | `01a115cd-d1f8-761b-b114-900f36530834` | 2026-10-07 09:59:32Z | 1012386106 |
| `rep_d3_r1_L1` | `raw/rep_d3_r1_L1.txt` | `banks/rep_d3_r1_L1.json` | `01a115d5-c9c4-73a8-ae9c-6fe51bb858f1` | 2026-10-07 10:08:14Z | 756216899 |
| `rep_d3_r3_L0` | `raw/rep_d3_r3_L0.txt` | `banks/rep_d3_r3_L0.json` | `01a115d7-7cbc-75fa-bad2-21e7b43964ce` | 2026-10-07 10:10:06Z | 1938670837 |
| `rep_d3_r3_L1` | `raw/rep_d3_r3_L1.txt` | `banks/rep_d3_r3_L1.json` | `01a115da-ced7-758d-b395-3c1c83691b6d` | 2026-10-07 10:13:43Z | 706416029 |
| `rep_d5_r3_L0` | `raw/rep_d5_r3_L0.txt` | `banks/rep_d5_r3_L0.json` | `01a115dc-1f58-7b3f-9771-71675686c350` | 2026-10-07 10:15:09Z | 1086232993 |
| `rep_d5_r3_L1` | `raw/rep_d5_r3_L1.txt` | `banks/rep_d5_r3_L1.json` | `01a115e2-6052-70b9-b701-452506d80b05` | 2026-10-07 10:21:59Z | 1127187622 |
| `rep_d5_r5_L0` | `raw/rep_d5_r5_L0.txt` | `banks/rep_d5_r5_L0.json` | `01a115e3-e409-7673-a24c-1a92eefcebda` | 2026-10-07 10:23:39Z | 490727874 |
| `rep_d5_r5_L1` | `raw/rep_d5_r5_L1.txt` | `banks/rep_d5_r5_L1.json` | `01a115eb-8754-7463-88db-6f0442b2e899` | 2026-10-07 10:31:59Z | 914806892 |
| `rep_d7_r3_L0` | `raw/rep_d7_r3_L0.txt` | `banks/rep_d7_r3_L0.json` | `01a115f3-48d2-7359-8a3a-f89d7b0fc20c` | 2026-10-07 10:40:27Z | 347037156 |
| `rep_d7_r3_L1` | `raw/rep_d7_r3_L1.txt` | `banks/rep_d7_r3_L1.json` | `01a115fa-72f8-7876-973c-2ba9adc050bb` | 2026-10-07 10:48:17Z | 178290805 |
| `v4_d3_r3_i0_k0` | `raw/v4/v4_d3_r3_i0_k0.txt` | `banks/v4_d3_r3_i0_k0.json` | `01a11b3b-d339-7cd6-bf27-2d62cec73819` | 2026-10-08 11:17:47Z | 2110077385 |
| `v4_d3_r3_i0_k1` | `raw/v4/v4_d3_r3_i0_k1.txt` | `banks/v4_d3_r3_i0_k1.json` | `01a11b3d-0ab1-7a07-ba53-1d220b04fafd` | 2026-10-08 11:19:07Z | 356644854 |
| `v4_d3_r3_i0_k2` | `raw/v4/v4_d3_r3_i0_k2.txt` | `banks/v4_d3_r3_i0_k2.json` | `01a11b3e-05d9-79ff-9aff-6d136898baf0` | 2026-10-08 11:20:11Z | 2139660026 |
| `v4_d3_r3_i1_k0` | `raw/v4/v4_d3_r3_i1_k0.txt` | `banks/v4_d3_r3_i1_k0.json` | `01a11b3f-0ca7-737a-909e-afaab2a58169` | 2026-10-08 11:21:19Z | 1079968443 |
| `v4_d3_r3_i1_k1` | `raw/v4/v4_d3_r3_i1_k1.txt` | `banks/v4_d3_r3_i1_k1.json` | `01a11b3f-f4bd-781d-b442-fbc0c30868a9` | 2026-10-08 11:22:18Z | 610129654 |
| `v4_d3_r3_i1_k2` | `raw/v4/v4_d3_r3_i1_k2.txt` | `banks/v4_d3_r3_i1_k2.json` | `01a11b40-c1b3-70b0-91d0-27dbb83a62e4` | 2026-10-08 11:23:11Z | 1328329168 |
| `v4_d3_r3_i2_k0` | `raw/v4/v4_d3_r3_i2_k0.txt` | `banks/v4_d3_r3_i2_k0.json` | `01a11b41-9c5c-7a9a-abb2-c3c677cbbc37` | 2026-10-08 11:24:07Z | 1216489182 |
| `v4_d3_r3_i2_k1` | `raw/v4/v4_d3_r3_i2_k1.txt` | `banks/v4_d3_r3_i2_k1.json` | `01a11b43-1f5f-799c-9156-75ad1e706eaf` | 2026-10-08 11:25:46Z | 651302763 |
| `v4_d3_r3_i2_k2` | `raw/v4/v4_d3_r3_i2_k2.txt` | `banks/v4_d3_r3_i2_k2.json` | `01a11b44-2f9f-7334-bec6-5f90ac11a289` | 2026-10-08 11:26:55Z | 1731069982 |
| `v4_d5_r3_i0_k0` | `raw/v4/v4_d5_r3_i0_k0.txt` | `banks/v4_d5_r3_i0_k0.json` | `01a11b45-38bb-773b-95e7-0a88ac298120` | 2026-10-08 11:28:03Z | 46082957 |
| `v4_d5_r3_i0_k1` | `raw/v4/v4_d5_r3_i0_k1.txt` | `banks/v4_d5_r3_i0_k1.json` | `01a11b46-9477-7bf3-8263-620ce2f83b94` | 2026-10-08 11:29:32Z | 722203451 |
| `v4_d5_r3_i0_k2` | `raw/v4/v4_d5_r3_i0_k2.txt` | `banks/v4_d5_r3_i0_k2.json` | `01a11b47-9ee1-76de-9dcc-ba4716c955a2` | 2026-10-08 11:30:40Z | 1756932967 |
| `v4_d5_r3_i1_k0` | `raw/v4/v4_d5_r3_i1_k0.txt` | `banks/v4_d5_r3_i1_k0.json` | `01a11b48-af08-70fc-81bd-805561b4eb83` | 2026-10-08 11:31:50Z | 309265062 |
| `v4_d5_r3_i1_k1` | `raw/v4/v4_d5_r3_i1_k1.txt` | `banks/v4_d5_r3_i1_k1.json` | `01a11b49-9573-7414-bb8c-f0400894d856` | 2026-10-08 11:32:49Z | 1285942726 |
| `v4_d5_r3_i1_k2` | `raw/v4/v4_d5_r3_i1_k2.txt` | `banks/v4_d5_r3_i1_k2.json` | `01a11b4a-67a5-7ca2-ae9b-9a2332c5aea3` | 2026-10-08 11:33:43Z | 1520817678 |
| `v4_d5_r3_i2_k0` | `raw/v4/v4_d5_r3_i2_k0.txt` | `banks/v4_d5_r3_i2_k0.json` | `01a11b4b-e034-7010-89ac-c780d45fdb5a` | 2026-10-08 11:35:19Z | 2146497581 |
| `v4_d5_r3_i2_k1` | `raw/v4/v4_d5_r3_i2_k1.txt` | `banks/v4_d5_r3_i2_k1.json` | `01a11b4c-a7ec-7006-960a-3d03f105cd72` | 2026-10-08 11:36:10Z | 633361251 |
| `v4_d5_r3_i2_k2` | `raw/v4/v4_d5_r3_i2_k2.txt` | `banks/v4_d5_r3_i2_k2.json` | `01a11b4d-9e17-7b00-bccd-e2a462506314` | 2026-10-08 11:37:14Z | 1019328693 |
| `v4_d5_r3_i3_k0` | `raw/v4/v4_d5_r3_i3_k0.txt` | `banks/v4_d5_r3_i3_k0.json` | `01a11b4e-db65-7dbb-af3c-e1ff140f3fd8` | 2026-10-08 11:38:35Z | 1984527685 |
| `v4_d5_r3_i3_k1` | `raw/v4/v4_d5_r3_i3_k1.txt` | `banks/v4_d5_r3_i3_k1.json` | `01a11b4f-b786-7b85-98f7-aa7e89178c32` | 2026-10-08 11:39:31Z | 1366329564 |
| `v4_d5_r3_i3_k2` | `raw/v4/v4_d5_r3_i3_k2.txt` | `banks/v4_d5_r3_i3_k2.json` | `01a11b50-f8be-703d-af32-923e9fdde998` | 2026-10-08 11:40:53Z | 2106019850 |
| `v4_d5_r3_i4_k0` | `raw/v4/v4_d5_r3_i4_k0.txt` | `banks/v4_d5_r3_i4_k0.json` | `01a11b51-c706-7247-a911-bfe1e2234761` | 2026-10-08 11:41:46Z | 1546938092 |
| `v4_d5_r3_i4_k1` | `raw/v4/v4_d5_r3_i4_k1.txt` | `banks/v4_d5_r3_i4_k1.json` | `01a11b52-8ea6-75c5-b365-a2fb453706c5` | 2026-10-08 11:42:37Z | 719605923 |
| `v4_d5_r3_i4_k2` | `raw/v4/v4_d5_r3_i4_k2.txt` | `banks/v4_d5_r3_i4_k2.json` | `01a11b53-65f3-7efd-a3ef-9238db0d3de8` | 2026-10-08 11:43:32Z | 943539033 |
