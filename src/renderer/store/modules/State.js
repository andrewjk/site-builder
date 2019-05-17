import { getField, updateField } from 'vuex-map-fields'

import fs from 'fs-extra'
import path from 'path'
import walk from 'klaw'
import { remote } from 'electron'

// NOTE: V4 uses random numbers
import uuid from 'uuid/v4'

import Liquid from 'liquidjs'
import { exec } from 'child_process'

const state = {
  sites: [],
  sitesExist: false,
  creatingSite: false,
  activeSite: '',
  infoDefinition: {},
  appearanceDefinition: {},
  pageDefinition: {},
  // TODO: Fold this into each site
  info: {
    name: '',
    title: '',
    description: '',
    icon: null
    // etc
  },
  appearance: {
    // TODO:
  },
  // TODO: Fold this into each site
  collections: [],
  pages: [],
  blocks: [],
  sections: []
}

const getters = {
  getField,
  activeSection (state) {
    return state.sections.find((section) => {
      return section.isActive
    })
  },
  sites (state) {
    return state.sites
  },
  collections (state) {
    return state.collections
  },
  pages (state) {
    return state.pages
  },
  blocks (state) {
    return state.blocks
  }
}

const mutations = {
  updateField,
  SET_SITES (state, sites) {
    state.sites = sites
  },
  SET_SITES_EXIST (state) {
    state.sitesExist = true
  },
  START_CREATING_SITE (state) {
    state.creatingSite = true
    state.info.name = 'New Site'
    state.info.title = 'New Site'
    state.info.intro = ''
  },
  END_CREATING_SITE (state, name) {
    state.creatingSite = false
    state.sitesExist = true
    state.sites.push(name)
  },
  SET_ACTIVE_SITE (state, site) {
    state.activeSite = site
  },
  SET_INFO_DEFINITION (state, def) {
    state.infoDefinition = def
  },
  SET_INFO (state, info) {
    state.info.name = info.name
    state.info.title = info.title
    state.info.intro = info.intro
  },
  SET_APPEARANCE_DEFINITION (state, def) {
    state.appearanceDefinition = def
  },
  SET_APPEARANCE (state, app) {
    // TODO:
  },
  SET_PAGE_DEFINITION (state, def) {
    state.pageDefinition = def
  },
  SET_COLLECTIONS (state, collections) {
    state.collections = collections
  },
  SET_PAGES (state, pages) {
    state.pages = pages
  },
  SET_BLOCKS (state, blocks) {
    state.blocks = blocks
  },
  SET_SECTIONS (state, items) {
    state.sections = items
  },
  SET_ACTIVE_SECTION (state, index) {
    state.sections.forEach((item, i) => {
      item.isActive = (i === index)
    })
  },
  SET_SETTINGS_VALUE (state, { name, key, value }) {
    const data =
      name === 'info' ? state.info
        : name === 'appearance' ? state.appearance
          : null
    data[key] = value
  },
  SET_PAGE_VALUE (state, { page, key, value }) {
    page.data[key] = value
  },
  SET_BLOCK_VALUE (state, { block, key, value }) {
    block.data[key] = value
  },
  SET_BLOCK_FIELDS (state, { block, fields }) {
    if (fields.id) block.id = fields.id
    if (fields.name) block.name = fields.name
    if (fields.content) block.content = fields.content
    if (fields.definition) block.definition = fields.definition
    if (fields.data) block.data = fields.data
    if (fields.tempFile) block.tempFile = fields.tempFile
  },
  SET_BLOCK_DATA (state, { block, data }) {
    block.data = data
  },
  INSERT_BLOCK (state, { page, block }) {
    block.id = uuid()
    page.blocks.push(block)
    // page.blocks = [...page.blocks, block]
  }
}

