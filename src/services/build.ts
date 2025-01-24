
import { logger } from "@lib/utils/logging"
import { BlogManager } from "@managers/BlogManager";
import { StorageManager } from "@managers/StorageManager";

export function build(): void {
  const storageManager: StorageManager = new StorageManager();
  const blogManager: BlogManager = new BlogManager(storageManager)

  logger.info("Build service is run...")

  // This is even worse than previous code I've wrote, what the fuck
  storageManager.buildAllComponents()
  blogManager.createBlogListComponent()

  storageManager.buildStatic()
  blogManager.buildAllBlogs()

}

if (require.main === module) {
  build();
}
