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
  COMPONENT: /@(\w+)/g,
} as const;
