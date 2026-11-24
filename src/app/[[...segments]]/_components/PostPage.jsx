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
          {(post.author || post.date || post.contactUs) && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blog-muted wrap-anywhere">
              {post.author && <p>作者：{post.author}</p>}
              {post.date && <p>发布于 <time dateTime={post.date}>{post.date}</time></p>}
              {post.contactUs && (
                <p>
                  联系方式：{post.contactHref
                    ? <a className="text-blog-link underline underline-offset-4" href={post.contactHref}>{post.contactUs}</a>
                    : post.contactUs}
                </p>
              )}
            </div>
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
