import { REGEX, TEMP, } from "@lib/constants";
import * as fs from "fs";
import * as path from "path";
import { logger } from "./logging";

export function isFile(pathItem: string) {
  return !!path.extname(pathItem);
}

export function ensureDirExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function ensureDirRemoved(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}


/**
 * Extracts the path segment after a specified directory.
 * 
 * @param fullPath - The full path string.
 * @param targetDirectory - The directory after which the path should be extracted.
 * @returns The path segment after the target directory, or undefined if the directory is not found.
 */
export function getPathAfterDir(fullPath: string, targetDir: string): string | undefined {

  const p: string[] = fullPath.split(targetDir + '/')

  if (p.length == 1) {
    return undefined
  } else if (p.length == 2) {
    return
  } else if (p.length >= 3) {
    logger.error(`I didn't account for this yet`) // FIXME: Make it work with extra splits
    return undefined
  }
}

/**
 * Determines the type of the provided content and returns the corresponding file extension.
 * 
 * @param content - The string content whose type needs to be determined.
 * @returns The file extension as a string (`.json`, `.html`, or `.txt`).
 */
export function determineExtension(content: string): string {

  try {
    JSON.parse(content)
    return '.json'
  } catch (error) {

  }

  const HTML_REGEX = /<[\s\S]*>[\s\S]*<\/[\s\S]*>/
  if (HTML_REGEX.test(content)) {
    return '.html'
  }

  return '.txt'
}

/**
 * Extracts the first `n` words from a given string.
 *
 * @param content - The input string from which to extract words.
 * @param amount - The number of words to extract.
 * @returns An array of the first `n` words from the string.
 */
export function getFirstWords(content: string, amount: number): string[] {
  const words = content.split(/\s+/);
  const firstWords = words.slice(0, amount);
  return firstWords;
}
