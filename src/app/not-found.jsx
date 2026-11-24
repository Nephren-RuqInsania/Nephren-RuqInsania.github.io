import Link from 'next/link'
import Icon from '@/components/Icon'

export default function NotFound() {
  return (
    <div className="page-frame">
      <header className="page-heading">
        <p className="panel-label mb-2">404</p>
        <h1 className="page-title">找不到这个页面</h1>
      </header>
      <Link href="/" className="ui-control text-blog-link"><Icon name="arrow-left" />返回首页</Link>
    </div>
  )
}
