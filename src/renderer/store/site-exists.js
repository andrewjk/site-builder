import fs from 'fs-extra'
import path from 'path'

import { remote } from 'electron'

export default function siteExists (name) {
  const siteFolder = path.join(remote.app.getPath('documents'), 'Site Builder', name)
  return fs.existsSync(siteFolder)
}
