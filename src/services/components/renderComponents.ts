import { STATIC_DIR } from '@lib/constants'
import { REGEX } from '@lib/enums';
import { isFile } from '@lib/utils/files';
import { logger } from '@lib/utils/logging';
import fs from 'fs'
import path from 'path'

export function render() {

  const staticFiles = fs.readdirSync(STATIC_DIR, { recursive: true })

  for (let i = 0; i < staticFiles.length; i++) {
    const file = staticFiles[i].toString();

    if (!isFile(file.toString())) {
      logger.debug(`${file} is not a file! Skipping.`)
      continue
    }
    logger.debug(`${file} is a file.`)

    let fileContent = fs.readFileSync(path.join(STATIC_DIR, file), 'utf8').toString()

    logger.debug(fileContent)
    logger.info("Start of the loop")

    let match;
    while ((match = REGEX.COMPONENT.exec(fileContent)) !== null) {
      logger.debug(`Full match: ${match[0].toString()}`); // Full match
      logger.debug(match[1]); // Capturing group (if any)

      // Replace only the current match
      fileContent = fileContent.replace(match[0], "");
      logger.debug(fileContent);
    }

    // TODO: continue

  }

  //while ((match = regex.exec(text)) !== null) {
  //      // `match[1]` contains the captured group (the part after '@')
  //      mentions.push(match[1]);
  //}
}
