import { LIVESERVER_URL, NEOCITIES_URL } from "@lib/constants";
import { addToTempMap } from "@lib/utils/files";
import { collectBlogData } from "./components/dataCollect";
import { Blog } from "@lib/types"
import { logger } from "@lib/logging"

import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const isDebug = args.debug === true;
const websiteUrl = isDebug ? LIVESERVER_URL : NEOCITIES_URL;

export function build(): void {

  logger.info('This is an info message'); // TODO: Разобраться с логгером
  logger.error('This is an error message');

  const blogs: Blog[] = collectBlogData(websiteUrl)

}


build();
