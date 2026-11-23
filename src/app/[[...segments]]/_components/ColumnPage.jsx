import Link from 'next/link'
import MarkdownBody from '@/components/MarkdownBody'

export default function ColumnPage({ column: { slug, title, content, posts } }) {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">{title}</h1>
      <MarkdownBody>{content}</MarkdownBody>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">文章列表</h2>
        {posts.length ? (
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {posts.map((post) => (
              <li key={post.slug} className="py-4">
                <Link className="font-semibold underline underline-offset-4" href={`/${slug}/${post.slug}/`}>
                  {post.title}
                </Link>
                {post.date && <time className="mt-1 block text-sm text-slate-600" dateTime={post.date}>{post.date}</time>}
                {post.summary && <p className="mt-1 text-slate-700">{post.summary}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">这个专栏暂时没有文章。</p>
        )}
      </section>
    </>
  )
}
