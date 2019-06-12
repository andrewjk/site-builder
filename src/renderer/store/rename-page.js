import fs from 'fs-extra'

export default async function renamePage (page, name, sections) {
  const oldFile = page.file
  const newFile = page.file.replace(page.name + '.liquid', name + '.liquid')
  await fs.move(oldFile, newFile)
  await fs.move(oldFile.replace('.liquid', '.json'), newFile.replace('.liquid', '.json'))

  // TODO: Need to update these in components etc
  page.file = newFile
  page.name = name

  const section = sections.find((item) => item.page === page)
  if (section) {
    section.key = 'page-' + page.name
    section.text = page.name
  }
}
