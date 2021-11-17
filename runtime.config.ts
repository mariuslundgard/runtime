import {defineConfig} from './src/defineConfig'

export default defineConfig({
  builds: [
    {
      input: {
        build: 'src/build.ts',
        cli: 'src/cli/index.ts',
        runtime: 'src/index.ts',
      },
      output: {
        dir: 'lib',
      },
      target: 'node',
      tsconfig: 'tsconfig.lib.json',
    },
  ],
})
