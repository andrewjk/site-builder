import electron from 'electron'

const { shell } = electron

export default function deleteCollection (context, collection) {
  shell.moveItemToTrash(collection.file)
  context.commit('DELETE_COLLECTION', collection)
}
