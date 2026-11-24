import Link from 'next/link'
import Icon from '@/components/Icon'
import MarkdownBody from '@/components/MarkdownBody'

export default function ColumnPage({ column: { slug, title, content, posts } }) {
  return (
    <>
      <header className="page-heading">
        <p className="panel-label mb-2">专栏</p>
        <h1 className="page-title">{title}</h1>
      </header>
      <MarkdownBody>{content}</MarkdownBody>
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">文章列表</h2>
        {posts.length ? (
          <ul className="grid gap-3">
            {posts.map((post) => (
              <li key={post.slug} className="min-w-0">
                <Link className="post-list-link" href={`/${slug}/${post.slug}/`}>
                  <div className="min-w-0 wrap-anywhere">
                    <span className="block font-semibold text-blog-link">{post.title}</span>
                    {post.summary && <p className="mt-1 text-sm text-blog-muted">{post.summary}</p>}
                    {post.date && <time className="mt-2 block text-xs text-blog-muted" dateTime={post.date}>{post.date}</time>}
                  </div>
                  <Icon name="arrow-right" className="text-blog-link" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="surface-panel text-sm text-blog-muted">这个专栏暂时没有文章。</p>
        )}
      </section>
    </>
  )
}
