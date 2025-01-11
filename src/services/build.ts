import { addToTemp } from "@lib/utils/files";
import { collectBlogData } from "./components/blogData";
import { logger } from "@lib/utils/logging"

import { createBlogList } from "./components/blogList";
import { buildStatic } from "./components/static";
import { buildBlogs } from "./components/blog";

export function build(): void {

  const blogContent = `---
title: Rewrite update.
date: 2024-12-21
branch: Neocities website
language: en
---

At this moment, I just finished a session. I'm still doing a full rewrite of my website and a build tool for it, however after exams progress will be very slow. I understand, of course, that no one reads this, but the fact that I had to postpone such an important project is upsetting.`;

  const REGEX = {
    FRONTMATTER: /^---\n([\s\S]*?)\n---/
  };

  console.log(blogContent.replace(REGEX.FRONTMATTER, ""));

  logger.info("Build service is run...")

  collectBlogData()

  createBlogList()

  buildStatic()
  buildBlogs()

}


build();
