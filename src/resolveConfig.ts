import path from 'path'
import esbuild from 'esbuild'
import mkdirp from 'mkdirp'
import {nanoid} from 'nanoid'
import {rimraf} from './helpers'
import {RuntimeConfig} from './types'

export async function resolveConfig(context: {
  cachePath: string
  cwd: string
}): Promise<RuntimeConfig> {
  const {cachePath, cwd} = context
  const buildId = '.tmp_' + nanoid()

  await mkdirp(cachePath)

  const rawConfigPath = path.resolve(cwd, 'runtime.config.ts')
  const configPath = path.resolve(cachePath, `${buildId}.config.js`)

  try {
    const tsconfigPath = path.resolve(cwd, 'tsconfig.json')

    await esbuild.build({
      bundle: true,
      entryPoints: [rawConfigPath],
      external: ['esbuild'],
      format: 'cjs',
      platform: 'node',
      outfile: configPath,
      tsconfig: tsconfigPath,
    })

    const configMod = require(configPath)
    const configPromise: Promise<RuntimeConfig> = configMod.default ? configMod.default : configMod
    const config = await configPromise

    await rimraf(configPath)

    return config
  } catch (err) {
    await rimraf(configPath)

    throw err
  }
}
