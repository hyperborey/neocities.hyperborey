import { CONTENT, PUBLIC, REGEX, SRC } from "@lib/constants";
import { logger } from "@lib/utils/logging";
import { getFromTemp, insertComponent } from "@lib/utils/files";
import { Blog } from "@lib/types";

import fs from 'fs'
import path from 'path';

export function buildBlogs() {
  const blogs = fs.readdirSync(CONTENT.BLOG.EN)

  for (let i = 0; i < blogs.length; i++) {
    const blogFile = blogs[i];
    const blogPath = path.join(CONTENT.BLOG.EN, blogFile)
    let blogContent: string | string[] = fs.readFileSync(blogPath, 'utf8')

    // Get the title from the temp
    const blogsFrontmatterRaw = getFromTemp('blogData', 'data')

    if (!blogsFrontmatterRaw) {
      throw new Error(`blogsFrontmatter was not found!`)
    }

    const blogsFrontmatter = JSON.parse(blogsFrontmatterRaw)
    const blog = blogsFrontmatter.find((blog: Blog) =>
      path.parse(blog.fileName).name === path.parse(blogFile).name
    );

    // Remove front matter from the .md file
    blogContent = blogContent.replace(REGEX.FRONTMATTER, "")

    blogContent = blogContent.split('\n')

    // Inline markdown
    let states = {
      codeBlock: false
    }

    for (let j = 0; j < blogContent.length; j++) {

      let line = blogContent[j].trim()

      const checks = {
        header: line.startsWith('#'),
        startCodeBlock: line.startsWith('```')
      }

      logger.debug('line')
      logger.debug(line)
      logger.debug('checks')
      logger.debug(checks)
      logger.debug('states')
      logger.debug(states)

      if (checks.startCodeBlock && !states.codeBlock) { // Start of the codeblock
        logger.debug(`before ${line}`)
        logger.error(line.match(REGEX.CODE_BLOCK_START.pattern))
        line = line.replace(REGEX.CODE_BLOCK_START.pattern, REGEX.CODE_BLOCK_START.replacement)
        states.codeBlock = true
        logger.debug(`after ${line}`)

      } else if (checks.startCodeBlock && states.codeBlock) { // End of the codeblock
        line = line.replace(REGEX.CODE_BLOCK_END.pattern, REGEX.CODE_BLOCK_END.replacement)
        states.codeBlock = false

      } else if (states.codeBlock) { // Codeblock

      } else if (checks.header) {
        line = line
          .replace(REGEX.HEADERS.H6.pattern, REGEX.HEADERS.H6.replacement)
          .replace(REGEX.HEADERS.H5.pattern, REGEX.HEADERS.H5.replacement)
          .replace(REGEX.HEADERS.H4.pattern, REGEX.HEADERS.H4.replacement)
          .replace(REGEX.HEADERS.H3.pattern, REGEX.HEADERS.H3.replacement)
          .replace(REGEX.HEADERS.H2.pattern, REGEX.HEADERS.H2.replacement)
          .replace(REGEX.HEADERS.H1.pattern, REGEX.HEADERS.H1.replacement)
      }

      // Inline markdown
      if (!states.codeBlock) {
        line = line
          .replace(REGEX.BOLD_ITALIC.pattern, REGEX.BOLD_ITALIC.replacement)
          .replace(REGEX.ITALIC.pattern, REGEX.ITALIC.replacement)
          .replace(REGEX.BOLD.pattern, REGEX.BOLD.replacement)
          .replace(REGEX.CODE.pattern, REGEX.CODE.replacement)
      }



      blogContent[j] = line
    }

    blogContent = blogContent.join('\n')

    if (!fs.existsSync(PUBLIC.BLOG.EN)) {
      fs.mkdirSync(PUBLIC.BLOG.EN, { recursive: true })
    }

    const blogTemplate = fs.readFileSync(path.join(SRC.TEMPLATES, "blog.html"), 'utf8')
    const blogPage = insertComponent(blogTemplate, "blog", blogContent)

    fs.writeFileSync(path.join(PUBLIC.BLOG.EN, `${blog?.properties?.titleSlug || "null"}.html`), blogPage, 'utf8')

  }
}

export function buildBlog() {

}
