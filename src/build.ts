import path from 'path'
import chalk from 'chalk'
import mkdirp from 'mkdirp'
import {writeFile} from './helpers'
import {resolveConfig} from './resolveConfig'
import {bundle} from './rollup'
import {RuntimeServer} from '.'

export async function build(opts: {cwd: string}) {
  const {cwd} = opts
  const cachePath = path.resolve(cwd, 'node_modules', '.runtime')
  const config = await resolveConfig({cachePath, cwd})

  for (const build of config.builds) {
    const input = build.input
    const target = build.target
    const tsconfig = build.tsconfig || 'tsconfig.json'

    console.log(chalk.blue('tsconfig'), tsconfig)

    if (target === 'node') {
      await bundle({
        cwd,
        input,
        build: {outDir: build.output.dir + '/cjs', format: 'cjs'},
        target: 'node',
        tsconfig,
      })

      await bundle({
        cwd,
        input,
        build: {outDir: build.output.dir + '/esm', format: 'esm'},
        target: 'node',
        tsconfig,
      })

      break
    }

    if (target === 'browser') {
      await bundle({
        cwd,
        input,
        build: {outDir: build.output.dir, format: 'iife'},
        target: 'browser',
        tsconfig,
      })

      break
    }
  }

  if (config.server) {
    const paths = await resolvePaths(config.server.paths)

    for (const p of paths) {
      const html = await resolveHtml(config.server, p)
      const relativePath = p === '/' ? 'index.html' : p.slice(1) + '.html'
      const filePath = path.resolve(cwd, 'public', relativePath)
      const dirPath = path.dirname(filePath)

      await mkdirp(dirPath)
      await writeFile(filePath, html)

      // console.log('GET', p)
      // console.log(html)

      console.log(chalk.green(`GET ${p}`), '→', path.relative(opts.cwd, filePath))
    }
  }
}

async function resolveHtml(server: RuntimeServer, path: string) {
  return server.handle({path})
}

async function resolvePaths(
  pathsOrFn: (() => Promise<string[]> | string[]) | string[]
): Promise<string[]> {
  if (typeof pathsOrFn === 'function') {
    return pathsOrFn()
  }

  return pathsOrFn
}
