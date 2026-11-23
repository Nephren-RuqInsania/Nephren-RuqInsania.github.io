import MarkdownBody from '@/components/MarkdownBody'
import { getHome } from '@/lib/content'

export async function generateMetadata() {
  const { title } = await getHome()
  return { title }
}

export default async function HomePage() {
  const { title, content } = await getHome()

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">{title}</h1>
      <MarkdownBody>{content}</MarkdownBody>
    </>
  )
}
