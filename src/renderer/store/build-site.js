import fs from 'fs-extra'
import path from 'path'

import getSiteFolder from './get-site-folder'
import getFilesInFolder from './get-files-in-folder'
import buildPageContent from './build-page-content'
import buildStyles from './build-styles'
import buildStyleAttribute from './build-style-attribute'

import Liquid from 'liquidjs'
import { exec } from 'child_process'
// eslint-disable-next-line camelcase
import { html_beautify } from 'js-beautify'

export default async function buildSite (site, definitions) {
  const siteFolder = getSiteFolder(site.info.name)

  // Ensure the output folder exists
  const outputFolder = path.join(siteFolder, 'output')
  await fs.remove(outputFolder)
  await fs.ensureDir(outputFolder)

  // Ensure the includes, layouts and site folders exist
  const includesFolder = path.join(siteFolder, 'output', 'includes')
  const layoutsFolder = path.join(siteFolder, 'output', 'layouts')
  const webSiteFolder = path.join(siteFolder, 'output', 'site')
  await fs.ensureDir(includesFolder)
  await fs.ensureDir(layoutsFolder)
  await fs.ensureDir(webSiteFolder)

  // HACK: Copy the built-in default template to the output folder for the time being...
  // TODO: Figure out whether this is something that should be done
  //   Pro: allows us to update the default template for people
  //   Con: those updates may break things
  const builtInFolder = path.join(__static, 'templates', 'default')
  const defaultTemplateFolder = path.join(siteFolder, 'templates', 'default')
  await fs.copy(builtInFolder, defaultTemplateFolder)

  // Copy the default template to the output folder
  await fs.copy(defaultTemplateFolder, webSiteFolder)

  // Move the default template layout folder to the output layouts folder
  // TODO: Remove the default template layout folder? Or move and overwrite dir if that works?
  const defaultLayoutFolder = path.join(webSiteFolder, 'layout')
  const defaultLayoutFiles = await getFilesInFolder(defaultLayoutFolder)
  for (let i = 0; i < defaultLayoutFiles.length; i++) {
    const source = defaultLayoutFiles[i]
    const dest = path.join(layoutsFolder, path.basename(defaultLayoutFiles[i]))
    await fs.move(source, dest)
  }

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
  // const pagesFolder = path.join(siteFolder, 'pages')
  const engine = new Liquid({
    root: [layoutsFolder, includesFolder]
  })

  // Register a custom filter to build styles
  engine.registerFilter('styles', (initial, fontFamily, fontSize, backgroundColor, color) => {
    return buildStyleAttribute(fontFamily, fontSize, backgroundColor, color)
  })

  // Generate each layout
  // Files starting with underscores are templates and should get built into the layouts folder
  await Promise.all([...site.pages].sort(sorter).filter(page => path.basename(page.file).startsWith('_')).map(async (page) => {
    const outputFile = path.join(layoutsFolder, path.basename(page.file))
    await generatePage(site, page, outputFile, engine, true)
  }))

  // Generate each page
  await Promise.all([...site.pages].sort(sorter).filter(page => path.basename(page.file).indexOf('_') !== 0).map(async (page) => {
    const outputFile = path.join(webSiteFolder, path.basename(page.file).replace('.liquid', '.html'))
    await buildPage(site, page, outputFile, engine)
  }))

  const styles = buildStyles(site, definitions)
  const siteCssFile = path.join(webSiteFolder, 'css', 'site.css')
  fs.writeFileSync(siteCssFile, styles.trim())

  // TODO: Concat and minify JS from templates, layouts and blocks

  // Open it in the user's default browser
  const indexFile = path.join(webSiteFolder, 'index.html')
  exec(`"${indexFile}"`, (error, stdout, stderr) => {
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
    if (error !== null) {
      console.log(`OPEN ERROR: ${error}`)
    }
  })
}

function sorter (a, b) {
  if (a.name < b.name) {
    return -1
  } else if (a.name > b.name) {
    return 1
  } else {
    return 0
  }
}

async function buildPage (site, page, outputFile, engine) {
  console.log('GENERATING', page.file)

  if (page.settings.data) {
    // We need to create a page file for each item in the collection
    const collection = site.collections.find(
      item => item.name && item.name.localeCompare(page.settings.data, undefined, { sensitivity: 'accent' }) === 0
    )
    if (!collection) {
      // TODO: Throw and log properly
      console.log('Collection not found: ' + page.settings.data + ' in ' + page.name)
    }

    if (collection) {
      // Put each file in a folder with the page's name
      const outputFolder = outputFile.replace('.html', '')
      await fs.ensureDir(outputFolder)

      collection.data.items.forEach(async (item) => {
        const itemOutputFile = path.join(outputFolder, item.name.replace(/\W+/g, '_').toLowerCase() + '.html')
        const itemData = item
        await generatePage(site, page, itemOutputFile, engine, false, itemData)
      })
    }
  } else {
    await generatePage(site, page, outputFile, engine, false)
  }
}

async function generatePage (site, page, outputFile, engine, isLayout, itemData) {
  console.log('GENERATING', page.file)

  // Build the page's data
  const data = Object.assign({}, site.info, page.settings)

  if (itemData) {
    data.item = itemData
  }

  // Generate the page in memory
  let pageContent = await buildPageContent(page)
  if (isLayout) {
    // HACK: LiquidJS seems to lose the block content in nested layouts?
    pageContent = pageContent.replace('{% block content %}Page content{% endblock %}', '<div id="block-content">Page content</div>')
  }
  let result = await engine.parseAndRender(pageContent, data)
  if (isLayout) {
    // HACK: LiquidJS seems to lose the block content in nested layouts?
    result = result.replace('<div id="block-content">Page content</div>', '{% block content %}Page content{% endblock %}')
  }

  // Remove multiple newlines
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n')

  // Beautify the HTML a little bit
  result = html_beautify(result)

  // HACK: If there's itemData present, we need to re-orient our relative CSS and JS
  // TODO: Be a lot smarter about this!
  if (itemData) {
    result = result
      .replace(/<link rel="stylesheet" href="/gi, '<link rel="stylesheet" href="../')
      .replace(/<script src="/gi, '<script src="../')
  }

  // Write the output file
  fs.writeFileSync(outputFile, result, (err) => {
    if (err) {
      console.log('GEN ERROR', err)
    }
  })
}
