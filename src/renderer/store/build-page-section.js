
export default function buildPageSection (page, pageDefinition) {
  return {
    selected: false,
    page,
    key: 'page-' + page.name,
    class: 'item',
    type: 'page',
    text: page.name,
    definition: pageDefinition,
    data: page.data
  }
}
