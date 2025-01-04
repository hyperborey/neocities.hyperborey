import { CONTENT, REGEX } from "@lib/constants";
import { logger } from "@lib/utils/logging";
import fs from 'fs'
import path from 'path';

export function buildBlogs() {
  const blogs = fs.readdirSync(CONTENT.BLOG.EN)


  for (let i = 0; i < blogs.length; i++) {
    const blogFile = blogs[i];
    const blogPath = path.join(CONTENT.BLOG.EN, blogFile)
    let blogContent: string | string[] = fs.readFileSync(blogPath, 'utf8')

    blogContent.replace(REGEX.FRONTMATTER, "")
    blogContent = blogContent.split('\n')

    logger.debug(blogContent)

    for (let i = 0; i < blogContent.length; i++) {

      blogContent[i] = blogContent[i].replace(REGEX.BOLD_ITALIC.pattern, REGEX.BOLD_ITALIC.replacement)
      blogContent[i] = blogContent[i].replace(REGEX.ITALIC.pattern, REGEX.ITALIC.replacement)
      blogContent[i] = blogContent[i].replace(REGEX.BOLD.pattern, REGEX.BOLD.replacement)
      blogContent[i] = blogContent[i].replace(REGEX.CODE.pattern, REGEX.CODE.replacement)
      blogContent[i] = blogContent[i].replace(REGEX.EMPTY_LINE.pattern, REGEX.EMPTY_LINE.replacement)

    }

  }
}

export function buildBlog() {

}
