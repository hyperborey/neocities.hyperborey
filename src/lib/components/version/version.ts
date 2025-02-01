import { Component } from '@lib/managers/ComponentManager'

import fs from 'fs'

export function buildVersion(): Component {
  const packageJson = JSON.parse(fs.readFileSync("package.json").toString())
  const version = packageJson.version

  return {
    name: "version",
    content: version,
    sourceFile: null,
    build: () => {
      return buildVersion()
    }
  }
}
