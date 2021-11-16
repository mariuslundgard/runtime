import {defineConfig} from './src/defineConfig'

export default defineConfig({
  bundle: {
    input: {
      cli: 'src/cli/index.ts',
      runtime: 'src/index.ts',
    },
    output: {
      dir: 'lib',
    },
  },
  tsconfig: 'tsconfig.lib.json',
})
