// How many times this session a prompt asked for a plain explanation
export type Asks = number

declare module 'claude-code' {
  interface PluginState {
    layman: { asks: Asks }
  }
}
