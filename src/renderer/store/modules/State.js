const state = {
  sitesExist: false,
  creatingSite: false
}

const mutations = {
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
    // TODO: Create the site files...
    context.commit('SITES_EXIST')
  },
  doLog (context) {
    context.commit('DO_LOG')
  }
}

export default {
  state,
  mutations,
  actions
}
