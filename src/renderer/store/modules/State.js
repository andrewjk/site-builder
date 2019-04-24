import { getField, updateField } from 'vuex-map-fields'

import fs from 'fs-extra'
import path from 'path'
import walk from 'klaw'
import { remote } from 'electron'

import Liquid from 'liquidjs'
import { exec } from 'child_process'

const state = {
  sites: [],
  // TODO: This should be state
  sitesExist: false,
  creatingSite: false,
  activeSite: '',
  info: {
    name: '',
    title: '',
    intro: ''
    // etc
  },
  pages: []
}

const getters = {
  getField
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
  SET_INFO (state, info) {
    state.info.name = info.name
    state.info.title = info.title
    state.info.intro = info.intro
  },
  SET_PAGES (state, pages) {
    state.pages = pages
  }
}

const actions = {
  getTemplatesFolder (context) {
    return path.join(__static, '/templates/')
  },
  getSitesFolder (context) {
    return path.join(remote.app.getPath('appData'), '/Site Builder/sites/')
  },
  async loadAllSites (context) {
    const sitesFolder = await context.dispatch('getSitesFolder')
    const isDirectory = sitesFolder => fs.lstatSync(sitesFolder).isDirectory()
    const sites = fs.readdirSync(sitesFolder).map(name => path.join(sitesFolder, name)).filter(isDirectory).map(name => path.basename(name))
    context.commit('SET_SITES', sites)
    if (sites.length) {
      context.commit('SET_SITES_EXIST')
      context.dispatch('loadSite', sites[0])
    }
  },
  startCreatingSite (context) {
    context.commit('START_CREATING_SITE')
  },
  async createSite (context) {
    // Copy the template files
    const templateFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), state.info.name)
    await fs.copy(templateFolder, path.join(siteFolder, 'templates', 'default'))
    // Create the info file
    const dataFolder = path.join(siteFolder, 'data')
    await fs.mkdir(dataFolder)
    await fs.writeJSON(path.join(dataFolder + '/info.json'), state.info)
    context.commit('END_CREATING_SITE', state.info.name)
    context.commit('SET_ACTIVE_SITE', state.info.name)
  },
  async loadSite (context, name) {
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)
    // Load the info
    const infoFile = path.join(siteFolder, 'data/info.json')
    fs.readJSON(infoFile).then((info) => {
      context.commit('SET_INFO', info)
      context.commit('SET_ACTIVE_SITE', name)
    })
    // Load the pages that have been created
    const pages = []
    walk(path.join(siteFolder, 'pages'))
      .on('data', item => {
        if (!item.stats.isDirectory()) {
          const fileName = item.path.substring(item.path.lastIndexOf(path.sep) + 1, item.path.lastIndexOf('.'))
          console.log(fileName)
          pages.push(fileName)
        }
      })
      .on('end', () => context.commit('SET_PAGES', pages))
  },
  async buildSite (context, name) {
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

    // Ensure the output folder exists
    const outputFolder = path.join(siteFolder, 'output')
    await fs.remove(outputFolder)
    await fs.ensureDir(outputFolder)

    // HACK: Recopy the templates to the output folder for the time being...
    const tempFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
    const templateFolder = path.join(siteFolder, 'templates', 'default')
    await fs.copy(tempFolder, templateFolder)

    // Copy the default template to the output folder
    await fs.copy(templateFolder, outputFolder)

    // TODO: Copy the theme template to the output folder (if applicable)

    // Liquid rendering
    const pagesFolder = path.join(siteFolder, 'pages')
    const engine = new Liquid({
      root: pagesFolder, // root for layouts/includes lookup
      extname: '.html' // used for layouts/includes, defaults ''
    })

    // Generate each page in the pages folder
    state.pages.map(async (item) => {
      console.log('GENERATING', item)
      const result = await engine.renderFile(item, { name: item })

      // Write the output files
      const outputFile = path.resolve(outputFolder, item + '.html')
      fs.writeFile(outputFile, result, (err) => {
        if (err) {
          console.log('GEN ERROR', err)
        }
      })
    })

    // Open it in the user's default browser
    const indexFile = path.join(outputFolder, 'index.html')
    exec(`"${indexFile}"`, (error, stdout, stderr) => {
      console.log(stdout)
      console.log(stderr)
      if (error !== null) {
        console.log(`OPEN ERROR: ${error}`)
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
