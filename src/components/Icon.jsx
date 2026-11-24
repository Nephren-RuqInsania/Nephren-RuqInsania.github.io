const paths = {
  'arrow-left': 'M13 5 6 12l7 7M6 12h13',
  'arrow-right': 'm11 5 7 7-7 7M18 12H5',
  book: 'M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1 0-4h13M8 7h7m-7 4h5',
  chevron: 'm6 9 6 6 6-6',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  settings: 'M4 7h5m4 0h7M4 17h9m4 0h3M9 4v6m8 4v6',
}

export default function Icon({ name, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      className={`size-4 shrink-0 ${className}`}>
      <path d={paths[name]} />
    </svg>
  )
}
