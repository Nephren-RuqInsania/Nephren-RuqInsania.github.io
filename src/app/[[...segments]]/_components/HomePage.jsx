import MarkdownBody from '@/components/MarkdownBody'

export default function HomePage({ home: { title, content } }) {
  return (
    <>
      <h1 className="page-title mb-5">{title}</h1>
      <MarkdownBody>{content}</MarkdownBody>
    </>
  )
}
