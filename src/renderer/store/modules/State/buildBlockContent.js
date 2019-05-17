import fs from 'fs-extra'
import path from 'path'

// NOTE: V4 uses random numbers
import uuid from 'uuid/v4'

export default async function buildBlockContent (context, { page, block, templateBlock }) {
  const siteName = context.state.activeSite

  // HACK: Give the block a temporary id
  // TODO: Save and load these somehow?
  if (!block.id) {
    block.id = uuid()
  }

  const id = block.id

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
  let content = templateBlock.content
  const regex = /{{ (.+) }}/gi
  let match = regex.exec(content)
  while (match != null) {
    const name = match[1]
    const value = data[name]
    // TODO: Placeholder from definitions...
    const placeholder = name
    const input = `<input class="data-input" type="text" name="${name}" value="${value}" placeholder="${placeholder}"/>`
    content = content.replace(match[0], input)
    match = regex.exec(content)
  }

  // TODO: Load CSS from the template, the block and our editing file
  // Basically, the same way as we would when building the site
  const editorCssFile = path.join(__static, '/block-editor.css')
  const editorCss = fs.readFileSync(editorCssFile)

  // Wrap the content in HTML so that it can be displayed in a webview
  // TODO: Make sure that this works well with custom styling - probably need to include custom page styles etc
  content = `<html>
<head>
  <link rel="stylesheet" href="../templates/default/css/normalize.css">
  <link rel="stylesheet" href="../templates/default/css/main.css">
  <link rel="stylesheet" href="../templates/default/css/site.css">
  <style>
${templateBlock.styles}
${editorCss}
  </style>
</head>
<body>
${content}
  <div id="data-border"/>
  <script>
    document.__blockId = '${id}';
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

  context.commit('SET_BLOCK_FIELDS', {
    block: block,
    fields: {
      id,
      definition: templateBlock.definition,
      data,
      tempFile
    }
  })
}
