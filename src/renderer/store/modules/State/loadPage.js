import fs from 'fs-extra'
import path from 'path'

export default async function loadPage (context, { siteFolder, file }) {
  const name = file.substring(file.lastIndexOf(path.sep) + 1, file.lastIndexOf('.'))
  // Load the page's data
  const dataFile = file.replace('.liquid', '.json')
  const data = fs.existsSync(dataFile) ? fs.readJSONSync(dataFile) : {}
  // Load the page's blocks
  const lines = fs.readFileSync(file).toString().split('\n')
  const regex = /{% include '(.+).liquid'(?:, (.+))* %}/gi
  const contentRegex = /{% block content %}Page content{% endblock %}/gi
  const blocks = []
  for (let i = 0; i < lines.length; i++) {
    const content = lines[i]
    let match = regex.exec(content)
    while (match != null) {
      // TODO: This probably needs to be much more robust
      const blockData = {}
      const dataRegex = /(\w+): '((?:[^'\\]|\\.)+)'/gi
      let dataMatch = dataRegex.exec(match[2])
      while (dataMatch != null) {
        blockData[dataMatch[1]] = dataMatch[2].replace('\\\'', '\'')
        dataMatch = dataRegex.exec(match[2])
      }
      const block = {
        name: match[1],
        data: blockData,
        tempFile: ''
      }
      blocks.push(block)
      match = regex.exec(content)
    }
    // HACK: Special case for content blocks
    let contentMatch = contentRegex.exec(content)
    while (contentMatch != null) {
      const block = {
        name: 'content',
        data: {},
        tempFile: ''
      }
      blocks.push(block)
      contentMatch = contentRegex.exec(content)
    }
  }
  const page = {
    file,
    name,
    data,
    blocks
  }
  return page
}
