'use client'

import { useEffect, useRef } from 'react'
import Icon from './Icon'

export default function Disclosure({ children, className = '', icon, label, name, summaryClassName = '' }) {
  const details = useRef(null)

  useEffect(() => {
    if (!name) return

    function closeOnOutsidePointer(event) {
      const panel = details.current
      if (panel?.open && !panel.contains(event.target)) panel.open = false
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [name])

  function handleClick(event) {
    const link = event.target.closest('a[href]')
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.currentTarget.open = false
  }

  function handleKeyDown(event) {
    if (event.key !== 'Escape' || !event.currentTarget.open) return
    event.stopPropagation()
    event.currentTarget.open = false
    event.currentTarget.querySelector('summary').focus()
  }

  return (
    <details ref={details} name={name} className={`group ${className}`} onClickCapture={handleClick} onKeyDown={handleKeyDown}>
      <summary className={`ui-control disclosure-summary ${summaryClassName}`}>
        {icon && <Icon name={icon} />}
        <span>{label}</span>
        <Icon name="chevron" className="text-blog-muted group-open:rotate-180 motion-safe:transition-transform" />
      </summary>
      {children}
    </details>
  )
}
