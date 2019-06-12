
import buildCollectionSection from './build-collection-section'
import buildPageSection from './build-page-section'

export default function buildSections (activeSite, definitions) {
  // Build the sidebar items from pages, blocks etc
  const items = []
  // Settings
  items.push({
    selected: false,
    key: 'title-info',
    class: 'title',
    type: 'title',
    text: 'Settings'
  })
  items.push({
    selected: true,
    name: 'info',
    key: 'settings-info',
    class: 'item',
    type: 'settings',
    text: 'info',
    definition: definitions.info,
    data: activeSite.info
  })
  items.push({
    selected: false,
    name: 'appearance',
    key: 'settings-appearance',
    class: 'item',
    type: 'settings',
    text: 'appearance',
    definition: definitions.appearance,
    data: activeSite.appearance
  })
  // Data
  items.push({
    selected: false,
    key: 'title-data',
    class: 'title',
    type: 'title',
    text: 'Data'
  })
  activeSite.collections.forEach((collection) => {
    const section = buildCollectionSection(collection)
    items.push(section)
  })
  items.push({
    key: 'add-collection',
    class: 'add'
  })
  // Pages
  items.push({
    selected: false,
    key: 'title-pages',
    class: 'title',
    type: 'title',
    text: 'Pages'
  })
  activeSite.pages.forEach((page) => {
    const section = buildPageSection(page, definitions.page)
    items.push(section)
  })
  items.push({
    key: 'add-page',
    class: 'add'
  })
  // Blocks
  items.push({
    selected: false,
    key: 'title-blocks',
    class: 'title',
    type: 'title',
    text: 'Blocks'
  })
  activeSite.blocks.forEach((block) => {
    items.push({
      selected: false,
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
  return items
}
