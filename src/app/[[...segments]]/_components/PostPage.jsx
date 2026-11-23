import Link from 'next/link'
import MarkdownBody from '@/components/MarkdownBody'
import { getArticleHeadings } from '@/lib/article-headings'
import { DesktopArticleOutline, MobileArticleOutline } from './ArticleOutline'
import styles from './article.module.css'

export default function PostPage({ column, post }) {
  const headings = getArticleHeadings(post.content)
  const hasOutline = headings.length > 0

  return (
    <div className={hasOutline ? 'page-frame page-frame-with-outline' : 'page-frame'}>
      <article className="min-w-0">
        <header className="mb-7 border-b border-blog-border pb-6 sm:mb-9 sm:pb-8">
          <Link className="text-sm font-medium text-blog-link underline-offset-4 hover:underline focus-visible:outline-blog-link" href={`/${column.slug}/`}>
            <span aria-hidden="true">← </span>{column.title}
          </Link>
          <h1 className="page-title mt-3">{post.title}</h1>
          {post.date && (
            <p className="mt-3 text-sm text-blog-muted">
              发布于 <time dateTime={post.date}>{post.date}</time>
            </p>
          )}
          {post.summary && (
            <p className="mt-4 leading-relaxed text-blog-muted wrap-anywhere sm:text-lg">{post.summary}</p>
          )}
        </header>
        {hasOutline && <MobileArticleOutline headings={headings} />}
        <MarkdownBody className={styles.body} post={post}>{post.content}</MarkdownBody>
      </article>
      {hasOutline && <DesktopArticleOutline headings={headings} />}
    </div>
  )
}
