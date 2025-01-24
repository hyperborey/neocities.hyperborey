import { CONTENT, TEMP, TESTS } from "@lib/constants"
import { BlogManager } from "@managers/BlogManager"
import { StorageManager } from "@managers/StorageManager"
import mockFs from 'mock-fs'
import fs from 'fs'
import path from 'path'
import { logger } from "@lib/utils/logging"

describe("BlogManager class", () => {
  let storageManager: StorageManager
  let blogManager: BlogManager

  beforeEach(() => {
    storageManager = new StorageManager()
    blogManager = new BlogManager(storageManager)
    mockFs({
      [TEMP.DIR]: {},
      [CONTENT.BLOG.DIR]: {
        "en": {
          "test_blog_post.md": fs.readFileSync(path.join(TESTS.FIXTURES.SAMPLE_CONTENT, "test_blog_post.md"), 'utf8'),
          "test_no_property.md": fs.readFileSync(path.join(TESTS.FIXTURES.SAMPLE_CONTENT, "test_no_property.md"), 'utf8')
        }
      }
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("should correctly retrieve information from the blog", () => {
    const input = path.join(CONTENT.BLOG.DIR, "en", "test_blog_post.md")
    const expected = "What is a placeholder text?"
    const blogInfo = blogManager.getBlogInfo(input)
    const output = blogInfo!.properties!.title

    expect(output).toBe(expected)
  })

  it("should correctly generate a slug title even if the blog has no properties", () => {
    const input = path.join(CONTENT.BLOG.DIR, "en", "test_no_property.md")
    const expected = "theres-no-frontmatter-however"
    const blogInfo = blogManager.getBlogInfo(input)
    const output = blogInfo!.urlTitleSlug

    expect(output).toBe(expected)
  })

  it("should correctly retrieve information from all blogs", () => {
    const output = blogManager.getAllBlogsInfo()

    expect(output).toBeDefined()
  })
})
