#!/usr/bin/env node
import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { builtinModules } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const templateRoot = fileURLToPath(new URL('../', import.meta.url))
const templatePackage = 'pkg-placeholder'
const templateProject = 'starter-monorepo'
const templateRepository = 'https://github.com/YunYouJun/starter-monorepo'
const reserved = new Set(['node_modules', 'favicon.ico', ...builtinModules.map(name => name.replace(/^node:/, ''))])
const portableName = /^[a-z0-9][a-z0-9._-]*$/
const windowsDevice = /^(?:con|prn|aux|nul|com\d|lpt\d)(?:\.|$)/i
const textExtensions = new Set(['.md', '.json', '.yaml', '.yml', '.ts', '.js', '.mjs', '.css', '.vue', '.tsx', '.jsx', '.svg'])
const excluded = new Set(['node_modules', '.git', 'dist', '.nuxt', '.output', '.cache', '.temp', '.vite-temp', 'cache', 'coverage', '.DS_Store', '.eslintcache'])
const rootFiles = ['package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml', 'tsconfig.json', 'typedoc.json', 'eslint.config.js', '.gitignore', '.node-version', 'README.md', 'LICENSE', 'AGENTS.md', 'CLAUDE.md']
const rootDirectories = ['packages', 'docs', 'apps', '.github', '.vscode']

const help = `Create a TypeScript library monorepo (no dependency installation or publishing).

  node scripts/init.mjs --project-name my-library --package-name @acme/core \\
    --description "My TypeScript library" [--dir ../my-library]
  pnpm run init --project-name my-library --package-name my-library --description "My library"

Required (prompted in an interactive terminal):
  --project-name   Project directory/site name: lowercase letters, digits, . _ -
  --package-name   npm name, optionally scoped: core or @acme/core
  --description    Non-empty, single-line project and package description

Optional:
  --dir            New destination directory (default: ../<project-name> from cwd)
  --repository     GitHub URL, e.g. https://github.com/acme/my-library
  --author         Package author (original MIT attribution is preserved)
  --help, -h       Show this help

Existing destinations are never overwritten. Package directory uses the name
without its scope. Only template source files are copied; Git history, local
credentials, dependencies, build outputs and initializer tooling are excluded.
Without --repository/--author, template ownership metadata is removed.
`

/** Validate a portable subset of npm names without needing installed dependencies. */
export function validateName(value, scoped = false) {
  const parts = scoped && value.startsWith('@') ? value.slice(1).split('/') : [value]
  if (!value || value.length > 214 || (value.startsWith('@') && (!scoped || parts.length !== 2))
    || parts.some(part => !portableName.test(part) || part.endsWith('.') || windowsDevice.test(part) || part === 'node_modules' || part === 'favicon.ico')
    || (!value.startsWith('@') && reserved.has(value))) {
    throw new Error(`Invalid ${scoped ? 'package' : 'project'} name ${JSON.stringify(value)}. Use lowercase letters/digits with . _ -, start with a letter/digit, max 214 characters; no trailing dot, reserved names or paths.${scoped ? ' A scope such as @acme/core is supported.' : ''}`)
  }
}

function validateText(value, label) {
  // Reject terminal controls and line separators before any filesystem changes.
  if (!value.trim() || /[\p{Cc}\p{Zl}\p{Zp}]/u.test(value))
    throw new Error(`${label} must be non-empty, single-line text without control characters.`)
}

