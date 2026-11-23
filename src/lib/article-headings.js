import { toString } from 'mdast-util-to-string'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

export const markdownSyntaxPlugins = [remarkGfm]
const parser = unified().use(remarkParse).use(markdownSyntaxPlugins)

function articleHeadings(tree) {
  const usedIds = new Set()
  return tree.children.flatMap((node) => {
    if (node.type !== 'heading' || node.depth < 2 || node.depth > 3) return []

    const title = toString(node, { includeHtml: false }).trim()
    if (!title) return []

    const slug = title.normalize('NFC').toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '')
    const base = slug ? `section-${slug}` : 'section'
    let id = base
    for (let suffix = 2; usedIds.has(id); suffix += 1) id = `${base}-${suffix}`
    usedIds.add(id)
    return [{ node, id, title, depth: node.depth }]
  })
}

export function getArticleHeadings(markdown) {
  return articleHeadings(parser.parse(markdown)).map(({ id, title, depth }) => ({ id, title, depth }))
}

export function remarkArticleAnchors() {
  return (tree) => {
    for (const { node, id } of articleHeadings(tree)) {
      node.data ??= {}
      node.data.hProperties = { ...node.data.hProperties, id }
    }
  }
}
