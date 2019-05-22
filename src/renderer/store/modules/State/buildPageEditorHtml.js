import fs from 'fs-extra'
import path from 'path'

// NOTE: V4 uses random numbers
import uuid from 'uuid/v4'

export default async function buildPageEditorHtml (context, { page, blocks }) {
  const siteName = context.state.activeSite

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

    // HACK: Give the block a temporary id
    if (!block.id) {
      block.id = uuid()
    }

    const blockId = block.id

    // Update data from the definition, just in case the template has changed
    const data = block.data
    templateBlock.definition.definitions.forEach((def) => {
      if (!data[def.key]) {
        // TODO: Depends on the type, I guess...
        data[def.key] = ''
      }
    })

    // Load the content from the template and make it dynamic, by replacing liquid fields with
    // inputs that the user can type into and saving it to a temp file
    // TODO: change the input based on the data type!
    let blockContent = templateBlock.content
    const regex = /{{ (.+) }}/gi
    let match = regex.exec(blockContent)
    while (match != null) {
      const name = match[1]
      const value = data[name]
      // TODO: Placeholder from definitions...
      const placeholder = name
      const input = `<input class="data-input" type="text" name="${name}" value="${value}" placeholder="${placeholder}" data-block-id="${blockId}"/>`
      blockContent = blockContent.replace(match[0], input)
      match = regex.exec(blockContent)
    }

    content = `${content}\n<div class="block-container">${blockContent}</div>`
    styles = styles + '\n' + templateBlock.styles

    context.commit('SET_BLOCK_FIELDS', {
      block: block,
      fields: {
        id: blockId,
        definition: templateBlock.definition,
        data
      }
    })
  }

  // TODO: Load CSS from the template, the blocks and our editing file
  // Basically, the same way as we would when building the site
  const editorCssFile = path.join(__static, '/page-editor.css')
  const editorCss = fs.readFileSync(editorCssFile)

  // Wrap the content in HTML so that it can be displayed in a webview
  // TODO: Make sure that this works well with custom styling - probably need to include custom page styles etc
  content = `<html>
<head>
  <link rel="stylesheet" href="../templates/default/css/normalize.css">
  <link rel="stylesheet" href="../templates/default/css/main.css">
  <link rel="stylesheet" href="../templates/default/css/site.css">
  <style>
${styles}
${editorCss}
  </style>
</head>
<body>
${content}
  <div id="data-border"></div>
  <script>
    document.__pageId = '${id}';
  </script>
</body>
</html>`
  // console.log(content)

  // Write the content to a temp file
  const siteFolder = path.join(await context.dispatch('getSitesFolder'), siteName)
  const tempFolder = path.join(siteFolder, 'temp')
  await fs.ensureDir(tempFolder)
  const tempFile = path.join(tempFolder, id + '.html')
  fs.writeFileSync(tempFile, content)

  context.commit('SET_PAGE_FIELDS', {
    page: page,
    fields: {
      id,
      tempFile
    }
  })
}
