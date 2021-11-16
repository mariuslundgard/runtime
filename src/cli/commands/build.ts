import {build} from '../../build'
import {CmdFn} from '../types'

export const buildCommand: CmdFn = async ({cwd}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    require('dotenv-flow').config({node_env: 'production', path: cwd})
  } catch (err) {
    throw err
  }

  await build({cwd})
}
