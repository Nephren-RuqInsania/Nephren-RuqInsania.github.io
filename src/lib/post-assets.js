export function validatePostAssetUrl(url, post) {
  const match = /^(?:\.\/)?assets\/([^?#]*)/.exec(url)
  if (!match) return

  const invalidUrl = `${post.sourcePath}: invalid asset URL "${url}"`
  let segments

  try {
    segments = match[1].split('/').map(decodeURIComponent)
  } catch {
    throw new Error(invalidUrl)
  }

  if (segments.some((segment) => !segment || segment === '.' || segment === '..' || /[/\\\0]/.test(segment))) {
    throw new Error(invalidUrl)
  }

  const file = segments.join('/')
  if (!post.assets.includes(file)) {
    throw new Error(`${post.sourcePath}: asset "${file}" not found under assets/`)
  }
}
