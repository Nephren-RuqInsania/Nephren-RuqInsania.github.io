import assert from 'node:assert/strict'
import test from 'node:test'
import matter from 'gray-matter'
import { parsePostMetadata } from './post-metadata.js'

const file = 'markdown-blog/notes/posts/example.md'

test('article front matter reads the author and contact without changing the theme', () => {
  const { data } = matter('---\nauthor: " 林同学 "\ncontact-us: " [邮件](mailto:writer@example.com) "\ntheme: rust\n---\n')
  assert.deepEqual(parsePostMetadata(data, file), {
    author: '林同学',
    contactUs: [{ text: '邮件', href: 'mailto:writer@example.com' }],
    sequence: null,
    theme: 'rust',
  })
})

test('omitted or empty author and contact fields stay hidden', () => {
  const empty = { author: '', contactUs: [], sequence: null, theme: null }
  assert.deepEqual(parsePostMetadata({}, file), empty)
  assert.deepEqual(parsePostMetadata({ author: '  ', 'contact-us': null }, file), empty)
})

test('an article can display a plain contact string from YAML', () => {
  const text = '邮件联系：writer@example.com'
  const { data } = matter(`---\ncontact-us: '${text}'\n---\n`)
  assert.deepEqual(parsePostMetadata(data, file).contactUs, [{ text }])
})

test('inline Markdown links preserve their labels, titles and surrounding text', () => {
  const contact = '访问 [官网](https://example.com/path_(info) "站点")，或发送[邮件](mailto:writer@example.com)。'
  assert.deepEqual(parsePostMetadata({ 'contact-us': contact }, file).contactUs, [
    { text: '访问 ' },
    { text: '官网', href: 'https://example.com/path_(info)', title: '站点' },
    { text: '，或发送' },
    { text: '邮件', href: 'mailto:writer@example.com' },
    { text: '。' },
  ])
})

test('bare addresses, autolinks, reference links, and unusable links stay as text', () => {
  for (const contact of [
    'writer@example.com https://example.com mailto:writer@example.com',
    '<https://example.com> <writer@example.com> [无效]',
    '[官网][site]\n\n[site]: https://example.com',
    '[邮件联系]()',
    '[不安全](javascript:alert(1))',
    '`[邮件](mailto:writer@example.com)`',
    '![头像](https://example.com/avatar.png)',
  ]) {
    assert.deepEqual(parsePostMetadata({ 'contact-us': contact }, file).contactUs, [{ text: contact }])
  }
})

test('non-text article metadata reports the field and source file', () => {
  for (const [field, value] of [['author', ['林同学']], ['contact-us', { email: 'writer@example.com' }]]) {
    assert.throws(() => parsePostMetadata({ [field]: value }, file), {
      message: `${file}: ${field} must be text`,
    })
  }
})

test('sequence is optional and accepts only non-negative safe integers', () => {
  assert.equal(parsePostMetadata({}, file).sequence, null)
  for (const sequence of [0, 1, Number.MAX_SAFE_INTEGER]) {
    assert.equal(parsePostMetadata({ sequence }, file).sequence, sequence)
  }
  for (const sequence of [-1, 1.5, '2', null, true, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parsePostMetadata({ sequence }, file), {
      message: `${file}: sequence must be a non-negative integer`,
    })
  }
})
