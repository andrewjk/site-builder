import fs from 'fs-extra'
import path from 'path'

import getSiteFolder from './get-site-folder'
import buildCollectionSection from './build-collection-section'

export default async function addCollection (collectionName, site, sections) {
  const siteFolder = getSiteFolder(site.info.name)

  // TODO: Check that it's valid
  const name = collectionName.replace(/ /g, '_')

  // Create the empty file
  // Add a default Name definition that can't be removed
  const data = {
    fields: [{
      key: 'name',
      name: 'Name',
      type: 'text'
    }],
    items: []
  }
  const dataFolder = path.join(siteFolder, 'data')
  const file = path.join(dataFolder, name + '.json')
  fs.writeJSON(file, data)

  // Add the data to the current site
  const collection = {
    file,
    name,
    data
  }
  site.collections.push(collection)

  const section = buildCollectionSection(collection)
  const addSection = sections.find((item) => item.key === 'add-collection')
  const index = sections.indexOf(addSection)
  sections.splice(index, 0, section)

  return section
}
