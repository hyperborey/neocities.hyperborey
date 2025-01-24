import chokidar from 'chokidar';
import { createBlogList } from './components/blogList';
import { collectBlogData } from './components/blogData';
import { buildBlog } from './components/blog';
import { CONTENT, PUBLIC, STATIC } from '@lib/constants';
import { build } from './build';
import { logger } from '@lib/utils/logging';
import { buildStatic } from './components/static';
import { ensureDirRemoved } from '@lib/utils/files';
import fs from 'fs'
import path from 'path'

build()
logger.info("The watchers has been deployed...")

// Blogs
chokidar.watch(CONTENT.BLOG.EN, { persistent: true, ignoreInitial: true })
  .on('add', (p: string) => {
    logger.info(`File ${p} has been added`)
    collectBlogData()
    createBlogList()
    buildBlog(p)
  })
  .on('change', (p: string) => {
    logger.info(`File ${p} has been changed`)
    collectBlogData()
    createBlogList()
  })
  .on('unlink', (p: string) => {
    logger.info(`File ${p} has been removed`)
    collectBlogData()
    createBlogList()
  });

// Static
chokidar.watch(STATIC.DIR, { persistent: true, ignoreInitial: true })
  .on('add', (p: string) => {
    logger.info(`File ${p} has been added`)
    buildStatic()
  })
  .on('change', (p: string) => {
    logger.info(`File ${p} has been changed`)
    buildStatic()
  })
  .on('unlink', (p: string) => {
    logger.info(`File ${p} has been removed`)
    fs.rmSync(path.join(PUBLIC.DIR, path.basename(p)))
    buildStatic()
  });
