import { defaultThemeId, themeIds } from './theme-registry.js'

export const appearanceStorageKey = 'blog-appearance'
export const defaultAppearance = { follow: true, theme: defaultThemeId }

// Start with the static HTML defaults, then apply valid saved preferences before paint.
export const appearanceInit = `try {
  const saved = JSON.parse(localStorage.getItem(${JSON.stringify(appearanceStorageKey)}));
  const { dataset } = document.documentElement;
  if (typeof saved?.follow === 'boolean') dataset.followTheme = String(saved.follow);
  if (${JSON.stringify(themeIds)}.includes(saved?.theme)) {
    dataset.selectedTheme = saved.theme;
  }
} catch {}`
