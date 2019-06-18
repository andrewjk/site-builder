
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', (event) => {
  setupBlocks()
  setupInputs()
  setupFields()
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

    // Listen to dragging and dropping
    blocks[i].addEventListener('dragstart', (e) => handleDragStart(e))
    blocks[i].addEventListener('dragover', (e) => handleDragOver(e))
    blocks[i].addEventListener('drop', (e) => handleDrop(e))
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

function setupFields () {
  const fields = document.getElementsByClassName('data-input')
  for (let i = 0; i < fields.length; i++) {
    // Listen to mouse and focus events to display the data border over data item fields
    fields[i].addEventListener('mouseover', (e) => showDataBorder(e))
    fields[i].addEventListener('mouseleave', (e) => hideDataBorder(e))

    // TODO: Listen to dragging and dropping
    fields[i].addEventListener('dragstart', (e) => handleDragStart(e))
    fields[i].addEventListener('dragover', (e) => handleDragOver(e))
    fields[i].addEventListener('drop', (e) => handleDrop(e))
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
    const blockId = e.target.dataset.blockId
    const div = document.getElementById(`data-block-${blockId}`)
    const next = div.nextElementSibling
    if (next) {
      moveBlock(blockId, div, next.nextElementSibling)
    }
  } catch (err) {
    console.log('$' + err)
  }
}

function moveBlockUp (e) {
  try {
    const blockId = e.target.dataset.blockId
    const div = document.getElementById(`data-block-${blockId}`)
    const before = div.previousElementSibling
    if (before) {
      moveBlock(blockId, div, before)
    }
  } catch (err) {
    console.log('$' + err)
  }
}

function moveBlock (blockId, div, before) {
  const pageId = document.__pageId

  // Move the node
  const parent = div.parentNode
  parent.insertBefore(div, before)

  // Send an event so that things can be updated
  const update = {
    pageId,
    blockId,
    beforeBlockId: before ? before.dataset.blockId : null
  }
  ipcRenderer.send('move-block', update)
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

  const target = e.target.closest('.data-block, .data-input, .data-field')
  if (target) {
    // Show the data border for the closest ancestor block or input
    const rect = getOffsetRect(target)
    const border = document.getElementById('data-border')
    border.style.display = 'block'
    border.style.top = rect.top
    border.style.left = rect.left
    border.style.width = rect.width
    border.style.height = rect.height
    border.classList.add(
      target.classList.contains('data-block') ? 'data-block' : null,
      target.classList.contains('data-input') ? 'data-input' : null,
      target.classList.contains('data-field') ? 'data-field' : null
    )

    // Show the data controls for blocks
    if (target.classList.contains('data-block')) {
      const controls = target.querySelector('.data-block-controls')
      controls.style.display = 'block'
      controls.style.left = rect.width / 2 - controls.offsetWidth / 2
    }
  }
}

function hideDataBorder (e, focussing) {
  // Don't move the data border when the cursor is in a data input
  if (!focussing && isDataInputFocused(e.target)) {
    return
  }

  const target = e.target.closest('.data-block, .data-input, .data-field')
  if (target && target !== document.activeElement) {
    // Hide the data border for the closest ancestor block or input
    const border = document.getElementById('data-border')
    border.style.display = 'none'
    border.classList.remove('data-block', 'data-input', 'data-field')

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

let dragType = ''
let dragBlockId = ''
let dragFieldKey = ''

function handleDragStart (e) {
  if (e.target.classList.contains('data-block')) {
    dragType = 'block'
    dragBlockId = e.target.dataset.blockId
  } else if (e.target.classList.contains('data-field')) {
    dragType = 'field'
    dragFieldKey = e.target.dataset.fieldKey
    const block = e.target.closest('.data-block')
    if (block) {
      dragBlockId = block.dataset.blockId
    }
  }
}

function handleDragOver (e) {
  const target = e.target.closest('.data-block, .data-field')
  if (target) {
    // Enable dropping
    e.preventDefault()

    // Show the data border for the closest ancestor block
    const rect = getOffsetRect(target)
    const border = document.getElementById('drag-border')
    border.style.display = 'block'
    border.style.top = dragAtTop(e.y, rect) ? rect.top - 1 : rect.bottom - 1
    border.style.left = rect.left
    border.style.width = rect.width
    border.classList.add(
      target.classList.contains('data-block') ? 'data-block' : null,
      target.classList.contains('data-field') ? 'data-field' : null
    )
  }
}

function handleDrop (e) {
  // Move the element
  if (dragType === 'block') {
    handleDropBlock(e)
  } else if (dragType === 'field') {
    handleDropField(e)
  }

  // Hide the border
  const border = document.getElementById('drag-border')
  border.style.display = 'none'
  border.classList.remove('data-block', 'data-field')
}

function handleDropBlock (e) {
  // Move the block
  const target = e.target.closest('.data-block')
  if (target) {
    e.preventDefault()

    try {
      const div = document.getElementById(`data-block-${dragBlockId}`)

      const rect = getOffsetRect(target)
      const before = dragAtTop(e.y, rect) ? target : target.nextElementSibling

      moveBlock(dragBlockId, div, before)
    } catch (err) {
      console.log('$' + err)
    }
  }
}

function handleDropField (e) {
  // Move the field
  const target = e.target.closest('.data-field')
  if (target) {
    e.preventDefault()

    try {
      const div = document.getElementById(`data-field-${dragFieldKey}`)

      const rect = getOffsetRect(target)
      const before = dragAtTop(e.y, rect) ? target : target.nextElementSibling

      moveField(dragBlockId, div, before)
    } catch (err) {
      console.log('$' + err)
    }
  }
}

function moveField (blockId, div, before) {
  const pageId = document.__pageId

  // Move the node
  const parent = div.parentNode
  parent.insertBefore(div, before)

  const elements = parent.getElementsByClassName('data-field')
  const html = Array.from(elements).map((item) => item.outerHTML).join('\n')

  // Send an event so that things can be updated
  // HACK: Do this more elegantly
  const update = {
    pageId,
    blockId,
    html
  }
  ipcRenderer.send('move-field', update)
}

function getOffsetRect (el) {
  const rect = el.getBoundingClientRect()
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    height: rect.bottom - rect.top,
    width: rect.right - rect.left
  }
}

function dragAtTop (y, rect) {
  return y < rect.top + rect.height / 2
}
