// Ablation of the learned decoder and checks of the learned error model, on the held-out banks.
// Usage: node tools/ablation.mjs
// Which part of the learned decoder gives F1's gain? Four noise models decode the held-out
// trapped-ion banks (data/banks/heldout, Z basis, d = 3 and 5, r = 3), each trained on the
// original L0 + L1 banks only, as in --stage holdout:
//   naive:      space and time edges, one calibrated pGate (estimatePGate);
//   diagOnly:   adds the diagonal edges, every class at that same pGate (nothing learned);
//   ratesOnly:  per-class learned rates (dem.js) with diag = 0, so the diagonal edges carry the
//               clamped maximum weight ln[(1 - 1e-12)/1e-12] = 27.6 and are in effect absent;
//   learned:    per-class learned rates and diagonal edges (the page's learned decoder).
// Ion readout at the grid point nearest each optimum (d = 3: 20 µs; d = 5: 100 µs), hard and
// soft, R = 4 readout draws per quantum shot. Every model uses the same seeds (common random
// numbers), so each is compared with the naive model by the paired cluster bootstrap.
// Model checks: the classes re-learned from the held-out banks against the trained ones; the
// anti-diagonal pairs (k, j)-(k+1, j+1), which no edge joins, as a null; and the classes learned
// from each bank on its own (original d = 3, 5, 7 and held-out d = 5).
// Output: data/results/ablation.json. No date or commit in the file, so two runs give the same
// bytes.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateBank, expandShots, split } from '../src/core/bank.js';
import { computeDetectors } from '../src/core/detectors.js';
import { estimatePGate } from '../src/core/calibrate.js';
import { estimateEdgeRates, ratesFromBanks } from '../src/core/dem.js';
import { wilson, pairedClusterDiff } from '../src/core/stats.js';
import { createRng } from '../src/core/rng.js';
import { createIonReadout } from '../src/core/readout/ion.js';
import { decodeShot } from '../src/core/sweep.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => join(root, ...parts);

export const ABLATION = {
  distances: [3, 5],
  r: 3,
  tau_us: { 3: 20, 5: 100 },
  modes: ['hard', 'soft'],
  readoutDrawsPerShot: 4,
  clusterB: 500,
  models: ['naive', 'diagOnly', 'ratesOnly', 'learned'],
  stabilityBanks: ['rep_d3_r3_L0', 'rep_d3_r3_L1', 'rep_d5_r3_L0', 'rep_d5_r3_L1', 'rep_d7_r3_L0', 'rep_d7_r3_L1'],
};
// Seeds: readout draw `draw` of held-out bank `bi` (sorted file order) at distance d.
const seedFor = (d, bi, draw) => 7300000 + 10000 * d + 1000 * bi + draw;
const clusterSeed = (d, mode, m) => 7400000 + 100 * d + 10 * ABLATION.modes.indexOf(mode) + m;

const round = (v) => Number(v.toPrecision(6));
const roundObj = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, round(v)]));

function loadBank(...parts) {
  const bank = JSON.parse(readFileSync(p(...parts), 'utf8'));
  validateBank(bank);
  return bank;
}

function detectorArraysOf(bank) {
  return expandShots(bank).map((bits) => {
    const { m, x } = split(bits, bank.layout, bank.d, bank.r);
    return computeDetectors(m, x, bank.d, bank.r);
  });
}

// The four noise models of one distance, from the training banks only.
export function ablationModels(pGate, rates) {
  return {
    naive: { model: 'naive', pGate },
    diagOnly: { model: 'learned', rates: { space: pGate, spaceBoundary: pGate, time: pGate, diag: pGate } },
    ratesOnly: { model: 'learned', rates: { ...rates, diag: 0 } },
    learned: { model: 'learned', rates },
  };
}

// Per-shot failure counts (0..R) over the banks, concatenated in bank order.
function failCounts(banks, d, { readout, mode, noise, R }) {
  const parts = banks.map((bank, bi) => {
    const shots = expandShots(bank);
    const f = new Uint8Array(shots.length);
    for (let draw = 0; draw < R; draw++) {
      const rng = createRng(seedFor(d, bi, draw));
      for (let s = 0; s < shots.length; s++) {
        f[s] += decodeShot({ shotBits: shots[s], layout: bank.layout, d, r: bank.r, readout, mode, noise, basis: 'Z', rng, logical: bank.logical }).logicalError;
      }
    }
    return f;
  });
  const out = new Uint8Array(parts.reduce((s, x) => s + x.length, 0));
  let o = 0;
  for (const x of parts) {
    out.set(x, o);
    o += x.length;
  }
  return out;
}

