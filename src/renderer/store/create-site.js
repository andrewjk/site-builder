import fs from 'fs-extra'
import path from 'path'

import { remote } from 'electron'

export default async function createSite (name, info, appearance) {
  const siteFolder = path.join(remote.app.getPath('documents'), 'Site Builder', name)

  // Copy the template files
  const templateFolder = path.join(__static, 'templates', 'default')
  await fs.copy(templateFolder, path.join(siteFolder, 'templates', 'default'))

  // Create the data files
  const dataFolder = path.join(siteFolder, 'data')
  await fs.mkdir(dataFolder)
  await fs.writeJSON(path.join(dataFolder + '/info.json'), info)
  await fs.writeJSON(path.join(dataFolder + '/appearance.json'), appearance)

  // Create the pages folder
  const pagesFolder = path.join(siteFolder, 'pages')
  await fs.mkdir(pagesFolder)
}
