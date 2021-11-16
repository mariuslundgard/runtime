// export interface RuntimeRequest {
//   path: string
// }

export interface RuntimeConfig {
  bundle: {
    input: Record<string, string>
    output: {
      dir: string
    }
  }
  // build: {outDir: string}
  external: string[]
  // paths: string[]
  // server: (req: RuntimeRequest) => Promise<string>
}
