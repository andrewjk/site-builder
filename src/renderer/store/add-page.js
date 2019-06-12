import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'

import buildPageSection from './build-page-section'

export default async function addPage (pageName, site, sections) {
  // TODO: Check that it's valid
  const name = pageName.replace(/ /g, '_')

  // Create the empty files
  const pagesFolder = path.join(remote.app.getPath('documents'), 'Site Builder', site.info.name, 'pages')
  const file = path.join(pagesFolder, name + '.liquid')
  fs.writeFile(file)

  const data = {}
  const dataFile = file.replace('.liquid', '.json')
  fs.writeJSON(dataFile, data)

  // Add the page to the current site
  const page = {
    file,
    name,
    data,
    blocks: [],
    tempFile: null
  }
  site.pages.push(page)

  const section = buildPageSection(page)
  const addSection = sections.find((item) => item.key === 'add-page')
  const index = sections.indexOf(addSection)
  sections.splice(index, 0, section)

  return section
}
