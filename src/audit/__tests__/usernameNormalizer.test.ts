import { describe, it, expect } from 'vitest'
import { normalizeInstagramUsername } from '../utils/usernameNormalizer'

describe('usernameNormalizer', () => {
  it('normalizes handles with @ symbol', () => {
    const res = normalizeInstagramUsername('@demo_cafe')
    expect(res.isValid).toBe(true)
    expect(res.username).toBe('demo_cafe')
  })

  it('normalizes plain username strings', () => {
    const res = normalizeInstagramUsername('demo_salon')
    expect(res.isValid).toBe(true)
    expect(res.username).toBe('demo_salon')
  })

  it('extracts canonical username from full Instagram URLs', () => {
    const url1 = normalizeInstagramUsername('https://instagram.com/demo_fitness')
    expect(url1.isValid).toBe(true)
    expect(url1.username).toBe('demo_fitness')

    const url2 = normalizeInstagramUsername('https://www.instagram.com/demo_realestate/')
    expect(url2.isValid).toBe(true)
    expect(url2.username).toBe('demo_realestate')
  })

  it('trims whitespace and converts to lowercase', () => {
    const res = normalizeInstagramUsername('  @Demo_Clothing  ')
    expect(res.isValid).toBe(true)
    expect(res.username).toBe('demo_clothing')
  })

  it('rejects invalid characters', () => {
    const res = normalizeInstagramUsername('invalid username!')
    expect(res.isValid).toBe(false)
    expect(res.error).toBeDefined()
  })

  it('rejects empty input', () => {
    const res = normalizeInstagramUsername('')
    expect(res.isValid).toBe(false)
  })
})
