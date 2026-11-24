import { cloneElement, Fragment, isValidElement } from 'react'
import { highlightCode } from '@/lib/code-highlight'
import styles from './numbered-code.module.css'

export default async function NumberedCodeBlock({ node, children, className, ...props }) {
  const blockClassName = [className, styles.block].filter(Boolean).join(' ')
  const source = isValidElement(children) && children.type === 'code'
    ? children.props.children
    : null

  if (typeof source !== 'string' || !source.length) {
    return <pre {...props} className={blockClassName}>{children}</pre>
  }

  const trailingNewline = source.endsWith('\n')
  const lines = (trailingNewline ? source.slice(0, -1) : source).split('\n')
  const highlighted = await highlightCode(lines, children.props.className)
  const code = cloneElement(children, {
    className: [children.props.className, styles.code].filter(Boolean).join(' '),
    style: { ...children.props.style, '--line-number-width': `${String(lines.length).length}ch` },
  }, lines.map((line, index) => (
    <Fragment key={index}>
      <span aria-hidden="true" className={styles.lineStart} data-line={index + 1} />
      {highlighted ? highlighted[index].map(({ content, variants }, tokenIndex) => (
        <span key={tokenIndex} className={styles.token}
          style={{ '--shiki-light': variants.light.color, '--shiki-dark': variants.dark.color }}>
          {content}
        </span>
      )) : line}
      {(index < lines.length - 1 || trailingNewline) ? '\n' : ''}
    </Fragment>
  )))

  return <pre {...props} className={blockClassName}>{code}</pre>
}
