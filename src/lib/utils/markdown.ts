import * as fs from 'fs'
import { REGEX } from '../enums'
import * as yaml from "yaml"
import { Properties } from '../types'

/**
 * Loads and parses a YAML data at the beggining of the markdown file.
 * @param {string} content The string from which frontmatter should get extracted
 * @returns {Properties | null} The parsed YAML data as a Properties interface, null if YAML data is not found.
 * @throws {Error} Throws an error if the file is not found.
 */
export function getFrontmatter(content: string): Properties | null {

  const frontmatter = content.match(REGEX.FRONTMATTER)

  if (!frontmatter) {
    return null
  }

  let properties = yaml.parse(frontmatter[1]) as Properties;

  if (properties.date) {
    properties.date = new Date(properties.date);
  }

  return properties
}

export function parseMarkdown(input: string): string {

  let content: string | string[] = input.split("\n");
  let isCode: boolean = false;

  // This sucks ass
  // But works for now
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
      console.log(`isCode is now ${isCode} - ${content[index]}`)
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


  return content

}
