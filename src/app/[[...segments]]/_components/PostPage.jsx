import Link from 'next/link'
import MarkdownBody from '@/components/MarkdownBody'
import styles from './article.module.css'

export default function PostPage({ column, post }) {
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
