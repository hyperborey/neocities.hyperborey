// TODO: Change Host, Paths, Static to enums

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
export const PUBLIC_DIR = path.resolve("public/")

// STATIC
export const STATIC_DIR = path.resolve("./src/static")
export const STATIC_BLOG_DIR = path.join(STATIC_DIR, "blog")
export const STATIC_BLOG_PAGE = path.join(STATIC_DIR, STATIC_BLOG_DIR, "index.html")

// ENUMS
export const LANG = {
  EN: "en",
  RU: "ru"
} as const

export const REGEX = {
  PROPERTY: /^(\w+):\s*(.+)$/gm,
  FRONTMATTER: /^---\n([\s\S]*?)\n---/,
  BOLD_ITALIC: /\*\*\*(.*?)\*\*\*/g,
  BOLD: /\*\*(.*?)\*\*/g,
  ITALIC: /\*(.*?)\*/g,
  UNDERLINE_ITALIC: /\_(.*?)\_/g,
  CODE: /\`(.*?)\`/g,
  CODE_BLOCK_START: /^```/,
  EMPTY_LINE: /^$/,
  HEADERS: {
    H6: /^######\s*(.+)$/,
    H5: /^#####\s*(.+)$/,
    H4: /^####\s*(.+)$/,
    H3: /^###\s*(.+)$/,
    H2: /^##\s*(.+)$/,
    H1: /^#\s*(.+)$/,
  },
  BR: /^$/,
  COMPONENT: /\[component:(.*?)\]/,
} as const;
