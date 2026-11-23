import { notFound } from 'next/navigation'
import { getColumn, getColumns, getHome } from '@/lib/content'
import { resolveRecommendedTheme } from '@/themes/theme-metadata'
import ColumnPage from './_components/ColumnPage'
import HomePage from './_components/HomePage'
import PostPage from './_components/PostPage'

export const dynamicParams = false

export async function generateStaticParams() {
  const columns = await getColumns()
  // Include the root so the static export also works before there are any posts.
  return [
    { segments: [] },
    ...columns.flatMap(({ slug: column, posts }) => [
      { segments: [column] },
      ...posts.map(({ slug }) => ({ segments: [column, slug] })),
    ]),
  ]
}

async function loadPage(params) {
  const { segments = [] } = await params
  if (segments.length === 0) return { home: await getHome() }
  if (segments.length > 2) notFound()

  const [columnSlug, postSlug] = segments
  const column = await getColumn(columnSlug)
  if (!column) notFound()
  if (segments.length === 1) return { column }

  const post = column.posts.find(({ slug }) => slug === postSlug)
  if (!post) notFound()
  return { column, post }
}

export async function generateMetadata({ params }) {
  const { home, column, post } = await loadPage(params)
  if (post) return { title: post.title, description: post.summary || undefined }
  return { title: (home ?? column).title }
}

export default async function BlogPage({ params }) {
  const { home, column, post } = await loadPage(params)
  const recommendedTheme = resolveRecommendedTheme(column?.theme, post?.theme)

  return (
    <div data-recommended-theme={recommendedTheme}>
      {post ? <PostPage column={column} post={post} /> : (
        <div className="page-frame">
          {home ? <HomePage home={home} /> : <ColumnPage column={column} />}
        </div>
      )}
    </div>
  )
}
