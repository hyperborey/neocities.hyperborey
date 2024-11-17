import chokidar from 'chokidar'
import * as fs from 'fs'
import * as path from 'path'

function copy(f: string) {
  const f_new = path.join('public', f.slice(4))
  fs.cpSync(f, f_new, { recursive: true })
}
const src_watcher = chokidar.watch('src', {
  persistent: true
});


src_watcher
  .on('add',
    (path: string) => {
      console.log(`File ${path} has been added`);
      copy(path);
    })
  .on('change',
    (path: string) => {
      console.log(`File ${path} has been changed`);
      copy(path);
    })
  .on('error', error => console.log(`Watcher error: ${error}`))
