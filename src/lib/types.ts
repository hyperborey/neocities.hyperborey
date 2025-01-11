import { LANG } from "@lib/constants";
import { URL } from 'url'

export interface TempMap {
  component: {
    [name: string]: any;
  };
  data: {
    [name: string]: any;
  };
}

export interface Blog {
  properties: Properties | null
  urlPath: URL
  fileName: string
}

export interface Properties {
  title?: string
  titleSlug?: string
  date?: Date;
  branch?: string // Change later for enum or something
  language?: LANG;
  tags?: string[]
}

export interface Component {
  name: string
  content: string
}

