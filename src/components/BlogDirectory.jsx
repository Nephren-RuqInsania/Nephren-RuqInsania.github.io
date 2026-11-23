import Link from 'next/link'

const linkClass = 'block rounded px-2 py-1 hover:bg-slate-100 hover:underline'

function DirectoryLinks({ columns }) {
  return (
    <ul className="space-y-1">
      <li><Link className={linkClass} href="/">首页</Link></li>
      {columns.map(({ slug, title, posts }) => (
        <li key={slug}>
          <Link className={linkClass} href={`/${slug}/`}>{title}</Link>
          {posts.length > 0 && (
            <ul className="ml-2 space-y-1 border-l border-slate-200 pl-2 text-sm">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link className={linkClass} href={`/${slug}/${post.slug}/`} prefetch={false}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function BlogDirectory({ columns }) {
  return (
    <aside className="min-h-0 min-w-0">
      <nav aria-label="博客目录" className="scroll-pane hidden h-full md:block md:py-12" tabIndex={0}>
        <h2 className="mb-2 px-2 font-semibold">博客目录</h2>
        <DirectoryLinks columns={columns} />
      </nav>
      <details className="rounded border border-slate-200 p-2 md:hidden">
        <summary className="cursor-pointer px-2 py-1 font-semibold">博客目录</summary>
        <nav aria-label="博客目录" className="scroll-pane mt-2 max-h-[35dvh]" tabIndex={0}>
          <DirectoryLinks columns={columns} />
        </nav>
      </details>
    </aside>
  )
}
