'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function DirectoryLink({ children, href, pathname, prefetch }) {
  const current = href === pathname
  return (
    <Link
      aria-current={current ? 'page' : undefined}
      className="directory-link"
      href={href}
      prefetch={prefetch}
    >
      {children}
    </Link>
  )
}

export default function BlogDirectory({ columns }) {
  const pathname = usePathname()?.replace(/\/?$/, '/')
  return (
    <nav aria-label="博客目录">
      <h2 className="panel-label px-3 pt-1 pb-2">博客目录</h2>
      <ul className="space-y-1 text-sm">
        <li><DirectoryLink href="/" pathname={pathname}>首页</DirectoryLink></li>
        {columns.map(({ slug, title, posts }) => (
          <li key={slug}>
            <DirectoryLink href={`/${slug}/`} pathname={pathname}>{title}</DirectoryLink>
            {posts.length > 0 && (
              <ul className="my-1 ms-3 space-y-0.5 border-s border-blog-border ps-2 text-blog-muted">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <DirectoryLink href={`/${slug}/${post.slug}/`} pathname={pathname} prefetch={false}>
                      {post.title}
                    </DirectoryLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
