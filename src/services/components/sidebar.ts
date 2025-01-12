import { BASE_URL, CONFIG } from '@lib/constants'
import toml from 'toml'
import fs from 'fs'
import { logger } from '@lib/utils/logging'
import { addToTemp } from '@lib/utils/files'

export function buildSidebar(): void {

  const configuration = toml.parse(fs.readFileSync(CONFIG.SIDEBAR, 'utf8'))
  let options: string[] = []

  // TODO: Change it to work with with any sidebar block
  for (let i = 0; i < configuration.sidebar.links.length; i++) {
    const name: string = configuration.sidebar.links[i].name
    const url: string = configuration.sidebar.links[i].url
    const fullUrl = url.startsWith('/') ? new URL(url, BASE_URL) : url;

    const option = `        <li><a href="${fullUrl}">${name}</a></li>`

    options.push(option)
  }


  const component =
    `<aside>
  <ul>
${options.join('\n')}
    </ul>
    </aside>`;

  addToTemp('sidebar', component, 'component')

}
