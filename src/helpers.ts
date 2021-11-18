import fs from 'fs'
import {promisify} from 'util'
import rimrafCallback from 'rimraf'
import {RuntimeServer} from './types'

export const rimraf = promisify(rimrafCallback)
export const writeFile = promisify(fs.writeFile)

export async function resolveHtml(server: RuntimeServer, path: string) {
  return server.handle({path})
}

export async function resolvePaths(
  pathsOrFn: (() => Promise<string[]> | string[]) | string[]
): Promise<string[]> {
  if (typeof pathsOrFn === 'function') {
    return pathsOrFn()
  }

  return pathsOrFn
}
