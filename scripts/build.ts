import { log, error } from 'console';
import * as fs from 'fs';
import * as path from 'path';

const src_dist = 'src/'
const public_dist = 'public/'

function main() {
  const files = fs.readdirSync(src_dist, { recursive: true });

  if (!fs.existsSync(public_dist)) {
    fs.mkdirSync(public_dist);
  }
  
  // File copy
  for (let index = 0; index < files.length; index++) {
    fs.cpSync(src_dist + files[index], public_dist + files[index], { recursive: true })
  }
}

main();
