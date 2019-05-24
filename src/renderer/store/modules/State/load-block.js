import fs from 'fs-extra'
import path from 'path'

export default async function loadBlock (context, dir) {
  const name = dir.substring(dir.lastIndexOf(path.sep) + 1)
  // Load the block's content
  const blockFile = path.join(dir, 'block.liquid')
  const content = fs.existsSync(blockFile) ? fs.readFileSync(blockFile).toString() : ''
  // Load the block's data definition
  const definitionFile = path.join(dir, 'block.json')
  const definition = fs.existsSync(definitionFile) ? fs.readJSONSync(definitionFile) : {}
  // Load the block's styles
  const stylesFile = path.join(dir, 'block.css')
  const styles = fs.existsSync(stylesFile) ? fs.readFileSync(stylesFile).toString() : ''
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
}
