import { registerProvider } from '@flue/runtime'

const OPENCODE_GO_BASE_URL = 'https://opencode.ai/zen/go/v1'

const envValue = (name: string): string | undefined => {
  const value = process.env[name]?.trim()
  return value || undefined
}

/** Registers Shippie-owned model providers that are not built into flue/pi. */
export const registerReviewProviders = () => {
  registerProvider('opencode-go', {
    api: 'openai-completions',
    baseUrl: envValue('OPENCODE_GO_BASE_URL') ?? OPENCODE_GO_BASE_URL,
    apiKey: envValue('OPENCODE_GO_API_KEY') ?? envValue('OPENCODE_API_KEY'),
    headers: { 'User-Agent': 'shippie' },
  })
}
