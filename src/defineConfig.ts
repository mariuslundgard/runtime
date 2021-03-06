import type {RuntimeBuildConfig, RuntimeConfig, RuntimeServer} from './types'

interface RuntimeConfigSpec {
  builds?: {
    external?: string[]
    input: Record<string, string>
    output?: {
      dir?: string
    }
    target?: 'node' | 'browser'
    tsconfig?: string
  }[]
  external?: string[]
  server?: RuntimeServer
}

export async function defineConfig(
  spec: RuntimeConfigSpec | (() => Promise<RuntimeConfigSpec>)
): Promise<RuntimeConfig> {
  if (typeof spec === 'function') {
    return defineConfig(await spec())
  }

  const {external = [], server} = spec

  const builds: RuntimeBuildConfig[] = (spec.builds || []).map((b) => ({
    tsconfig: b.tsconfig,
    input: b.input || {},
    output: {
      ...b.output,
      dir: b.output?.dir || 'lib',
    },
    target: b.target || 'node',
  }))

  return {builds, external, server}
}
