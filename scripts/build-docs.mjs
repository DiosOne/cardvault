import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const documentationBin = path.resolve('node_modules/.bin/documentation');
const commonArgs = ['build', '--parse-extension', 'jsx', '--format', 'html', '--shallow'];

const categories = [
  {
    label: 'Client Containers',
    output: 'docs/client/containers',
    globs: ['client/src/pages/**/*.jsx'],
  },
  {
    label: 'Client Components',
    output: 'docs/client/components',
    globs: ['client/src/components/**/*.jsx'],
  },
  {
    label: 'Client Context',
    output: 'docs/client/context',
    globs: ['client/src/context/**/*.jsx'],
  },
  {
    label: 'Client Utilities',
    output: 'docs/client/utilities',
    globs: ['client/src/utility/**/*.js', 'client/src/api/**/*.js'],
  },
  {
    label: 'Client App Shell',
    output: 'docs/client/app-shell',
    globs: ['client/src/App.jsx', 'client/src/main.jsx'],
  },
  {
    label: 'Server Controllers',
    output: 'docs/server/controllers',
    globs: ['server/controllers/**/*.js'],
  },
  {
    label: 'Server Routes',
    output: 'docs/server/routes',
    globs: ['server/routes/**/*.js'],
  },
  {
    label: 'Server Middleware',
    output: 'docs/server/middleware',
    globs: ['server/middleware/**/*.js'],
  },
  {
    label: 'Server Schemas',
    output: 'docs/server/schemas',
    globs: ['server/models/**/*.js'],
  },
  {
    label: 'Server Utilities',
    output: 'docs/server/utilities',
    globs: ['server/utility/**/*.js'],
  },
  {
    label: 'Server Core',
    output: 'docs/server/core',
    globs: ['server/index.js', 'server/db.js'],
  },
];

const linkForOutput = (output) => `${output.replace(/^docs\//, '')}/index.html`;

const runDocumentation = (category) => {
  const args = [...commonArgs, ...category.globs, '--output', category.output];
  const result = spawnSync(documentationBin, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const buildIndexHtml = (entries) => {
  const sections = [
    {
      title: 'Client Documentation',
      entries: entries.filter((entry) => entry.output.startsWith('docs/client/')),
    },
    {
      title: 'Server Documentation',
      entries: entries.filter((entry) => entry.output.startsWith('docs/server/')),
    },
  ];

  const renderList = (sectionEntries) =>
    sectionEntries
      .map((entry) => `        <li><a href="${linkForOutput(entry.output)}">${entry.label}</a></li>`)
      .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CardVault Documentation</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: "Inter", "Segoe UI", system-ui, sans-serif;
        background: #0f172a;
        color: #e2e8f0;
      }
      body {
        margin: 0;
        padding: 3rem 1.5rem;
        min-height: 100vh;
        background: radial-gradient(circle at top, #1e293b, #0f172a);
      }
      main {
        max-width: 900px;
        margin: 0 auto;
        background: rgba(15, 23, 42, 0.7);
        border-radius: 18px;
        padding: 2.5rem;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.4);
      }
      h1 {
        margin-top: 0;
        font-size: clamp(2rem, 3vw, 2.6rem);
      }
      section + section {
        margin-top: 2rem;
      }
      h2 {
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
      }
      p {
        margin-top: 0.5rem;
        color: #cbd5f5;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0.75rem 0 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.75rem;
      }
      a {
        display: block;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        background: rgba(56, 189, 248, 0.12);
        color: inherit;
        text-decoration: none;
        border: 1px solid rgba(56, 189, 248, 0.3);
      }
      a:hover {
        background: rgba(56, 189, 248, 0.2);
      }
      footer {
        margin-top: 2rem;
        font-size: 0.9rem;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>CardVault Documentation</h1>
      <p>Select a category below to explore the generated API docs.</p>
${sections
  .map(
    (section) => `      <section>
        <h2>${section.title}</h2>
        <ul>
${renderList(section.entries)}
        </ul>
      </section>`,
  )
  .join('\n')}
      <footer>Generated with documentation.js.</footer>
    </main>
  </body>
</html>
`;
};

rmSync('docs', { recursive: true, force: true });
mkdirSync('docs', { recursive: true });

categories.forEach(runDocumentation);

const indexHtml = buildIndexHtml(categories);
writeFileSync('docs/index.html', indexHtml);
