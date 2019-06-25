import fs from 'fs-extra'
import path from 'path'

// NOTE: V4 uses random numbers
import uuid from 'uuid/v4'

import getSiteFolder from './get-site-folder'
import buildStyles from './build-styles'
import buildStyleAttribute from './build-style-attribute'

export default async function buildPageEditorHtml (site, page, blocks, definitions) {
  const siteFolder = getSiteFolder(site.info.name)

  // TODO: Remove this at some point, it's just for older pages
  if (!page.settings.id) {
    page.settings.id = uuid()
  }

  const id = page.settings.id

  // Build the page content from the blocks that have been included
  let pageContent = ''
  for (let i = 0; i < page.blocks.length; i++) {
    const block = page.blocks[i]
    const templateBlock = blocks.find((b) => b.name === block.name)

    const blockContent = buildBlockEditorHtml(block, templateBlock)

    pageContent = `${pageContent}\n${blockContent}`
  }

  // Load standard styles, and styles from the page-editor file
  const styles = buildStyles(site, definitions)
  const editorStylesFile = path.join(__static, '/page-editor.css')
  const editorStyles = fs.readFileSync(editorStylesFile)

  // Wrap the content in HTML so that it can be displayed in a webview
  // TODO: Load CSS from the template, instead of just including normalize and main
  // TODO: Make sure that this works well with custom styling - probably need to include custom page styles etc
  const content = `
<html>
<head>
  <link rel="stylesheet" href="../templates/default/css/normalize.css">
  <link rel="stylesheet" href="../templates/default/css/main.css">
  <link rel="stylesheet" href="../templates/default/css/builder.css">
  <style>
${styles}
${editorStyles}
  </style>
</head>
<body>
  <div id="data-content">
${pageContent}
  </div>
  <div id="data-border"></div>
  <div id="drag-border"></div>
  <script>
    document.__pageId = '${id}';
  </script>
</body>
</html>`.trim()
  // console.log(content)

  // Write the content to a temp file
  const tempFolder = path.join(siteFolder, 'temp')
  await fs.ensureDir(tempFolder)
  const tempFile = path.join(tempFolder, id + '.html')
  fs.writeFileSync(tempFile, content)

  page.id = id
  page.tempFile = tempFile
}

function buildBlockEditorHtml (block, templateBlock) {
  // HACK: Give the block a temporary id
  if (!block.id) {
    block.id = uuid()
  }

  const blockId = block.id

  // Update data from the definition, just in case it hasn't been loaded or the template has changed
  const data = block.data
  if (templateBlock.definition.fields) {
    templateBlock.definition.fields.forEach((def) => {
      if (!data[def.key]) {
        // TODO: Depends on the type, I guess...
        data[def.key] = ''
      }
    })
  }

  // Load the content from the template and make it dynamic, by replacing liquid fields with
  // inputs that the user can type into and saving it to a temp file
  // TODO: change the input based on the data type!
  // TODO: Ok, so i think we should always be getting content from the block's content, not the templateBlock's content...
  let content = ''

  if (block.name === 'data-item') {
    content = block.html
  } else {
    content = templateBlock.content

    // Pass 1 - replace inputs
    const regex = /{{ (.+) }}/gi
    let match = regex.exec(content)
    while (match != null) {
      const name = match[1]
      if (name.indexOf('| styles:') === -1) {
        // TODO: Placeholder from definitions...
        const value = data[name]
        const placeholder = name
        const input = `<input id="data-input-${blockId}-${name}" class="data-input" type="text" name="${name}" value="${value}" placeholder="${placeholder}" data-block-id="${blockId}"/>`
        content = content.replace(match[0], input)
      }
      if (name.indexOf('| styles:') !== -1) {
        // HACK: Do this nicer!!
        const keyregex = /__(\w+)__/gi
        let key = keyregex.exec(name)
        if (key) {
          key = key[1]
          if (!block.data.settings[key]) {
            block.data.settings[key] = {}
          }
          const inputSettings = block.data.settings[key]
          const inputStyles = buildStyleAttribute(inputSettings.fontFamily, inputSettings.fontSize, inputSettings.backgroundColor, inputSettings.color)
          content = content.replace(match[0], inputStyles)
        } else {
          // It's a block style, which will get set in the return statement...
          content = content.replace(match[0], '')
        }
      }
      regex.lastIndex = 0
      match = regex.exec(content)
    }
  }

  block.id = blockId
  block.definition = templateBlock.definition
  block.data = data

  const blockSettings = block.data.settings
  const blockStyles = buildStyleAttribute(blockSettings.fontFamily, blockSettings.fontSize, blockSettings.backgroundColor, blockSettings.color)

  return `
<div id="data-block-${blockId}" class="data-block" data-block-id="${blockId}" draggable="true" ${blockStyles}>
${content}
</div>`.trim()
}
