import Link from 'next/link'
import AppearanceSettings from './AppearanceSettings'
import BlogDirectory from './BlogDirectory'
import Disclosure from './Disclosure'

const menuButton = 'rounded-md px-2 py-1.5 text-sm font-medium hover:bg-blog-surface focus-visible:outline-blog-link sm:px-3'
const menuPanel = 'absolute top-full right-4 mt-2 max-h-[calc(100dvh-var(--site-header-height)-1rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-lg border border-blog-border p-3 text-blog-text shadow-lg sm:right-6'

export default function SiteHeader({ title, columns }) {
  return (
    <header className="sticky top-0 z-30 h-(--site-header-height) border-b border-blog-border bg-blog-header text-blog-text">
      <div className="relative mx-auto grid h-full max-w-[96rem] grid-cols-[minmax(0,1fr)_auto] grid-rows-2 items-center gap-x-3 px-4 py-2 sm:flex sm:gap-4 sm:px-6 sm:py-0">
        <Link href="/" className="min-w-0 truncate rounded text-base font-semibold focus-visible:outline-blog-link sm:text-lg">
          {title}
        </Link>
        <Disclosure label="目录" className="shrink-0 md:hidden" summaryClassName={menuButton}>
          <div className={`blog-sidebar ${menuPanel} bg-blog-canvas`}><BlogDirectory columns={columns} /></div>
        </Disclosure>
        <div className="col-span-2 min-w-0 sm:ml-auto sm:shrink-0">
          <AppearanceSettings />
        </div>
      </div>
    </header>
  )
}
