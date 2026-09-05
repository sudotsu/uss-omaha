function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function equal(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function mergeValue(base: unknown, local: unknown, remote: unknown, path: string, conflicts: string[]): unknown {
  if (equal(local, base)) return remote
  if (equal(remote, base) || equal(local, remote)) return local

  if (isPlainObject(base) && isPlainObject(local) && isPlainObject(remote)) {
    const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])
    const merged: Record<string, unknown> = {}
    for (const key of keys) {
      const childPath = path ? `${path}.${key}` : key
      merged[key] = mergeValue(base[key], local[key], remote[key], childPath, conflicts)
    }
    return merged
  }

  conflicts.push(path || '(root)')
  return local
}

export function mergeContentChanges<T>(base: T, local: T, remote: T) {
  const conflicts: string[] = []
  const merged = mergeValue(base, local, remote, '', conflicts) as T
  return { merged, conflicts }
}
