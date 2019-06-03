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
  ADD_COLLECTION (state, { collection, section }) {
    state.collections.push(collection)
    const addSection = state.sections.find((item) => item.key === 'add-collection')
    const index = state.sections.indexOf(addSection)
    state.sections.splice(index, 0, section)
  },
  ADD_DEFINITION (state, definitions) {
    definitions.push({
      key: '',
      name: '',
      type: 'text'
    })
  },
  SET_DEFINITION_FIELDS (state, { definition, fields, collection }) {
    if (fields.key) {
      const oldKey = definition.key
      definition.key = fields.key
      // Update items in the collection with this new key
      collection.forEach((item) => {
        item[fields.key] = item[oldKey]
        item[oldKey] = undefined
      })
    }
    if (fields.name) definition.name = fields.name
    if (fields.type) definition.type = fields.type
  },
  ADD_COLLECTION_ITEM (state, { collection, definitions }) {
    const item = {}
    for (let i = 0; i < definitions.length; i++) {
      // TODO: From type e.g. numbers should be 0
      item[definitions[i].key] = ''
    }
    collection.push(item)
  },
  SET_COLLECTION_ITEM_VALUE (state, { item, key, value }) {
    item[key] = value
  },
  SET_PAGES (state, pages) {
    state.pages = pages
  },
  ADD_PAGE (state, { page, section }) {
    state.pages.push(page)
    const addSection = state.sections.find((item) => item.key === 'add-page')
    const index = state.sections.indexOf(addSection)
    state.sections.splice(index, 0, section)
  },
  SET_BLOCKS (state, blocks) {
    state.blocks = blocks
  },
  SET_SECTIONS (state, items) {
    state.sections = items
  },
  SET_ACTIVE_SECTION (state, section) {
    state.sections.forEach((item) => {
      item.isActive = (item.key === section.key)
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
  SET_PAGE_FIELDS (state, { page, fields }) {
    if (fields.id) page.id = fields.id
    if (fields.tempFile) page.tempFile = fields.tempFile
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
  },
  SET_BLOCK_DATA (state, { block, data }) {
    block.data = data
  },
  INSERT_BLOCK (state, { page, block }) {
    page.blocks.push(block)
    // page.blocks = [...page.blocks, block]
  },
  MOVE_BLOCK_UP (state, { page, block }) {
    const index = page.blocks.indexOf(block)
    if (index > 0) {
      page.blocks.splice(index - 1, 0, page.blocks.splice(index, 1)[0])
    }
  },
  MOVE_BLOCK_DOWN (state, { page, block }) {
    const index = page.blocks.indexOf(block)
    if (index < page.blocks.length - 1) {
      page.blocks.splice(index + 1, 0, page.blocks.splice(index, 1)[0])
    }
  },
  DELETE_BLOCK (state, { page, block }) {
    const index = page.blocks.indexOf(block)
    page.blocks.splice(index, 1)
  },
  DELETE_COLLECTION (state, collection) {
    const index = state.collections.indexOf(collection)
    state.collections.splice(index, 1)

    const sectionIndex = state.sections.findIndex((item) => item.collection === collection)
    if (sectionIndex !== -1) {
      state.sections.splice(sectionIndex, 1)
    }
  },
  DELETE_PAGE (state, page) {
    const index = state.pages.indexOf(page)
    state.pages.splice(index, 1)

    const sectionIndex = state.sections.findIndex((item) => item.page && item.page === page)
    if (sectionIndex !== -1) {
      state.sections.splice(sectionIndex, 1)
    }
  },
  TOGGLE_RENAMING_SECTION (state, section) {
    section.renaming = !section.renaming
  },
  RENAME_COLLECTION (state, { collection, name }) {
    collection.file = collection.file.replace(collection.name + '.liquid', name + '.liquid')
    collection.name = name

    const section = state.sections.find((item) => item.collection === collection)
    if (section) {
      section.key = 'coll-' + collection.name
      section.text = collection.name
    }
  },
  RENAME_PAGE (state, { page, name }) {
    page.file = page.file.replace(page.name + '.liquid', name + '.liquid')
    page.name = name

    const section = state.sections.find((item) => item.page === page)
    if (section) {
      section.key = 'page-' + page.name
      section.text = page.name
    }
  }
}
