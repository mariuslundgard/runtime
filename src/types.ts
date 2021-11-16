export interface RuntimeBuildConfig {
  external: string[]
  input: Record<string, string>
  output: {
    dir: string
  }
  target: 'node' | 'browser'
  tsconfig?: string
}

export interface RuntimeConfig {
  builds: RuntimeBuildConfig[]
}
