import {dev} from '../../dev'
import {CmdFn} from '../types'

export const devCommand: CmdFn = async ({cwd}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    require('dotenv-flow').config({node_env: 'production', path: cwd})
  } catch (err) {
    throw err
  }

  dev({cwd})
}
