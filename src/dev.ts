import path from 'path'
import express from 'express'
import {resolveHtml, resolvePaths} from './helpers'
import {RuntimeConfig} from './types'
import {watchConfig} from './watchConfig'

export async function dev(opts: {cwd: string}) {
  const {cwd} = opts
  const cachePath = path.resolve(cwd, 'node_modules/.runtime')
  const context = {cachePath, cwd}
  const server = express()

  let config: RuntimeConfig | null

  watchConfig(context, (nextConfig: RuntimeConfig) => {
    console.log('config changed')
    config = nextConfig
  })

  server.use(async (req, res, next) => {
    if (!config) {
      res.send('no configuration')

      return
    }

    if (!config.server) {
      res.send('no server configured')

      return
    }

    const paths = await resolvePaths(config.server.paths)
    const match = paths.find((_p) => _p === req.path)

    if (!match) {
      next()

      return
    }

    const html = await resolveHtml(config.server, req.path)

    res.send(html)
  })

  server.use((req, _res, next) => {
    const root = config?.server?.root

    if (!root) {
      next()

      return
    }

    const middleware = express.static(root)

    middleware(req, _res, next)
  })

  server.listen(3000, () => {
    console.log('Development server running at http://localhost:3000')
  })
}
