import { getField, updateField } from 'vuex-map-fields'

import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'

const state = {
  sitesExist: false,
  creatingSite: false,
  info: {
    name: '',
    title: '',
    intro: ''
    // ...
  }
}

const getters = {
  getField
}

const mutations = {
  updateField,
  START_CREATING_SITE (state) {
    state.creatingSite = true
  },
  SITES_EXIST (state) {
    state.sitesExist = true
  }
}

const actions = {
  startCreatingSite (context) {
    context.commit('START_CREATING_SITE')
  },
  createSite (context) {
    // Copy the template files
    console.log(state.info)

    const source = path.join(__static, '/templates/default/')
    const dest = path.join(remote.app.getPath('appData'), '/Site Builder/sites/' + state.info.name)
    console.log(source, dest)
    fs.copy(source, dest)

    // Create the info files

    // Now at least one site exists
    context.commit('SITES_EXIST')
  },
  doLog (context) {
    context.commit('DO_LOG')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
