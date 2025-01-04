import { TEMP } from "@lib/constants";
import * as fs from "fs";
import * as path from "path";
import { logger } from "./logging";

// TODO: This can be removed if I use recursed to create tempMap
export function mkTemp(): void {

  if (!fs.existsSync(TEMP.DIR)) {
    try {
      fs.mkdirSync(TEMP.DIR);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to create temporary directory: ${error.message}`);
      } else {
        console.error(`Failed to create temporary directory: ${String(error)}`);
      }
    }
  }
}

export function rmTemp(): void {

  if (fs.existsSync(TEMP.DIR)) {
    try {
      fs.rmSync("./.temp", { recursive: true })
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Failed to delete temporary directory: ${error.message}`);
      } else {
        logger.error(`Failed to delete temporary directory: ${String(error)}`);
      }
    }
  } else {
    logger.warn("Can't delete temp folder if it doesn't exist.")
  }
}

export function addToTempMap(name: string, contentPath: string): void {

  name = name.toLowerCase()

  mkTemp();

  let mapData: Record<string, any>;

  if (fs.existsSync(TEMP.MAP)) {
    const mapContent = fs.readFileSync(TEMP.MAP, 'utf8');

    if (!mapContent.trim()) {
      mapData = {}
    } else {
      mapData = JSON.parse(mapContent)
    }
    console.log("File exists map")
  } else {
    mapData = {};
  }

  if (mapData[name] != null) {
    logger.warn(`In the temp map, there's already a key ${name}, it's going to be overwritten!`);
  }

  fs.writeFileSync(path.join(TEMP.DIR, name.toLowerCase()), contentPath)

  mapData[name] = path.join(TEMP.DIR, name.toLowerCase());

  fs.writeFileSync(TEMP.MAP, JSON.stringify(mapData), 'utf8')
}

export function getFromTempMap(name: string): string | undefined {

  name = name.toLowerCase()

  let mapData: Record<string, any>;

  if (fs.existsSync(TEMP.MAP)) {
    const mapContent = fs.readFileSync(TEMP.MAP, 'utf8');

    if (!mapContent.trim()) {
      mapData = {}
    } else {
      mapData = JSON.parse(mapContent)
    }
  } else {
    mapData = {};
  }

  if (mapData[name] == null) {
    logger.warn(`In the temp map, there's no key ${name}!`)
    return undefined
  }

  return mapData[name]

}

export function isFile(pathItem: string) {
  return !!path.extname(pathItem);
}
