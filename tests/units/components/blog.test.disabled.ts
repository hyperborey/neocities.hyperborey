import { getFrontmatter, parseMarkdown } from "./src/services/components/"
import { Properties } from "@lib/types";
import * as fs from "fs"

describe('getFrontmatter function', () => {
  it('should correctly parse frontmatter from a sample markdown file', () => {
    const input = fs.readFileSync("./tests/fixtures/sample-content/test_blog_post.md", 'utf-8');
    const result = getFrontmatter(input);
    const expected: Properties = {
      title: 'What is Placeholder Text?',
      language: 'en',
      date: new Date("2024-11-27"),
      branch: 'test',
      tags: ['Placeholder Text', 'Lorem Ipsum', 'Design']
    }

    expect(result).toEqual(expected);
  });

  it('should return null when no frontmatter is found in a sample markdown file', () => {
    const input = fs.readFileSync("./tests/fixtures/sample-content/test_no_property.md", 'utf-8');
    const result = getFrontmatter(input);
    const expected = null

    expect(result).toEqual(expected);
  });

});

describe('parseMarkdown function', () => {
  it("should correctly parse headers", () => {
    const input = "# Header 1\n## Header 2\n### Header 3\n#### Header 4\n##### Header 5\n###### Header 6"
    const result = parseMarkdown(input)
    const expected = "<h1>Header 1</h1>\n<h2>Header 2</h2>\n<h3>Header 3</h3>\n<h4>Header 4</h4>\n<h5>Header 5</h5>\n<h6>Header 6</h6>"

    expect(result).toEqual(expected);
  })
  it("should correctly parse empty lines", () => {
    const input = "This is a first line\n\nThis is a second line"
    const result = parseMarkdown(input)
    const expected = "<p>This is a first line</p>\n<br>\n<p>This is a second line</p>"

    expect(result).toEqual(expected);
  });
  it("should correctly parse bold and italic text", () => {
    const input = "This is a *italic text*. This is a **bold text**. This is ***both***."
    const result = parseMarkdown(input)
    const expected = "<p>This is a <em>italic text</em>. This is a <strong>bold text</strong>. This is <em><strong>both</strong></em>.</p>"

    expect(result).toEqual(expected);
  });
  it("should correctly parse inline code and code blocks", () => {
    const input = "This is a `code`. This is a codeblock:\n```python\nimport something\n\nprint(\"Hello World!\")\n```"
    const result = parseMarkdown(input)
    const expected = "<p>This is a <code>code</code>. This is a codeblock:</p>\n<pre>python\nimport something\n\nprint(\"Hello World!\")\n</pre>"

    expect(result).toEqual(expected);
  });
});
