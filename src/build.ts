import path from 'path'
import chalk from 'chalk'
import {bundle} from './_rollup/bundle'
import {resolveConfig} from './resolveConfig'

export async function build(opts: {cwd: string}) {
  const cachePath = path.resolve(opts.cwd, '.workshop')
  const config = await resolveConfig({cachePath, cwd: opts.cwd})
  const input = config.bundle.input
  const tsconfig = config.tsconfig || 'tsconfig.json'

  console.log(chalk.blue('tsconfig'), tsconfig)

  await bundle({
    ...opts,
    input,
    build: {
      outDir: config.bundle.output.dir + '/cjs',
      format: 'cjs',
    },
    tsconfig: config.tsconfig,
  })

  await bundle({
    ...opts,
    input,
    build: {
      outDir: config.bundle.output.dir + '/esm',
      format: 'esm',
    },
    tsconfig: config.tsconfig,
  })
}
