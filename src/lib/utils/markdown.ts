import * as fs from 'fs'
import { REGEX } from '../constants'
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

/**
 * Parses markdown to HTML tags.
 * @param {string} input The string to parse
 * @returns {string} Parsed HTML string
 */
export function parseMarkdown(input: string): string {

  let content: string | string[] = input.split("\n");
  let isCode: boolean = false;

  // This sucks ass
  // But works for now
  for (let index = 0; index < content.length; index++) {
    const line = content[index];

    if (REGEX.HEADERS.H6.test(line)) {
      content[index] = `<h6>${line.replace(REGEX.HEADERS.H6, "$1").trim()}</h6>`;
    } else if (REGEX.HEADERS.H5.test(line)) {
      content[index] = `<h5>${line.replace(REGEX.HEADERS.H5, "$1").trim()}</h5>`;
    } else if (REGEX.HEADERS.H4.test(line)) {
      content[index] = `<h4>${line.replace(REGEX.HEADERS.H4, "$1").trim()}</h4>`;
    } else if (REGEX.HEADERS.H3.test(line)) {
      content[index] = `<h3>${line.replace(REGEX.HEADERS.H3, "$1").trim()}</h3>`;
    } else if (REGEX.HEADERS.H2.test(line)) {
      content[index] = `<h2>${line.replace(REGEX.HEADERS.H2, "$1").trim()}</h2>`;
    } else if (REGEX.HEADERS.H1.test(line)) {
      content[index] = `<h1>${line.replace(REGEX.HEADERS.H1, "$1").trim()}</h1>`;
    } else if (REGEX.BR.test(line) && !isCode) {
      content[index] = "<br>";
    }

    else if (REGEX.CODE_BLOCK_START.test(content[index])) {  // Checks if the string starts with ```
      if (isCode) {
        content[index] = content[index].replace(REGEX.CODE_BLOCK_START, "</pre>");
        isCode = false;
      } else {
        content[index] = content[index].replace(REGEX.CODE_BLOCK_START, "<pre>");
        isCode = true;
      }

    } else if (isCode) {  // Checks if isCode is true

    } else {
      content[index] = `<p>${content[index]}</p>`;
    }

    content[index] = content[index]
      .replace(REGEX.BOLD_ITALIC, "<em><strong>$1</strong></em>")
      .replace(REGEX.BOLD, "<strong>$1</strong>")
      .replace(REGEX.ITALIC, "<em>$1</em>")
      .replace(REGEX.UNDERLINE_ITALIC, "<em>$1</em>")
      .replace(REGEX.CODE, "<code>$1</code>");
  }

  content = content.join("\n")

  return content

}
