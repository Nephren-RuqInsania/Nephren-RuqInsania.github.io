import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import { parseThemeMetadata } from '../themes/theme-metadata.js'

export const markdownDirectory = 'markdown-blog'

const contentDir = path.join(process.cwd(), markdownDirectory)
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const reservedColumns = new Set(['404', '500'])

async function readMarkdown(segments, parseMetadata) {
  const file = path.join(markdownDirectory, ...segments)
  const source = await readFile(path.join(contentDir, ...segments), 'utf8')
  const { data, content } = matter(source)

  if (typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error(`${file}: add a non-empty title to the Markdown front matter`)
  }

  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date
  if (date !== undefined && (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
    throw new Error(`${file}: use YYYY-MM-DD for the date`)
  }

  return {
    ...parseMetadata?.(data, file),
    title: data.title.trim(),
    summary: typeof data.summary === 'string' ? data.summary.trim() : '',
    date: date ?? '',
    content,
  }
}

async function readAssetFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const relative = `${prefix}${entry.name}`

    if (entry.isDirectory()) {
      files.push(...await readAssetFiles(path.join(directory, entry.name), `${relative}/`))
    } else if (entry.isFile()) {
      files.push(relative)
    } else {
      throw new Error(`${path.join(directory, entry.name)}: assets must be regular files or directories`)
    }
  }

  return files
}

async function readPosts(column) {
  const base = [column, 'posts']
  const directory = path.join(contentDir, ...base)
  const entries = await readdir(directory, { withFileTypes: true })
  const posts = new Map()

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const standalone = entry.isFile() && entry.name.endsWith('.md')
    if (!standalone && !entry.isDirectory()) continue

    const slug = standalone ? entry.name.slice(0, -3) : entry.name
    const segments = standalone ? [...base, entry.name] : [...base, slug, 'index.md']
    const sourcePath = path.join(markdownDirectory, ...segments)
    const postDirectory = path.join(directory, slug)
    let hasAssets = false

    if (!standalone) {
      const postEntries = await readdir(postDirectory, { withFileTypes: true })
      if (!postEntries.some((file) => file.isFile() && file.name === 'index.md')) continue
      hasAssets = postEntries.some((file) => file.isDirectory() && file.name === 'assets')
    }

    if (!slugPattern.test(slug)) {
      throw new Error(`${sourcePath}: invalid post slug`)
    }

    const existing = posts.get(slug)
    if (existing) {
      throw new Error(`Duplicate post slug "${slug}": ${existing.sourcePath} and ${sourcePath}`)
    }

    const post = await readMarkdown(segments, parseThemeMetadata)
    const assets = hasAssets ? await readAssetFiles(path.join(postDirectory, 'assets')) : []
    posts.set(slug, { slug, sourcePath, ...post, assets })
  }

  return [...posts.values()].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

async function readColumn(slug) {
  const entries = await readdir(path.join(contentDir, slug), { withFileTypes: true })
  if (!entries.some((entry) => entry.isFile() && entry.name === 'index.md')) return null

  if (!slugPattern.test(slug) || reservedColumns.has(slug)) {
    throw new Error(`${path.join(markdownDirectory, slug, 'index.md')}: invalid or reserved column slug`)
  }

  const intro = await readMarkdown([slug, 'index.md'], parseThemeMetadata)
  const posts = entries.some((entry) => entry.isDirectory() && entry.name === 'posts')
    ? await readPosts(slug)
    : []

  return { slug, ...intro, posts }
}

export const getHome = cache(() => readMarkdown(['home.md']))

export const getColumns = cache(async () => {
  const entries = await readdir(contentDir, { withFileTypes: true })
  const columns = await Promise.all(
    entries.filter((entry) => entry.isDirectory()).map((entry) => readColumn(entry.name)),
  )

  return columns.filter(Boolean).sort((a, b) => a.slug.localeCompare(b.slug))
})

export async function getColumn(slug) {
  const columns = await getColumns()
  return columns.find((column) => column.slug === slug)
}
