import {spawn} from 'node:child_process'
import {once} from 'node:events'
import {createWriteStream, mkdirSync, rmSync} from 'node:fs'
import {createServer} from 'node:net'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const portProbe = createServer()
portProbe.listen(0, '127.0.0.1')
await once(portProbe, 'listening')
const port = portProbe.address().port
await new Promise(resolve => portProbe.close(resolve))
// Only reset this runner's generated evidence, so the report matches this run.
rmSync(resolve(root, 'artifacts/e2e'), {recursive: true, force: true})
mkdirSync(resolve(root, 'artifacts/e2e'), {recursive: true})
const log = createWriteStream(resolve(root, 'artifacts/e2e/server.log'))
const env = {...process.env, E2E_PORT: String(port), E2E_BASE_URL: `http://127.0.0.1:${port}`}
const server = spawn(process.execPath, [resolve(root, 'node_modules/@empjs/cli/bin/emp.js'), 'serve'], {
  cwd: resolve(root, 'apps/valtio-offical'),
  env,
  stdio: ['ignore', 'pipe', 'pipe'],
})
server.stdout.pipe(log, {end: false})
server.stderr.pipe(log, {end: false})
let runner
const stop = () => {
  runner?.kill('SIGTERM')
  server.kill('SIGTERM')
}
process.once('SIGINT', stop)
process.once('SIGTERM', stop)

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null || server.signalCode !== null)
      throw new Error('EMP preview exited; see artifacts/e2e/server.log')
    const response = await fetch(env.E2E_BASE_URL, {signal: AbortSignal.timeout(1000)}).catch(() => null)
    if (response?.ok && (await response.text()).includes('<div id="emp-root"')) {
      ready = true
      break
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  if (!ready) throw new Error('EMP preview did not become ready; see artifacts/e2e/server.log')
  runner = spawn('pnpm', ['exec', 'rstest', 'run', '--config', 'rstest.e2e.config.ts'], {
    cwd: root,
    env,
    stdio: 'inherit',
  })
  const [code] = await once(runner, 'exit')
  process.exitCode = code ?? 1
} finally {
  stop()
  if (server.exitCode === null && server.signalCode === null) {
    const timeout = setTimeout(() => server.kill('SIGKILL'), 5000)
    await once(server, 'exit')
    clearTimeout(timeout)
  }
  log.end()
}
