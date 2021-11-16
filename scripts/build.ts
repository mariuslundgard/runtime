import path from 'path'
import {build} from '../src'

build({cwd: path.resolve(__dirname, '..')}).catch((err) => {
  console.log('err', err)
})
