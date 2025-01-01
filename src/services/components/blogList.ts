import { Blog } from "@lib/types";
import { logger } from "@lib/utils/logging";
import dayjs from 'dayjs'
import path from 'path'

export function createBlogList(blogs: Blog[]): string {

  // <tr> - header
  //  <th>
  // <tr>
  //  <td>

  let content: string[] | string = []


  content.push(`<table>`)
  content.push(`<thead>`)
  content.push(`<tr>\n<th>Name</th>\n<th>Date</th>\n</tr>`)
  content.push(`</thead>`)
  content.push(`<tbody>`)
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const date = dayjs(blog.properties?.date).format('D/M/YYYY')
    content.push(`<tr>\n<td><a href="${blog.urlPath}">${blog.properties?.title}</a></td>\n<td>${date}</td>\n</tr>`)

    logger.info(blog)
    logger.info(content)
  }
  content.push(`</tbody>`)
  content.push(`</table>`)
  content = content.join('\n')

  return content
}

