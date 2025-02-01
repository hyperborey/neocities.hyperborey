import { SRC } from "@lib/constants";
import { Component, componentManager } from "@lib/managers/ComponentManager";

import fs from 'fs'
import path from 'path'

export function buildFooter(): Component {
  const sourceFile = path.join(SRC.COMPONENTS, "footer/footer.html")
  const template = fs.readFileSync(sourceFile, "utf8")

  const componentContent = componentManager.insertComponent(template, "allRegistered")

  return {
    name: "footer",
    content: componentContent,
    sourceFile: sourceFile,
    build: () => {
      return buildFooter()
    }
  }
}
