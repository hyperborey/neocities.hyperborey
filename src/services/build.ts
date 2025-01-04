import { addToTempMap } from "@lib/utils/files";
import { collectBlogData } from "./components/blogData";
import { Blog } from "@lib/types"
import { logger } from "@lib/utils/logging"

import { createBlogList } from "./components/blogList";
import { buildComponents } from "./components/componentBuilder";
import { buildBlogs } from "./components/blog";

export function build(): void {

  logger.info("Build service is run...")

  const blogs: Blog[] = collectBlogData()
  addToTempMap("blogFrontmatter", JSON.stringify(blogs))

  const blogList = createBlogList(blogs)
  addToTempMap("blogList", blogList)

  buildComponents()
  //buildBlogs()

}


build();
