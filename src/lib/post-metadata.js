import { toString } from 'mdast-util-to-string'
import { defaultUrlTransform } from 'react-markdown'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { parseThemeMetadata } from '../themes/theme-metadata.js'

const contactParser = unified().use(remarkParse)

function readOptionalText(value, field, file) {
  if (value == null) return ''
  if (typeof value !== 'string') {
    throw new Error(`${file}: ${field} must be text`)
  }
  return value.trim()
}

function* inlineLinks(node, source) {
  if (node.type === 'link') {
    // CommonMark also uses link nodes for <...> autolinks.
    if (source[node.position.start.offset] === '[') yield node
    return
  }

  for (const child of node.children ?? []) {
    yield* inlineLinks(child, source)
  }
}

function parseContact(source) {
  if (!source) return []
  if (!source.includes('[')) return [{ text: source }]

  const parts = []
  let cursor = 0
  for (const link of inlineLinks(contactParser.parse(source), source)) {
    const href = defaultUrlTransform(link.url)
    const text = toString(link, { includeHtml: false })
    if (!href || !text.trim()) continue

    const { start, end } = link.position
    if (cursor < start.offset) parts.push({ text: source.slice(cursor, start.offset) })
    parts.push({ text, href, ...(link.title && { title: link.title }) })
    cursor = end.offset
  }

  if (cursor < source.length) parts.push({ text: source.slice(cursor) })
  return parts
}

export function parsePostMetadata(data, file) {
  const author = readOptionalText(data.author, 'author', file)
  const contactUs = readOptionalText(data['contact-us'], 'contact-us', file)
  return {
    ...parseThemeMetadata(data, file),
    author,
    contactUs: parseContact(contactUs),
  }
}
