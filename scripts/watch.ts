import chokidar from 'chokidar';
import { build } from "./build";
import fs from 'fs';
import path from 'path';

build();

const blog_watcher = chokidar.watch('blog', {
  persistent: true,
  ignoreInitial: true
});

const static_watcher = chokidar.watch('src', {
  persistent: false,
  ignoreInitial: true
})

blog_watcher
  .on('add', (path: string) => console.log(`File ${path} has been added`))
  .on('change', (path: string) => console.log(`File ${path} has been changed`))
  .on('unlink', (path: string) => console.log(`File ${path} has been removed`))

static_watcher
  .on('add', (path: string) => console.log(`File ${path} has been added`))
  .on('change', (file_path: string) => {
    console.log(`File ${file_path} has been changed`)
    const file_name = path.basename(file_path);
    fs.copyFileSync(file_path, `public/${file_name}`)
  })
  .on('unlink', (path: string) => console.log(`File ${path} has been removed`))
