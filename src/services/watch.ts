import chokidar from 'chokidar';

const BLOG_DIR = './src/components/blog'

const blogWatcher = chokidar.watch(BLOG_DIR, { persistent: true, ignoreInitial: true })
  .on('add', (path: string) => {
    console.log(`File ${path} has been added`)
  })
  .on('change', (path: string) => {
    console.log(`File ${path} has been added`)
  })
  .on('remove', (path: string) => {
    console.log(`File ${path} has been added`)
  });