const actions = {
  getTemplatesFolder (context) {
    return path.join(__static, '/templates/')
  },
  getSitesFolder (context) {
    return path.join(remote.app.getPath('documents'), '/Site Builder')
  },
  async loadAllSites (context) {
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
  },
  startCreatingSite (context) {
    context.commit('START_CREATING_SITE')
  },
  async createSite (context) {
    // Copy the template files
    const templateFolder = path.join(await context.dispatch('getTemplatesFolder'), 'default')
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), state.info.name)
    await fs.copy(templateFolder, path.join(siteFolder, 'templates', 'default'))

    // Create the data files
    const dataFolder = path.join(siteFolder, 'data')
    await fs.mkdir(dataFolder)
    await fs.writeJSON(path.join(dataFolder + '/info.json'), state.info)
    await fs.writeJSON(path.join(dataFolder + '/appearance.json'), state.info)
    context.commit('END_CREATING_SITE', state.info.name)
    context.commit('SET_ACTIVE_SITE', state.info.name)
  },
  async loadSite (context, name) {
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

    // Load the data from info.json and appearance.json
    const infoFile = path.join(siteFolder, 'data/info.json')
    fs.readJSON(infoFile).then((info) => {
      context.commit('SET_INFO', info)
    })
    const appearanceFile = path.join(siteFolder, 'data/appearance.json')
    fs.readJSON(appearanceFile).then((app) => {
      context.commit('SET_APPEARANCE', app)
    })

    // Load other data
    // TODO: Load the ACTUAL data
    let collections = await getFilesInFolder(path.join(siteFolder, 'data'))
    collections = collections
      .filter((item) => item.indexOf('info.json') === -1 && item.indexOf('appearance.json') === -1)
      .map((item) => {
        return item.substring(item.lastIndexOf(path.sep) + 1, item.lastIndexOf('.'))
      })
    context.commit('SET_COLLECTIONS', collections)

    // Load the pages that have been created
    const pageFiles = await getFilesInFolder(path.join(siteFolder, 'pages'))
    const pages = await Promise.all(pageFiles.filter((file) => file.indexOf('.html') !== -1).map((file) => {
      return context.dispatch('loadPage', { siteFolder, file })
    }))
    context.commit('SET_PAGES', pages)

    // Load the blocks that are available
    // TODO: Is this the right place to be getting data from?
    const blockFolders = await getDirectoriesInFolder(path.join(__static, 'blocks'))
    const blocks = await Promise.all(blockFolders.map(async (dir) => {
      return context.dispatch('loadBlock', dir)
    }))
    context.commit('SET_BLOCKS', blocks)

    // Now that that's all done, load the sections to display in the sidebar and set this site to active
    context.dispatch('buildSections')
    context.commit('SET_ACTIVE_SITE', name)
  },
  async loadPage (context, { siteFolder, file }) {
    const name = file.substring(file.lastIndexOf(path.sep) + 1, file.lastIndexOf('.'))
    // Load the page's data
    const dataFile = file.replace('.html', '.json')
    const data = fs.existsSync(dataFile) ? fs.readJSONSync(dataFile) : {}
    // Load the page's blocks
    const content = fs.readFileSync(file).toString()
    const regex = /{% include '(.+).liquid'(?:, (.+)) %}/gi
    const blocks = []
    let match = regex.exec(content)
    while (match != null) {
      // TODO: This probably needs to be much more robust
      const blockData = {}
      const dataRegex = /(\w+): '((?:[^'\\]|\\.)+)'/gi
      let dataMatch = dataRegex.exec(match[2])
      while (dataMatch != null) {
        blockData[dataMatch[1]] = dataMatch[2].replace('\\\'', '\'')
        dataMatch = dataRegex.exec(match[2])
      }
      const block = {
        name: match[1],
        data: blockData,
        tempFile: ''
      }
      blocks.push(block)
      match = regex.exec(content)
    }
    const page = {
      file,
      name,
      data,
      blocks
    }
    return page
  },
  async loadBlock (context, dir) {
    const name = dir.substring(dir.lastIndexOf(path.sep) + 1)
    // Load the block's content
    const blockFile = path.join(dir, 'block.liquid')
    const content = fs.readFileSync(blockFile).toString()
    // Load the block's data definition
    const definitionFile = path.join(dir, 'block.json')
    const definition = fs.existsSync(definitionFile) ? fs.readJSONSync(definitionFile) : {}
    // Load the block's styles
    const stylesFile = path.join(dir, 'block.css')
    const styles = fs.readFileSync(stylesFile).toString()
    // TODO: Load the block's data
    const block = {
      dir,
      name,
      content,
      definition,
      styles,
      // TODO: Where to load data from?!
      data: {}
    }
    return block
  },
  buildSections (context) {
    // Build the sidebar items from pages, blocks etc
    const items = []
    // Settings
    items.push({
      isActive: false,
      key: 'title-info',
      class: 'title',
      type: 'title',
      text: 'Settings'
    })
    items.push({
      isActive: true,
      name: 'info',
      key: 'settings-info',
      class: 'item',
      type: 'settings',
      text: 'info',
      definition: state.infoDefinition,
      data: state.info
    })
    items.push({
      isActive: false,
      name: 'appearance',
      key: 'settings-appearance',
      class: 'item',
      type: 'settings',
      text: 'appearance',
      definition: state.appearanceDefinition,
      data: state.appearance
    })
    // Data
    items.push({
      isActive: false,
      key: 'title-data',
      class: 'title',
      type: 'title',
      text: 'Data'
    })
    state.collections.forEach((data) => {
      items.push({
        isActive: false,
        key: 'coll-' + data,
        class: 'item',
        type: 'collection',
        text: data
      })
    })
    items.push({
      key: 'add-data',
      class: 'add'
    })
    // Pages
    items.push({
      isActive: false,
      key: 'title-pages',
      class: 'title',
      type: 'title',
      text: 'Pages'
    })
    state.pages.forEach((page) => {
      items.push({
        isActive: false,
        page,
        key: 'page-' + page.name,
        class: 'item',
        type: 'page',
        text: page.name,
        definition: state.pageDefinition,
        data: page.data
      })
    })
    items.push({
      key: 'add-page',
      class: 'add'
    })
    // Blocks
    items.push({
      isActive: false,
      key: 'title-blocks',
      class: 'title',
      type: 'title',
      text: 'Blocks'
    })
    state.blocks.forEach((block) => {
      items.push({
        isActive: false,
        block,
        key: 'block-' + block.name,
        class: 'item',
        type: 'block',
        text: block.name,
        definition: block.definition,
        data: block.data
      })
    })
    items.push({
      key: 'add-block',
      class: 'add'
    })
    context.commit('SET_SECTIONS', items)
  },
  setActiveSection (context, index) {
    context.commit('SET_ACTIVE_SECTION', index)
  },
  addSomething (context, index) {
    // TODO:
    alert('todo')
  },
  async saveSite (context, name) {
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), name)

    // Save the data into info.json and appearance.json
    const infoFile = path.join(siteFolder, 'data', 'info.json')
    fs.writeJSON(infoFile, context.state.info)
    const appearanceFile = path.join(siteFolder, 'data', 'appearance.json')
    fs.writeJSON(appearanceFile, context.state.appearance)

    // Save other data
    context.state.collections.forEach((collection) => {
      // const collectionFile = path.join(siteFolder, 'data', collection.file)
      fs.writeJSON(collection.file, collection.data)
    })

    // Save the pages that have been created
    context.state.pages.forEach((page) => {
      const content = page.blocks.map((block) => {
        const name = `'${block.name}.liquid'`
        const data = Object.keys(block.data)
          .filter((key) => block.data[key])
          .map((key) => `${key}: '${block.data[key].replace('\'', '\\\'')}'`)
          .join(', ')
        return `{% include ${[name, data].join(', ')} %}`
      }).join('\n')
      fs.writeFile(page.file, content)

      const dataFile = page.file.replace('.html', '.json')
      fs.writeJSON(dataFile, page.data)
    })

    /*
    // TODO: Figure out what to do with blocks
    // Save the blocks that are available
    const blockFiles = await getDirectoriesInFolder(path.join(__static, 'blocks'))
    const blocks = blockFiles.map((file) => {
      const name = file.substring(file.lastIndexOf(path.sep) + 1)
      const definitionFile = path.join(__static, 'blocks', file, 'block.json')
      const definition = fs.existsSync(definitionFile) ? fs.readJSONSync(definitionFile) : {}
      return {
        file,
        name,
        definition,
        // TODO: Where to load data from?!
        data: {}
      }
    })
    */
  },
  async buildBlockContent (context, { page, block, templateBlock }) {
    const siteName = context.state.activeSite

    // HACK: Give the block a temporary id
    // TODO: Save and load these somehow?
    if (!block.id) {
      block.id = uuid()
    }

    const id = block.id

    // Update data from the definition, just in case the template has changed
    const data = block.data
    templateBlock.definition.definitions.forEach((def) => {
      if (!data[def.key]) {
        // TODO: Depends on the type, I guess...
        data[def.key] = ''
      }
    })

    // Load the content from the template and make it dynamic, by replacing liquid fields with
    // inputs that the user can type into and saving it to a temp file
    // TODO: change the input based on the data type!
    let content = templateBlock.content
    const regex = /{{ (.+) }}/gi
    let match = regex.exec(content)
    while (match != null) {
      const name = match[1]
      const value = data[name]
      // TODO: Placeholder from definitions...
      const placeholder = name
      const input = `<input class="data-input" type="text" name="${name}" value="${value}" placeholder="${placeholder}"/>`
      content = content.replace(match[0], input)
      match = regex.exec(content)
    }

    // TODO: Load CSS from the template, the block and our editing file
    // Basically, the same way as we would when building the site
    const editorCssFile = path.join(__static, '/block-editor.css')
    const editorCss = fs.readFileSync(editorCssFile)

    // Wrap the content in HTML so that it can be displayed in a webview
    // TODO: Make sure that this works well with custom styling - probably need to include custom page styles etc
    content = `<html>
<head>
  <link rel="stylesheet" href="../templates/default/css/normalize.css">
  <link rel="stylesheet" href="../templates/default/css/main.css">
  <link rel="stylesheet" href="../templates/default/css/site.css">
  <style>
${templateBlock.styles}
${editorCss}
  </style>
</head>
<body>
${content}
  <div id="data-border"/>
  <script>
    document.__blockId = '${id}';
  </script>
</body>
</html>`
    // console.log(content)

    // Write the content to a temp file
    const siteFolder = path.join(await context.dispatch('getSitesFolder'), siteName)
    const tempFolder = path.join(siteFolder, 'temp')
    await fs.ensureDir(tempFolder)
    const tempFile = path.join(tempFolder, id + '.html')
    fs.writeFileSync(tempFile, content)

    context.commit('SET_BLOCK_FIELDS', {
      block: block,
      fields: {
        id,
        definition: templateBlock.definition,
        data,
        tempFile
      }
    })
  },
  async buildSite (context, name) {
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
    //       Pro: allows us to update the default template for people
    //       Con: those updates may break things
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
      root: [ pagesFolder, layoutsFolder, includesFolder ]
    })

    // Generate each page in the pages folder
    state.pages.forEach(async (page) => {
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
}

function getFilesInFolder (root) {
  return new Promise((resolve, reject) => {
    const result = []
    walk(root)
      .on('data', file => {
        if (!file.stats.isDirectory()) {
          result.push(file.path)
        }
      })
      .on('end', () => resolve(result))
  })
}

function getDirectoriesInFolder (root) {
  return new Promise((resolve, reject) => {
    let first = true
    const result = []
    walk(root)
      .on('data', dir => {
        if (dir.stats.isDirectory()) {
          // Skip the root folder
          if (first) {
            first = false
            return
          }
          result.push(dir.path)
        }
      })
      .on('end', () => resolve(result))
  })
}

export default {
  state,
  getters,
  mutations,
  actions
}
