import assert from 'node:assert/strict'
import test from 'node:test'
import { parseThemeMetadata, resolveRecommendedTheme } from './theme-metadata.js'

const file = 'markdown-blog/rust/index.md'

test('omitting the theme leaves inheritance to the page', () => {
  assert.deepEqual(parseThemeMetadata({}, file), { theme: null })
})

test('a registered theme is normalized to its ID', () => {
  assert.deepEqual(parseThemeMetadata({ theme: ' rust ' }, file), { theme: 'rust' })
  assert.deepEqual(parseThemeMetadata({ theme: 'starlight-dark' }, file), { theme: 'starlight-dark' })
  assert.deepEqual(parseThemeMetadata({ theme: 'default' }, file), { theme: 'vitepress-light' })
})

test('an empty or non-string theme reports the source file', () => {
  for (const theme of ['', '  ', null, true, 123, ['rust'], { id: 'rust' }]) {
    assert.throws(
      () => parseThemeMetadata({ theme }, file),
      { message: `${file}: theme must be a non-empty string; omit it to inherit` },
    )
  }
})

test('an unregistered theme reports the ID and allowed choices', () => {
  assert.throws(
    () => parseThemeMetadata({ theme: 'missing' }, 'markdown-blog/rust/posts/memo.md'),
    { message: /^markdown-blog\/rust\/posts\/memo\.md: unknown theme "missing"; available themes: .*\brust\b/ },
  )
})

test('an article can inherit or override its column; neither need recommend a theme', () => {
  assert.equal(resolveRecommendedTheme(null, null), null)
  assert.equal(resolveRecommendedTheme('rust', null), 'rust')
  assert.equal(resolveRecommendedTheme(null, 'rust'), 'rust')
  assert.equal(resolveRecommendedTheme('rust', 'vitepress-light'), 'vitepress-light')
})
