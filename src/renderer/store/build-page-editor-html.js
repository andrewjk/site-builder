import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'

// NOTE: V4 uses random numbers
import uuid from 'uuid/v4'

export default async function buildPageEditorHtml (site, page, blocks) {
  const siteName = site.info.name

  // TODO: Remove this at some point, it's just for older pages
  if (!page.data.id) {
    page.data.id = uuid()
  }

  const id = page.data.id

  let content = ''
  let styles = ''

  for (let i = 0; i < page.blocks.length; i++) {
    const block = page.blocks[i]
    const templateBlock = blocks.find((b) => b.name === block.name)

    const blockContent = buildBlockEditorHtml(block, templateBlock)

    content = `${content}\n${blockContent}`
    styles = `${styles}\n${templateBlock.styles}`
  }

  // Load styles from the page-editor file
  const editorStylesFile = path.join(__static, '/page-editor.css')
  const editorStyles = fs.readFileSync(editorStylesFile)

  // Wrap the content in HTML so that it can be displayed in a webview
  // TODO: Load CSS from the template, instead of just including normalize and main
  // TODO: Make sure that this works well with custom styling - probably need to include custom page styles etc
  content = `
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
${content}
  <div id="data-border"></div>
  <script>
    document.__pageId = '${id}';
  </script>
</body>
</html>`.trim()
  // console.log(content)

  // Write the content to a temp file
  const siteFolder = path.join(remote.app.getPath('documents'), 'Site Builder', siteName)
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
  if (templateBlock.definition.definitions) {
    templateBlock.definition.definitions.forEach((def) => {
      if (!data[def.key]) {
      // TODO: Depends on the type, I guess...
        data[def.key] = ''
      }
    })
  }

  // Load the content from the template and make it dynamic, by replacing liquid fields with
  // inputs that the user can type into and saving it to a temp file
  // TODO: change the input based on the data type!
  let content = templateBlock.content
  const regex = /{{ (.+) }}/gi
  let match = regex.exec(content)
  while (match != null) {
    const name = match[1]
    const value = data[name]
    // TODO: Placeholder from definitions...
    const placeholder = name
    const input = `<input class="data-input" type="text" name="${name}" value="${value}" placeholder="${placeholder}" data-block-id="${blockId}"/>`
    content = content.replace(match[0], input)
    match = regex.exec(content)
  }

  block.id = blockId
  block.definition = templateBlock.definition
  block.data = data

  return `
<div id="data-block-${blockId}" class="data-block" data-block-id="${blockId}">
${content}
</div>`.trim()
}
