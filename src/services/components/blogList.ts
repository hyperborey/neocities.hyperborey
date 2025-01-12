import { Blog } from "@lib/types";
import { addToTemp, getFromTemp } from "@lib/utils/files";
import dayjs from 'dayjs'

/**
 * Transforms `blogdata` from the `.temp/data` into a `bloglist` component
 * and saves it in the `.temp/components` folder.
 */
export function createBlogList(): void {
  const data = getFromTemp("blogdata", "data")

  if (!data) {
    throw new Error(`No blog data is found for blogList!`)
  }

  const blogs: Blog[] = JSON.parse(data);
  let table: string[] = []

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const date = dayjs(blog.properties?.date).format('D/M/YYYY')

    table.push(
      `<tr>
        <td>
          <a href="${blog.urlPath}.html">
            ${blog.properties?.title}
          </a>
        </td>
        <td>
          ${date}
        </td>
      </tr>`)
  }

  const component = `
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Date</th>
      </tr>
    <tbody>
      ${table.join('\n')}
    </tbody>
  </table>
  `

  addToTemp("bloglist", component, "component")
}

