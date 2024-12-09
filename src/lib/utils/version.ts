import * as fs from "fs"
import * as path from "path"

export function getVersion(): string {
  const packageJson = JSON.parse(fs.readFileSync("package.json").toString())
  const version = packageJson.version

  return version
}