function markdownText(value) {
  return value.replace(/[\\`*_{}[\]<>&]/g, char => `&#${char.codePointAt(0)};`)
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

async function readTemplate() {
  const files = new Map()
  async function collect(relative) {
    const entries = await readdir(path.join(templateRoot, relative), { withFileTypes: true })
    for (const entry of entries) {
      const name = `${relative}/${entry.name}`
      if (excluded.has(entry.name) || name === 'docs/api' || name === 'docs/.vitepress/components.d.ts'
        || name === '.github/FUNDING.yml' || name.endsWith('/initialization.md')) {
        continue
      }
      if (entry.isSymbolicLink())
        throw new Error(`Refusing to copy template symlink: ${name}`)
      if (entry.isDirectory())
        await collect(name)
      else if (entry.isFile() && (textExtensions.has(path.extname(name)) || ['.gitignore', 'LICENSE', 'hero.png'].includes(entry.name)))
        files.set(name, await readFile(path.join(templateRoot, name)))
    }
  }
  for (const name of rootFiles)
    files.set(name, await readFile(path.join(templateRoot, name)))
  for (const name of rootDirectories)
    await collect(name)
  return files
}

/** Create a new project from this checkout after validating every supplied value. */
export async function initialize(options) {
  const { projectName, packageName, description, author } = options
  validateName(projectName)
  validateName(packageName, true)
  validateText(description, 'Description')
  if (author !== undefined)
    validateText(author, 'Author')
  const repository = options.repository?.replace(/\/$/, '').replace(/\.git$/, '')
  if (repository !== undefined && !/^https:\/\/github\.com\/[a-z\d](?:[a-z\d-]*[a-z\d])?\/\w[\w.-]*$/i.test(repository))
    throw new Error('Repository must be a GitHub HTTPS URL: https://github.com/owner/repository')

  const destination = path.resolve(options.dir ?? path.join('..', projectName))
  if (existsSync(destination))
    throw new Error(`Destination already exists: ${destination}. Choose a new --dir; no files were changed.`)
  const files = await readTemplate()
  const root = JSON.parse(files.get('package.json').toString())
  if (root.name !== templateProject || !root.devDependencies[templatePackage])
    throw new Error('Run the initializer from an uninitialized starter template checkout.')
  if (packageName !== templatePackage && Object.hasOwn(root.devDependencies, packageName))
    throw new Error(`Package name ${packageName} conflicts with a template dependency. Choose another name.`)
  if (projectName === templateProject || packageName.includes(templatePackage))
    throw new Error('Choose new names instead of the template placeholders.')
  const packageDirectory = packageName.split('/').at(-1)
  const libraryPath = `packages/${packageDirectory}`
  if ([...files.keys()].some(name => name.startsWith(`${libraryPath}/`)))
    throw new Error(`Package directory ${libraryPath} already exists in the template.`)

  const replacements = new Map([
    [`packages/${templatePackage}`, libraryPath],
    [`${templatePackage}/`, `${packageDirectory}/`],
    [templatePackage, packageName],
    [templateProject, projectName],
  ])
  if (repository) {
    replacements.set(templateRepository, repository)
    replacements.set('https://github.com/YunYouJun/pkg-placeholder', repository)
    for (const name of [templateProject, templatePackage])
      replacements.set(`https://img.shields.io/github/license/YunYouJun/${name}`, `https://img.shields.io/github/license/${repository.slice('https://github.com/'.length)}`)
  }
  // One pass avoids interpreting replacement strings ($&, $') or replacing new names again.
  const tokens = /https:\/\/github\.com\/YunYouJun\/(?:starter-monorepo|pkg-placeholder)|https:\/\/img\.shields\.io\/github\/license\/YunYouJun\/(?:starter-monorepo|pkg-placeholder)|packages\/pkg-placeholder|pkg-placeholder\/|pkg-placeholder|starter-monorepo/g
  for (const [name, bytes] of files) {
    if (name.endsWith('.png'))
      continue
    let text = bytes.toString().replace(/<!-- template-only:start -->[\s\S]*?<!-- template-only:end -->\n?/g, '')
    if (name.endsWith('.md') && !repository) {
      text = text.replace(/ {4}- theme: alt\n {6}text: [^\n]+\n {6}link: https:\/\/github.com\/YunYouJun\/starter-monorepo\n/g, '')
        .split('\n')
        .filter(line => !line.includes(templateRepository)
          && !line.includes('https://github.com/YunYouJun/pkg-placeholder')
          && !line.includes('img.shields.io/github/license/')
          && !line.includes('[![License]'))
        .join('\n')
    }
    text = text.replace(tokens, token => replacements.get(token) ?? token)
    if (name === 'pnpm-lock.yaml')
      text = text.replace(`      ${packageName}:`, `      '${packageName}':`)
    if (name === 'AGENTS.md' || name === 'CLAUDE.md')
      text = text.replace(' by YunYouJun.', '.')
    if (name === 'README.md' || name === `packages/${templatePackage}/README.md`)
      text = text.replace(/TypeScript Monorepo Starter with VitePress Documentation|_description_/g, () => markdownText(description))
    if (name === 'docs/index.md' || name === 'docs/zh/index.md')
      text = text.replace(/ {2}tagline: .*/, () => `  tagline: ${JSON.stringify(description)}`)
    files.set(name, Buffer.from(text))
  }

  root.name = projectName === packageName ? `${projectName}-workspace` : projectName
  if (root.name.length > 214)
    throw new Error('Project and package names are identical and too long for the private root name (<project>-workspace). Use a shorter project name.')
  root.description = description
  delete root.scripts.init
  delete root.scripts['verify:init']
  delete root.devDependencies[templatePackage]
  root.devDependencies[packageName] = 'workspace:*'
  root.devDependencies = Object.fromEntries(Object.entries(root.devDependencies).sort(([a], [b]) => a.localeCompare(b, 'en')))
  const library = JSON.parse(files.get(`packages/${templatePackage}/package.json`).toString())
  library.name = packageName
  library.description = description
  for (const manifest of [root, library]) {
    delete manifest.funding
    if (author)
      manifest.author = author
    else
      delete manifest.author
    if (repository) {
      manifest.repository = { type: 'git', url: `git+${repository}.git`, ...(manifest === library ? { directory: libraryPath } : {}) }
      if (manifest === library) {
        manifest.homepage = `${repository}#readme`
        manifest.bugs = `${repository}/issues`
      }
    }
    else {
      delete manifest.homepage
      delete manifest.repository
      delete manifest.bugs
    }
  }
  files.set('package.json', Buffer.from(json(root)))
  files.set(`packages/${templatePackage}/package.json`, Buffer.from(json(library)))
  files.set(`packages/${templatePackage}/LICENSE`, files.get('LICENSE'))
  const typedoc = JSON.parse(files.get('typedoc.json').toString())
  typedoc.name = projectName
  if (repository) {
    typedoc.sourceLinkTemplate = `${repository}/tree/{gitRevision}/{path}#L{line}`
  }
  else {
    delete typedoc.sourceLinkTemplate
    typedoc.disableSources = true
  }
  files.set('typedoc.json', Buffer.from(json(typedoc)))
  files.set('CHANGELOG.md', Buffer.from(`# Changelog\n\n## [Unreleased]\n\n- Initialize ${projectName}.\n`))

  // Reserve a new directory only after all reads, validation and transformations succeed.
  await mkdir(path.dirname(destination), { recursive: true })
  await mkdir(destination)
  try {
    for (const [name, bytes] of files) {
      const target = path.join(destination, name.replace(`packages/${templatePackage}`, libraryPath))
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, bytes, { flag: 'wx' })
    }
  }
  catch (error) {
    await rm(destination, { recursive: true, force: true })
    throw error
  }
  return { destination, libraryPath, repository, author }
}

async function main() {
  const { values } = parseArgs({
    options: {
      'project-name': { type: 'string' },
      'package-name': { type: 'string' },
      'description': { type: 'string' },
      'dir': { type: 'string' },
      'repository': { type: 'string' },
      'author': { type: 'string' },
      'help': { type: 'boolean', short: 'h' },
    },
  })
  if (values.help) {
    console.log(help)
    return
  }
  const questions = [
    ['project-name', 'Project name (e.g. my-library): '],
    ['package-name', 'npm package name (e.g. @acme/core): '],
    ['description', 'Project description (one line): '],
  ]
  const missing = questions.filter(([key]) => values[key] === undefined)
  if (missing.length) {
    if (!process.stdin.isTTY || !process.stdout.isTTY)
      throw new Error(`Missing required options: ${missing.map(([key]) => `--${key}`).join(', ')}. Run with --help for examples; interactive prompts require a terminal.`)
    const prompt = createInterface({ input: process.stdin, output: process.stdout })
    try {
      for (const [key, question] of missing) {
        values[key] = await prompt.question(question)
        if (key === 'description')
          validateText(values[key], 'Description')
        else
          validateName(values[key], key === 'package-name')
      }
    }
    finally {
      prompt.close()
    }
  }
  const result = await initialize({ projectName: values['project-name'], packageName: values['package-name'], description: values.description, dir: values.dir, repository: values.repository, author: values.author })
  console.log(`Created ${result.destination}\nLibrary: ${result.libraryPath}\n\nNext, in the generated directory:\n  pnpm install --frozen-lockfile\n  pnpm typecheck\n  pnpm test\n  pnpm build\n  pnpm docs:build`)
  if (!result.repository)
    console.log('\nRepository not supplied: add your repository/homepage/bugs to package.json files and enable TypeDoc source links when ready.')
  if (!result.author)
    console.log('Author not supplied: add your package author when ready; the original MIT license attribution has been preserved.')
  console.log('Documentation has no deployment URL yet. Initialize your own Git repository/remotes as needed. No packages were published.')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Initialization failed: ${error.message}`)
    process.exitCode = 1
  })
}
