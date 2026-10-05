import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { initialize, validateName } from '../init.mjs'

const directories = []
const cli = fileURLToPath(new URL('../init.mjs', import.meta.url))
const templateRoot = fileURLToPath(new URL('../../', import.meta.url))
const base = { projectName: 'sample-project', packageName: '@sample/core', description: 'A sample library' }

async function temporary() {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'starter-init-test-'))
  directories.push(directory)
  return directory
}

async function readJson(directory, file) {
  return JSON.parse(await readFile(path.join(directory, file), 'utf8'))
}

async function sourceFiles(directory, prefix = '') {
  const result = new Map()
  for (const entry of await readdir(path.join(directory, prefix), { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) {
      for (const [key, value] of await sourceFiles(directory, name))
        result.set(key, value)
    }
    else if (!name.endsWith('.png')) {
      result.set(name, await readFile(path.join(directory, name), 'utf8'))
    }
  }
  return result
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

describe('initializer input validation', () => {
  it.each(['my-library', '@acme/core', '@acme/core.utils', 'a'.repeat(214)])('accepts portable package name %s', (name) => {
    expect(() => validateName(name, true)).not.toThrow()
  })

  it.each(['', 'Uppercase', 'two words', '../outside', 'a/b', '@scope', '@scope/a/b', '@Scope/core', '.hidden', '_hidden', 'trailing.', 'node_modules', '@acme/node_modules', 'favicon.ico', 'fs', 'node:fs', 'con', '@acme/com1', 'a'.repeat(215)])('rejects invalid package name %s', (name) => {
    expect(() => validateName(name, true)).toThrow('Invalid package name')
  })

  it('reports missing arguments without hanging or creating a destination', async () => {
    const directory = await temporary()
    const result = spawnSync(process.execPath, [cli, '--project-name', 'demo'], { cwd: directory, encoding: 'utf8', timeout: 5000 })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('--package-name, --description')
    expect(await readdir(directory)).toEqual([])
  })

  it('shows help without requiring values and rejects unknown flags', () => {
    expect(spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' }).stdout).toContain('--package-name')
    expect(spawnSync(process.execPath, [cli, '--project-nam', 'demo']).status).toBe(1)
  })

  it.each([
    { projectName: '../escape' },
    { projectName: 'starter-monorepo' },
    { packageName: 'pkg-placeholder' },
    { packageName: 'vite' },
    { description: '' },
    { description: 'line\nbreak' },
    { repository: 'https://github.com/acme/repo?bad=true' },
    { repository: 'https://example.com/acme/repo' },
  ])('fails before writes for %j', async (override) => {
    const parent = await temporary()
    const dir = path.join(parent, 'new-project')
    await expect(initialize({ ...base, ...override, dir })).rejects.toThrow()
    expect(await readdir(parent)).toEqual([])
  })
})

describe('generated library workspace', () => {
  it('rewrites scoped names, paths, metadata and docs without changing the template', async () => {
    const parent = await temporary()
    const dir = path.join(parent, 'project with spaces')
    const before = await readFile(path.join(templateRoot, 'package.json'))
    const description = '中文 "quotes": $& $\' \\ <tag> {{ example }} & [link] `code`'
    await initialize({ ...base, description, dir, repository: 'https://github.com/example/new-project.git', author: 'Example' })
    const root = await readJson(dir, 'package.json')
    const library = await readJson(dir, 'packages/core/package.json')
    expect(root).toMatchObject({ name: 'sample-project', private: true, description })
    expect(root.devDependencies['@sample/core']).toBe('workspace:*')
    expect(root.devDependencies).not.toHaveProperty('pkg-placeholder')
    expect(root.scripts).not.toHaveProperty('init')
    expect(library).toMatchObject({ name: '@sample/core', description, author: 'Example', repository: { url: 'git+https://github.com/example/new-project.git', directory: 'packages/core' } })
    expect(library.exports['.']).toBe('./dist/index.mjs')
    expect(library.types).toBe('./dist/index.d.mts')
    expect(await readJson(dir, 'tsconfig.json')).toMatchObject({ compilerOptions: { paths: { '@sample/core': ['./packages/core/src/index.ts'] } } })
    expect(await readJson(dir, 'typedoc.json')).toMatchObject({ entryPoints: ['./packages/core/src/index.ts'], sourceLinkTemplate: 'https://github.com/example/new-project/tree/{gitRevision}/{path}#L{line}' })
    const files = await sourceFiles(dir)
    const joined = [...files.values()].join('\n')
    expect(joined).not.toMatch(/pkg-placeholder|starter-monorepo|_description_/)
    expect(files.get('README.md')).toContain('from \'@sample/core\'')
    expect(files.get('README.md')).toContain('&#60;tag&#62;')
    expect(files.get('README.md')).not.toContain('## Modify')
    expect(files.get('README.md')).not.toContain('sponsors/public/sponsors.svg')
    expect(files.get('docs/index.md')).toContain(`tagline: ${JSON.stringify(description)}`)
    expect(files.get('docs/zh/index.md')).toContain(`tagline: ${JSON.stringify(description)}`)
    expect(files.get('pnpm-lock.yaml')).toContain('      \'@sample/core\':')
    expect(files.get('pnpm-lock.yaml')).toContain('version: link:packages/core')
    expect(files.get('pnpm-lock.yaml')).toContain('  packages/core: {}')
    expect(files.get('docs/.vitepress/theme/style.css')).toBe(await readFile(path.join(templateRoot, 'docs/.vitepress/theme/style.css'), 'utf8'))
    expect(files.get('packages/core/LICENSE')).toBe(files.get('LICENSE'))
    expect(files.get('LICENSE')).toContain('YunYouJun')
    for (const excluded of ['node_modules', '.git', '.github/FUNDING.yml', 'docs/api', 'scripts', 'docs/guide/initialization.md', 'docs/.vitepress/components.d.ts'])
      expect(existsSync(path.join(dir, excluded))).toBe(false)
    expect(await readFile(path.join(templateRoot, 'package.json'))).toEqual(before)
  })

  it('omits unknown ownership and source links, and avoids duplicate workspace names', async () => {
    const dir = path.join(await temporary(), 'new-project')
    await initialize({ ...base, projectName: 'sample-library', packageName: 'sample-library', dir })
    const root = await readJson(dir, 'package.json')
    const library = await readJson(dir, 'packages/sample-library/package.json')
    expect(root.name).toBe('sample-library-workspace')
    for (const manifest of [root, library]) {
      for (const field of ['author', 'repository', 'homepage', 'funding', 'bugs'])
        expect(manifest).not.toHaveProperty(field)
    }
    expect(await readJson(dir, 'typedoc.json')).toMatchObject({ disableSources: true })
    expect(await readJson(dir, 'typedoc.json')).not.toHaveProperty('sourceLinkTemplate')
    const files = await sourceFiles(dir)
    expect([...files.values()].join('\n')).not.toContain('github.com/YunYouJun/sample-library')
    expect(files.get('docs/index.md')).not.toContain('View on GitHub')
    expect(files.get('docs/zh/index.md')).not.toContain('在 GitHub 查看')
    expect(files.get('README.md')).not.toContain('[![License]')
  })

  it('does not reinterpret user repository names containing template tokens', async () => {
    const dir = path.join(await temporary(), 'new-project')
    await initialize({ ...base, dir, repository: 'https://github.com/example/starter-monorepo' })
    expect(await readFile(path.join(dir, 'docs/index.md'), 'utf8')).toContain('link: https://github.com/example/starter-monorepo')
    expect(await readFile(path.join(dir, 'README.md'), 'utf8')).toContain('github/license/example/starter-monorepo.svg')
  })

  it('refuses a repeat invocation or existing directory without modifying files', async () => {
    const dir = await temporary()
    await writeFile(path.join(dir, 'keep.txt'), 'untouched')
    await expect(initialize({ ...base, dir })).rejects.toThrow('already exists')
    expect(await readFile(path.join(dir, 'keep.txt'), 'utf8')).toBe('untouched')
    const newDir = path.join(dir, 'new')
    await initialize({ ...base, dir: newDir })
    const manifest = await readFile(path.join(newDir, 'package.json'))
    await expect(initialize({ ...base, dir: newDir })).rejects.toThrow('already exists')
    expect(await readFile(path.join(newDir, 'package.json'))).toEqual(manifest)
  })

  it('runs the public CLI with a destination relative to cwd', async () => {
    const cwd = await temporary()
    const result = spawnSync(process.execPath, [cli, '--project-name', 'cli-project', '--package-name', '@demo/core', '--description', 'CLI smoke test', '--dir', 'output'], { cwd, encoding: 'utf8', timeout: 10000 })
    expect(result.stderr).toBe('')
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('No packages were published')
    expect((await readJson(path.join(cwd, 'output'), 'packages/core/package.json')).name).toBe('@demo/core')
  })
})
