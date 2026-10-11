// Colour theme (FEATURES.theme), from the design mock: dark by default, light on request.
// tokens.css holds both palettes; the light one applies under #s2s-app[data-theme="light"], so
// the page is dark before this script runs. The reader's choice is kept in localStorage when
// the browser allows it (a private window or blocked storage just starts dark again).

export const THEME_KEY = 's2s-theme';
export const THEME_LABEL = 'Light theme';

// The browser's localStorage, or null where reading it throws (blocked storage).
function defaultStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

// "light" or "dark"; anything else stored (or no storage) is dark.
export function storedTheme(storage = defaultStorage()) {
  try {
    return storage?.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme, storage = defaultStorage()) {
  try {
    storage?.setItem(THEME_KEY, theme);
  } catch {
    // Storage full or blocked: the theme still applies for this visit.
  }
}

// Sets the theme on the app root: data-theme="light" for light, no attribute for dark.
export function applyTheme(root, theme) {
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
}

export const currentTheme = (root) => (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

// A toggle button ("Light theme", aria-pressed when on) placed after `anchor`; applies the stored
// theme first, so the page and the button agree from the start.
export function mountThemeToggle(root, anchor, { storage = defaultStorage() } = {}) {
  applyTheme(root, storedTheme(storage));
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'secondary theme-toggle';
  btn.textContent = THEME_LABEL;
  const sync = () => btn.setAttribute('aria-pressed', String(currentTheme(root) === 'light'));
  btn.addEventListener('click', () => {
    const next = currentTheme(root) === 'light' ? 'dark' : 'light';
    applyTheme(root, next);
    saveTheme(next, storage);
    sync();
  });
  sync();
  anchor.after(btn);
  return btn;
}
