import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

test('a column puts sequenced posts first, then sorts ties by newest date and slug', async () => {
  const originalDirectory = process.cwd()
  const directory = await mkdtemp(path.join(tmpdir(), 'blog-content-'))

  try {
    const column = path.join(directory, 'markdown-blog/notes')
    const posts = path.join(column, 'posts')
    await mkdir(path.join(posts, 'zero'), { recursive: true })
    await writeFile(path.join(column, 'index.md'), '---\ntitle: Notes\n---\n')

    for (const [file, fields] of [
      ['undated.md', ''],
      ['newest.md', 'date: 2026-11-24\n'],
      ['older.md', 'date: 2026-11-23\n'],
      ['two.md', 'sequence: 2\n'],
      ['one-older.md', 'sequence: 1\ndate: 2026-11-01\n'],
      ['one-b.md', 'sequence: 1\ndate: 2026-11-02\n'],
      ['one-a.md', 'sequence: 1\ndate: 2026-11-02\n'],
      ['zero/index.md', 'sequence: 0\n'],
    ]) {
      await writeFile(path.join(posts, file), `---\ntitle: Example\n${fields}---\n`)
    }

    process.chdir(directory)
    const { getColumns } = await import('./content.js')
    const [notes] = await getColumns()
    assert.deepEqual(notes.posts.map(({ slug }) => slug), [
      'zero', 'one-a', 'one-b', 'one-older', 'two', 'newest', 'older', 'undated',
    ])
  } finally {
    process.chdir(originalDirectory)
    await rm(directory, { recursive: true, force: true })
  }
})
