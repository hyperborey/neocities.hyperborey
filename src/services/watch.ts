import chokidar from 'chokidar';
import { createBlogList } from './components/blogList';
import { collectBlogData } from './components/blogData';
import { buildBlog } from './components/blog';
import { CONTENT, PUBLIC, STATIC } from '@lib/constants';
import { build } from './build';
import { logger } from '@lib/utils/logging';
import { buildStatic } from './components/static';
import { ensureDirRemoved } from '@lib/utils/files';

build()
logger.info("The watchers has been deployed...")

// Blogs
chokidar.watch(CONTENT.BLOG.EN, { persistent: true, ignoreInitial: true })
  .on('add', (path: string) => {
    logger.info(`File ${path} has been added`)
    collectBlogData()
    createBlogList()
    buildBlog(path)
  })
  .on('change', (path: string) => {
    logger.info(`File ${path} has been changed`)
    collectBlogData()
    createBlogList()
  })
  .on('remove', (path: string) => {
    logger.info(`File ${path} has been removed`)
    collectBlogData()
    createBlogList()
  });

// Static
chokidar.watch(STATIC.DIR, { persistent: true, ignoreInitial: true })
  .on('add', (path: string) => {
    logger.info(`File ${path} has been added`)
    ensureDirRemoved(PUBLIC.DIR)
    buildStatic()
  })
  .on('change', (path: string) => {
    logger.info(`File ${path} has been changed`)
    ensureDirRemoved(PUBLIC.DIR)
    buildStatic()
  })
  .on('remove', (path: string) => {
    logger.info(`File ${path} has been removed`)
    ensureDirRemoved(PUBLIC.DIR)
    buildStatic()
  });
