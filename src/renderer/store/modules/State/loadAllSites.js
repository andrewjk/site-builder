import fs from 'fs-extra'
import path from 'path'

export default async function loadAllSites (context) {
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

  // Load the definition files which contain types, explanations etc for site info, appearance and page info
  const infoJsonFile = path.join(__static, 'info-def.json')
  const infoJson = await fs.readJson(infoJsonFile)
  context.commit('SET_INFO_DEFINITION', infoJson)

  const appearanceJsonFile = path.join(__static, 'appearance-def.json')
  const appearanceJson = await fs.readJson(appearanceJsonFile)
  context.commit('SET_APPEARANCE_DEFINITION', appearanceJson)

  const pageJsonFile = path.join(__static, 'page-def.json')
  const pageJson = await fs.readJson(pageJsonFile)
  context.commit('SET_PAGE_DEFINITION', pageJson)
}
