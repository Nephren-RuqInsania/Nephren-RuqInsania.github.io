import './globals.css'
import BlogDirectory from '@/components/BlogDirectory'
import SiteHeader from '@/components/SiteHeader'
import { getColumns, getHome } from '@/lib/content'
import { appearanceInit, defaultAppearance } from '@/themes/appearance'

export default async function RootLayout({ children }) {
  const [home, columns] = await Promise.all([getHome(), getColumns()])
  const directory = columns.map(({ slug, title, posts }) => ({
    slug, title, posts: posts.map(({ slug, title }) => ({ slug, title })),
  }))

  return (
    <html lang="zh-CN" data-follow-theme={defaultAppearance.follow} data-selected-theme={defaultAppearance.theme} suppressHydrationWarning>
      <head>
        <script id="blog-appearance" dangerouslySetInnerHTML={{ __html: appearanceInit }} />
      </head>
      <body className="min-h-dvh bg-blog-canvas text-blog-text">
        <a href="#main-content" className="sr-only z-50 rounded bg-blog-canvas px-4 py-2 text-blog-link focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          跳到正文
        </a>
        <SiteHeader title={home.title} columns={directory} />
        <div className="mx-auto grid min-h-[calc(100dvh-var(--site-header-height))] max-w-[96rem] md:grid-cols-[14rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="blog-sidebar scroll-pane sticky top-(--site-header-height) hidden h-[calc(100dvh-var(--site-header-height))] self-start border-r border-blog-border bg-blog-canvas px-3 py-7 text-blog-text md:block lg:px-5" tabIndex={0}>
            <BlogDirectory columns={directory} />
          </aside>
          <main id="main-content" className="min-w-0" tabIndex={-1}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
