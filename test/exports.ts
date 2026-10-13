import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import process from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const packageDir = new URL('../packages/pkg-placeholder/', import.meta.url)

test('Node.js imports the built package through its public entry', () => {
  const output = execFileSync(process.execPath, [
    '--input-type=module',
    '--eval',
    `import { one, two } from 'pkg-placeholder'
console.log(JSON.stringify({ one, two }))`,
  ], {
    cwd: fileURLToPath(packageDir),
    encoding: 'utf8',
  })

  assert.deepEqual(JSON.parse(output), { one: 1, two: 2 })
})

test('the package exposes its built TypeScript declarations', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', packageDir), 'utf8'))
  const entry = pkg.exports['.']
  const types = typeof entry === 'string' ? pkg.types : entry.types

  assert.equal(types, './dist/index.d.mts')
  await access(new URL(types, packageDir))
})
