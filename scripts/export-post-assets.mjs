import { access, copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { getColumns, markdownDirectory } from '../src/lib/content.js'

const exportDirectory = 'out'
await access(path.join(exportDirectory, 'index.html'))

const columns = await getColumns()

for (const column of columns) {
  for (const post of column.posts) {
    if (!post.assets.length) continue

    const pageDirectory = path.join(exportDirectory, column.slug, post.slug)
    await access(path.join(pageDirectory, 'index.html'))

    for (const asset of post.assets) {
      const source = path.join(markdownDirectory, column.slug, 'posts', post.slug, 'assets', asset)
      const destination = path.join(pageDirectory, 'assets', asset)
      await mkdir(path.dirname(destination), { recursive: true })
      await copyFile(source, destination)
    }
  }
}
