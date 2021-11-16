import path from 'path'
import {build} from '../src'

build({
  cwd: path.resolve(__dirname, '..'),
  tsconfig: 'tsconfig.lib.json',
}).catch((err) => {
  console.log('err', err)
})
