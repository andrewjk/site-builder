import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'

import getFilesInFolder from './get-files-in-folder'
import getDirectoriesInFolder from './get-directories-in-folder'
import loadCollection from './load-collection'
import loadPage from './load-page'
import loadBlock from './load-block'

export default async function loadSite (name) {
  const siteFolder = path.join(remote.app.getPath('documents'), 'Site Builder', name)

  // Load the settings from info.json and appearance.json
  const infoFile = path.join(siteFolder, 'settings', 'info.json')
  const info = await fs.readJSON(infoFile)

  const appearanceFile = path.join(siteFolder, 'settings', 'appearance.json')
  const appearance = await fs.readJSON(appearanceFile)

  // Load data
  const collectionFiles = await getFilesInFolder(path.join(siteFolder, 'data'))
  const collections = (await Promise.all(
    collectionFiles
      .map((file) => {
        return loadCollection(file)
      })
  )).sort((a, b) => a.name.localeCompare(b.name))

  // Load the pages that have been created
  const pageFiles = await getFilesInFolder(path.join(siteFolder, 'pages'))
  const pages = (await Promise.all(
    pageFiles
      .filter((file) => file.indexOf('.liquid') !== -1)
      .map((file) => {
        return loadPage(siteFolder, file)
      })
  )).sort((a, b) => a.name.localeCompare(b.name))

  // Load the blocks that are available
  // TODO: Is this the right place to be getting data from?
  const blockFolders = await getDirectoriesInFolder(path.join(__static, 'blocks'))
  const blocks = (await Promise.all(
    blockFolders
      .map(async (dir) => {
        return loadBlock(dir)
      })
  )).sort((a, b) => a.name.localeCompare(b.name))

  return {
    info,
    appearance,
    collections,
    pages,
    blocks
  }
}
