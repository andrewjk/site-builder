export default function buildStyles (site, definitions) {
  // TODO: Concat and minify CSS from appearance, templates, layouts and blocks
  let styles = ''
  const htmlStyles = []
  const bodyStyles = []
  definitions.appearance.fields.forEach(def => {
    if (site.appearance[def.key]) {
      if (def.appliesTo === 'html') {
        htmlStyles.push(`${formatStyleName(def.key)}: ${site.appearance[def.key]}`)
      } else if (def.appliesTo === 'body') {
        bodyStyles.push(`${formatStyleName(def.key)}: ${site.appearance[def.key]}`)
      }
    }
  })
  if (htmlStyles.length) {
    styles = styles + `
html {
  ${htmlStyles.join(';\n')}
}`
  }
  if (bodyStyles.length) {
    styles = styles + `
body {
  ${bodyStyles.join(';\n')}
}`
  }

  // For now, we're just loading CSS from blocks into site.css
  const allBlocks = [].concat.apply([], site.pages.map(page => page.blocks))
  const templateBlocks = allBlocks.map(block => site.blocks.find(tb => block.name === tb.name))
  const uniqueBlocks = [...new Set(templateBlocks)]
  for (let i = 0; i < uniqueBlocks.length; i++) {
    styles = styles + '\n' + uniqueBlocks[i].styles
  }

  return styles
}

function formatStyleName (text) {
  return text.replace(/([A-Z])/, '-$1').toLowerCase()
}
