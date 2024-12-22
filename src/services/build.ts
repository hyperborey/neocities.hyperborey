import * as files from "@lib/utils/files";
import { Blog } from "@lib/types";
import { getFrontmatter } from "@lib/utils/markdown";

import * as fs from "fs";
import * as path from "path";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const isDebug = args.debug === true;
const websiteUrl = isDebug ? "http://127.0.0.1:40001" : "https://borey.neocities.org";

function build(): void {
  files.mkTemp();  

  // ==========================================================
  // Blog creation
  // ==========================================================

  const blogDir = path.resolve("./src/components/blog")
  const blogList = fs.readdirSync(blogDir, { recursive: true })
  let blogs: Blog[] = []

  for (let i = 0; i < blogList.length; i++) {

    const blogPath = path.join(blogDir, blogList[i].toString());
    const blogString = fs.readFileSync(blogPath)
    const blogProperties = getFrontmatter(blogString.toString())
    
    const newBlog: Blog = {
      properties: blogProperties,
      fileName: blogList[i].toString(),
      urlPath: path.join(websiteUrl, "blog", blogList[i].toString())
    }

    blogs.push(newBlog)
  }
  
  blogs = blogs.sort((a, b) => (b.properties?.date?.getTime() ?? 0) - (a.properties?.date?.getTime() ?? 0));

  console.log(blogs)

  files.rmTemp();
}

build();
