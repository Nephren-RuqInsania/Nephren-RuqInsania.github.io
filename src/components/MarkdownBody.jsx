import Markdown, { defaultUrlTransform } from 'react-markdown'
import { markdownSyntaxPlugins, remarkArticleAnchors } from '@/lib/article-headings'
import { validatePostAssetUrl } from '@/lib/post-assets'
import NumberedCodeBlock from './NumberedCodeBlock'

const markdownComponents = {
  table({ node, ...props }) {
    return (
      <div className="markdown-table" role="region" aria-label="表格" tabIndex={0}>
        <table {...props} />
      </div>
    )
  },
}

const articleComponents = {
  ...markdownComponents,
  pre: NumberedCodeBlock,
  img({ node, ...props }) {
    // Eager preloads during client navigation can resolve before the article URL updates.
    return <img {...props} loading="lazy" decoding="async" />
  },
}
const articleRemarkPlugins = [...markdownSyntaxPlugins, remarkArticleAnchors]
const remarkRehypeOptions = {
  footnoteLabel: '脚注',
  footnoteLabelProperties: {},
  footnoteBackLabel: '返回正文',
}

export default function MarkdownBody({ children, className, post }) {
  function transformUrl(url) {
    if (post) validatePostAssetUrl(url, post)
    return defaultUrlTransform(url)
  }

  return (
    <div className={className ? `markdown ${className}` : 'markdown'}>
      <Markdown
        components={post ? articleComponents : markdownComponents}
        remarkPlugins={post ? articleRemarkPlugins : markdownSyntaxPlugins}
        remarkRehypeOptions={remarkRehypeOptions}
        urlTransform={transformUrl}
      >
        {children}
      </Markdown>
    </div>
  )
}
