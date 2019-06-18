import fs from 'fs-extra'

export default async function renamePage (page, name, sections) {
  if (page.name.localeCompare(name, undefined, { sensitivity: 'accent' }) === 0) {
    // TODO: throw a proper error
    return
  }

  const oldFile = page.file
  const newFile = page.file.replace(page.name + '.liquid', name + '.liquid')
  await fs.move(oldFile, newFile)
  await fs.move(oldFile.replace('.liquid', '.json'), newFile.replace('.liquid', '.json'))

  // Update the page
  page.file = newFile
  page.name = name

  // Rename the page in sections
  const section = sections.find((item) => item.page === page)
  if (section) {
    section.key = 'page-' + page.name
    section.text = page.name
  }
}
