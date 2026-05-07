import { describe, expect, it } from 'vitest'
import { one, two } from '../src/index'

describe('pkg-placeholder', () => {
  it('exports one as 1', () => {
    expect(one).toBe(1)
  })

  it('exports two as 2', () => {
    expect(two).toBe(2)
  })
})
