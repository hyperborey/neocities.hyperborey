import { CONTENT, TEMP, TESTS } from "@lib/constants"
import { blogManager } from "@managers/BlogManager"
import mockFs from 'mock-fs'
import fs from 'fs'
import path from 'path'
import { logger } from "@lib/utils/logging"

// Logger mock
logger.mockTypes((typeName, type) => jest.fn());


describe("BlogManager class", () => {
  beforeEach(() => {
    mockFs({
      // Basic folder structure
      [TEMP.DIR]: {},
      [CONTENT.BLOG.EN]: {
        "test_blog_post.md": fs.readFileSync(path.join(TESTS.FIXTURES.SAMPLE_CONTENT, "test_blog_post.md"), 'utf8'),
        "test_no_property.md": fs.readFileSync(path.join(TESTS.FIXTURES.SAMPLE_CONTENT, "test_no_property.md"), 'utf8')
      }
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("should correctly retrieve information from the blog", () => {
    const input = path.join(CONTENT.BLOG.EN, "test_blog_post.md")
    const expected = "What is a placeholder text?"
    const blogInfo = blogManager.getBlogInfo(input)
    const output = blogInfo!.properties!.title

    expect(output).toBe(expected)
  })

  it("should correctly generate a slug title even if the blog has no properties", () => {
    const input = path.join(CONTENT.BLOG.EN, "test_no_property.md")
    const expected = "theres-no-frontmatter-however"
    const blogInfo = blogManager.getBlogInfo(input)
    const output = blogInfo!.urlTitleSlug

    expect(output).toBe(expected)
  })

  it("should correctly remove blog info", () => { // BUG: This test doesn't work
    const input = path.join(CONTENT.BLOG.EN, "test_blog_post.md")
    const expected = ""
    blogManager.updateAllBlogsInfo()
    blogManager.removeBlogInfo(input)
    const output = blogManager.getBlogs()

    expect(output).toBe(undefined)
  })
})
