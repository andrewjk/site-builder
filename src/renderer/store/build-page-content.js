
export default async function buildPageContent (page) {
  let template = page.data.layout || 'default.liquid'
  if (template.indexOf('.liquid') === -1) {
    template = template + '.liquid'
  }

  const blockContent = page.blocks.map((block) => {
    if (block.name === 'content') {
      return buildContentContent(block)
    } else if (block.name === 'data-item') {
      return buildDataItemContent(block)
    } else {
      return buildBlockContent(block)
    }
  }).join('\n')

  const content = `
{% layout '${template}' %}
{% block content %}
${blockContent}
{% endblock %}`.trim()
  return content
}

function buildContentContent (block) {
  // NOTE: Trim the start but ensure there's a newline at the end for nicer output HTML formatting
  return `
<main>
  {% block content %}Page content{% endblock %}
</main>
`.trimStart()
}

function buildDataItemContent (block) {
  // NOTE: Trim the start but ensure there's a newline at the end for nicer output HTML formatting
  return `
<div id="data-item-content">
${block.html}
</div>
`.trimStart()
}

function buildBlockContent (block) {
  const name = `'${block.name}.liquid'`
  const data = Object.keys(block.data)
    .filter((key) => block.data[key])
    .map((key) => `${key}: '${block.data[key].replace('\'', '&#39;')}'`)
    .join(', ')
  return `{% include ${name}${data && data.length ? ', ' : ''}${data} %}`
}
