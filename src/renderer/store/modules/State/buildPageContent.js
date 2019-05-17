
export default async function buildPageContent (context, { page }) {
  let template = page.data.layout || 'default.liquid'
  if (template.indexOf('.liquid') === -1) {
    template = template + '.liquid'
  }
  const blockContent = page.blocks.map((block) => {
    const name = `'${block.name}.liquid'`
    const data = Object.keys(block.data)
      .filter((key) => block.data[key])
      .map((key) => `${key}: '${block.data[key].replace('\'', '\\\'')}'`)
      .join(', ')
    return `{% include ${[name, data].join(', ')} %}`
  }).join('\n')
  const content = `
{% layout '${template}' %}
{% block content %}
${blockContent}
{% endblock %}`.trim()
  return content
}
