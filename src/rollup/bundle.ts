import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import chalk from 'chalk'
import {InputOptions, ModuleFormat, OutputOptions, rollup as rollupBundle} from 'rollup'
import typescript from 'rollup-plugin-typescript2'

export async function bundle(opts: {
  build: {
    format: ModuleFormat
    outDir: string
  }
  cwd: string
  input: Record<string, string>
  target: 'node' | 'browser'
  tsconfig?: string
}) {
  // see below for details on the options
  const inputOptions: InputOptions = {
    // core input options
    external: [
      '@rollup/plugin-commonjs',
      '@rollup/plugin-json',
      '@rollup/plugin-node-resolve',
      'chalk',
      'esbuild',
      'fs',
      'mkdirp',
      'nanoid',
      'path',
      'rimraf',
      'rollup',
      'rollup-plugin-typescript2',
      'yargs',
      'util',
    ],
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

  // console.log(bundle.watchFiles) // an array of file names this bundle depends on

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  const {output} = await bundle.generate(outputOptions)

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'asset') {
      // For assets, this contains
      // {
      //   fileName: string,              // the asset file name
      //   source: string | Uint8Array    // the asset source
      //   type: 'asset'                  // signifies that this is an asset
      // }
      console.log(
        chalk.yellow('asset'),
        '→',
        chalk.gray(path.relative(opts.cwd, path.resolve(opts.build.outDir, chunkOrAsset.fileName)))
      )
      // console.log('Asset', chunkOrAsset)
    } else {
      // For chunks, this contains
      // {
      //   code: string,                  // the generated JS code
      //   dynamicImports: string[],      // external modules imported dynamically by the chunk
      //   exports: string[],             // exported variable names
      //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
      //   fileName: string,              // the chunk file name
      //   implicitlyLoadedBefore: string[]; // entries that should only be loaded after this chunk
      //   imports: string[],             // external modules imported statically by the chunk
      //   importedBindings: {[imported: string]: string[]} // imported bindings per dependency
      //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
      //   isEntry: boolean,              // is this chunk a static entry point
      //   isImplicitEntry: boolean,      // should this chunk only be loaded after other chunks
      //   map: string | null,            // sourcemaps if present
      //   modules: {                     // information about the modules in this chunk
      //     [id: string]: {
      //       renderedExports: string[]; // exported variable names that were included
      //       removedExports: string[];  // exported variable names that were removed
      //       renderedLength: number;    // the length of the remaining code in this module
      //       originalLength: number;    // the original length of the code in this module
      //       code: string | null;       // remaining code in this module
      //     };
      //   },
      //   name: string                   // the name of this chunk as used in naming patterns
      //   referencedFiles: string[]      // files referenced via import.meta.ROLLUP_FILE_URL_<id>
      //   type: 'chunk',                 // signifies that this is a chunk
      // }
      // console.log('Chunk', chunkOrAsset.modules)
      console.log(
        chalk.green('chunk'),
        '→',
        path.relative(opts.cwd, path.resolve(opts.build.outDir, chunkOrAsset.fileName))
      )
    }
  }

  // or write the bundle to disk
  await bundle.write(outputOptions)

  // closes the bundle
  await bundle.close()
}
