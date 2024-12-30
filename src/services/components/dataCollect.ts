import { BLOG_DIR, BLOG_URL } from "@lib/constants"
import { Blog } from "@lib/types"
import { getFrontmatter } from "@lib/utils/markdown";
import path from "path";

import * as fs from "fs"

// TODO: Сделать эту функцию обрабатывать не только EN посты, но и RU
export function collectBlogData(websiteURL: string): Blog[] {

  const blogDir = fs.readdirSync(BLOG_DIR)
  let blogs = []

  for (let i = 0; i < blogDir.length; i++) {
    const blogFilePath = path.join(BLOG_DIR, blogDir[i])
    const blogFile = fs.readFileSync(blogFilePath, 'utf-8');
    const blogFrontmatter = getFrontmatter(blogFile)
    
    const blog: Blog = {
      fileName: path.resolve(blogFilePath),
      urlPath: path.join(websiteURL, BLOG_URL, blogDir[i]),
      properties: blogFrontmatter
    } 
    
    blogs.push(blog)
  }

  return []

};
