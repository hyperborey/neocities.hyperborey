/*
 * BlogManager - менеджер работающий с блогами
 * 1) Собирает информацию с блогов
 * 2) Делает специфичный для блогов компоненты и отправл
 */

interface Blog {
  properties: Properties | null
  urlTitleSlug: string
  urlPath: URL
  fileName: string
  publicFilePath: string
  contentFilePath: string
}

interface Properties {
  title?: string
  date?: Date;
  branch?: string // Change later for enum or something
  language?: string
  tags?: string[]
}

export class BlogManager {
  public blogs: Blog[]

  constructor() {
    this.blogs = []
  }
}
