import { CONTENT } from "@lib/constants";
import { logger } from "@lib/utils/logging";
import { blogManager } from "@managers/BlogManager";
import { storageManager } from "@managers/StorageManager";
import path from "path"


export function build(): void {

  logger.start("Build service is run...")

  blogManager.updateAllBlogsInfo()
  blogManager.removeBlogInfo(path.join(CONTENT.BLOG.EN, "2024-11-18.md"))

  //storageManager.registerStaticFiles()
  //storageManager.buildAllComponents()
  //blogManager.createBlogListComponent()

  //storageManager.buildStatic()
  //blogManager.buildAllBlogs()

}

if (require.main === module) {
  build();
}
