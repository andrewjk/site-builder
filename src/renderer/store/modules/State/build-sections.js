
export default function buildSections (context) {
  // Build the sidebar items from pages, blocks etc
  const items = []
  // Settings
  items.push({
    isActive: false,
    key: 'title-info',
    class: 'title',
    type: 'title',
    text: 'Settings'
  })
  items.push({
    isActive: true,
    name: 'info',
    key: 'settings-info',
    class: 'item',
    type: 'settings',
    text: 'info',
    definition: context.state.infoDefinition,
    data: context.state.info
  })
  items.push({
    isActive: false,
    name: 'appearance',
    key: 'settings-appearance',
    class: 'item',
    type: 'settings',
    text: 'appearance',
    definition: context.state.appearanceDefinition,
    data: context.state.appearance
  })
  // Data
  items.push({
    isActive: false,
    key: 'title-data',
    class: 'title',
    type: 'title',
    text: 'Data'
  })
  context.state.collections.forEach((data) => {
    items.push({
      isActive: false,
      key: 'coll-' + data,
      class: 'item',
      type: 'collection',
      text: data
    })
  })
  items.push({
    key: 'add-data',
    class: 'add'
  })
  // Pages
  items.push({
    isActive: false,
    key: 'title-pages',
    class: 'title',
    type: 'title',
    text: 'Pages'
  })
  context.state.pages.forEach((page) => {
    items.push({
      isActive: false,
      page,
      key: 'page-' + page.name,
      class: 'item',
      type: 'page',
      text: page.name,
      definition: context.state.pageDefinition,
      data: page.data
    })
  })
  items.push({
    key: 'add-page',
    class: 'add'
  })
  // Blocks
  items.push({
    isActive: false,
    key: 'title-blocks',
    class: 'title',
    type: 'title',
    text: 'Blocks'
  })
  context.state.blocks.forEach((block) => {
    items.push({
      isActive: false,
      block,
      key: 'block-' + block.name,
      class: 'item',
      type: 'block',
      text: block.name,
      definition: block.definition,
      data: block.data
    })
  })
  items.push({
    key: 'add-block',
    class: 'add'
  })
  context.commit('SET_SECTIONS', items)
}
