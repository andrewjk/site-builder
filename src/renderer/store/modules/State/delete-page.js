import electron from 'electron'

const { shell } = electron

export default function deletePage (context, page) {
  shell.moveItemToTrash(page.file)
  shell.moveItemToTrash(page.file.replace('.liquid', '.json'))
  context.commit('DELETE_PAGE', page)
}
