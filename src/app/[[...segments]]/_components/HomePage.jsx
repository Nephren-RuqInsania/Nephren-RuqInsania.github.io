import MarkdownBody from '@/components/MarkdownBody'

export default function HomePage({ home: { title, content } }) {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">{title}</h1>
      <MarkdownBody>{content}</MarkdownBody>
    </>
  )
}
