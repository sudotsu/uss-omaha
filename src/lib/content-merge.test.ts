import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeContentChanges } from './content-merge'

test('three-way merge preserves independent edits', () => {
  const base = { metadata: { title: 'A', subtitle: 'B' } }
  const local = { metadata: { title: 'Local', subtitle: 'B' } }
  const remote = { metadata: { title: 'A', subtitle: 'Remote' } }
  const result = mergeContentChanges(base, local, remote)

  assert.deepEqual(result.merged, { metadata: { title: 'Local', subtitle: 'Remote' } })
  assert.deepEqual(result.conflicts, [])
})

test('overlapping edits keep the local value and report a conflict', () => {
  const base = { value: 'A' }
  const local = { value: 'Local' }
  const remote = { value: 'Remote' }
  const result = mergeContentChanges(base, local, remote)

  assert.deepEqual(result.merged, { value: 'Local' })
  assert.deepEqual(result.conflicts, ['value'])
})
