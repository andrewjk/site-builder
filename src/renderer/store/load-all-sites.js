import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'

export default async function loadAllSites () {
  // Load the folders in the sites directory
  const sitesFolder = path.join(remote.app.getPath('documents'), 'Site Builder')
  const isDirectory = sitesFolder => fs.lstatSync(sitesFolder).isDirectory()
  const folders = await fs.readdir(sitesFolder)
  const sites = folders.map(name => path.join(sitesFolder, name)).filter(isDirectory).map(name => path.basename(name))
  return sites
}
