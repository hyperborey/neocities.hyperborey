import { promises as fs } from 'fs';
import * as path from 'path';

async function parseMarkdown(markdown: string) {
  let html = markdown;
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return html;
}

async function buildSite() {
  try {
    // Ensure dist directory exists
    await fs.mkdir('public', { recursive: true });
    await fs.mkdir('public/css', { recursive: true });
    await fs.mkdir('public/blog', { recursive: true });

    // Copy static files
    await fs.copyFile('src/index.html', 'public/index.html');
    await fs.copyFile('src/css/style.css', 'public/css/style.css');

    // Process blog posts
    const postsDir = 'src/blog/posts';
    const files = await fs.readdir(postsDir);

    for (const file of files) {
      if (path.extname(file) === '.md') {
        const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
        const htmlContent = await parseMarkdown(content);

        // Read the template
        let template = await fs.readFile('src/blog/template.html', 'utf-8');

        // Replace a placeholder in the template with the content
        template = template.replace('{{content}}', htmlContent);

        // Write the final HTML file
        const htmlFilename = path.basename(file, '.md') + '.html';
        await fs.writeFile(path.join('public/blog/', htmlFilename), template);
      }
    }

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

buildSite();
