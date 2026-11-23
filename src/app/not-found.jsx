import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-frame">
      <p className="mb-3 text-sm font-semibold text-blog-muted">404</p>
      <h1 className="page-title mb-4">找不到这个页面</h1>
      <Link href="/" className="text-blog-link underline underline-offset-4">返回首页</Link>
    </div>
  )
}
