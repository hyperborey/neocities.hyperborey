export const LANG = {
  EN: "en",
  RU: "ru"
} as const

export const REGEX = {
  PROPERTY: /^(\w+):\s*(.+)$/gm,
  FRONTMATTER: /^---\n([\s\S]*?)\n---/,
} as const
