import minimist from "minimist";
import path from "path";
import { URL } from "url"

const args = minimist(process.argv.slice(2));
const isDebug = args.debug === true;

export const BASE_URL = isDebug
  ? new URL("http://127.0.0.1:40001")
  : new URL("https://borey.neocities.org");

export const URLS = {
  MAIN: new URL("./index.html", BASE_URL),
  BLOG: {
    INDEX: new URL("./blog/index.html", BASE_URL),
    EN: new URL("./blog/en", BASE_URL),
    RU: new URL("./blog/ru", BASE_URL)
  }
}

export const TEMP = {
  DIR: path.resolve("./.temp"),
  MAP: path.resolve("./.temp/map.json")
}

export const CONTENT = {
  DIR: path.resolve("./content"),
  BLOG: {
    EN: path.resolve("./content/blog/en"),
    RU: path.resolve("./content/blog/ru")
  }
}

export const PUBLIC = {
  DIR: path.resolve("./public"),
  BLOG: {
    DIR: path.resolve("./src/public/blog"),
    PAGE: path.resolve("./src/public/blog/index.html")
  }
}

export const STATIC = {
  DIR: path.resolve("./src/static"),
  BLOG: {
    DIR: path.resolve("./src/static/blog"),
    PAGE: path.resolve("./src/static/blog/index.html")
  }
};

export const LANG = {
  EN: "en",
  RU: "ru"
}

export const REGEX = {
  BOLD_ITALIC: {
    pattern: /\*\*\*(.*?)\*\*\*/g,
    replacement: "<strong><em>$1</em></strong>",
  },
  BOLD: {
    pattern: /\*\*(.*?)\*\*/g,
    replacement: "<strong>$1</strong>",
  },
  ITALIC: {
    pattern: /\*(.*?)\*/g,
    replacement: "<em>$1</em>",
  },
  CODE: {
    pattern: /\`(.*?)\`/g,
    replacement: "<code>$1</code>",
    class: "codeblock" // TODO: This is example, I'll delete it later
  },
  CODE_BLOCK_START: {
    pattern: /^```(\w*)\n/,
    replacement: "<pre><code>",
  },
  CODE_BLOCK_END: {
    pattern: /^```/,
    replacement: "</code></pre>",
  },
  EMPTY_LINE: {
    pattern: /^$/,
    replacement: "<br>",
  },
  HEADERS: {
    H6: {
      pattern: /^######\s*(.+)$/,
      replacement: "<h6>$1</h6>",
    },
    H5: {
      pattern: /^#####\s*(.+)$/,
      replacement: "<h5>$1</h5>",
    },
    H4: {
      pattern: /^####\s*(.+)$/,
      replacement: "<h4>$1</h4>",
    },
    H3: {
      pattern: /^###\s*(.+)$/,
      replacement: "<h3>$1</h3>",
    },
    H2: {
      pattern: /^##\s*(.+)$/,
      replacement: "<h2>$1</h2>",
    },
    H1: {
      pattern: /^#\s*(.+)$/,
      replacement: "<h1>$1</h1>",
    },
  },

  COMPONENT: /\[component:(.*?)\]/,
  PROPERTY: /^(\w+):\s*(.+)$/gm,
  FRONTMATTER: /^---\n([\s\S]*?)\n---/,
};
