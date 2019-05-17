import fs from 'fs-extra'
import path from 'path'

export default async function saveSite (context, name) {
  const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

  // Save the data into info.json and appearance.json
  const infoFile = path.join(siteFolder, 'data', 'info.json')
  fs.writeJSON(infoFile, context.state.info)
  const appearanceFile = path.join(siteFolder, 'data', 'appearance.json')
  fs.writeJSON(appearanceFile, context.state.appearance)

  // Save other data
  context.state.collections.forEach((collection) => {
    // const collectionFile = path.join(siteFolder, 'data', collection.file)
    fs.writeJSON(collection.file, collection.data)
  })

  // Save the pages that have been created
  context.state.pages.forEach(async (page) => {
    const content = await context.dispatch('buildPageContent')
    fs.writeFile(page.file, content)

    const dataFile = page.file.replace('.html', '.json')
    fs.writeJSON(dataFile, page.data)
  })

  /*
  // TODO: Figure out what to do with blocks
  // Save the blocks that are available
  const blockFiles = await getDirectoriesInFolder(path.join(__static, 'blocks'))
  const blocks = blockFiles.map((file) => {
    const name = file.substring(file.lastIndexOf(path.sep) + 1)
    const definitionFile = path.join(__static, 'blocks', file, 'block.json')
    const definition = fs.existsSync(definitionFile) ? fs.readJSONSync(definitionFile) : {}
    return {
    file,
    name,
    definition,
    // TODO: Where to load data from?!
    data: {}
    }
  })
  */
}
