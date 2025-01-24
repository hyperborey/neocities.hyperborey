import { StorageManager } from "@managers/StorageManager"
import mockFs from 'mock-fs'

describe('StorageManager', () => {
  let storageManager: StorageManager

  beforeEach(() => {
    storageManager = new StorageManager()
    mockFs({
      ".temp/": {},
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should add content to .temp and retrieve it succesfully', () => {
    const input = 'this is a test file content!'

    storageManager.addToTemp('test', input, 'data')
    const output = storageManager.getFromTemp('test', 'data')

    expect(output).toBe(input)
  })

  it("should import the component into the text", () => {
    const input = "This text has a [component:test] component"
    const expected = "This text has a really awesome component"

    storageManager.addToTemp("test", "really awesome", "components")

    const output = storageManager.insertComponent(input, "test")

    expect(output).toBe(expected)
  })

  it("should import all available components into the text", () => {
    const input = "This is a [component:first], [component:second] and [component:does_not_exists] components"
    const expected = "This is a 1st, 2nd and [component:does_not_exists] components"

    storageManager.addToTemp("first", "1st", "components")
    storageManager.addToTemp("second", "2nd", "components")

    const output = storageManager.insertAllComponents(input)

    expect(output).toBe(expected)
  })

  it("should import the component into the text only once if the onlyOnce arg is set", () => {
    const input = "You need to import [component:once] [component:once]"
    const expected = "You need to import once [component:once]"

    storageManager.addToTemp("once", "once", "components")
    const output = storageManager.insertComponent(input, "once", true)

    expect(output).toBe(expected)
  })

})
