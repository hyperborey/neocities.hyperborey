import * as fs from "fs";
import * as path from "path";

/**
 * Creates .temp in the root of the project
 */
export function mkTemp(): void {
  const tempDir = path.resolve('./.temp');

  if (!fs.existsSync(tempDir)) {
    try {
      fs.mkdirSync(tempDir);
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
  const tempDir = path.resolve('./.temp');

  if (fs.existsSync(tempDir)) {
    try {
      fs.rmSync("./.temp", { recursive: true })
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to delete temporary directory: ${error.message}`);
      } else {
        console.error(`Failed to delete temporary directory: ${String(error)}`);
      }
    }
  } else {
    console.warn("Can't delete temp folder if it doesn't exist.")
  }
}

export function getAllFromDir(path: string): string[] {



  return []
}
