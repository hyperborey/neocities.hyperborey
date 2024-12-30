import path from "path";

// HOST
export const LIVESERVER_URL = "http://127.0.0.1:40001"
export const NEOCITIES_URL = "https://borey.neocities.org"

// WEBSITE URLS
// (they go after HOST url)
export const BLOG_URL = "blog"

// PATHS
export const TEMP_DIR = path.resolve(".temp/")
export const TEMP_MAP = path.join(TEMP_DIR, "map.json")

// RESOURCES
export const BLOG_DIR = path.resolve("content/blog/en") // HACK: Поменять потом на RU и EN

// STATIC
export const STATIC_DIR = path.resolve("./static")
export const STATIC_BLOG_DIR = path.join(STATIC_DIR, "blog")

