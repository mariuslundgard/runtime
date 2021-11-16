import type {
  RuntimeConfig,
  // RuntimeRequest
} from './types'

interface RuntimeConfigSpec {
  // build?: {outDir?: string}
  bundle?: {
    input: Record<string, string>
    output?: {
      dir?: string
    }
  }
  external?: string[]
  // paths: string[]
  // server: (req: RuntimeRequest) => Promise<string>
}

export async function defineConfig(
  spec: RuntimeConfigSpec | (() => Promise<RuntimeConfigSpec>)
): Promise<RuntimeConfig> {
  if (typeof spec === 'function') {
    return defineConfig(await spec())
  }

  return {
    bundle: {
      ...(spec.bundle || {}),
      input: spec.bundle?.input || {},
      output: {
        ...spec.bundle?.output,
        dir: spec.bundle?.output?.dir || 'lib',
      },
    },
    // build: {
    //   ...(spec.build || {}),
    //   outDir: spec.build?.outDir || 'public',
    // },
    external: spec.external || [],
    // paths: spec.paths,
    // server: spec.server,
  }
}
