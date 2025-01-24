import { determineExtension } from "@lib/utils/files"

describe('determineExtension function', () => {
  it('should accurately determine that the string is HTML', () => {
    const input = "<p>This is a test string!</p>"
    const output = determineExtension(input)
    expect(output).toBe('.html')
  })

  it('should accurately determine that the string is not HTML if it contains no valid tags', () => {
    const input = "<p>This is a not valid test string!<rkr>"
    const output = determineExtension(input)
    expect(output).toBe('.txt')
  })

  it('should accurately determine that the string is JSON', () => {
    const input = '{"name": "John", "age": 30}';
    const output = determineExtension(input)
    expect(output).toBe('.json')
  })
})
