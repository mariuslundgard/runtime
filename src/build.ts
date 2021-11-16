import path from 'path'
import chalk from 'chalk'
import {bundle} from './_rollup/bundle'
import {resolveConfig} from './resolveConfig'

export async function build(opts: {cwd: string}) {
  const {cwd} = opts
  const cachePath = path.resolve(cwd, '.workshop')
  const config = await resolveConfig({cachePath, cwd})

  for (const build of config.builds) {
    const input = build.input
    const target = build.target
    const tsconfig = build.tsconfig || 'tsconfig.json'

    console.log(chalk.blue('tsconfig'), tsconfig)

    await bundle({
      cwd,
      input,
      build: {outDir: build.output.dir + '/cjs', format: 'cjs'},
      target,
      tsconfig,
    })

    await bundle({
      cwd,
      input,
      build: {outDir: build.output.dir + '/esm', format: 'esm'},
      target,
      tsconfig,
    })
  }
}
