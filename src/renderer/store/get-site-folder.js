import path from 'path'

import { remote } from 'electron'

export default function getSitePath (name) {
  return path.join(remote.app.getPath('documents'), 'Site Builder', name)
}
