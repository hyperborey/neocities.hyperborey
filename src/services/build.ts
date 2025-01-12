import { addToTemp } from "@lib/utils/files";
import { collectBlogData } from "./components/blogData";
import { logger } from "@lib/utils/logging"

import { createBlogList } from "./components/blogList";
import { buildStatic } from "./components/static";
import { buildBlogs } from "./components/blog";
import { buildSidebar } from "./components/sidebar";
import { buildHeader } from "./components/header";

export function build(): void {

  logger.info("Build service is run...")

  // Common components
  buildSidebar()
  buildHeader()

  // Blogs
  collectBlogData()
  createBlogList()
  buildBlogs()

  // Static
  buildStatic()

}


build();
