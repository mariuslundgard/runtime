import path from 'path'
import {bundle} from './_rollup/bundle'
import {resolveConfig} from './resolveConfig'

export async function build(opts: {cwd: string; tsconfig?: string}) {
  const cachePath = path.resolve(opts.cwd, '.workshop')
  const config = await resolveConfig({cachePath, cwd: opts.cwd})
  const input = config.bundle.input

  await bundle({
    ...opts,
    input,
    build: {
      outDir: config.bundle.output.dir + '/cjs',
      format: 'cjs',
    },
  })

  await bundle({
    ...opts,
    input,
    build: {
      outDir: config.bundle.output.dir + '/esm',
      format: 'esm',
    },
  })
}
