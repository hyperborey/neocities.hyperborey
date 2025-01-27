import { CONTENT, PUBLIC, REGEX, SRC, URLS } from "@lib/constants";
import { storageManager } from "./StorageManager";
import { ensureDirExists, getFirstWords, isFile } from "@lib/utils/files";
import { logger } from "@lib/utils/logging";

import fs from 'fs'
import yaml from 'yaml'
import slugify from "slugify";
import path from 'path'
import dayjs from "dayjs";

interface Blog {
  properties: Properties | null
  urlTitleSlug: string
  urlPath: URL
  fileName: string
  publicFilePath: string
  contentFilePath: string
}

interface Properties {
  title?: string
  date?: Date;
  branch?: string // Change later for enum or something
  language?: string
  tags?: string[]
}

export class BlogManager {
  private blogs: Blog[]

  constructor() {
    this.blogs = []
    this.updateAllBlogsInfo()
  }

  /**
   * Retrieves all available blogs from the CONTENT.BLOG.DIR directory.
   * @returns An array of Blog structures containing information about each blog.
   */
  public updateAllBlogsInfo() {
    const blogList = fs.readdirSync(CONTENT.BLOG.DIR, { encoding: 'utf8', recursive: true })
    let allBlogsInfo: Blog[] = []

    logger.info(blogList)

    for (let i = 0; i < blogList.length; i++) {
      const blogPath = path.join(CONTENT.BLOG.DIR, blogList[i]);

      if (!isFile(blogPath)) {
        continue
      }

      const blogInfo = this.getBlogInfo(blogPath)
      if (blogInfo) {
        allBlogsInfo.push(blogInfo)
      }
    }

    this.blogs = allBlogsInfo
  }


  public updateBlogInfo(blogPath: string) {
    const blogInfo = this.getBlogInfo(blogPath)
    const blogFileName = path.basename(blogPath)

    if (!blogInfo) {
      return
    }

    const index = this.blogs.findIndex(blog => blog.fileName === blogFileName);

    if (index !== -1) {
      this.blogs[index] = blogInfo;
    } else {
      this.blogs.push(blogInfo);
    }

  }

  /**
   * Takes a blog path and returns the Blog structure with blog info, or undefined if the blog is empty.
   * @param blogPath - The path to the blog.
   * @returns Blog info or undefined if empty.
   */
  public getBlogInfo(blogPath: string): Blog | undefined {
    const blogContent = fs.readFileSync(blogPath, 'utf8')

    if (!blogContent) {
      return undefined
    }

    let blog: Partial<Blog> = {}

    // It just works, ok?
    const frontmatter = blogContent.match(REGEX.FRONTMATTER)
    if (frontmatter) {
      blog.properties = yaml.parse(frontmatter[1]) as Properties
    } else {
      blog.properties = null
    }

    if (blog.properties?.title) {
      blog.urlTitleSlug = slugify(blog.properties.title, { strict: true, lower: true })
    } else {
      blog.urlTitleSlug = slugify(getFirstWords(blogContent, 5).join('-'), { strict: true, lower: true })
    }

    if (blog.properties?.language === 'ru') {
      blog.urlPath = new URL(blog.urlTitleSlug, URLS.BLOG.EN)
    } else {
      blog.urlPath = new URL(blog.urlTitleSlug, URLS.BLOG.RU)
    }

    blog.fileName = path.basename(blogPath)
    blog.contentFilePath = blogPath

    if (blog.properties?.language === 'ru') {
      blog.publicFilePath = path.join(PUBLIC.BLOG.RU, `${path.parse(blog.fileName).name}.html`)
    } else {
      blog.publicFilePath = path.join(PUBLIC.BLOG.EN, `${path.parse(blog.fileName).name}.html`)
    }

    return blog as Blog
  }

  public createBlogListComponent() {
    let table: string[] = []

    for (let i = 0; i < this.blogs.length; i++) {
      const blog = this.blogs[i];
      const date = dayjs(blog.properties?.date).format('D/M/YYYY')

      table.push(
        `<tr>
        <td>
          <a href="${blog.urlPath}.html">
            ${blog.properties?.title}
          </a>
        </td>
        <td>
          ${date}
        </td>
      </tr>`)
    }

    const component = `
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Date</th>
      </tr>
    <tbody>
      ${table.join('\n')}
    </tbody>
  </table>
  `

    storageManager.addToTemp("blogList", component, "components")

  }

  public buildAllBlogs() {
    const blogs = fs.readdirSync(CONTENT.BLOG.EN)

    for (let i = 0; i < blogs.length; i++) {
      const blogPath = path.join(CONTENT.BLOG.EN, blogs[i])
      this.buildBlog(blogPath)
    }
  }

  /**
   * Builds a blog by converting a `.md` file from the specified path into an `.html` file.
   * The resulting `.html` file is then written to the directory defined by `PUBLIC.BLOG`.
   * 
   * @param blogPath - The path to the `.md` file to be processed and converted into an `.html` file.
   */
  public buildBlog(blogPath: string) {

    logger.info(`blogs ${this.blogs}`)

    const blogName = path.basename(blogPath)
    let blogContent: string | string[] = fs.readFileSync(blogPath, 'utf8')

    if (blogContent === "") {
      logger.error(`Blog ${blogName} is empty!`)
      return
    }

    const blog = this.blogs.find((blog: Blog) =>
      path.parse(blog.fileName).name === path.parse(blogName).name
    );

    // Remove front matter from the .md file
    blogContent = blogContent.replace(REGEX.FRONTMATTER, "")
    blogContent = blogContent.split('\n')

    let states = {
      codeBlock: false
    }

    for (let j = 0; j < blogContent.length; j++) {

      let line = blogContent[j].trim()

      const checks = {
        header: line.startsWith('#'),
        startCodeBlock: line.startsWith('```')
      }

      if (line === "") {
        blogContent[j] = "<br>"
        continue
      }

      if (checks.startCodeBlock && !states.codeBlock) { // Start of the codeblock
        line = line.replace(REGEX.CODE_BLOCK_START.pattern, REGEX.CODE_BLOCK_START.replacement)
        states.codeBlock = true

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

      if (!checks.header && !checks.header) {
        line = `<p>${line}</p>`
      }

      blogContent[j] = line
    }

    blogContent = blogContent.join('\n')

    ensureDirExists(PUBLIC.BLOG.DIR)

    let blogPage = fs.readFileSync(path.join(SRC.TEMPLATES, "blog.html"), 'utf8')


    blogPage = storageManager.insertAllComponents(blogPage)
    blogPage = storageManager.insertComponent(blogPage, "blog", { componentContent: blogContent })
    blogPage = storageManager.insertComponent(blogPage, "blogTitle", { componentContent: blog?.properties?.title || blog?.urlTitleSlug || "null" })

    fs.writeFileSync(path.join(PUBLIC.BLOG.DIR, `${blog?.urlTitleSlug || "null"}.html`), blogPage, 'utf8')
  }
}

export const blogManager = new BlogManager();
