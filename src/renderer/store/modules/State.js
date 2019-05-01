import { getField, updateField } from 'vuex-map-fields'

import fs from 'fs-extra'
import path from 'path'
import walk from 'klaw'
import { remote } from 'electron'

import Liquid from 'liquidjs'
import { exec } from 'child_process'

const state = {
  sites: [],
  sitesExist: false,
  creatingSite: false,
  activeSite: '',
  infoDefinition: {},
  // TODO: Fold this into each site
  info: {
    name: '',
    title: '',
    description: '',
    icon: null
    // etc
  },
  appearanceDefinition: {},
  appearance: {
    // TODO:
  },
  // TODO: Fold this into each site
  collections: [],
  pages: [],
  blocks: [],
  sections: []
}

const getters = {
  getField,
  activeSection (state) {
    return state.sections.find((section) => {
      // if (section.isActive) console.log('got active section', section.text)
      return section.isActive
    })
  }
}

const mutations = {
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
  }
}

const actions = {
  getTemplatesFolder (context) {
    return path.join(__static, '/templates/')
  },
  getSitesFolder (context) {
    return path.join(remote.app.getPath('documents'), '/Site Builder')
  },
  async loadAllSites (context) {
    // Load the folders in the sites directory
    const sitesFolder = await context.dispatch('getSitesFolder')
    const isDirectory = sitesFolder => fs.lstatSync(sitesFolder).isDirectory()
    const sites = fs.readdirSync(sitesFolder).map(name => path.join(sitesFolder, name)).filter(isDirectory).map(name => path.basename(name))
    context.commit('SET_SITES', sites)

    // Load the first site
    // TODO: Should load the previous site used
    if (sites.length) {
      context.commit('SET_SITES_EXIST')
      context.dispatch('loadSite', sites[0])
    }

    // Load the definition files which contain types, explanations etc for site info and appearance
    const infoJsonFile = path.join(__static, 'info.json')
    const infoJson = await fs.readJson(infoJsonFile)
    context.commit('SET_INFO_DEFINITION', infoJson)

    const appearanceJsonFile = path.join(__static, 'appearance.json')
    const appearanceJson = await fs.readJson(appearanceJsonFile)
    context.commit('SET_APPEARANCE_DEFINITION', appearanceJson)
  },
  startCreatingSite (context) {
    context.commit('START_CREATING_SITE')
  },
  async createSite (context) {
    // Copy the template files
    const templateFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), state.info.name)
    await fs.copy(templateFolder, path.join(siteFolder, 'templates', 'default'))

    // Create the data files
    const dataFolder = path.join(siteFolder, 'data')
    await fs.mkdir(dataFolder)
    await fs.writeJSON(path.join(dataFolder + '/info.json'), state.info)
    await fs.writeJSON(path.join(dataFolder + '/appearance.json'), state.info)
    context.commit('END_CREATING_SITE', state.info.name)
    context.commit('SET_ACTIVE_SITE', state.info.name)
  },
  async loadSite (context, name) {
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

    // TODO: Rename info.json to info.json
    // Load the data from info.json and appearance.json
    const infoFile = path.join(siteFolder, 'data/info.json')
    fs.readJSON(infoFile).then((info) => {
      context.commit('SET_INFO', info)
    })
    const appearanceFile = path.join(siteFolder, 'data/appearance.json')
    fs.readJSON(appearanceFile).then((app) => {
      context.commit('SET_APPEARANCE', app)
    })

    // Load other data
    let collections = await getFilesInFolder(path.join(siteFolder, 'data'))
    collections = collections
      .filter((item) => item !== 'info.json' && item !== 'appearance.json')
      .map((item) => {
        return item.substring(item.lastIndexOf(path.sep) + 1, item.lastIndexOf('.'))
      })
    context.commit('SET_COLLECTIONS', collections)

    // Load the pages that have been created
    let pages = await getFilesInFolder(path.join(siteFolder, 'pages'))
    pages = pages.map((item) => {
      return item.substring(item.lastIndexOf(path.sep) + 1, item.lastIndexOf('.'))
    })
    context.commit('SET_PAGES', pages)

    // Load the pages that are available
    const blocks = await getDirectoriesInFolder(path.join(__static, 'blocks'))
    context.commit('SET_BLOCKS', blocks)

    // Now that that's all done, load the sections to display in the sidebar and set this site to active
    context.dispatch('loadSections')
    context.commit('SET_ACTIVE_SITE', name)
  },
  loadSections (context) {
    // Build the sidebar items from pages, blocks etc
    const items = []
    // Info
    items.push({
      isActive: false,
      key: 'title-info',
      class: 'title',
      type: 'title',
      text: 'Settings'
    })
    items.push({
      isActive: true,
      key: 'info-json',
      class: 'item',
      type: 'data',
      text: 'info',
      definition: state.infoDefinition,
      data: state.info
    })
    items.push({
      isActive: false,
      key: 'appearance-json',
      class: 'item',
      type: 'data',
      text: 'appearance',
      definition: state.appearanceDefinition,
      data: state.appearance
    })
    // Data
    items.push({
      isActive: false,
      key: 'title-data',
      class: 'title',
      type: 'title',
      text: 'Data'
    })
    state.collections.forEach((data) => {
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
    state.pages.forEach((page) => {
      items.push({
        isActive: false,
        key: 'page-' + page,
        class: 'item',
        type: 'page',
        text: page
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
    state.blocks.forEach((block) => {
      items.push({
        isActive: false,
        key: 'block-' + block,
        class: 'item',
        type: 'block',
        text: block
      })
    })
    items.push({
      key: 'add-block',
      class: 'add'
    })
    context.commit('SET_SECTIONS', items)
  },
  setActiveSection (context, index) {
    context.commit('SET_ACTIVE_SECTION', index)
  },
  addSomething (context, index) {
    // TODO:
    alert('todo')
  },
  async buildSite (context, name) {
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

    // Ensure the output folder exists
    const outputFolder = path.join(siteFolder, 'output')
    await fs.remove(outputFolder)
    await fs.ensureDir(outputFolder)

    // Ensure the includes, layouts and site folders exist
    const includesFolder = path.join(siteFolder, 'output', 'includes')
    const layoutsFolder = path.join(siteFolder, 'output', 'layouts')
    const webFolder = path.join(siteFolder, 'output', 'site')
    await fs.ensureDir(includesFolder)
    await fs.ensureDir(layoutsFolder)
    await fs.ensureDir(webFolder)

    // HACK: Copy the built-in default template to the output folder for the time being...
    // TODO: Figure out whether this is something that should be done
    //       Pro: allows us to update the default template for people
    //       Con: those updates may break things
    const builtInFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
    const defaultTemplateFolder = path.join(siteFolder, 'templates', 'default')
    await fs.copy(builtInFolder, defaultTemplateFolder)

    // Copy the default template to the output folder
    await fs.copy(defaultTemplateFolder, webFolder)

    // Move the default template layouts folder to the output layouts folder
    const defaultLayoutFolder = path.join(webFolder, 'layout')
    const defaultLayoutFiles = await getFilesInFolder(defaultLayoutFolder)
    for (let i = 0; i < defaultLayoutFiles.length; i++) {
      const source = path.join(defaultLayoutFolder, defaultLayoutFiles[i])
      const dest = path.join(layoutsFolder, defaultLayoutFiles[i])
      await fs.move(source, dest)
    }

    // TODO: Copy the theme template to the output folder (if applicable)
    // TODO: Move the theme template layouts folder to the output layouts folder
    // TODO: Need to have 'theme template' as part of info.json

    // TODO: Copy the used blocks into the includes folder

    // Initialize the Liquid rendering engine
    const pagesFolder = path.join(siteFolder, 'pages')
    const engine = new Liquid({
      root: [ pagesFolder, layoutsFolder, includesFolder ]
    })

    // Generate each page in the pages folder
    state.pages.map(async (item) => {
      console.log('GENERATING', item)
      const itemFile = path.join(pagesFolder, item + '.html')
      const result = await engine.renderFile(itemFile, { name: item })

      // Write the output files
      const outputFile = path.resolve(webFolder, item + '.html')
      fs.writeFile(outputFile, result, (err) => {
        if (err) {
          console.log('GEN ERROR', err)
        }
      })
    })

    // TODO: Concat and minify css from templates, layouts and blocks
    // TODO: Concat and minify css from templates, layouts and blocks

    // Open it in the user's default browser
    const indexFile = path.join(webFolder, 'index.html')
    exec(`"${indexFile}"`, (error, stdout, stderr) => {
      console.log(stdout)
      console.log(stderr)
      if (error !== null) {
        console.log(`OPEN ERROR: ${error}`)
      }
    })
  }
}

function getFilesInFolder (root) {
  return new Promise((resolve, reject) => {
    const result = []
    walk(root)
      .on('data', item => {
        if (!item.stats.isDirectory()) {
          const fileName = item.path.substring(item.path.lastIndexOf(path.sep) + 1)
          result.push(fileName)
        }
      })
      .on('end', () => resolve(result))
  })
}

function getDirectoriesInFolder (root) {
  return new Promise((resolve, reject) => {
    let first = true
    const result = []
    walk(root)
      .on('data', item => {
        if (item.stats.isDirectory()) {
          // Skip the root folder
          if (first) {
            first = false
            return
          }
          const dirName = item.path.substring(item.path.lastIndexOf(path.sep) + 1)
          result.push(dirName)
        }
      })
      .on('end', () => resolve(result))
  })
}

export default {
  state,
  getters,
  mutations,
  actions
}
