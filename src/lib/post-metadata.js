import { parseThemeMetadata } from '../themes/theme-metadata.js'

function readOptionalText(value, field, file) {
  if (value == null) return ''
  if (typeof value !== 'string') {
    throw new Error(`${file}: ${field} must be text`)
  }
  return value.trim()
}

function getContactHref(contact) {
  const email = contact.replace(/^mailto:/i, '')
  if (/^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/.test(email)) return `mailto:${email}`

  if (/^https?:\/\//i.test(contact)) {
    return URL.parse(contact)?.href ?? null
  }
  return null
}

export function parsePostMetadata(data, file) {
  const author = readOptionalText(data.author, 'author', file)
  const contactUs = readOptionalText(data['contact-us'], 'contact-us', file)
  return {
    ...parseThemeMetadata(data, file),
    author,
    contactUs,
    contactHref: getContactHref(contactUs),
  }
}
