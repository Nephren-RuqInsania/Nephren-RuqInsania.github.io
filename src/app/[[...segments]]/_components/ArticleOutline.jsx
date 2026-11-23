import Disclosure from '@/components/Disclosure'

function OutlineLinks({ headings }) {
  return (
    <nav aria-label="本页目录">
      <ul className="space-y-1 border-l border-blog-border pl-2 text-sm">
        {headings.map(({ id, title, depth }) => (
          <li key={id}>
            <a className={`block rounded px-2 py-1 wrap-anywhere hover:bg-blog-surface hover:text-blog-link focus-visible:outline-blog-link${depth > 2 ? ' pl-5' : ''}`}
              href={`#${id}`}>
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function DesktopArticleOutline({ headings }) {
  return (
    <aside className="scroll-pane sticky top-[calc(var(--site-header-height)+2rem)] hidden max-h-[calc(100dvh-var(--site-header-height)-4rem)] self-start text-blog-muted xl:block">
      <h2 className="mb-3 text-sm font-semibold text-blog-text">本页目录</h2>
      <OutlineLinks headings={headings} />
    </aside>
  )
}

export function MobileArticleOutline({ headings }) {
  return (
    <Disclosure label="本页目录" className="sticky top-(--site-header-height) z-10 my-6 rounded-md border border-blog-border bg-blog-canvas text-blog-muted xl:hidden"
      summaryClassName="px-3 py-2 text-sm font-semibold text-blog-text focus-visible:outline-blog-link">
      <div className="scroll-pane max-h-[40dvh] p-3 pt-0"><OutlineLinks headings={headings} /></div>
    </Disclosure>
  )
}
