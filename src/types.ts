export interface RuntimeRequest {
  path: string
}

export interface RuntimeBuildConfig {
  input: Record<string, string>
  output: {
    dir: string
  }
  target: 'node' | 'browser'
  tsconfig?: string
}

export interface RuntimeServer {
  handle: (req: RuntimeRequest) => Promise<string> | string
  paths: (() => Promise<string[]> | string[]) | string[]
  root?: string
}

export interface RuntimeConfig {
  builds: RuntimeBuildConfig[]
  external: string[]
  server?: RuntimeServer
}
