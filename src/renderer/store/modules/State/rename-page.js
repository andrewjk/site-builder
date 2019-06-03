import fs from 'fs-extra'

export default async function renamePage (context, { page, name }) {
  const oldFile = page.file
  const newFile = page.file.replace(page.name + '.liquid', name + '.liquid')
  await fs.move(oldFile, newFile)
  await fs.move(oldFile.replace('.liquid', '.json'), newFile.replace('.liquid', '.json'))
  context.commit('RENAME_PAGE', { page, name })
}
