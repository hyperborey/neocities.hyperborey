import chokidar from 'chokidar';
import { CONTENT, PUBLIC, STATIC } from '@lib/constants';
import { build } from './build';
import { logger } from '@lib/utils/logging';
import fs from 'fs'
import path from 'path'

build()
logger.info("The watchers has been deployed...")

// Blogs
chokidar.watch(CONTENT.BLOG.EN, { persistent: true, ignoreInitial: true })
  .on('add', (p: string) => {
    logger.info(`File ${p} has been added`)
  })
  .on('change', (p: string) => {
    logger.info(`File ${p} has been changed`)
  })
  .on('unlink', (p: string) => {
    logger.info(`File ${p} has been removed`)
  });

// Static
chokidar.watch(STATIC.DIR, { persistent: true, ignoreInitial: true })
  .on('add', (p: string) => {
    logger.info(`File ${p} has been added`)
  })
  .on('change', (p: string) => {
    logger.info(`File ${p} has been changed`)
  })
  .on('unlink', (p: string) => {
    logger.info(`File ${p} has been removed`)
  });
