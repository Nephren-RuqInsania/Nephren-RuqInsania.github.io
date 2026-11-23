import './globals.css'
import BlogDirectory from '@/components/BlogDirectory'
import { getColumns } from '@/lib/content'

export default async function RootLayout({ children }) {
  const columns = await getColumns()

  return (
    <html lang="zh-CN">
      <body className="overflow-hidden bg-white text-slate-900">
        <div className="mx-auto grid h-dvh max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden px-6 pt-4 md:grid-cols-[12rem_minmax(0,1fr)] md:grid-rows-1 md:gap-8 md:pt-0">
          <BlogDirectory columns={columns} />
          <main className="scroll-pane pt-2 pb-8 md:py-12" tabIndex={0}>
            <div className="max-w-3xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}
