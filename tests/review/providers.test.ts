import { beforeEach, describe, expect, test, vi } from 'vitest'

const registerProvider = vi.fn()

vi.mock('@flue/runtime', () => ({ registerProvider }))

describe('registerReviewProviders', () => {
  beforeEach(() => {
    vi.resetModules()
    registerProvider.mockReset()
    delete process.env.OPENCODE_GO_API_KEY
    delete process.env.OPENCODE_API_KEY
    delete process.env.OPENCODE_GO_BASE_URL
  })

  test('registers OpenCode Go with the default endpoint', async () => {
    process.env.OPENCODE_GO_API_KEY = 'go-key'
    const { registerReviewProviders } = await import('../../src/review/providers')

    registerReviewProviders()

    expect(registerProvider).toHaveBeenCalledWith('opencode-go', {
      api: 'openai-completions',
      baseUrl: 'https://opencode.ai/zen/go/v1',
      apiKey: 'go-key',
      headers: { 'User-Agent': 'shippie' },
    })
  })

  test('accepts OPENCODE_API_KEY as a fallback', async () => {
    process.env.OPENCODE_API_KEY = 'fallback-key'
    const { registerReviewProviders } = await import('../../src/review/providers')

    registerReviewProviders()

    expect(registerProvider).toHaveBeenCalledWith(
      'opencode-go',
      expect.objectContaining({ apiKey: 'fallback-key' })
    )
  })

  test('ignores blank env values', async () => {
    process.env.OPENCODE_GO_BASE_URL = '  '
    process.env.OPENCODE_GO_API_KEY = ''
    process.env.OPENCODE_API_KEY = 'fallback-key'
    const { registerReviewProviders } = await import('../../src/review/providers')

    registerReviewProviders()

    expect(registerProvider).toHaveBeenCalledWith(
      'opencode-go',
      expect.objectContaining({
        baseUrl: 'https://opencode.ai/zen/go/v1',
        apiKey: 'fallback-key',
      })
    )
  })
})
