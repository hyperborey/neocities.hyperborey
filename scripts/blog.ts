import { log, warn } from "console";
import * as fs from "fs";
import * as path from "path"

const PATHS = {
  neocities: "https://borey.neocities.org/",
  blog: "./blog/",
  public: "./public/",
  cache: "./.cache/",
  template: "./scripts/components/post_template.html"
} as const

const TEMPLATES = {
  blog: /@blog/,
  title: /@title/,
  date: /@date/,
  blogList: /@blog_list/
} as const

const REGEX = {
  property: /^(\w+):\s*(.+)$/gm,
  frontmatter: /^---\n([\s\S]*?)\n---/,
} as const

interface Properties { // Not used yet
  title?: string
  date?: Date;
  branch?: string // Change later for enum or something
  language?: string // Same here 
}

interface Blog {
  properties?: Record<string, string>
  urlPath?: string
  fileName?: string
}

export function parse(mdPath: string): Blog {
  let blog: Blog = {}
  let content: string | string[] = fs.readFileSync(PATHS.blog + mdPath, 'utf-8')

  // Properties at the start of the file
  // Extract the YAML content between the --- markers
  const frontmatterMatch = content.match(REGEX.frontmatter);
  const properties: Record<string, string> = {}; // TODO: Change it later to use Properties interface

  if (frontmatterMatch) {
    const yamlContent = frontmatterMatch[1];
    let match;

    while ((match = REGEX.property.exec(yamlContent)) !== null) {
      properties[match[1]] = match[2];
    }
  }
  content = content.replace(REGEX.frontmatter, '') // Remove properties from content
  blog.properties = properties

  //
  // Markdown
  //

  content = content.split("\n");
  let isCode: boolean = false;

  for (let index = 0; index < content.length; index++) {
    if (content[index].startsWith("######")) {
      content[index] = `<h6>${content[index].slice(6).trim()}</h6>`; // Remove "######" and wrap in <h6>
    } else if (content[index].startsWith("#####")) {
      content[index] = `<h5>${content[index].slice(5).trim()}</h5>`; // Remove "#####" and wrap in <h5>
    } else if (content[index].startsWith("####")) {
      content[index] = `<h4>${content[index].slice(4).trim()}</h4>`; // Remove "####" and wrap in <h4>
    } else if (content[index].startsWith("###")) {
      content[index] = `<h3>${content[index].slice(3).trim()}</h3>`; // Remove "###" and wrap in <h3>
    } else if (content[index].startsWith("##")) {
      content[index] = `<h2>${content[index].slice(2).trim()}</h2>`; // Remove "##" and wrap in <h2>
    } else if (content[index].startsWith("#")) {
      content[index] = `<h1>${content[index].slice(1).trim()}</h1>`; // Remove "#" and wrap in <h1>

    } else if (content[index] === "") {
      content[index] = "<br>"

    } else if (/^```/.test(content[index])) {  // Checks if the string starts with ```
      if (isCode) {
        content[index] = content[index].replace(/^```/, "</pre>")
        isCode = false
      } else {
        content[index] = content[index].replace(/^```/, "<pre>")
        isCode = true
      }
      log(`isCode is now ${isCode} - ${content[index]}`)
    } else if (isCode) {  // Checks if isCode is true
      console.log("isCode is true");
    } else {
      content[index] = `<p>${content[index]}</p>`
    }

    content[index] = content[index]
      .replace(/\*\*\*(.*?)\*\*\*/g, "<em><strong>$1</strong></em>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\_(.*?)\_/g, "<em>$1</em>")
      .replace(/\`(.*?)\`/g, "<code>$1</code>");

  }


  content = content.join("\n")

  // 
  // Use template
  //

  const template = fs.readFileSync(PATHS.template, 'utf-8')

  content = template
    .replace(TEMPLATES.blog, content)
    .replace(TEMPLATES.title, properties.title)
    .replace(TEMPLATES.date, properties.date)

  //
  // Finishing step
  //

  const newUrl = path.join(
    PATHS.neocities,
    PATHS.blog,
    `${properties.title.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    }`
  )

  blog.urlPath = newUrl

  const fileName = `${properties.title.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    }.html`

  blog.fileName = fileName

  const newPath = path.join(
    PATHS.public,
    PATHS.blog,
    `${properties.title.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    }.html`
  );


  if (fs.existsSync(newPath)) {
    fs.rmSync(newPath)
  }
  fs.writeFileSync(newPath, content, { flag: 'w' })

  return blog
}

export function createBlogList(blogs: Blog[]) {
  let template: string = fs.readFileSync("./scripts/components/blog_list.html", 'utf-8')

  let list: string = "";

  for (let index = 0; index < blogs.length; index++) {
    const blog = blogs[index];

    list = list + `<li>${blog?.properties?.date.toString()} - <a href="${blog?.fileName}">${blog?.properties?.title}</a></li>\n`

  }

  list = "<ul>\n" + list + "</ul>\n";

  const content = template
    .replace(TEMPLATES.blogList, list)


  if (fs.existsSync("./public/blog/index.html")) {
    fs.rmSync("./public/blog/index.html")
  }
  fs.writeFileSync("./public/blog/index.html", content, { flag: 'w' })

  log(list)
}

export function parseAll() {
  const files = fs.readdirSync(PATHS.blog, { recursive: true });
  let blogs: Blog[] = []

  if (!fs.existsSync(PATHS.public + PATHS.blog)) {
    fs.mkdirSync(PATHS.public + PATHS.blog, { recursive: true });
  }

  for (let index = 0; index < files.length; index++) {
    if (path.extname(files[index].toString()) != ".md") {
      warn(`Somehow blog folder has file ${files[index]} which is not a.md file!`)
      continue;
    }

    log(files)
    blogs.push(parse(files[index].toString()))

  }

  createBlogList(blogs)

  console.log(blogs)
}
