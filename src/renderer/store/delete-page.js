import electron from 'electron'

const { shell } = electron

export default function deletePage (page, pages, sections) {
  shell.moveItemToTrash(page.file)
  shell.moveItemToTrash(page.file.replace('.liquid', '.json'))

  const index = pages.indexOf(page)
  pages.splice(index, 1)

  const sectionIndex = sections.findIndex((item) => item.page && item.page === page)
  if (sectionIndex !== -1) {
    sections.splice(sectionIndex, 1)
  }

  return sections[sectionIndex - 1]
}
