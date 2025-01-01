import { LANG } from "@lib/constants";
import { URL } from 'url'

export interface Blog {
  properties: Properties | null
  urlPath: URL
  fileName: string
}

export interface Properties {
  title?: string
  date?: Date;
  branch?: string // Change later for enum or something
  language?: typeof LANG[keyof typeof LANG];
  tags?: string[]
}


