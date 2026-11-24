import MarkdownBody from '@/components/MarkdownBody'

export default function HomePage({ home: { title, content } }) {
  return (
    <>
      <header className="page-heading">
        <p className="panel-label mb-2">首页</p>
        <h1 className="page-title">{title}</h1>
      </header>
      <MarkdownBody>{content}</MarkdownBody>
    </>
  )
}
