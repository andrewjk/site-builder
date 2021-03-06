import fs from 'fs-extra'
import path from 'path'

export default async function loadCollection (file) {
  const name = file.substring(file.lastIndexOf(path.sep) + 1, file.lastIndexOf('.'))

  const data = await fs.readJSON(file)

  const collection = {
    file,
    name,
    data
  }

  return collection
}
