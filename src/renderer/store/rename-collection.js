import fs from 'fs-extra'

export default async function renameCollection (collection, name, sections) {
  const oldFile = collection.file
  const newFile = collection.file.replace(collection.name + '.json', name + '.json')
  await fs.move(oldFile, newFile)

  // Rename the collection in pages
  sections.filter((section) => section.key.startsWith('page-')).forEach((section) => {
    if (section.page.data && section.page.data.data === collection.name) {
      section.page.data.data = name
    }
  })

  // Update the collection
  collection.file = newFile
  collection.name = name

  // Update sections
  const section = sections.find((item) => item.collection === collection)
  if (section) {
    section.key = 'coll-' + collection.name
    section.text = collection.name
  }
}
