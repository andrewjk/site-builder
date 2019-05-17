import fs from 'fs-extra'
import path from 'path'

export default async function createSite (context) {
  // Copy the template files
  const templateFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
  const siteFolder = path.join(await context.dispatch('getSitesFolder'), context.state.info.name)
  await fs.copy(templateFolder, path.join(siteFolder, 'templates', 'default'))

  // Create the data files
  const dataFolder = path.join(siteFolder, 'data')
  await fs.mkdir(dataFolder)
  await fs.writeJSON(path.join(dataFolder + '/info.json'), context.state.info)
  await fs.writeJSON(path.join(dataFolder + '/appearance.json'), context.state.info)
  context.commit('END_CREATING_SITE', context.state.info.name)
  context.commit('SET_ACTIVE_SITE', context.state.info.name)
}
