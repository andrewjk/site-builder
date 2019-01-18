import { getField, updateField } from 'vuex-map-fields'

import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'

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
  SITES_EXIST (state) {
    state.sitesExist = true
  },
  START_CREATING_SITE (state) {
    state.creatingSite = true
    state.info.name = 'New Site'
    state.info.title = 'New Site'
    state.info.intro = ''
  },
  DONE_CREATING_SITE (state, data) {
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
  loadAllSites (context) {
    const source = path.join(remote.app.getPath('appData'), '/Site Builder/sites/')
    const isDirectory = source => fs.lstatSync(source).isDirectory()
    const sites = fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory).map(name => path.basename(name))
    context.commit('SET_SITES', sites)
    if (sites.length) {
      context.commit('SITES_EXIST')
      context.dispatch('loadSite', sites[0])
    }
  },
  startCreatingSite (context) {
    context.commit('START_CREATING_SITE')
  },
  createSite (context) {
    // Copy the template files
    const source = path.join(__static, '/templates/default/')
    const dest = path.join(remote.app.getPath('appData'), '/Site Builder/sites/' + state.info.name)
    fs.copy(source, dest).then(() => {
      // Create the info file
      const dataFolder = path.join(dest, '/data/')
      fs.mkdir(dataFolder).then(() => {
        fs.writeJSON(path.join(dataFolder + '/info.json'), state.info)
      }).then(() => {
        context.commit('DONE_CREATING_SITE', state.info.name)
        context.commit('SET_ACTIVE_SITE', state.info.name)
      })
    })
  },
  loadSite (context, data) {
    const source = path.join(remote.app.getPath('appData'), '/Site Builder/sites/' + data + '/data/info.json')
    fs.readJSON(source).then((info) => {
      context.commit('SET_INFO', info)
      context.commit('SET_ACTIVE_SITE', data)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
