/*
 * BlogManager - менджер, цель которого сделать конечный статичный сайт
 * 1) Собирает STATIC файлы
 * 2) Собирает блог файлы у BlogManager
 * 3) Запрашивает у ComponentManager общие компоненты
 */

import { REGEX, STATIC } from "@lib/constants";
import { logger } from "@lib/utils/logging";

import path from 'path'
import fs from 'fs'
import { Component } from "./ComponentManager";
import { isFile } from "@lib/utils/files";

class BuildManager {

  public slots: Record<string, string[]>

  constructor() {
    this.slots = {}
  }

  insertIntoSlot(
    content: string,
    component: Component,
    options?: {
      onlyOnce: boolean
    }) {

    const resolvedOptions = { test: false, ...options };



  }

  buildStatic() {

  }

  buildFile(filePath: string) {

  }

  registerStatic() {
    const staticDir = fs.readdirSync(STATIC.DIR, { recursive: true, encoding: 'utf8' })

    logger.debug(`Static directory: ${staticDir}`)

    for (let i = 0; i < staticDir.length; i++) {
      const item = staticDir[i];
      const itemPath = path.join(STATIC.DIR, item)

      if (!isFile(itemPath)) {
        continue
      }

      this.registerSlots(itemPath)

    }
  }

  registerSlots(filePath: string): void {

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const fileSlots = [...fileContent.matchAll(REGEX.COMPONENT)].map(match => match[1]);

    for (let i = 0; i < fileSlots.length; i++) {
      const slot = fileSlots[i]

      if (!this.slots[slot]) {
        this.slots[slot] = [filePath]

      } else if (!this.slots[slot].includes(filePath)) {
        this.slots[slot].push(filePath)
      }
    }
  }

  unregisterSlots(sourcePath: string): void {

  }
}

export const buildManager = new BuildManager();
