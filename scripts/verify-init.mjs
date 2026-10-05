import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const base = await mkdtemp(path.join(os.tmpdir(), 'starter-monorepo-acceptance-'))
const project = path.join(base, 'project')
const consumer = path.join(base, 'consumer')
const artifacts = path.join(base, 'artifacts')
const logs = path.join(base, 'logs')
const report = { startedAt: new Date().toISOString(), platform: `${os.platform()} ${os.arch()}`, node: process.version, base, steps: [] }
await mkdir(logs)
console.log(`Acceptance artifacts: ${base}`)

async function run(label, command, args, cwd) {
  const log = `${String(report.steps.length + 1).padStart(2, '0')}-${label}.log`
  console.log(`\n[${label}] ${command} ${args.join(' ')}\n  cwd: ${cwd}`)
  const started = Date.now()
  let output = ''
  const status = await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, CI: 'true', NO_COLOR: '1' }, stdio: ['ignore', 'pipe', 'pipe'] })
    for (const stream of [child.stdout, child.stderr]) {
      stream.on('data', (chunk) => {
        output += chunk.toString()
        process.stdout.write(chunk)
      })
    }
    child.on('error', reject)
    child.on('close', resolve)
  })
  await writeFile(path.join(logs, log), output)
  report.steps.push({ label, command, args, cwd, exitCode: status, durationMs: Date.now() - started, log: `logs/${log}` })
  await writeFile(path.join(base, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  if (status !== 0)
    throw new Error(`${label} failed with exit code ${status}; see ${path.join(logs, log)}`)
  return output
}

async function pnpm(label, args, cwd = project) {
  // pnpm run provides its JS entrypoint, which also works without a shell on Windows.
  if (process.env.npm_execpath)
    return run(label, process.execPath, [process.env.npm_execpath, ...args], cwd)
  return run(label, 'pnpm', args, cwd)
}

try {
  await pnpm('pnpm-version', ['--version'], root)
  await run('initialize', process.execPath, [path.join(root, 'scripts/init.mjs'), '--project-name', 'acceptance-library', '--package-name', '@acceptance/core', '--description', '验收 TypeScript library: "quotes", $& and \\ paths', '--dir', project], root)
  await pnpm('install', ['install', '--frozen-lockfile'])
  await pnpm('typecheck', ['typecheck'])
  await pnpm('test', ['test'])
  await pnpm('lint', ['lint'])
  await pnpm('build', ['build'])
  await pnpm('docs-build', ['docs:build'])
  await mkdir(artifacts)
  await pnpm('pack', ['-C', 'packages/core', 'pack', '--pack-destination', artifacts])
  const tarballs = (await readdir(artifacts)).filter(name => name.endsWith('.tgz'))
  if (tarballs.length !== 1)
    throw new Error(`Expected one tarball, got ${tarballs.length}`)
  await mkdir(consumer)
  await writeFile(path.join(consumer, 'package.json'), `${JSON.stringify({ name: 'acceptance-consumer', private: true, type: 'module' }, null, 2)}\n`)
  await pnpm('consumer-install', ['add', path.join(artifacts, tarballs[0])], consumer)
  await writeFile(path.join(consumer, 'index.mjs'), 'import assert from \'node:assert/strict\'\nimport { one, two } from \'@acceptance/core\'\nassert.equal(one, 1)\nassert.equal(two, 2)\nassert.equal(one + two, 3)\nconsole.log(\'consumer runtime OK: 1 + 2 = 3\')\n')
  await run('consumer-runtime', process.execPath, ['index.mjs'], consumer)
  const { version } = JSON.parse(await readFile(path.join(project, 'node_modules/typescript/package.json'), 'utf8'))
  await pnpm('consumer-typescript-install', ['add', '-D', `typescript@${version}`], consumer)
  await writeFile(path.join(consumer, 'index.ts'), 'import { one, two } from \'@acceptance/core\'\nconst sum: number = one + two\nconsole.log(sum)\n// @ts-expect-error the package declarations must not expose any\nconst invalid: string = one\nvoid invalid\n')
  await pnpm('consumer-types-nodenext', ['exec', 'tsc', '--noEmit', '--strict', '--module', 'NodeNext', '--target', 'ES2022', 'index.ts'], consumer)
  await pnpm('consumer-types-bundler', ['exec', 'tsc', '--noEmit', '--strict', '--module', 'ESNext', '--moduleResolution', 'Bundler', '--target', 'ES2022', 'index.ts'], consumer)
  report.success = true
}
catch (error) {
  report.success = false
  report.error = error.message
  console.error(error.message)
  process.exitCode = 1
}
finally {
  report.finishedAt = new Date().toISOString()
  await writeFile(path.join(base, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  await writeFile(path.join(base, 'report.md'), `# Initialization acceptance\n\n- Started: ${report.startedAt}\n- Finished: ${report.finishedAt}\n- Platform: ${report.platform}\n- Node: ${report.node}\n- Result: ${report.success ? 'PASS' : 'FAIL'}\n- Artifacts: ${base}\n\n| Step | Exit | Duration (ms) | Log |\n| --- | --- | --- | --- |\n${report.steps.map(step => `| ${step.label} | ${step.exitCode} | ${step.durationMs} | [log](${step.log}) |`).join('\n')}\n${report.error ? `\nError: ${report.error}\n` : ''}\nCommands, arguments and working directories are recorded in report.json. Nothing was published.\n`)
  console.log(`\n${report.success ? 'PASS' : 'FAIL'}: ${path.join(base, 'report.md')}\nTemporary files are retained for inspection.`)
}
