import { REGEX, TEMP, TEMP_CATEGORY } from "@lib/constants";
import * as fs from "fs";
import * as path from "path";
import { logger } from "./logging";
import { TempMap } from "@lib/types";

/**
 * Writes the content to the file in the .temp folder and writes the path to file to the tempMap
 *
 * @param {string} name - Name of the file 
 * @param {string} content - The string to be written 
 * @param {TEMP_CATEGORY} category - Category of the file 
 */
export function addToTemp(name: string, content: string, category: TEMP_CATEGORY): void {
  name = name.toLowerCase()

  ensureDirExists(TEMP.DATA)
  ensureDirExists(TEMP.COMPONENTS)

  let tempMap: TempMap
  if (fs.existsSync(TEMP.MAP)) {
    tempMap = JSON.parse(fs.readFileSync(TEMP.MAP, 'utf8'))
  } else {
    tempMap = {
      "component": {},
      "data": {}
    }
  }

  let extension
  switch (category) {
    case "data":
      extension = ".json"
      break;

    case "component":
      extension = ".html"
      break;

    default:
      extension = ""
      break;
  }

  const k = path.join(TEMP.DIR, category, `${name}${extension}`);

  fs.writeFileSync(k, content, 'utf8')

  if (tempMap[category][name]) {
    logger.warn(`In tempMap, the key "${name}" already exists in the "${category}" category. It's going to be overwritten.`)
  }

  tempMap[category][name] = k;
  fs.writeFileSync(TEMP.MAP, JSON.stringify(tempMap), 'utf8')

}

/**
 * Retrieves the content of a file with the specified name from the `.temp` folder.
 * 
 * @param {string} name - The name of the file to retrieve.
 * @param {TEMP_CATEGORY} category - The category of the file to retrieve.
 * @returns {string | undefined} - The content of the file as a string. Returns `undefined` if the file is not found, 
 *                                 the `tempMap` is empty, or the `tempMap` does not exist.
 */
export function getFromTemp(name: string, category: TEMP_CATEGORY): string | undefined {
  name = name.toLowerCase()

  if (!fs.existsSync(TEMP.DIR) || !fs.existsSync(TEMP.MAP)) {
    logger.error(`.temp is empty or does not exist, can't get the key "${name}" from the "${category}" category!`)
    return undefined
  }

  const tempMap: TempMap = JSON.parse(fs.readFileSync(TEMP.MAP, 'utf8').toString())

  try {
    return fs.readFileSync(tempMap[category][name], 'utf8')
  } catch (TypeError) {
    logger.error(`Can't get key "${name}" from the "${category}" category!`)
    return undefined
  }
}

/**
 * Inserts a specified component from `.temp` folder into the content string by replacing all placeholders for the component.
 * 
 * @param componentName - The name of the component to be inserted. This component will be searched for in the `.temp` folder.
 * @param content - The string in which all placeholders for the component should be replaced with the actual component content.
 * @param componentContent - Optional. If provided, this string will be used as the component content instead of fetching from `.temp`.
 * @returns The modified `content` string with the component inserted in place of its placeholders.
 * 
 * @remarks If the component is not found in the `.temp` folder, the placeholders for the component in the `content` string will remain unchanged.
 */
export function insertComponent(content: string, componentName: string, componentContent?: string): string {
  componentName = componentName.toLowerCase()

  const component = componentContent || getFromTemp(componentName, "component")

  if (!component) {
    logger.error(`The "${componentName}" component was not found`)
  }

  content = content.replace(REGEX.COMPONENT, (match, p1) => {
    if (p1.toLowerCase() === componentName) {
      return component || match;
    }
    return match;
  });

  return content
}


/**
 * Checks if the given path item is a file by verifying if it has a file extension.
 * 
 * @param pathItem - The path item to check (e.g., a file or directory path).
 * @returns Returns `true` if the path item has a file extension (indicating it is a file), 
 *          otherwise returns `false`.
 */
export function isFile(pathItem: string) {
  return !!path.extname(pathItem);
}

/**
 * Ensures that a directory exists at the specified path. If the directory does not exist,
 * it is created recursively (including any parent directories that do not exist).
 * 
 * @param {string} dir - The path of the directory to ensure existence for.
 */
export function ensureDirExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Ensures that a directory at the specified path is removed. If the directory exists,
 * it is deleted recursively (including all its contents and subdirectories).
 * 
 * @param {string} dir - The path of the directory to remove.
 */
export function ensureDirRemoved(dir: string): void {
  if (fs.existsSync(dir)) {
    logger.debug(`Dir ${dir} does exists, deleting...`)
    fs.rmSync(dir, { recursive: true });
  }
}
