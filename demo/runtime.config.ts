import path from 'path'
import {defineConfig, RuntimeRequest} from '../src'

export default defineConfig({
  builds: [
    {
      input: {
        main: path.resolve(__dirname, '../../src/main.ts'),
      },
      output: {
        dir: path.resolve(__dirname, '../../public'),
      },
      target: 'browser',
    },
  ],

  server: {
    handle(req: RuntimeRequest) {
      return `<!doctype html><html>${req.path}</html>`
    },

    paths: ['/'],
  },
})
