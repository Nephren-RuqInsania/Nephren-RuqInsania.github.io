'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function DirectoryLink({ children, href, pathname, prefetch }) {
  const current = href === pathname
  return (
    <Link
      aria-current={current ? 'page' : undefined}
      className={`block rounded-md px-3 py-1.5 wrap-anywhere hover:bg-blog-surface focus-visible:outline-blog-link${current ? ' bg-blog-surface text-blog-link' : ''}`}
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
    <nav aria-label="博客目录" className="font-normal">
      <h2 className="mb-3 px-3 text-sm text-blog-link">博客目录</h2>
      <ul className="space-y-2 text-sm">
        <li><DirectoryLink href="/" pathname={pathname}>首页</DirectoryLink></li>
        {columns.map(({ slug, title, posts }) => (
          <li key={slug}>
            <DirectoryLink href={`/${slug}/`} pathname={pathname}>{title}</DirectoryLink>
            {posts.length > 0 && (
              <ul className="my-1 ml-3 space-y-0.5 border-l border-blog-border pl-2">
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
