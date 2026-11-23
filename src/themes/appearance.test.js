import assert from 'node:assert/strict'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { appearanceInit, appearanceStorageKey, defaultAppearance } from './appearance.js'

function restoreAppearance(getItem) {
  const dataset = { followTheme: String(defaultAppearance.follow), selectedTheme: defaultAppearance.theme }
  runInNewContext(appearanceInit, {
    localStorage: { getItem },
    document: { documentElement: { dataset } },
  })
  return dataset
}

test('following recommendations with VitePress Light as fallback is the default', () => {
  const expected = { followTheme: 'true', selectedTheme: 'vitepress-light' }
  for (const stored of [null, 'broken JSON', '{"follow":"false","theme":"unknown"}']) {
    assert.deepEqual(restoreAppearance(() => stored), expected)
  }
  assert.deepEqual(restoreAppearance(() => { throw new Error('Storage is unavailable') }), expected)
})

test('the initial script restores the switch and selected theme independently', () => {
  for (const follow of [true, false]) {
    const restored = restoreAppearance((key) => {
      assert.equal(key, appearanceStorageKey)
      return JSON.stringify({ follow, theme: 'starlight-dark' })
    })
    assert.deepEqual(restored, { followTheme: String(follow), selectedTheme: 'starlight-dark' })
  }
  assert.deepEqual(restoreAppearance(() => '{"follow":false,"theme":"unknown"}'), {
    followTheme: 'false', selectedTheme: 'vitepress-light',
  })
})
