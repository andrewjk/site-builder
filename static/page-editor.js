
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', (event) => {
  const blocks = document.getElementsByClassName('block-container')
  for (let i = 0; i < blocks.length; i++) {
    // Listen to mouse and focus events to display the data border over blocks
    // We're using JS rather than an outline CSS because outlines can overlap things and be overridden
    blocks[i].addEventListener('mouseover', (e) => showDataBorder(e))
    blocks[i].addEventListener('mouseleave', (e) => hideDataBorder(e))
  }

  const inputs = document.getElementsByClassName('data-input')
  for (let i = 0; i < inputs.length; i++) {
    // Listen to mouse and focus events to display the data border over inputs
    inputs[i].addEventListener('mouseover', (e) => showDataBorder(e))
    inputs[i].addEventListener('mouseleave', (e) => hideDataBorder(e))
    inputs[i].addEventListener('focus', (e) => showDataBorder(e, true))
    inputs[i].addEventListener('blur', (e) => hideDataBorder(e, true))
    // Listen to the input event to resize the input and relay changes to the app
    if (inputs[i].value) inputs[i].size = inputs[i].value.length
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
})

function showDataBorder (e, focussing) {
  // Don't move the data border when the cursor is in a data input
  if (!focussing && isDataInputFocused(e.target)) {
    return
  }

  const target = e.target.closest('.block-container, .data-input')
  if (target) {
    const el = document.getElementById('data-border')
    el.style.display = 'block'
    el.style.top = target.offsetTop
    el.style.left = target.offsetLeft
    el.style.width = target.offsetWidth - 2
    el.style.height = target.offsetHeight - 2
    el.style.borderColor = target.classList.contains('data-input') ? 'orange' : 'lightblue'
  }
}

function hideDataBorder (e, focussing) {
  // Don't move the data border when the cursor is in a data input
  if (!focussing && isDataInputFocused(e.target)) {
    return
  }

  const target = e.target.closest('.block-container, .data-input')
  if (target && target !== document.activeElement) {
    const el = document.getElementById('data-border')
    el.style.display = 'none'
  }
}

function isDataInputFocused (target) {
  return document.activeElement &&
    document.activeElement.classList.contains('data-input') &&
    document.activeElement !== target
}
