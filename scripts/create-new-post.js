#!/usr/bin/env node 

const { writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const { distDir } = require('./paths.js');

const DEFAULT_TITLE = 'default title'
const [_processPath, _filePath, arg1, arg2] = process.argv;

const help = `\
usage:
  node create-new-post.js --title "My Awesome Article."`

const createDistFile = (title) => {
  const now = new Date().toISOString();
  const dirName = encodeURIComponent(title);
  const distPath = resolve(distDir, dirName);
  const distFilePath = resolve(distPath, 'index.md');
  const template = `\
  ---
  title: '${title}'
  date: '${now}'
  ---

  # ${title}
  `;

  mkdirSync(distPath, {recursive: true});
  writeFileSync(distFilePath, template);
  console.log(`Successfully created new file.`);
  console.log(distFilePath);
}


switch (arg1) {
  case '--help':
    console.log(help);
    return;

  case '--title':
    if (!arg2) {
      console.log(help);
      return;
    }
    createDistFile(arg2);
    return;

  default:
    console.log(help);
}
