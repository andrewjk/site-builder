import fs from 'fs-extra'
import path from 'path'

export default async function loadPage (siteFolder, file) {
  const name = file.substring(file.lastIndexOf(path.sep) + 1, file.lastIndexOf('.'))

  // Load the page's data
  const settingsFile = file.replace('.liquid', '.json')
  const settings = fs.existsSync(settingsFile) ? fs.readJSONSync(settingsFile) : {}

  // Load the page's blocks
  const lines = fs.readFileSync(file).toString().split('\n')
  const regex = /{% include '(.+).liquid'(?:, (.+))* %}/gi
  const contentRegex = /{% block content %}Page content{% endblock %}/gi
  const dataItemRegex = /<div class="data-item">/gi
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
        blockData[dataMatch[1]] = dataMatch[2].replace('&#39;', '\'')
        dataMatch = dataRegex.exec(match[2])
      }
      const block = {
        name: match[1],
        data: blockData
      }
      blocks.push(block)
      match = regex.exec(content)
    }
    // HACK: Special case for content blocks
    let contentMatch = contentRegex.exec(content)
    while (contentMatch != null) {
      const block = {
        name: 'content',
        data: {}
      }
      blocks.push(block)
      contentMatch = contentRegex.exec(content)
    }
    // HACK: Special case for data item blocks
    let dataItemMatch = dataItemRegex.exec(content)
    while (dataItemMatch != null) {
      const contentLines = []
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j] === '</div>') {
          i = j
          break
        }
        contentLines.push(lines[j])
      }
      const block = {
        name: 'data-item',
        data: {},
        html: contentLines.join('\n')
      }
      blocks.push(block)
      dataItemMatch = dataItemRegex.exec(content)
    }
  }

  const page = {
    file,
    name,
    settings,
    blocks,
    tempFile: null
  }
  return page
}
