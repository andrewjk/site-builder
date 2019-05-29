import fs from 'fs-extra'
import path from 'path'
import { create } from 'vue-modal-dialogs'

import PromptDialog from '../../../components/Dialogs/PromptDialog'

export default async function addData (context) {
  const prompt = create(PromptDialog)
  const collectionName = await prompt({ content: 'Enter the new collection\'s name:' }).transition()
  if (collectionName) {
    // TODO: Check that it's valid
    const name = collectionName.replace(/ /g, '_')

    // Create the empty file
    const data = {}
    const siteName = context.state.activeSite
    const dataFolder = path.join(await context.dispatch('getSitesFolder'), siteName, 'data')
    const file = path.join(dataFolder, name + '.json')
    fs.writeJSON(file, data)

    // Add the data to the current site
    const collection = {
      file,
      name,
      data
    }
    const section = context.getters.buildCollectionSection(collection)
    context.commit('ADD_COLLECTION', { collection, section })

    // Set the active section to this collection
    context.commit('SET_ACTIVE_SECTION', section)
  }
}
