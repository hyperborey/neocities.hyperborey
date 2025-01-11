import { CONTENT, URLS, REGEX } from "@lib/constants"
import { Blog, Properties } from "@lib/types"
import { logger } from "@lib/utils/logging";

import * as fs from "fs"
import * as yaml from "yaml"
import path from "path";
import slugify from "slugify";
import { addToTemp } from "@lib/utils/files";

/**
 * Loads and parses a YAML data at the beggining of the markdown file.
 * @param {string} content The string from which frontmatter should get extracted
 * @returns {Properties | null} The parsed YAML data as a Properties interface, null if YAML data is not found.
 */
export function getFrontmatter(content: string): Properties | null {

  const frontmatter = content.match(REGEX.FRONTMATTER)

  if (!frontmatter) {
    return null
  }
  
  let properties = yaml.parse(frontmatter[1]) as Properties;

  properties.date &&= new Date(properties.date);
  properties.title && (properties.titleSlug = slugify(properties.title, { lower: true, strict: true }));

  return properties
}

/**
 * Collects blog data from the path specified by the `CONTENT.BLOG.EN` constant,
 * processes it, and writes the data as an array of `Blog` types into the `.temp` directory.
 * 
 *  @see CONTENT.BLOG.EN - The constant defining the path to the blog content.
 *  @see Blog - The type representing blog data.
 */
export function collectBlogData(): void {

  const blogDir = fs.readdirSync(CONTENT.BLOG.EN)
  logger.info(`Found ${blogDir.length} blog files: ${blogDir}`)

  let blogs = []

  for (let i = 0; i < blogDir.length; i++) {
    const blogFilePath = path.join(CONTENT.BLOG.EN, blogDir[i])
    const blogFile = fs.readFileSync(blogFilePath, 'utf-8');
    const blogFrontmatter = getFrontmatter(blogFile)
    const newUrlPath = new URL(`${URLS.BLOG.EN}/${blogFrontmatter?.titleSlug || "null"}`);

    const blog: Blog = {
      fileName: blogDir[i],
      urlPath: newUrlPath,
      properties: blogFrontmatter
    }

    blogs.push(blog)
  }

  addToTemp("blogdata", JSON.stringify(blogs), "data")

};
