import electron from 'electron'

const { shell } = electron

export default function deleteCollection (collection, collections, sections) {
  shell.moveItemToTrash(collection.file)

  const index = collections.indexOf(collection)
  collections.splice(index, 1)

  const sectionIndex = sections.findIndex((item) => item.collection === collection)
  if (sectionIndex !== -1) {
    sections.splice(sectionIndex, 1)
  }

  return sections[sectionIndex - 1]
}
