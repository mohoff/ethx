module.exports = {
  '*.ts': ['eslint --fix', 'git add'],
  '*.json': ['jsonlint-cli', 'git add'],
  '*.{yaml,yml}': ['yamllint', 'git add'],
  '*.md': [
    'markdownlint --ignore node_modules --ignore CHANGELOG.md',
    'git add',
  ],
}
