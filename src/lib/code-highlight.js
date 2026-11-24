import { bundledLanguages, codeToTokensWithThemes } from 'shiki'

const themes = { light: 'github-light', dark: 'github-dark' }

export async function highlightCode(lines, className = '') {
  const language = /(?:^|\s)language-(\S+)/.exec(className)?.[1].toLowerCase()
  if (!language || !Object.hasOwn(bundledLanguages, language)) return null

  const tokens = await codeToTokensWithThemes(lines.join('\n'), { lang: language, themes })

  // Fall back to the original text if tokenization would change what gets copied.
  if (tokens.length !== lines.length
    || tokens.some((line, index) => line.map(({ content }) => content).join('') !== lines[index])) {
    return null
  }

  return tokens
}
