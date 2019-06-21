
export default async function buildPageContent (page) {
  let template = page.settings.layout || 'default.liquid'
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
<div class="data-item">
${block.html}
</div>
`.trimStart()
}

function buildBlockContent (block) {
  const name = `'${block.name}.liquid'`
  const data = formatBlockData(block.data)
  return `{% include ${name}${data.length ? ', ' : ''}${data} %}`
}

function formatBlockData (data, prefix = '') {
  if (!data) {
    return ''
  }
  return Object.keys(data)
    .filter((key) => data[key])
    .map((key) => data[key] && data[key] instanceof Object ? formatBlockData(data[key], prefix + key + '__') : `${prefix}${key}: '${data[key].replace('\'', '&#39;')}'`)
    .join(', ')
}
