import { LIVESERVER_URL, NEOCITIES_URL } from "@lib/constants";
import { addToTempMap } from "@lib/utils/files";
import { collectBlogData } from "./components/dataCollect";
import { Blog } from "@lib/types"
import { logger } from "@lib/utils/logging"

import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const isDebug = args.debug === true;
const websiteUrl = isDebug ? LIVESERVER_URL : NEOCITIES_URL;

export function build(): void {
  
  logger.info("Build service is run...")

  const blogs: Blog[] = collectBlogData(websiteUrl)

  addToTempMap("blogFrontmatter", "blogFrontmatter.json", JSON.stringify(blogs))

}


build();
