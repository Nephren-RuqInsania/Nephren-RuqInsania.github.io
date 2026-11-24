'use client'

import { useEffect, useState } from 'react'
import { appearanceStorageKey, defaultAppearance } from '@/themes/appearance'
import { themeGroups } from '@/themes/theme-registry'
import Icon from './Icon'

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
    <div className="grid gap-4 p-1 text-sm">
      <h2 className="panel-label">外观偏好</h2>
      <div className="grid gap-1">
        <label className="flex min-h-9 cursor-pointer items-center justify-between gap-3 font-medium">
          <span>跟随页面推荐</span>
          <input
            type="checkbox"
            role="switch"
            className="ui-switch-input sr-only"
            checked={appearance.follow}
            onChange={(event) => updateAppearance({ follow: event.target.checked })}
            aria-describedby="theme-follow-help"
          />
          <span aria-hidden="true" className="ui-switch-track" />
        </label>
        <p id="theme-follow-help" className="text-xs leading-relaxed text-blog-muted">
          {appearance.follow ? '页面有推荐时优先使用推荐主题。' : '所有页面都使用下方所选主题。'}
        </p>
      </div>
      <label className="grid min-w-0 gap-2 border-t border-blog-border pt-3">
        <span className="font-medium">{appearance.follow ? '备用主题' : '全站主题'}</span>
        <span className="relative">
          <select className="ui-control ui-select" value={appearance.theme}
            onChange={(event) => updateAppearance({ theme: event.target.value })}>
            {themeGroups.map(({ label, themes }) => (
              <optgroup key={label} label={label}>
                {themes.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
              </optgroup>
            ))}
          </select>
          <Icon name="chevron" className="ui-select-icon" />
        </span>
      </label>
    </div>
  )
}
