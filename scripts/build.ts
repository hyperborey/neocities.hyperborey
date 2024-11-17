import { log, error } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import { parse_all } from "./blog"

const src_dir = 'src/'
const public_dir = 'public/'

function main() {
  const files = fs.readdirSync(src_dir, { recursive: true });

  if (!fs.existsSync(public_dir)) {
    fs.mkdirSync(public_dir);
  }

  // File copy
  for (let index = 0; index < files.length; index++) {
    fs.cpSync(src_dir + files[index], public_dir + files[index], { recursive: true })
  }

  parse_all()
}

main();
