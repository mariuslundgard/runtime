import fs from 'fs'
import {promisify} from 'util'
import rimrafCallback from 'rimraf'

export const rimraf = promisify(rimrafCallback)
export const writeFile = promisify(fs.writeFile)
