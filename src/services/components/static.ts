import { REGEX, STATIC, PUBLIC } from '@lib/constants';
import { ensureDirExists, getFromTemp, insertComponent, isFile } from '@lib/utils/files';
import { logger } from '@lib/utils/logging';
import fs from 'fs'
import path from 'path'

export function buildStatic() {

  const staticFiles = fs.readdirSync(STATIC.DIR, { recursive: true })

  for (let i = 0; i < staticFiles.length; i++) {
    const file = staticFiles[i].toString();

    // Basically copies all folders from STATIC to PUBLIC
    if (!isFile(file.toString())) {
      ensureDirExists(path.join(PUBLIC.DIR, file))
      continue
    }

    let fileContent = fs.readFileSync(path.join(STATIC.DIR, file), 'utf8').toString()

    fileContent = fileContent.replace(REGEX.COMPONENT, (match, componentName) => {
      return insertComponent(match, componentName);
    });

    fs.writeFileSync(path.join(PUBLIC.DIR, file), fileContent, 'utf8')

  }

  //while ((match = regex.exec(text)) !== null) {
  //      // `match[1]` contains the captured group (the part after '@')
  //      mentions.push(match[1]);
  //}
}
