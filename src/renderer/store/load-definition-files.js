import fs from 'fs-extra'
import path from 'path'

export default async function loadDefinitionFiles () {
  // Load the definition files which contain types, explanations etc for site info, appearance and page info
  const infoFile = path.join(__static, 'info-def.json')
  const info = await fs.readJson(infoFile)

  const appearanceFile = path.join(__static, 'appearance-def.json')
  const appearance = await fs.readJson(appearanceFile)

  const pageFile = path.join(__static, 'page-def.json')
  const page = await fs.readJson(pageFile)

  const blockFile = path.join(__static, 'block-def.json')
  const block = await fs.readJson(blockFile)

  const inputFile = path.join(__static, 'input-def.json')
  const input = await fs.readJson(inputFile)

  return {
    info,
    appearance,
    page,
    block,
    input
  }
}
