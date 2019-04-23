import { getField, updateField } from 'vuex-map-fields'

import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'

import Liquid from 'liquidjs'

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
  }
}

const getters = {
  getField
}

const mutations = {
  updateField,
  SET_SITES (state, data) {
    state.sites = data
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
  END_CREATING_SITE (state, data) {
    state.creatingSite = false
    state.sitesExist = true
    state.sites.push(data)
  },
  SET_ACTIVE_SITE (state, data) {
    state.activeSite = data
  },
  SET_INFO (state, data) {
    state.info.name = data.name
    state.info.title = data.title
    state.info.intro = data.intro
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
    await fs.copy(templateFolder, siteFolder)
    // Create the info file
    const dataFolder = path.join(siteFolder, 'data')
    await fs.mkdir(dataFolder)
    await fs.writeJSON(path.join(dataFolder + '/info.json'), state.info)
    context.commit('END_CREATING_SITE', state.info.name)
    context.commit('SET_ACTIVE_SITE', state.info.name)
  },
  async loadSite (context, name) {
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)
    const infoFile = path.join(siteFolder, 'data/info.json')
    fs.readJSON(infoFile).then((info) => {
      context.commit('SET_INFO', info)
      context.commit('SET_ACTIVE_SITE', name)
    })
  },
  async buildSite (context, name) {
    // Ensure the output folder exists
    const templateFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
    const outputFolder = path.join(await context.dispatch('getSitesFolder'), name, 'output')
    await fs.ensureDir(outputFolder)

    // Liquid rendering
    const engine = new Liquid({
      root: templateFolder, // root for layouts/includes lookup
      extname: '.liquid' // used for layouts/includes, defaults ''
    })
    const result = await engine.renderFile('index', { name: 'alice' }) // will read and render `views/hello.liquid`

    // Write the output files
    const outputFile = path.resolve(outputFolder, 'index.html')
    fs.writeFile(outputFile, result, (err) => {
      if (err) console.log(err)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
