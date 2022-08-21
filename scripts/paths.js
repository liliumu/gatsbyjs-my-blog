const { resolve } = require('path');

const rootDir = resolve(__dirname, '../');
const distDir = resolve(rootDir, 'content', 'blog')

module.exports = {
  rootDir,
  distDir
}
