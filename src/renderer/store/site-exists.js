import fs from 'fs-extra'

import getSiteFolder from './get-site-folder'

export default function siteExists (name) {
  const siteFolder = getSiteFolder(name)
  return fs.existsSync(siteFolder)
}
