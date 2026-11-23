import { defaultThemeId, themeIds } from './theme-registry.js'

export function parseThemeMetadata({ theme }, file) {
  if (theme === undefined) return { theme: null }

  if (typeof theme !== 'string' || !theme.trim()) {
    throw new Error(`${file}: theme must be a non-empty string; omit it to inherit`)
  }

  const id = theme.trim()
  if (id === 'default') return { theme: defaultThemeId }
  if (!themeIds.includes(id)) {
    const available = [...themeIds, 'default'].join(', ')
    throw new Error(`${file}: unknown theme ${JSON.stringify(id)}; available themes: ${available}`)
  }

  return { theme: id }
}

export function resolveRecommendedTheme(columnTheme, postTheme) {
  return postTheme ?? columnTheme ?? null
}
