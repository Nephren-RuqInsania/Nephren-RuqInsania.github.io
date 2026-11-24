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
        <a href="#main-content" className="ui-control sr-only z-50 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          跳到正文
        </a>
        <SiteHeader title={home.title} columns={directory} />
        <div className="site-wrap site-layout">
          <aside className="blog-sidebar site-sidebar surface-panel scroll-pane" tabIndex={0}>
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
