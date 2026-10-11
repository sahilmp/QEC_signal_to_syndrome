// data/results/ablation.json (tools/ablation.mjs) and the claims the write-up makes from it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ablationModels, ABLATION } from '../tools/ablation.mjs';

const res = JSON.parse(readFileSync(new URL('../data/results/ablation.json', import.meta.url), 'utf8'));
const row = (d, mode, model) => res.rows.find((x) => x.d === d && x.mode === mode && x.model === model);

// Catches: fails if a model of the ablation stops switching on exactly one change (diagonal
// edges or learned rates) against the naive model.
test('ablationModels: each model changes one thing', () => {
  const rates = { space: 0.007, spaceBoundary: 0.008, time: 0.0095, diag: 0.009 };
  const m = ablationModels(0.013, rates);
  assert.deepEqual(m.naive, { model: 'naive', pGate: 0.013 });
  assert.deepEqual(m.diagOnly.rates, { space: 0.013, spaceBoundary: 0.013, time: 0.013, diag: 0.013 });
  assert.equal(m.ratesOnly.rates.diag, 0);
  assert.equal(m.ratesOnly.rates.space, rates.space);
  assert.deepEqual(m.learned.rates, rates);
});

// Catches: fails if the results file loses a row, or its training ever includes a held-out bank.
test('ablation.json: every (d, mode, model) row, trained on the original banks only', () => {
  assert.equal(res.schema, 's2s-results/1');
  assert.equal(res.rows.length, ABLATION.distances.length * ABLATION.modes.length * ABLATION.models.length);
  for (const f of res.fit) for (const t of f.trainedOn) assert.doesNotMatch(t, /_h\d/);
  assert.ok(res.params.heldout.length > 0 && res.params.heldout.every((f) => /_h\d+\.json$/.test(f)));
});

// Catches: fails if a rerun no longer supports the project page's reading of the ablation:
// at d = 5 hard the diagonal edges alone resolve below naive and match the learned decoder,
// learned rates alone give only a small change (in the in-window rerun resolved below naive,
// but still above the diagonal-only interval), and the anti-diagonal null is far below diag.
test('ablation.json: the diagonal edges carry the d = 5 hard gain', () => {
  const naive = row(5, 'hard', 'naive');
  const diag = row(5, 'hard', 'diagOnly');
  const rates = row(5, 'hard', 'ratesOnly');
  const learned = row(5, 'hard', 'learned');
  assert.ok(diag.hi < naive.lo, 'diagonal edges alone below naive beyond the intervals');
  assert.ok(diag.lo <= learned.hi && learned.lo <= diag.hi, 'diagonal edges alone and learned overlap');
  assert.ok(rates.minusNaive.hi < 0, 'learned rates alone resolved below naive (in-window rerun)');
  assert.ok(rates.lo > diag.hi, 'learned rates alone stay above the diagonal-only interval');
  const d5 = res.fit.find((f) => f.d === 5);
  assert.ok(d5.heldout.diag / d5.heldoutAntiDiag > 100);
});
