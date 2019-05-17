import fs from 'fs-extra'
import path from 'path'

import getFilesInFolder from './getFilesInFolder'

import Liquid from 'liquidjs'
import { exec } from 'child_process'

export default async function buildSite (context, name) {
  const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

  // Ensure the output folder exists
  const outputFolder = path.join(siteFolder, 'output')
  await fs.remove(outputFolder)
  await fs.ensureDir(outputFolder)

  // Ensure the includes, layouts and site folders exist
  const includesFolder = path.join(siteFolder, 'output', 'includes')
  const layoutsFolder = path.join(siteFolder, 'output', 'layouts')
  const webFolder = path.join(siteFolder, 'output', 'site')
  await fs.ensureDir(includesFolder)
  await fs.ensureDir(layoutsFolder)
  await fs.ensureDir(webFolder)

  // HACK: Copy the built-in default template to the output folder for the time being...
  // TODO: Figure out whether this is something that should be done
  //   Pro: allows us to update the default template for people
  //   Con: those updates may break things
  const builtInFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
  const defaultTemplateFolder = path.join(siteFolder, 'templates', 'default')
  await fs.copy(builtInFolder, defaultTemplateFolder)

  // Copy the default template to the output folder
  await fs.copy(defaultTemplateFolder, webFolder)

  // Uh, what was this?
  // // Move the default template layouts folder to the output layouts folder
  // const defaultLayoutFolder = path.join(siteFolder, 'layout')
  // const defaultLayoutFiles = await getFilesInFolder(defaultLayoutFolder)
  // for (let i = 0; i < defaultLayoutFiles.length; i++) {
  //   const source = defaultLayoutFiles[i]
  //   const dest = path.join(layoutsFolder, path.basename(defaultLayoutFiles[i]))
  //   await fs.move(source, dest)
  // }

  // TODO: Copy the theme template to the output folder (if applicable)
  // TODO: Move the theme template layouts folder to the output layouts folder
  // TODO: Need to have 'theme template' as part of info.json

  // Copy the used blocks into the includes folder
  // TODO: This probably isn't the right place to be getting them from
  const blockFiles = (await getFilesInFolder(path.join(__static, 'blocks'))).filter((file) => file.indexOf('.liquid') !== -1)
  for (let i = 0; i < blockFiles.length; i++) {
    const file = blockFiles[i]
    const parts = file.split(path.sep)
    const blockName = parts[parts.length - 2]
    const dest = path.join(includesFolder, blockName + '.liquid')
    fs.copySync(file, dest)
  }

  // Initialize the Liquid rendering engine
  const pagesFolder = path.join(siteFolder, 'pages')
  const engine = new Liquid({
    root: [pagesFolder, layoutsFolder, includesFolder]
  })

  // Generate each page in the pages folder
  context.state.pages.forEach(async (page) => {
    console.log('GENERATING', page.file)
    const result = await engine.renderFile(page.file, { name: page.name })

    // Write the output files
    const outputFile = path.join(webFolder, path.basename(page.file))
    fs.writeFile(outputFile, result, (err) => {
      if (err) {
        console.log('GEN ERROR', err)
      }
    })
  })

  // TODO: Concat and minify css from templates, layouts and blocks
  // TODO: Concat and minify css from templates, layouts and blocks

  // Open it in the user's default browser
  const indexFile = path.join(webFolder, 'index.html')
  exec(`"${indexFile}"`, (error, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    if (error !== null) {
      console.log(`OPEN ERROR: ${error}`)
    }
  })
}