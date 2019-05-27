
export default async function buildPageContent (context, { page }) {
  let template = page.data.layout || 'default.liquid'
  if (template.indexOf('.liquid') === -1) {
    template = template + '.liquid'
  }
  const blockContent = page.blocks.map((block) => {
    if (block.name === 'content') {
      // NOTE: Trim the start but ensure there's a newline at the end for nicer output HTML formatting
      return `
<main>
  {% block content %}Page content{% endblock %}
</main>
`.trimStart()
    } else {
      const name = `'${block.name}.liquid'`
      const data = Object.keys(block.data)
        .filter((key) => block.data[key])
        .map((key) => `${key}: '${block.data[key].replace('\'', '&#39;')}'`)
        .join(', ')
      return `{% include ${name}${data && data.length ? ', ' : ''}${data} %}`
    }
  }).join('\n')
  const content = `
{% layout '${template}' %}
{% block content %}
${blockContent}
{% endblock %}`.trim()
  return content
}
