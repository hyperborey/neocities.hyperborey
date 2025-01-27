import { logger } from "@lib/utils/logging"
import { blogManager } from "@managers/BlogManager";
import { storageManager } from "@managers/StorageManager";

export function build(): void {

  logger.info("Build service is run...")

  storageManager.registerStaticFiles()
  //storageManager.buildAllComponents()
  //blogManager.createBlogListComponent()

  //storageManager.buildStatic()
  //blogManager.buildAllBlogs()

}

if (require.main === module) {
  build();
}
