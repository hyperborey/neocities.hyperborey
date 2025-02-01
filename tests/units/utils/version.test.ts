import { logger } from "@lib/utils/logging";
import { getVersion } from "@lib/utils/version"
import * as fs from "fs"

// Logger mock
logger.mockTypes((typeName, type) => jest.fn());

jest.mock("fs");

describe('getVersion function', () => {
  it('should correctly get version from package.json', () => {
    const mockData = JSON.stringify(
      require("../../fixtures/project-files/test_package.json")
    );

    (fs.readFileSync as jest.Mock).mockReturnValue(mockData);

    const result = getVersion();
    const expected = "1.0.1"

    expect(result).toEqual(expected);
  })
});
