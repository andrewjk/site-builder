import path from 'path'
import { remote } from 'electron'

import loadAllSites from './loadAllSites'
import createSite from './createSite'
import loadSite from './loadSite'
import loadPage from './loadPage'
import loadBlock from './loadBlock'
import buildSections from './buildSections'
import saveSite from './saveSite'
import buildBlockContent from './buildBlockContent'
import buildSite from './buildSite'

export const actions = {
  getTemplatesFolder (context) {
    return path.join(__static, '/templates/')
  },
  getSitesFolder (context) {
    return path.join(remote.app.getPath('documents'), '/Site Builder')
  },
  loadAllSites,
  createSite,
  loadSite,
  loadPage,
  loadBlock,
  buildSections,
  setActiveSection (context, index) {
    context.commit('SET_ACTIVE_SECTION', index)
  },
  addSomething (context, index) {
    // TODO:
    alert('todo')
  },
  saveSite,
  buildBlockContent,
  buildSite
}
