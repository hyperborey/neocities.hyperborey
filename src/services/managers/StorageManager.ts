import { PUBLIC, REGEX, STATIC, TEMP } from '@lib/constants'
import { determineExtension, ensureDirExists, isFile } from '@lib/utils/files';
import { logger } from '@lib/utils/logging';
import fs from 'fs'
import path from 'path'
import { buildHeader } from '../components/header';
import { buildSidebar } from '../components/sidebar';

interface TempMap {
  data: Map<string, string>
  components: Map<string, string>
  cssPaths: Map<string, string>
  jsPaths: Map<string, string>
}

type TempCategories = "data" | "components" | "jsPaths" | "cssPaths"

export class StorageManager {

  private tempMap: TempMap

  constructor() {
    if (fs.existsSync(TEMP.MAP)) {
      this.tempMap = JSON.parse(fs.readFileSync(TEMP.MAP, 'utf8'))
    } else {
      this.tempMap = {
        data: new Map(),
        components: new Map(),
        cssPaths: new Map(),
        jsPaths: new Map()
      }
    }
  }

  /**
   * Saves the provided content to a file in the temporary directory (defined by TEMP.DIR).
   * 
   * @param name - The name of the file to be created.
   * @param content - The content to be saved, which can be either a string or an object.
   * @param category - The category within the temporary directory where the file should be saved.
   */
  public addToTemp(name: string, content: string | object, category: TempCategories): void {
    ensureDirExists(TEMP.DIR)
    name = name.toLowerCase()

    if (typeof content === "object") {
      const k = path.join(TEMP.DIR, `${name}.json`);
      fs.writeFileSync(k, JSON.stringify(content), 'utf8')
      this.tempMap[category].set(name, k);
      return
    }

    const extension: string = determineExtension(content)
    const k = path.join(TEMP.DIR, `${name}${extension}`)
    fs.writeFileSync(k, content, 'utf8')
    this.tempMap[category].set(name, k);
    return
  }

  /**
   * Retrieves content or the file path from the temporary directory (defined by TEMP.DIR).
   * 
   * @param name - The name of the file to retrieve.
   * @param category - The category within the temporary directory where the file is located.
   * @param returnPath - If `true`, returns the file path instead of its content. Defaults to `false`.
   * @returns The content of the file as a string, the file path if `returnPath` is `true`, or `undefined` if the file is not found.
   */
  public getFromTemp(name: string, category: TempCategories, returnPath = false): string | undefined {
    ensureDirExists(TEMP.DIR)

    const filePath = this.tempMap[category].get(name)

    if (!filePath) {
      return undefined
    }

    if (returnPath) {
      return filePath
    }

    return fs.readFileSync(filePath, 'utf8')
  }

  /**
   * Searches for required components in the temporary directory (defined by TEMP.DIR) and inserts them into the provided content.
   * If a component is not found, the template placeholder for that component remains unchanged.
   * 
   * @param content - The string content containing placeholders for components.
   * @returns The updated content with components inserted where found, or the original placeholder if a component is not found.
   */
  public insertAllComponents(content: string): string {
    content = content.replace(REGEX.COMPONENT, (match, componentName) => {
      return this.insertComponent(match, componentName);
    });

    return content
  }

  /**
   * Inserts a specific component into the provided content string.
   * 
   * @param content - The string content where the component will be inserted.
   * @param componentName - The name of the component to insert.
   * @param onlyOnce - If `true`, inserts the component only into the first matching template placeholder. Defaults to `false`.
   * @param componentContent - If provided, inserts this content directly instead of searching for the component in the temporary directory.
   * @returns The updated content with the component inserted, or the original content if the component is not found and `componentContent` is not provided.
   */
  public insertComponent(content: string, componentName: string, onlyOnce: boolean = false, componentContent: string | null = null): string {
    componentName = componentName.toLowerCase()
    logger.info(`Trying to find component "${componentName}"`)

    const component = componentContent || this.getFromTemp(componentName, 'components')

    if (!component) {
      logger.error(`Component "${componentName}" was not found!`)
    }

    let replaced: boolean = false

    content = content.replace(REGEX.COMPONENT, (match, p1) => {
      if (replaced && onlyOnce) {
        return match
      }

      if (p1.toLowerCase() === componentName) {
        replaced = true
        return component || match;
      }

      return match;
    });

    return content
  }

  public buildAllComponents() {
    this.addToTemp("header", buildHeader(), "components")
    this.addToTemp("sidebar", buildSidebar(), "components")
  }

  public buildStatic() {
    const staticFiles = fs.readdirSync(STATIC.DIR, { recursive: true })

    for (let i = 0; i < staticFiles.length; i++) {
      const file = staticFiles[i].toString();

      // Basically copies all folders from STATIC to PUBLIC
      if (!isFile(file.toString())) {
        ensureDirExists(path.join(PUBLIC.DIR, file))
        continue
      }

      let fileContent = fs.readFileSync(path.join(STATIC.DIR, file), 'utf8').toString()

      fileContent = this.insertAllComponents(fileContent)

      fs.writeFileSync(path.join(PUBLIC.DIR, file), fileContent, 'utf8')
    }
  }
}
