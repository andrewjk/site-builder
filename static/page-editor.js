
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', (event) => {
  setupBlocks()
  setupInputs()
})

function setupBlocks () {
  const blocks = document.getElementsByClassName('data-block')
  for (let i = 0; i < blocks.length; i++) {
    // Listen to mouse and focus events to display the data border over blocks
    // We're using JS rather than an outline CSS because outlines can overlap things and be overridden
    blocks[i].addEventListener('mouseover', (e) => showDataBorder(e))
    blocks[i].addEventListener('mouseleave', (e) => hideDataBorder(e))

    // Add the control container to the block
    addControlContainer(blocks[i])
  }
}

function setupInputs () {
  const inputs = document.getElementsByClassName('data-input')
  for (let i = 0; i < inputs.length; i++) {
    // Listen to mouse and focus events to display the data border over inputs
    inputs[i].addEventListener('mouseover', (e) => showDataBorder(e))
    inputs[i].addEventListener('mouseleave', (e) => hideDataBorder(e))
    inputs[i].addEventListener('focus', (e) => showDataBorder(e, true))
    inputs[i].addEventListener('blur', (e) => hideDataBorder(e, true))
    // Listen to the input event to resize the input and relay changes to the app
    if (inputs[i].value) {
      inputs[i].size = inputs[i].value.length
    }
    inputs[i].addEventListener('input', (e) => {
      if (e.target.value) {
        e.target.size = e.target.value.length
      }

      const data = {}
      data[e.target.name] = e.target.value
      const update = {
        pageId: document.__pageId,
        blockId: e.target.dataset.blockId,
        data
      }
      ipcRenderer.send('block-input-changed', update)

      // Recalculate the position and size of the border, too
      showDataBorder(e)
    })
  }
}

function addControlContainer (block) {
  const container = document.createElement('div')
  container.classList.add('data-block-controls')

  const moveUpButton = document.createElement('button')
  moveUpButton.type = 'button'
  moveUpButton.classList.add('data-block-button')
  moveUpButton.dataset.blockId = block.dataset.blockId
  moveUpButton.appendChild(buildSvg('M20,60 L50,30 L80,60'))
  moveUpButton.addEventListener('click', moveBlockUp)
  container.appendChild(moveUpButton)

  const moveDownButton = document.createElement('button')
  moveDownButton.type = 'button'
  moveDownButton.classList.add('data-block-button')
  moveDownButton.dataset.blockId = block.dataset.blockId
  moveDownButton.appendChild(buildSvg('M20,40 L50,70 L80,40'))
  moveDownButton.addEventListener('click', moveBlockDown)
  container.appendChild(moveDownButton)

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.classList.add('data-block-button')
  deleteButton.dataset.blockId = block.dataset.blockId
  deleteButton.appendChild(buildSvg(['M25,25 L75,75', 'M25,75 L75,25']))
  deleteButton.addEventListener('click', deleteBlock)
  container.appendChild(deleteButton)

  block.appendChild(container)
}

function buildSvg (paths) {
  if (!Array.isArray(paths)) {
    paths = [paths]
  }

  const svgns = 'http://www.w3.org/2000/svg'

  const svg = document.createElementNS(svgns, 'svg')
  svg.setAttributeNS(null, 'viewBox', '0 0 100 100')
  const g = document.createElementNS(svgns, 'g')
  for (let i = 0; i < paths.length; i++) {
    const path = document.createElementNS(svgns, 'path')
    path.setAttributeNS(null, 'd', paths[i])
    path.setAttributeNS(null, 'stroke', 'white')
    path.setAttributeNS(null, 'stroke-width', '20')
    path.setAttributeNS(null, 'stroke-linecap', 'round')
    path.setAttributeNS(null, 'stroke-linejoin', 'round')
    path.setAttributeNS(null, 'fill', 'transparent')
    g.appendChild(path)
  }
  svg.appendChild(g)

  return svg
}

function moveBlockDown (e) {
  try {
    const pageId = document.__pageId
    const blockId = e.target.dataset.blockId

    const div = document.getElementById(`data-block-${blockId}`)
    const next = div.nextElementSibling
    if (next) {
      // Move the node
      const parent = div.parentNode
      parent.insertBefore(div, next.nextElementSibling)

      // Send an event so that things can be updated
      const update = {
        pageId,
        blockId
      }
      ipcRenderer.send('move-block-up', update)
    }
  } catch (err) {
    console.log('$' + err)
  }
}

function moveBlockUp (e) {
  try {
    const pageId = document.__pageId
    const blockId = e.target.dataset.blockId

    const div = document.getElementById(`data-block-${blockId}`)
    const before = div.previousElementSibling
    if (before) {
      // Move the node
      const parent = div.parentNode
      parent.insertBefore(div, before)

      // Send an event so that things can be updated
      const update = {
        pageId,
        blockId
      }
      ipcRenderer.send('move-block-up', update)
    }
  } catch (err) {
    console.log('$' + err)
  }
}

function deleteBlock (e) {
  try {
    const pageId = document.__pageId
    const blockId = e.target.dataset.blockId

    // Send an event so that things can be updated
    // The actual block will be deleted in the event below, if the user confirms they want to do it
    const update = {
      pageId,
      blockId
    }
    ipcRenderer.send('delete-block', update)
  } catch (err) {
    console.log('$' + err)
  }
}

ipcRenderer.on('confirm-delete-block', (event, data) => {
  const blockId = data.blockId
  const div = document.getElementById(`data-block-${blockId}`)
  if (div) {
    // Delete the node
    const parent = div.parentNode
    parent.removeChild(div)
  }
})

function showDataBorder (e, focussing) {
  // Don't move the data border when the cursor is in a data input
  if (!focussing && isDataInputFocused(e.target)) {
    return
  }

  const target = e.target.closest('.data-block, .data-input')
  if (target) {
    // Show the data border for the closest ancestor block or input
    const rect = target.getBoundingClientRect()
    const border = document.getElementById('data-border')
    border.style.display = 'block'
    border.style.top = rect.top
    border.style.left = rect.left
    border.style.width = rect.right - rect.left
    border.style.height = rect.bottom - rect.top
    border.style.borderColor = target.classList.contains('data-input') ? 'orange' : 'lightblue'

    // Show the data controls for blocks
    if (target.classList.contains('data-block')) {
      const controls = target.querySelector('.data-block-controls')
      controls.style.display = 'block'
      controls.style.left = (rect.right - rect.left) / 2 - controls.offsetWidth / 2
    }
  }
}

function hideDataBorder (e, focussing) {
  // Don't move the data border when the cursor is in a data input
  if (!focussing && isDataInputFocused(e.target)) {
    return
  }

  const target = e.target.closest('.data-block, .data-input')
  if (target && target !== document.activeElement) {
    // Hide the data border for the closest ancestor block or input
    const el = document.getElementById('data-border')
    el.style.display = 'none'

    // Hide the data controls for blocks
    if (target.classList.contains('data-block')) {
      target.querySelector('.data-block-controls').style.display = 'none'
    }
  }
}

function isDataInputFocused (target) {
  return document.activeElement &&
    document.activeElement.classList.contains('data-input') &&
    document.activeElement !== target
}
