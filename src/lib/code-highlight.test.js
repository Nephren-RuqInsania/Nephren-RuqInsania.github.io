import assert from 'node:assert/strict'
import test from 'node:test'
import { highlightCode } from './code-highlight.js'

test('code blocks with a language alias receive both GitHub syntax palettes', async () => {
  const [line] = await highlightCode(['const title = "blog"'], 'extra language-js')
  const keyword = line.find(({ content }) => content === 'const')
  const colors = Object.values(keyword.variants).map(({ color }) => color)
  assert.ok(keyword.variants.light.color)
  assert.ok(keyword.variants.dark.color)
  assert.equal(new Set(colors).size, 2)
})

test('highlighted lines retain tabs, spaces, blank lines and HTML-like text', async () => {
  const lines = ['fn main() {', '\tprintln!("<b>你好</b>");  ', '', '}', '']
  const tokens = await highlightCode(lines, 'language-rust')
  assert.deepEqual(tokens.map((line) => line.map(({ content }) => content).join('')), lines)
})

test('Protocol Buffers blocks support both proto and protobuf', async () => {
  const lines = ['syntax = "proto3";', '', 'message Greeting {', '  string text = 1;', '}']
  const tokens = await highlightCode(lines, 'language-proto')
  assert.deepEqual(await highlightCode(lines, 'language-protobuf'), tokens)
  assert.deepEqual(tokens.map((line) => line.map(({ content }) => content).join('')), lines)

  const keyword = tokens[0].find(({ content }) => content === 'syntax')
  const string = tokens[0].find(({ content }) => content === '"proto3"')
  for (const theme of ['light', 'dark']) {
    assert.notEqual(keyword.variants[theme].color, string.variants[theme].color)
  }
})

test('missing, plain-text or unknown languages fall back to plain code', async () => {
  for (const className of [undefined, 'language-text', 'language-not-a-language', 'language-constructor']) {
    assert.equal(await highlightCode(['plain text'], className), null)
  }
})
