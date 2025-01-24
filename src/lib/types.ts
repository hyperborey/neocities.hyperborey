import { LANG } from "@lib/constants";
import { URL } from 'url'

export interface Blog {
  properties: Properties | null
  urlTitleSlug: string
  urlPath: URL
  fileName: string
  publicFilePath: string
  contentFilePath: string
}

export interface Properties {
  title?: string
  date?: Date;
  branch?: string // Change later for enum or something
  language?: LANG;
  tags?: string[]
}
