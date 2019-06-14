import fs from 'fs-extra'
import path from 'path'

import { remote } from 'electron'

export default async function createSite (name, info, appearance) {
  const siteFolder = path.join(remote.app.getPath('documents'), 'Site Builder', name)

  // Copy the template files
  const templateFolder = path.join(__static, 'templates', 'default')
  await fs.copy(templateFolder, path.join(siteFolder, 'templates', 'default'))

  // Create the settings files
  const settingsFolder = path.join(siteFolder, 'settings')
  await fs.mkdir(settingsFolder)
  await fs.writeJSON(path.join(settingsFolder + '/info.json'), info)
  await fs.writeJSON(path.join(settingsFolder + '/appearance.json'), appearance)

  // Create the pages folder
  const pagesFolder = path.join(siteFolder, 'pages')
  await fs.mkdir(pagesFolder)
}
