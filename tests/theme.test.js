// theme.js: the stored choice, the data-theme attribute, and storage that throws.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THEME_KEY, storedTheme, saveTheme, applyTheme, currentTheme } from '../src/ui/theme.js';

const fakeRoot = () => {
  const attrs = new Map();
  return {
    setAttribute: (k, v) => attrs.set(k, String(v)),
    removeAttribute: (k) => attrs.delete(k),
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
  };
};
const memoryStorage = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};
const throwing = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };

// Catches: fails if the page stops defaulting to the dark theme, or a stray stored value or
// blocked storage gives anything but dark.
test('storedTheme: dark unless "light" was saved', () => {
  const s = memoryStorage();
  assert.equal(storedTheme(s), 'dark');
  saveTheme('light', s);
  assert.equal(s.getItem(THEME_KEY), 'light');
  assert.equal(storedTheme(s), 'light');
  s.setItem(THEME_KEY, 'sepia');
  assert.equal(storedTheme(s), 'dark');
  assert.equal(storedTheme(null), 'dark');
  assert.equal(storedTheme(throwing), 'dark');
  assert.doesNotThrow(() => saveTheme('light', throwing));
});

// Catches: fails if dark stops being the attribute-free default that tokens.css styles, or the
// light theme stops setting the attribute its rules select on.
test('applyTheme: data-theme="light" for light, no attribute for dark', () => {
  const root = fakeRoot();
  applyTheme(root, 'light');
  assert.equal(root.getAttribute('data-theme'), 'light');
  assert.equal(currentTheme(root), 'light');
  applyTheme(root, 'dark');
  assert.equal(root.getAttribute('data-theme'), null);
  assert.equal(currentTheme(root), 'dark');
});
