import { getField } from 'vuex-map-fields'

export const getters = {
  getField,
  activeSection (state) {
    return state.sections.find((section) => {
      return section.isActive
    })
  },
  sites (state) {
    return state.sites
  },
  collections (state) {
    return state.collections
  },
  pages (state) {
    return state.pages
  },
  blocks (state) {
    return state.blocks
  },
  buildCollectionSection: (state) => (collection) => {
    return {
      isActive: false,
      collection,
      key: 'coll-' + collection.name,
      class: 'item',
      type: 'collection',
      text: collection.name,
      data: collection.data
    }
  },
  buildPageSection: (state) => (page) => {
    return {
      isActive: false,
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
