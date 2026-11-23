import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarkdownBody from '@/components/MarkdownBody'
import { getColumn, getColumns } from '@/lib/content'
import styles from './article.module.css'

export const dynamicParams = false

export async function generateStaticParams() {
  const columns = await getColumns()
  return columns.flatMap(({ slug: column, posts }) =>
    posts.map(({ slug }) => ({ column, slug })),
  )
}

async function loadPost(params) {
  const { column, slug } = await params
  const entry = await getColumn(column)
  const post = entry?.posts.find((item) => item.slug === slug)
  if (!post) notFound()
  return { column: entry, post }
}

export async function generateMetadata({ params }) {
  const { post } = await loadPost(params)
  return { title: post.title, description: post.summary || undefined }
}

export default async function PostPage({ params }) {
  const { column, post } = await loadPost(params)

  return (
    <article className="max-w-[72ch]">
      <header className="mb-7 border-b border-slate-200 pb-6 sm:mb-9 sm:pb-8">
        <Link className="text-sm text-slate-700 underline underline-offset-4" href={`/${column.slug}/`}>
          <span aria-hidden="true">← </span>返回 {column.title}
        </Link>
        <h1 className="mt-4 text-3xl leading-tight font-bold wrap-anywhere sm:text-4xl">{post.title}</h1>
        {post.date && (
          <p className="mt-3 text-sm text-slate-600">
            发布于 <time dateTime={post.date}>{post.date}</time>
          </p>
        )}
        {post.summary && (
          <p className="mt-4 leading-relaxed text-slate-700 wrap-anywhere sm:text-lg">{post.summary}</p>
        )}
      </header>
      <MarkdownBody className={styles.body} post={post}>{post.content}</MarkdownBody>
    </article>
  )
}
