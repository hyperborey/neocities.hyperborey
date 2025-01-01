import { addToTempMap, getFromTempMap } from "@lib/utils/files";
import fs from 'fs'
import path from 'path'
import mockFs from 'mock-fs';

jest.mock('pino', () => {
  return jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
  }));
});

describe('tempMap functions', () => {

  beforeEach(() => {
    mockFs({
      ".temp/": {},
    });
  });

  afterEach(() => {
    mockFs.restore(); // Restore the real filesystem after each test
  });

  it('should add content to the temp map and retrieve it correctly', () => {
    const input = '<p>This is a test component!</p>'
    const expected = input

    addToTempMap("test", input)

    const k = getFromTempMap("test")

    expect(k).toBeDefined();

    const result = fs.readFileSync(path.resolve(k!)).toString()

    expect(result).toEqual(expected);
  })

  it("should return undefined if key doesn't exists", () => {
    addToTempMap("test", "test")
    const result = getFromTempMap("does-not-exist!")

    expect(result).toBeUndefined()
  });

});
