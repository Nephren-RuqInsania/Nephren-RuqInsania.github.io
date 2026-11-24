import assert from 'node:assert/strict'
import test from 'node:test'
import matter from 'gray-matter'
import { parsePostMetadata } from './post-metadata.js'

const file = 'markdown-blog/notes/posts/example.md'

test('article front matter reads the author and contact without changing the theme', () => {
  const { data } = matter('---\nauthor: " 林同学 "\ncontact-us: " writer@example.com "\ntheme: rust\n---\n')
  assert.deepEqual(parsePostMetadata(data, file), {
    author: '林同学',
    contactUs: 'writer@example.com',
    contactHref: 'mailto:writer@example.com',
    theme: 'rust',
  })
})

test('omitted or empty author and contact fields stay hidden', () => {
  const empty = { author: '', contactUs: '', contactHref: null, theme: null }
  assert.deepEqual(parsePostMetadata({}, file), empty)
  assert.deepEqual(parsePostMetadata({ author: '  ', 'contact-us': null }, file), empty)
})

test('only email addresses and HTTP(S) URLs become contact links', () => {
  for (const [contactUs, href] of [
    ['https://example.com/contact', 'https://example.com/contact'],
    ['mailto:writer+blog@example.com', 'mailto:writer+blog@example.com'],
    ['@writer', null],
    ['javascript:alert(1)', null],
    ['https://', null],
  ]) {
    const post = parsePostMetadata({ 'contact-us': contactUs }, file)
    assert.equal(post.contactUs, contactUs)
    assert.equal(post.contactHref, href)
  }
})

test('non-text article metadata reports the field and source file', () => {
  for (const [field, value] of [['author', ['林同学']], ['contact-us', { email: 'writer@example.com' }]]) {
    assert.throws(() => parsePostMetadata({ [field]: value }, file), {
      message: `${file}: ${field} must be text`,
    })
  }
})
