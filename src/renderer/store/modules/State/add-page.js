import fs from 'fs-extra'
import path from 'path'
import { create } from 'vue-modal-dialogs'

import PromptDialog from '../../../components/Dialogs/PromptDialog'

export default async function addPage (context) {
  const prompt = create(PromptDialog)
  const pageName = await prompt({ content: 'Enter the new page\'s name:' }).transition()
  if (pageName) {
    // TODO: Check that it's valid
    const name = pageName.replace(/ /g, '_')

    // Create the empty files
    const siteName = context.state.activeSite
    const pagesFolder = path.join(await context.dispatch('getSitesFolder'), siteName, 'pages')
    const file = path.join(pagesFolder, name + '.liquid')
    fs.writeFile(file)

    const data = {}
    const dataFile = file.replace('.liquid', '.json')
    fs.writeJSON(dataFile, data)

    // Add the page to the current site
    const page = {
      file,
      name,
      data,
      blocks: [],
      tempFile: null
    }
    const section = context.getters.buildPageSection(page)
    context.commit('ADD_PAGE', { page, section })

    // Set the active section to this page
    context.commit('SET_ACTIVE_SECTION', section)
  }
}
