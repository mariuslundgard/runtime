import {build} from '../../build'
import {CmdFn} from '../types'

export const buildCommand: CmdFn = async ({args, cwd, flags}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    require('dotenv-flow').config({node_env: 'production', path: cwd})
  } catch (err) {
    throw err
  }

  const main = args[0]

  if (typeof main !== 'string') {
    throw new Error('missing input')
  }

  await build({
    cwd,
    tsconfig: typeof flags.tsconfig === 'string' ? flags.tsconfig : undefined,
  })
}
