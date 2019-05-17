import { updateField } from 'vuex-map-fields'

export const mutations = {
  updateField,
  SET_SITES (state, sites) {
    state.sites = sites
  },
  SET_SITES_EXIST (state) {
    state.sitesExist = true
  },
  START_CREATING_SITE (state) {
    state.creatingSite = true
    state.info.name = 'New Site'
    state.info.title = 'New Site'
    state.info.intro = ''
  },
  STOP_CREATING_SITE (state) {
    state.creatingSite = false
  },
  END_CREATING_SITE (state, name) {
    state.creatingSite = false
    state.sitesExist = true
    state.sites.push(name)
  },
  SET_ACTIVE_SITE (state, site) {
    state.activeSite = site
  },
  SET_INFO_DEFINITION (state, def) {
    state.infoDefinition = def
  },
  SET_INFO (state, info) {
    state.info.name = info.name
    state.info.title = info.title
    state.info.intro = info.intro
  },
  SET_APPEARANCE_DEFINITION (state, def) {
    state.appearanceDefinition = def
  },
  SET_APPEARANCE (state, app) {
    // TODO:
  },
  SET_PAGE_DEFINITION (state, def) {
    state.pageDefinition = def
  },
  SET_COLLECTIONS (state, collections) {
    state.collections = collections
  },
  SET_PAGES (state, pages) {
    state.pages = pages
  },
  SET_BLOCKS (state, blocks) {
    state.blocks = blocks
  },
  SET_SECTIONS (state, items) {
    state.sections = items
  },
  SET_ACTIVE_SECTION (state, index) {
    state.sections.forEach((item, i) => {
      item.isActive = (i === index)
    })
  },
  SET_SETTINGS_VALUE (state, { name, key, value }) {
    const data =
      name === 'info' ? state.info
        : name === 'appearance' ? state.appearance
          : null
    data[key] = value
  },
  SET_PAGE_VALUE (state, { page, key, value }) {
    page.data[key] = value
  },
  SET_BLOCK_VALUE (state, { block, key, value }) {
    block.data[key] = value
  },
  SET_BLOCK_FIELDS (state, { block, fields }) {
    if (fields.id) block.id = fields.id
    if (fields.name) block.name = fields.name
    if (fields.content) block.content = fields.content
    if (fields.definition) block.definition = fields.definition
    if (fields.data) block.data = fields.data
    if (fields.tempFile) block.tempFile = fields.tempFile
  },
  SET_BLOCK_DATA (state, { block, data }) {
    block.data = data
  },
  INSERT_BLOCK (state, { page, block }) {
    page.blocks.push(block)
    // page.blocks = [...page.blocks, block]
  }
}