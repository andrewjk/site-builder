import fs from 'fs-extra'

export default async function renameCollection (context, { collection, name }) {
  const oldFile = collection.file
  const newFile = collection.file.replace(collection.name + '.json', name + '.json')
  await fs.move(oldFile, newFile)
  context.commit('RENAME_COLLECTION', { collection, name })
}
