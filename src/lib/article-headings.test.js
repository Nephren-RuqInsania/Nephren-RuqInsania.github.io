import assert from 'node:assert/strict'
import test from 'node:test'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { getArticleHeadings, markdownSyntaxPlugins, remarkArticleAnchors } from './article-headings.js'

test('the outline follows actual Markdown headings, including inline text and Setext headings', () => {
  const source = [
    '# Page title',
    '## 阅读 **笔记**',
    '### [Rust](/) 和 `move`',
    '#### Not in the outline',
    '',
    '```md',
    '## In a code block',
    '```',
    '',
    '> ## In a quote',
    '',
    'Setext heading',
    '--------------',
  ].join('\n')

  const headings = getArticleHeadings(source)
  assert.deepEqual(headings, [
    { id: 'section-阅读-笔记', title: '阅读 笔记', depth: 2 },
    { id: 'section-rust-和-move', title: 'Rust 和 move', depth: 3 },
    { id: 'section-setext-heading', title: 'Setext heading', depth: 2 },
  ])
  const processor = unified().use(remarkParse).use(markdownSyntaxPlugins).use(remarkArticleAnchors)
  const tree = processor.runSync(processor.parse(source))
  assert.deepEqual(
    tree.children.flatMap((node) => node.data?.hProperties?.id ?? []),
    headings.map(({ id }) => id),
  )
})

test('headings receive unique anchors, even when a generated suffix is already in use', () => {
  const source = '## Install\n### Install-2\n## Install\n## ✦\n## ✧'
  assert.deepEqual(getArticleHeadings(source).map(({ id }) => id), [
    'section-install', 'section-install-2', 'section-install-3', 'section', 'section-2',
  ])
  assert.deepEqual(getArticleHeadings('Only a paragraph.'), [])
})
