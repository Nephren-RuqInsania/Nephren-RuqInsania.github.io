import Link from 'next/link'
import Icon from '@/components/Icon'
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
        <header className="page-heading">
          <Link className="ui-control max-w-full justify-start text-blog-link" href={`/${column.slug}/`}>
            <Icon name="arrow-left" />
            <span className="min-w-0 wrap-anywhere">{column.title}</span>
          </Link>
          <h1 className="page-title mt-4">{post.title}</h1>
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
