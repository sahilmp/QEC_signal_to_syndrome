# Methods, sources and libraries

The methods behind [Signal to Syndrome](../README.md), each with the file that implements it and the paper it follows. Results, intervals and limitations are in [project_page.md](project_page.md).

## Methods implemented and sources

All of the following are our own implementations in JavaScript (`src/core/`), with no runtime libraries.

- **Repetition-code memory and detectors:** d data qubits, d − 1 parity checks measured for r rounds, detectors as changes of a check between rounds, plus a final layer from the data readout (`detectors.js`, `graph.js`). D. Gottesman, PhD thesis (1997), arXiv:quant-ph/9705052; E. Dennis, A. Kitaev, A. Landahl and J. Preskill, J. Math. Phys. 43, 4452 (2002).
- **Minimum-weight matching decoder:** shortest paths with Dijkstra's algorithm on the space-time decoding graph, then an exact minimum-weight matching of the lit detectors (and the boundary) by dynamic programming over subsets, up to 20 defects; above that a greedy matching, flagged as not exact (`matching.js`). Edge weights w = ln[(1 − p)/p]. Checked against PyMatching (V2): O. Higgott, ACM Trans. Quantum Comput. 3, 16 (2022); O. Higgott and C. Gidney, arXiv:2303.15933. Background: J. Edmonds, Can. J. Math. 17, 449 (1965).
- **Soft decoding:** readout log-likelihood ratios turned into per-edge error probabilities, p = 1/(1 + e^|llr|), combined with the gate-noise rate. C. A. Pattison, M. E. Beverland, M. P. da Silva and N. Delfosse, arXiv:2107.13589.
- **Gate-noise calibration:** the per-edge gate error estimated from the bulk detector firing rate, P(fire) = [1 − (1 − 2p)^n]/2 (`calibrate.js`).
- **Learned detector error model:** one rate per edge class (space, boundary, time and the diagonal edges from faults between a data qubit's two gates), solved from pairwise detector correlations, p = ½ − ½√(1 − 4(x_ij − x_i x_j)/(1 − 2x_i − 2x_j + 4x_ij)) (`dem.js`). An ablation on the held-out banks switches the diagonal edges and the learned rates on one at a time, with common random numbers and the paired cluster bootstrap (`tools/ablation.mjs`).
- **Trapped-ion fluorescence readout:** Poisson photon counts from a bright or dark ion with background, with at most one optical-pumping switch during the window; the likelihood integrates over the switch time (`readout/ion.js`). Parameters: C. Crain et al., Commun. Phys. 2, 97 (2019); S. Noek et al., Opt. Lett. 38, 4735 (2013); S. Olmschenk et al., arXiv:0708.0657; A. H. Myerson et al., Phys. Rev. Lett. 100, 200502 (2008).
- **Superconducting dispersive readout:** resonator ring-up to state-dependent coherent states, integrated and projected heterodyne signal with efficiency η, decay of |1⟩ during the window (T1); the belief model has no ring-up (`readout/sc.js`). Assignment error ½ erfc(SNR/2√2) without decay (V8). J. Gambetta et al., Phys. Rev. A 76, 012325 (2007); A. Blais, A. L. Grimsmo, S. M. Girvin and A. Wallraff, Rev. Mod. Phys. 93, 025005 (2021); parameters: T. Walter et al., Phys. Rev. Applied 7, 054020 (2017).
- **Idle errors (Pauli-frame rule):** data qubits waiting during readout flip with probability ½(1 − e^(−τ/T1)) (Pauli-twirled amplitude damping), or ½(1 − e^(−τ/T2)) in the phase-flip memory, plus ½(1 − e^(−Γτ)) for trapped-ion measurement crosstalk; the X error is applied to the later check results and the final data readout (`idle.js`), checked against an explicit X gate on IonQ's ideal simulator (V4).
- **Per-round and per-microsecond rates:** ε_L = ½[1 − (1 − 2p_L)^(1/r)], divided by the cycle time (`metrics.js`). Cycle times: Robertson et al., arXiv:2603.03801; Google Quantum AI, Nature 638, 920 (2025), arXiv:2408.13687; M. McEwen et al., Nat. Commun. 12, 1761 (2021), arXiv:2102.06131.
- **Wilson score interval** for every error rate: E. B. Wilson, J. Am. Stat. Assoc. 22, 209 (1927) (`stats.js`).
- **Percentile bootstrap** for the location of optimal readout times, with a least-squares quadratic fit around the grid minimum: B. Efron, Ann. Statist. 7, 1 (1979) (`stats.js`, `optimum.js`).
- **Random numbers:** mulberry32 uniform generator, Box–Muller normal draws, Poisson draws by Knuth's multiplication method below mean 30 and by PTRS above: W. Hörmann, "The transformed rejection method for generating Poisson random variables," Insurance: Mathematics and Economics 12, 39 (1993) (`rng.js`).
- **Numerical tools:** Gauss–Legendre quadrature (`quadrature.js`), erfc by its series and continued fraction, and ln Γ by the Lanczos approximation (`special.js`).

## Libraries and tools

- **esbuild:** build-only bundler (`npm run build`); nothing from it ships at runtime
- **Node.js** built-in test runner (`node --test`) for the JavaScript tests
- **Qiskit:** circuit construction and transpilation, in the bank generator and the live-run helper on Qollab
- **The IonQ provider (qiskit-ionq), through Qollab:** IonQ's simulator with the forte-1 noise model (and the ideal model for V4), native gates
- **Qollab:** hosting and running both projects; the page uses the `qollab.live` / `live` Python bridge for the live run, following Qollab's documented JavaScript example (`docs/qollab_js_api_example.txt`)
- **PyMatching, NumPy and pytest:** local validation only (V2, V3); not shipped

The shipped page loads no external resource and makes no network request; all data are embedded at build time.
