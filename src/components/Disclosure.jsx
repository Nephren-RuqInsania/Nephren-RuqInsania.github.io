'use client'

export default function Disclosure({ children, className = '', label, summaryClassName }) {
  function handleClick(event) {
    const link = event.target.closest('a[href]')
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.currentTarget.open = false
  }

  function handleKeyDown(event) {
    if (event.key !== 'Escape' || !event.currentTarget.open) return
    event.stopPropagation()
    event.currentTarget.open = false
    event.currentTarget.querySelector('summary').focus()
  }

  return (
    <details className={`group ${className}`} onClick={handleClick} onKeyDown={handleKeyDown}>
      <summary className={`disclosure-summary ${summaryClassName}`}>
        <span>{label}</span>
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-4 shrink-0 group-open:rotate-180">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      {children}
    </details>
  )
}
