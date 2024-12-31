import { BLOG_DIR, BLOG_URL } from "@lib/constants"
import { Blog } from "@lib/types"
import { getFrontmatter } from "@lib/utils/markdown";
import path from "path";

import * as fs from "fs"
import { logger } from "@lib/utils/logging";

// TODO: Сделать эту функцию обрабатывать не только EN посты, но и RU
export function collectBlogData(websiteURL: URL): Blog[] {

  const blogDir = fs.readdirSync(BLOG_DIR)
  logger.info(`Found ${blogDir.length} blog files: ${blogDir}`)

  let blogs = []

  for (let i = 0; i < blogDir.length; i++) {
    const blogFilePath = path.join(BLOG_DIR, blogDir[i])
    const blogFile = fs.readFileSync(blogFilePath, 'utf-8');
    const blogFrontmatter = getFrontmatter(blogFile)

    const blog: Blog = {
      fileName: path.resolve(blogFilePath),
      urlPath: new URL(`${BLOG_URL}/${blogDir[i]}`, websiteURL),
      properties: blogFrontmatter
    }

    blogs.push(blog)
  }

  logger.trace(blogs)
  return blogs

};
