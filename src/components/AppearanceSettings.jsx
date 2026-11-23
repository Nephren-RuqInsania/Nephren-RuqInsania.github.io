'use client'

import { useEffect, useState } from 'react'
import { appearanceStorageKey, defaultAppearance } from '@/themes/appearance'
import { themeGroups } from '@/themes/theme-registry'

const selectClass = 'w-36 min-w-0 rounded-md border border-blog-border bg-blog-canvas px-2 py-1.5 focus-visible:outline-blog-link'

export default function AppearanceSettings() {
  const [appearance, setAppearance] = useState(defaultAppearance)

  useEffect(() => {
    const { followTheme, selectedTheme } = document.documentElement.dataset
    setAppearance({ follow: followTheme === 'true', theme: selectedTheme })
  }, [])

  function updateAppearance(change) {
    const next = { ...appearance, ...change }
    const { dataset } = document.documentElement
    dataset.followTheme = String(next.follow)
    dataset.selectedTheme = next.theme
    setAppearance(next)

    try {
      localStorage.setItem(appearanceStorageKey, JSON.stringify(next))
    } catch {
      // The preference still applies until the next full page load.
    }
  }

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 text-sm sm:justify-end sm:gap-5">
      <label className="flex shrink-0 cursor-pointer items-center gap-2">
        <span className="font-medium">主题偏好跟随</span>
        <span className="relative flex">
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={appearance.follow}
            onChange={(event) => updateAppearance({ follow: event.target.checked })}
            aria-describedby="theme-follow-help"
          />
          <span
            aria-hidden="true"
            className="h-5 w-9 rounded-full bg-blog-muted after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-blog-canvas peer-checked:bg-blog-link peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blog-link"
          />
        </span>
      </label>
      <p id="theme-follow-help" className="sr-only">
        {appearance.follow ? '优先使用文章或专栏推荐，未推荐时使用所选主题。' : '所有页面都使用所选主题。'}
      </p>
      <label className="flex min-w-0 items-center gap-2">
        <span className="sr-only lg:not-sr-only lg:shrink-0">主题选择</span>
        <select
          className={selectClass}
          value={appearance.theme}
          onChange={(event) => updateAppearance({ theme: event.target.value })}
          title={appearance.follow ? '无推荐时使用此主题' : '全站使用此主题'}
          aria-describedby="theme-follow-help"
        >
          {themeGroups.map(({ label, themes }) => (
            <optgroup key={label} label={label}>
              {themes.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
    </div>
  )
}
