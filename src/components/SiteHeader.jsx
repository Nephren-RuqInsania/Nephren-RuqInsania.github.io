import Link from 'next/link'
import AppearanceSettings from './AppearanceSettings'
import BlogDirectory from './BlogDirectory'
import Disclosure from './Disclosure'
import Icon from './Icon'

export default function SiteHeader({ title, columns }) {
  return (
    <header className="site-header">
      <div className="site-wrap relative flex h-full items-center justify-between gap-2">
        <Disclosure label="目录" icon="list" name="site-panel" className="shrink-0 md:hidden" summaryClassName="header-trigger">
          <div className="blog-sidebar surface-panel popup-panel popup-panel-start scroll-pane"><BlogDirectory columns={columns} /></div>
        </Disclosure>
        <Link href="/" className="site-brand">
          <span className="site-brand-mark"><Icon name="book" /></span>
          <span className="truncate">{title}</span>
        </Link>
        <Disclosure label="外观" icon="settings" name="site-panel" className="shrink-0" summaryClassName="header-trigger">
          <div className="surface-panel popup-panel scroll-pane"><AppearanceSettings /></div>
        </Disclosure>
      </div>
    </header>
  )
}
