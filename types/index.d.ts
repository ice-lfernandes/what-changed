export type ChangedFiles = string[]

declare module 'claude-code' {
  interface PluginState {
    'what-changed': { files: ChangedFiles; isHidden: boolean }
  }
}
