import fs from 'fs';
import { convert } from './md_parser'

async function build() {
  // Is there a public folder?
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public')
    console.log("public folder created");
  } else {
    console.log("public folder already exists");
  }

  const items = ["index.html", "blog.html"]

  for (let i = 0; i < items.length; i++) {
    const element = items[i];

    fs.copyFile("src/" + element, "public/" + element, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

  const blogs = ["test.md"]


  if (!fs.existsSync('public/blog')) {
    fs.mkdirSync('public/blog')
    console.log("public/blog folder created");
  } else {
    console.log("public/blog folder already exists");
  }

  for (let i = 0; i < blogs.length; i++) {
    const element = blogs[i];

    convert(`blog/${element}`)
  }
}

build()

export { build };
