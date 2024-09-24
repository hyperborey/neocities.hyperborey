import fs from "fs";
import path from "path";

function convert(file_path: string) {

  try {
    const data = fs.readFileSync(file_path, 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }

  let text: string = fs.readFileSync(file_path, { encoding: 'utf8' });

  const lines = text.split("\n")
  if (lines[0].startsWith("---")) {
    console.log("YAML")
  } else {
    console.log("No YAML")
  }

  // TODO: change this crap to also determine if line should be <p> or no
  // also need a cleanup and separate function
  for (let i = 0; i < lines.length; i++) {

    lines[i] = lines[i].replace(/\*\*\*([^*]*)\*\*\*/g, "<i><b>$1</b></i>");
    lines[i] = lines[i].replace(/\*\*([^*]*)\*\*/g, "<b>$1</b>");
    lines[i] = lines[i].replace(/\*([^*]*)\*/g, "<i>$1</i>");

    lines[i] = `<p>${lines[i]}</p>`

    console.log(`new line is ${lines[i]}`)
  }

  console.log(`lines is ${lines}`)

  text = lines.join("\n")

  console.log(text)

  let template: string = fs.readFileSync("blog/template.html", { encoding: 'utf8' })
  template = template.replace(/\{\{\s*main\s*\}\}/, text)

  if (fs.existsSync(`public/blog/${path.basename(file_path, ".md")}.html`)) {
    fs.writeFileSync(`public/blog/${path.basename(file_path, ".md")}.html`, template, { flag: "w" });
  } else {
    fs.writeFileSync(`public/blog/${path.basename(file_path, ".md")}.html`, template, { flag: "wx" });
  }
};

export { convert }
