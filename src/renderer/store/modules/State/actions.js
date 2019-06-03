import path from 'path'
import { remote } from 'electron'

import loadAllSites from './load-all-sites'
import createSite from './create-site'
import loadSite from './load-site'
import loadCollection from './load-collection'
import loadPage from './load-page'
import loadBlock from './load-block'
import buildSections from './build-sections'
import addPage from './add-page'
import addData from './add-collection'
import saveSite from './save-site'
import buildPageContent from './build-page-content'
import buildPageEditorHtml from './build-page-editor-html'
import buildSite from './build-site'
import deleteCollection from './delete-collection'
import deletePage from './delete-page'
import renameCollection from './rename-collection'
import renamePage from './rename-page'

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
  loadCollection,
  loadPage,
  loadBlock,
  buildSections,
  setActiveSection (context, section) {
    context.commit('SET_ACTIVE_SECTION', section)
  },
  addPage,
  addData,
  saveSite,
  buildPageContent,
  buildPageEditorHtml,
  buildSite,
  deleteCollection,
  deletePage,
  renameCollection,
  renamePage
}
