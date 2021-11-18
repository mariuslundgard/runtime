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
    handle(_req: RuntimeRequest) {
      return [
        `<!doctype html>`,
        `<html>`,
        `<body>`,
        `<h1>App</h1>`,
        `<script src="/main.js"></script>`,
        `</body>`,
        `</html>`,
      ].join('')
    },

    paths: ['/'],

    root: path.resolve(__dirname, '../../public'),
  },
})
