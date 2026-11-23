import { cloneElement, Fragment, isValidElement } from 'react'
import styles from './numbered-code.module.css'

export default function NumberedCodeBlock({ node, children, ...props }) {
  const source = isValidElement(children) && children.type === 'code'
    ? children.props.children
    : null

  if (typeof source !== 'string' || !source.length) {
    return <pre {...props}>{children}</pre>
  }

  const trailingNewline = source.endsWith('\n')
  const lines = (trailingNewline ? source.slice(0, -1) : source).split('\n')
  const code = cloneElement(children, {
    className: [children.props.className, styles.code].filter(Boolean).join(' '),
    style: { ...children.props.style, '--line-number-width': `${String(lines.length).length}ch` },
  }, lines.map((line, index) => (
    <Fragment key={index}>
      <span aria-hidden="true" className={styles.lineStart} data-line={index + 1} />
      {line}
      {(index < lines.length - 1 || trailingNewline) ? '\n' : ''}
    </Fragment>
  )))

  return <pre {...props}>{code}</pre>
}
