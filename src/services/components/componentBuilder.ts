import { REGEX, STATIC, PUBLIC } from '@lib/constants';
import { getFromTempMap, isFile } from '@lib/utils/files';
import { logger } from '@lib/utils/logging';
import fs from 'fs'
import path from 'path'

export function buildComponents() {

  const staticFiles = fs.readdirSync(STATIC.DIR, { recursive: true })

  for (let i = 0; i < staticFiles.length; i++) {
    const file = staticFiles[i].toString();


    if (!isFile(file.toString())) {
      if (!fs.existsSync(path.join(PUBLIC.DIR, file))) {
        fs.mkdirSync(path.join(PUBLIC.DIR, file), { recursive: true })
      }
      continue
    }

    let fileContent = fs.readFileSync(path.join(STATIC.DIR, file), 'utf8').toString()

    let match;
    while ((match = REGEX.COMPONENT.exec(fileContent)) !== null) {
      logger.debug(`Full match: ${match[0].toString()}`); // Full match
      logger.debug(match[1]); // Capturing group (if any)

      const component = getFromTempMap(match[1])

      if (component == null) {
        logger.warn(`Component ${component} was not found!`)
        fileContent = fileContent.replace(match[0], "");
      } else {
        const componentContent = fs.readFileSync(component)
        fileContent = fileContent.replace(match[0], componentContent.toString());
      }

      if (!fs.existsSync(PUBLIC.DIR)) {
        fs.mkdirSync(PUBLIC.DIR)

      }
    }

    fs.writeFileSync(path.join(PUBLIC.DIR, file), fileContent, 'utf8')

  }

  //while ((match = regex.exec(text)) !== null) {
  //      // `match[1]` contains the captured group (the part after '@')
  //      mentions.push(match[1]);
  //}
}
