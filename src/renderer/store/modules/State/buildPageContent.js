
export default async function buildPageContent (context, { page }) {
  const content = page.blocks.map((block) => {
    const name = `'${block.name}.liquid'`
    const data = Object.keys(block.data)
      .filter((key) => block.data[key])
      .map((key) => `${key}: '${block.data[key].replace('\'', '\\\'')}'`)
      .join(', ')
    return `{% include ${[name, data].join(', ')} %}`
  }).join('\n')
  return content
}
