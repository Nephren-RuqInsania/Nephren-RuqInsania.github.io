export const defaultThemeId = 'vitepress-light'

export const themeGroups = [
  {
    label: '浅色主题',
    themes: [
      { id: defaultThemeId, label: 'VitePress Light' },
      { id: 'rust', label: 'Rust Book' },
    ],
  },
  {
    label: '深色主题',
    themes: [
      { id: 'starlight-dark', label: 'Starlight Dark' },
    ],
  },
]

export const themeIds = themeGroups.flatMap(({ themes }) => themes.map(({ id }) => id))
