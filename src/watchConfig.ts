import path from 'path'
import chokidar from 'chokidar'
import mkdirp from 'mkdirp'
import {nanoid} from 'nanoid'
import {rimraf} from './helpers'
import {bundle} from './rollup'
import {RuntimeConfig} from './types'

export async function watchConfig(
  context: {
    cachePath: string
    cwd: string
  },
  observer: (config: RuntimeConfig) => void
) {
  const {cachePath, cwd} = context
  const buildId = '.tmp_' + nanoid()

  await mkdirp(cachePath)

  const rawConfigPath = path.resolve(cwd, 'runtime.config.ts')
  const configPath = path.resolve(cachePath, `${buildId}.config.js`)

  const watch = chokidar.watch(rawConfigPath)

  async function _build() {
    const files = await bundle({
      cwd,
      input: {
        [`${buildId}.config`]: rawConfigPath,
      },
      build: {
        format: 'cjs',
        outDir: cachePath,
      },
      target: 'node',
    })

    delete require.cache[configPath]

    const configMod = require(configPath)
    const configPromise: Promise<RuntimeConfig> = configMod.default ? configMod.default : configMod
    const config = await configPromise

    for (const f of files) {
      await rimraf(f.path)
      await rimraf(f.path + '.map')
      await rimraf(f.path + '.d.ts')
    }

    return config
  }

  watch.on('all', (event) => {
    if (event === 'add' || event === 'change') {
      _build().then((config) => {
        observer(config)
      })
    }
  })
}
