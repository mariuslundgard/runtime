import path from 'path'
import chalk from 'chalk'
import mkdirp from 'mkdirp'
import {resolveHtml, resolvePaths, writeFile} from './helpers'
import {resolveConfig} from './resolveConfig'
import {bundle} from './rollup'

function logOutputFiles(cwd: string, files: {type: 'asset' | 'chunk'; path: string}[]) {
  for (const f of files) {
    if (f.type === 'asset') {
      console.log(chalk.yellow('asset'), '→', path.relative(cwd, f.path))
    }

    if (f.type === 'chunk') {
      console.log(chalk.green('chunk'), '→', path.relative(cwd, f.path))
    }
  }
}

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
      const cjsFiles = await bundle({
        cwd,
        external: config.external,
        input,
        build: {outDir: build.output.dir + '/cjs', format: 'cjs'},
        target: 'node',
        tsconfig,
      })

      logOutputFiles(opts.cwd, cjsFiles)

      const esmFiles = await bundle({
        cwd,
        external: config.external,
        input,
        build: {outDir: build.output.dir + '/esm', format: 'esm'},
        target: 'node',
        tsconfig,
      })

      logOutputFiles(opts.cwd, esmFiles)

      break
    }

    if (target === 'browser') {
      const iifeFiles = await bundle({
        cwd,
        external: config.external,
        input,
        build: {outDir: build.output.dir, format: 'iife'},
        target: 'browser',
        tsconfig,
      })

      logOutputFiles(opts.cwd, iifeFiles)

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

      console.log(chalk.green(`GET ${p}`), '→', path.relative(opts.cwd, filePath))
    }
  }
}