function main() {
  const t0 = Date.now();
  const { r, readoutDrawsPerShot: R, clusterB } = ABLATION;
  const ionCard = JSON.parse(readFileSync(p('params', 'ion.json'), 'utf8'));
  const heldFiles = readdirSync(p('data', 'banks', 'heldout')).filter((f) => /^rep_d\d+_r3_L\d_h\d+\.json$/.test(f)).sort();
  const held = heldFiles.map((file) => ({ file, bank: loadBank('data', 'banks', 'heldout', file) }));

  const rows = [];
  const fit = [];
  for (const d of ABLATION.distances) {
    const trainFiles = [0, 1].map((L) => `rep_d${d}_r${r}_L${L}.json`);
    const train = trainFiles.map((f) => loadBank('data', 'banks', f));
    const pGate = estimatePGate(train.flatMap(detectorArraysOf), d, r).p;
    const rates = ratesFromBanks(train).classes;
    const models = ablationModels(pGate, rates);
    const banks = held.filter((h) => h.bank.d === d && h.bank.r === r).map((h) => h.bank);
    const readout = createIonReadout(ionCard, ABLATION.tau_us[d]);
    for (const mode of ABLATION.modes) {
      const fails = Object.fromEntries(ABLATION.models.map((m) => [m, failCounts(banks, d, { readout, mode, noise: models[m], R })]));
      ABLATION.models.forEach((m, mi) => {
        let k = 0;
        for (const x of fails[m]) k += x;
        const n = fails[m].length * R;
        const w = wilson(k, n);
        const pd = m === 'naive' ? null : pairedClusterDiff(fails[m], fails.naive, R, clusterB, createRng(clusterSeed(d, mode, mi)));
        rows.push({
          d, r, mode, tau_us: ABLATION.tau_us[d], model: m, k, n, pL: round(w.p), lo: round(w.lo), hi: round(w.hi),
          minusNaive: pd ? { diff: round(pd.diff), lo: round(pd.lo), hi: round(pd.hi) } : null,
        });
      });
    }
    const heldRates = estimateEdgeRates(banks.flatMap(detectorArraysOf), d, r);
    fit.push({
      d, r, trainedOn: trainFiles, pGate: round(pGate), trained: roundObj(rates),
      heldout: roundObj(heldRates.classes), heldoutAntiDiag: round(heldRates.antiDiag),
    });
  }

  const stability = [
    ...ABLATION.stabilityBanks.map((name) => ({ name, bank: loadBank('data', 'banks', `${name}.json`) })),
    ...held.filter((h) => h.bank.d === 5).map((h) => ({ name: h.file.replace(/\.json$/, ''), bank: h.bank })),
  ].map(({ name, bank }) => {
    const est = ratesFromBanks([bank]);
    return { bank: name, d: bank.d, ...roundObj(est.classes), antiDiag: round(est.antiDiag), pGate: round(estimatePGate(detectorArraysOf(bank), bank.d, bank.r).p) };
  });

  const result = {
    schema: 's2s-results/1',
    stage: 'ablation',
    params: { ...ABLATION, card: 'params/ion.json', heldout: heldFiles, training: 'original L0 + L1 banks of each d only; no held-out bank feeds a rate' },
    rows,
    fit,
    stability,
    provenance: {
      tool: 'tools/ablation.mjs',
      seedRule: 'readout: 7300000 + 10000*d + 1000*bankIndex + draw (every model); paired cluster bootstrap: 7400000 + 100*d + 10*modeIndex + modelIndex',
      node: process.version,
    },
  };
  const out = p('data', 'results', 'ablation.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);

  const pct = (x) => `${(x * 100).toFixed(3)}%`;
  for (const row of rows) {
    const vs = row.minusNaive ? `  minus naive ${pct(row.minusNaive.diff)} [${pct(row.minusNaive.lo)}, ${pct(row.minusNaive.hi)}]` : '';
    console.log(`d = ${row.d} ${row.mode.padEnd(4)} ${row.model.padEnd(9)} ${pct(row.pL)} [${pct(row.lo)}, ${pct(row.hi)}]${vs}`);
  }
  console.log(`Wrote ${out} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
