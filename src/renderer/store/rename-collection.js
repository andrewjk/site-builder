import fs from 'fs-extra'

export default async function renameCollection (collection, name, sections) {
  const oldFile = collection.file
  const newFile = collection.file.replace(collection.name + '.json', name + '.json')
  await fs.move(oldFile, newFile)

  // TODO: Need to update these in components etc
  collection.file = newFile
  collection.name = name

  const section = sections.find((item) => item.collection === collection)
  if (section) {
    section.key = 'coll-' + collection.name
    section.text = collection.name
  }
}
