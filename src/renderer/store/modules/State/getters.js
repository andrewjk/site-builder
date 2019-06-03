import { getField } from 'vuex-map-fields'

import buildCollectionSection from './build-collection-section'
import buildPageSection from './build-page-section'

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
  buildCollectionSection,
  buildPageSection
}
