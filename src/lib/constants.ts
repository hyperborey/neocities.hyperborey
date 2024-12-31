import path from "path";
import { URL } from "url"

// HOST
export const LIVESERVER_URL = new URL("http://127.0.0.1:40001")
export const NEOCITIES_URL = new URL("https://borey.neocities.org")


// WEBSITE URLS
// (they go after HOST url)
export const BLOG_URL = "blog"

// PATHS
export const TEMP_DIR = path.resolve(".temp/")
export const TEMP_MAP = path.join(TEMP_DIR, "map.json")

// RESOURCES
export const BLOG_DIR = path.resolve("content/blog/en") // HACK: Поменять потом на RU и EN

// STATIC
export const STATIC_DIR = path.resolve("./src/static")
export const STATIC_BLOG_DIR = path.join(STATIC_DIR, "blog")
export const STATIC_BLOG_PAGE = path.join(STATIC_DIR, STATIC_BLOG_DIR, "index.html")

