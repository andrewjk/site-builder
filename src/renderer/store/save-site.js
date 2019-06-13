import fs from 'fs-extra'
import path from 'path'

import { remote } from 'electron'

import buildPageContent from './build-page-content'

export default async function saveSite (site) {
  const siteFolder = path.join(remote.app.getPath('documents'), 'Site Builder', site.info.name)

  // Save the data into info.json and appearance.json
  const infoFile = path.join(siteFolder, 'data', 'info.json')
  fs.writeJSON(infoFile, site.info)
  const appearanceFile = path.join(siteFolder, 'data', 'appearance.json')
  fs.writeJSON(appearanceFile, site.appearance)

  // Save other data
  site.collections.forEach((collection) => {
    fs.writeJSON(collection.file, collection.data)
  })

  // Save the pages that have been created
  site.pages.forEach(async (page) => {
    const content = await buildPageContent(page)
    fs.writeFile(page.file, content)

    const dataFile = page.file.replace('.liquid', '.json')
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