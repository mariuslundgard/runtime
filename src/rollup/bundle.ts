import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import {InputOptions, ModuleFormat, OutputOptions, rollup as rollupBundle} from 'rollup'
import typescript from 'rollup-plugin-typescript2'

export async function bundle(opts: {
  build: {
    format: ModuleFormat
    outDir: string
  }
  cwd: string
  external?: string[]
  input: Record<string, string>
  target: 'node' | 'browser'
  tsconfig?: string
}) {
  // see below for details on the options
  const inputOptions: InputOptions = {
    // core input options
    external: (opts.external || []).concat([
      '@rollup/plugin-commonjs',
      '@rollup/plugin-json',
      '@rollup/plugin-node-resolve',
      'chalk',
      'express',
      'fs',
      'mkdirp',
      'nanoid',
      'path',
      'rimraf',
      'rollup',
      'rollup-plugin-typescript2',
      'yargs',
      'util',
    ]),
    input: opts.input, // conditionally required
    plugins: [
      // postcss(),
      // alias(),
      nodeResolve({
        mainFields: ['module', 'jsnext', 'main'],
        browser: opts.target !== 'node',
        exportConditions: [opts.target === 'node' ? 'node' : 'browser'],
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        preferBuiltins: opts.target === 'node',
      }),
      commonjs({
        esmExternals: false,
        include: /\/node_modules\//,
        requireReturnsDefault: 'namespace',
      }),
      json(),
      typescript({
        tsconfig: opts.tsconfig,
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext',
            target: 'esnext',
          },
        },
        useTsconfigDeclarationDir: true,
      }),
      // babel(),
      // customBabel(),
      // terser(),
      // OMT(), // (@surma/rollup-plugin-off-main-thread)
    ],
    // // advanced input options
    // cache,
    onwarn(warning, warn) {
      // https://github.com/rollup/rollup/blob/0fa9758cb7b1976537ae0875d085669e3a21e918/src/utils/error.ts#L324
      if (warning.code === 'UNRESOLVED_IMPORT') {
        console.warn(
          `Failed to resolve the module ${warning.source} imported by ${warning.importer}` +
            `\nIs the module installed? Note:` +
            `\n ↳ to inline a module into your bundle, install it to "devDependencies".` +
            `\n ↳ to depend on a module via import/require, install it to "dependencies".`
        )

        return
      }

      warn(warning)
    },
    // preserveEntrySignatures,
    // strictDeprecations,
    // // danger zone
    // acorn,
    // acornInjectPlugins,
    context: opts.cwd,
    // moduleContext,
    // preserveSymlinks,
    // shimMissingExports,
    treeshake: {
      propertyReadSideEffects: false,
    },
    // // experimental
    // experimentalCacheExpiry,
    // perf
  }

  const outputOptions: OutputOptions = {
    // core output options
    dir: opts.build.outDir,
    // file,
    format: opts.build.format,
    // globals,
    // name,
    // plugins,
    // // advanced output options
    // assetFileNames,
    // banner,
    // chunkFileNames,
    // compact,
    // entryFileNames,
    // extend,
    // externalLiveBindings,
    // footer,
    // hoistTransitiveImports,
    // inlineDynamicImports,
    // interop,
    // intro,
    // manualChunks,
    // minifyInternalExports,
    // outro,
    // paths,
    // preserveModules,
    // preserveModulesRoot,
    sourcemap: true,
    // sourcemapExcludeSources,
    // sourcemapFile,
    // sourcemapPathTransform,
    // validate,
    // // danger zone
    // amd,
    esModule: false,
    exports: 'auto',
    freeze: false,
    // indent,
    // namespaceToStringTag,
    // noConflict,
    // preferConst,
    // sanitizeFileName,
    // strict,
    // systemNullSetters,
  }

  // Create bundle
  const bundle = await rollupBundle(inputOptions)

  // an array of file names this bundle depends on
  // console.log(bundle.watchFiles)

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  const {output} = await bundle.generate(outputOptions)

  const files: {type: 'asset' | 'chunk'; path: string}[] = []

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'asset') {
      files.push({type: 'asset', path: path.resolve(opts.build.outDir, chunkOrAsset.fileName)})
    } else {
      files.push({type: 'chunk', path: path.resolve(opts.build.outDir, chunkOrAsset.fileName)})
    }
  }

  // or write the bundle to disk
  await bundle.write(outputOptions)

  // closes the bundle
  await bundle.close()

  return files
}
