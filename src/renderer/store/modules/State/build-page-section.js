
export default function buildPageSection (state) {
  return (page) => {
    return {
      isActive: false,
      renaming: false,
      page,
      key: 'page-' + page.name,
      class: 'item',
      type: 'page',
      text: page.name,
      definition: state.pageDefinition,
      data: page.data
    }
  }
}
