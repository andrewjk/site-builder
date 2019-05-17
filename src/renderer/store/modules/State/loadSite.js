import fs from 'fs-extra'
import path from 'path'

import getFilesInFolder from './getFilesInFolder'
import getDirectoriesInFolder from './getDirectoriesInFolder'

export default async function loadSite (context, name) {
  const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

  // Load the data from info.json and appearance.json
  const infoFile = path.join(siteFolder, 'data/info.json')
  fs.readJSON(infoFile).then((info) => {
    context.commit('SET_INFO', info)
  })
  const appearanceFile = path.join(siteFolder, 'data/appearance.json')
  fs.readJSON(appearanceFile).then((app) => {
    context.commit('SET_APPEARANCE', app)
  })

  // Load other data
  // TODO: Load the ACTUAL data
  let collections = await getFilesInFolder(path.join(siteFolder, 'data'))
  collections = collections
    .filter((item) => item.indexOf('info.json') === -1 && item.indexOf('appearance.json') === -1)
    .map((item) => {
      return item.substring(item.lastIndexOf(path.sep) + 1, item.lastIndexOf('.'))
    })
  context.commit('SET_COLLECTIONS', collections)

  // Load the pages that have been created
  const pageFiles = await getFilesInFolder(path.join(siteFolder, 'pages'))
  const pages = await Promise.all(pageFiles.filter((file) => file.indexOf('.liquid') !== -1).map((file) => {
    return context.dispatch('loadPage', { siteFolder, file })
  }))
  context.commit('SET_PAGES', pages)

  // Load the blocks that are available
  // TODO: Is this the right place to be getting data from?
  const blockFolders = await getDirectoriesInFolder(path.join(__static, 'blocks'))
  const blocks = await Promise.all(blockFolders.map(async (dir) => {
    return context.dispatch('loadBlock', dir)
  }))
  context.commit('SET_BLOCKS', blocks)

  // Now that that's all done, load the sections to display in the sidebar and set this site to active
  context.dispatch('buildSections')
  context.commit('SET_ACTIVE_SITE', name)
}
