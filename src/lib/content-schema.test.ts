import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import yaml from 'js-yaml'
import { parseContent, validateContent } from './content-schema'

const source = yaml.load(readFileSync('content.yml', 'utf8'))
const content = parseContent(source)

test('repository content matches the shared schema', () => {
  assert.equal(content.metadata.title, 'USS Omaha SSN-692 Memorial')
  assert.match(content.navy250.deadline, /Z$/)
  assert.equal(content.whatYourGiftBuilds.items.length, 3)
})

test('countdown timestamps without an offset are rejected', () => {
  const invalid = structuredClone(content)
  invalid.navy250.deadline = '2026-05-16T10:00:00'
  const result = validateContent(invalid)
  assert.equal(result.success, false)
})
