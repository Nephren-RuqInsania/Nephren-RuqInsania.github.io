import Disclosure from '@/components/Disclosure'

function OutlineLinks({ headings }) {
  return (
    <nav aria-label="本页目录">
      <ul className="space-y-0.5 border-s border-blog-border ps-2 text-sm text-blog-muted">
        {headings.map(({ id, title, depth }) => (
          <li key={id}>
            <a className={`outline-link${depth > 2 ? ' ps-5' : ''}`}
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
    <aside className="surface-panel scroll-pane sticky top-[calc(var(--site-header-height)+1.5rem)] hidden max-h-[calc(100dvh-var(--site-header-height)-3rem)] self-start xl:block">
      <h2 className="panel-label px-2 pt-1 pb-2">本页目录</h2>
      <OutlineLinks headings={headings} />
    </aside>
  )
}

export function MobileArticleOutline({ headings }) {
  return (
    <Disclosure label="本页目录" icon="list" className="sticky top-(--site-header-height) z-10 my-6 bg-blog-canvas xl:hidden"
      summaryClassName="w-full justify-start py-2 [&>svg:last-child]:ms-auto">
      <div className="surface-panel scroll-pane mt-2 max-h-[40dvh]"><OutlineLinks headings={headings} /></div>
    </Disclosure>
  )
}
