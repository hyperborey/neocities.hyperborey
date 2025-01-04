import { CONTENT, URLS } from "@lib/constants"
import { Blog } from "@lib/types"
import { getFrontmatter } from "@lib/utils/markdown";
import path from "path";

import * as fs from "fs"
import { logger } from "@lib/utils/logging";

// TODO: Сделать эту функцию обрабатывать не только EN посты, но и RU
export function collectBlogData(): Blog[] {

  const blogDir = fs.readdirSync(CONTENT.BLOG.EN)
  logger.info(`Found ${blogDir.length} blog files: ${blogDir}`)

  let blogs = []

  for (let i = 0; i < blogDir.length; i++) {
    const blogFilePath = path.join(CONTENT.BLOG.EN, blogDir[i])
    const blogFile = fs.readFileSync(blogFilePath, 'utf-8');
    const blogFrontmatter = getFrontmatter(blogFile)

    const newUrlPath = new URL(`${URLS.BLOG.EN}/${blogFrontmatter?.title?.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')}`)


    const blog: Blog = {
      fileName: blogDir[i],
      urlPath: newUrlPath,
      properties: blogFrontmatter
    }

    blogs.push(blog)
  }

  logger.trace(blogs)
  return blogs

};
