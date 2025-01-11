import { addToTemp, getFromTemp } from "@lib/utils/files";
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

    addToTemp("test", input, "data")

    const k = getFromTemp("test", "data")

    expect(k).toBeDefined();


    expect(k).toEqual(expected);
  })

  it("should return undefined if key doesn't exists", () => {
    addToTemp("test", "test", "data")
    const result = getFromTemp("does-not-exist!", "data")

    expect(result).toBeUndefined()
  });

});
