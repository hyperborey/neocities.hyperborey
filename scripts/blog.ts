import { log, warn } from "console";
import * as fs from "fs";
import * as path from "path"

const blog_dir = "./blog/"
const public_dir = "./public/"

const template_path = "./scripts/components/post_template.html"
const template_blog = /@blog/
const template_title = /@title/
const template_date = /@date/

const property_regex = /^(\w+):\s*(.+)$/gm;
const frontmatter_regex = /^---\n([\s\S]*?)\n---/;
const bold_regex = ""
const italic_regex = ""

// We need to:
// 1) Get the title (not name)
// 2) Get the content of the file
// 3) Create html with the title of the file (otherwise with name of the file)
// 4) Create the html file in the public/blog/
export function parse(md_path: string) {
  let content = fs.readFileSync(blog_dir + md_path, 'utf-8')

  // Properties at the start of the file

  // Extract the YAML content between the --- markers
  const frontmatterMatch = content.match(frontmatter_regex);
  const properties: Record<string, string> = {};

  if (frontmatterMatch) {
    const yamlContent = frontmatterMatch[1];
    let match;

    while ((match = property_regex.exec(yamlContent)) !== null) {
      properties[match[1]] = match[2];
    }
  }

  console.log("Extracted Properties:", JSON.stringify(properties, null, 2));

  content = content.replace(frontmatter_regex, '') // Remove properties from .md file

  // Use template
  const template = fs.readFileSync(template_path, 'utf-8')

  content = template.replace(template_blog, content)
  content = content.replace(template_title, properties["title"])
  content = content.replace(template_date, properties["date"])


  // Finishing step
  const new_path = public_dir + blog_dir + properties["title"].toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(" ", "-") + ".html"

  if (fs.existsSync(new_path)) {
    fs.rmSync(new_path)
    log("File removed!")
  }
  fs.writeFileSync(new_path, content, { flag: 'w' })
  log("File created!")
}

export function parse_all() {
  const files = fs.readdirSync(blog_dir, { recursive: true });

  for (let index = 0; index < files.length; index++) {
    if (path.extname(files[index].toString()) != ".md") {
      warn(`Somehow blog folder has file ${files[index]} which is not a .md file!`)
      continue;
    }

    log(files)
    parse(files[index].toString())

  }
}
