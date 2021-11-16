import path from 'path'
import {build} from '../src'

build({cwd: path.resolve(__dirname, '..')}).catch((err) => {
  console.error(err)
  process.exit(1)
})
