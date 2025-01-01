import { LIVESERVER_URL, NEOCITIES_URL, STATIC_DIR } from "@lib/constants";
import { addToTempMap } from "@lib/utils/files";
import { collectBlogData } from "./components/blogData";
import { Blog } from "@lib/types"
import { logger } from "@lib/utils/logging"
import fs from 'fs'

import minimist from "minimist";
import { createBlogList } from "./components/blogList";
import { buildComponents } from "./components/componentBuilder";

const args = minimist(process.argv.slice(2));
const isDebug = args.debug === true;
const websiteUrl = isDebug ? LIVESERVER_URL : NEOCITIES_URL;

export function build(): void {

  logger.info("Build service is run...")

  const blogs: Blog[] = collectBlogData(websiteUrl)
  addToTempMap("blogFrontmatter", "blogFrontmatter.json", JSON.stringify(blogs))

  const blogList = createBlogList(blogs)
  addToTempMap("blogList", "blogList.html", blogList)

  buildComponents()

}


build();
