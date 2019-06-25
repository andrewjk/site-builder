import fs from 'fs-extra'
import path from 'path'

import getSiteFolder from './get-site-folder'

export default async function createSite (name, info, appearance) {
  const siteFolder = getSiteFolder(name)
  await fs.mkdir(siteFolder)

  // Create some default directories
  const dataFolder = path.join(siteFolder, 'data')
  await fs.mkdir(dataFolder)

  // Copy the template files
  const templateFolder = path.join(__static, 'templates', 'default')
  await fs.copy(templateFolder, path.join(siteFolder, 'templates', 'default'))

  // Copy images and update settings
  const imagesFolder = path.join(siteFolder, 'images')
  await fs.mkdir(imagesFolder)
  if (info.logo) {
    const logo = 'logo' + path.extname(info.logo)
    await fs.copy(info.logo, path.join(imagesFolder, logo))
    info.logo = logo
  }
  if (info.icon) {
    const icon = 'favicon' + path.extname(info.icon)
    await fs.copy(info.icon, path.join(imagesFolder, icon))
    info.icon = icon
  }
  if (info.bannerImage) {
    const banner = path.basename(info.bannerImage)
    await fs.copy(info.bannerImage, path.join(imagesFolder, banner))
    info.bannerImage = banner
  }

  // Banner stuff shouldn't be saved, it should be put into the index file
  const bannerImage = info.bannerImage
  const bannerTitle = info.bannerTitle
  const bannerText = info.bannerText
  info.bannerImage = undefined
  info.bannerTitle = undefined
  info.bannerText = undefined

  // Create the settings files
  const settingsFolder = path.join(siteFolder, 'settings')
  await fs.mkdir(settingsFolder)
  await fs.writeJSON(path.join(settingsFolder, 'info.json'), info)
  await fs.writeJSON(path.join(settingsFolder, 'appearance.json'), appearance)

  // Create the pages folder
  const pagesFolder = path.join(siteFolder, 'pages')
  await fs.mkdir(pagesFolder)

  // Create default _Layout and Index files
  const layout = `{% layout 'default.liquid' %}
{% block content %}
{% include 'header.liquid', title: '${info.title}' %}
<main>
  {% block content %}Page content{% endblock %}
</main>
{% endblock %}`
  fs.writeFile(path.join(pagesFolder, '_Layout.liquid'), layout)

  let index = `{% layout '_Layout.liquid' %}
{% block content %}`
  if (bannerImage || bannerTitle || bannerText) {
    index = index + `
{% include 'banner.liquid', image: '${bannerImage}', title: '${bannerTitle}', text: '${bannerText}' %}`
  }
  index = index + `
{% endblock %}`
  fs.writeFile(path.join(pagesFolder, 'Index.liquid'), index)
}
