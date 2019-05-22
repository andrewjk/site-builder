
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', (event) => {
  // Listen to mouse and focus events to display the red data border over blocks
  // We're using JS rather than an outline CSS because outlines can overlap things and be overridden
  // document.body.onmouseover = (e) => showDataBorder(e);
  // document.body.onmouseleave = (e) => hideDataBorder(e);

  const inputs = document.getElementsByClassName('data-input')
  for (var i = 0; i < inputs.length; i++) {
    // Listen to mouse and focus events to display the red data border over inputs
    inputs[i].addEventListener('mouseover', (e) => showDataBorder(e))
    inputs[i].addEventListener('mouseleave', (e) => hideDataBorder(e))
    inputs[i].addEventListener('focus', (e) => showDataBorder(e))
    inputs[i].addEventListener('blur', (e) => hideDataBorder(e))
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

function showDataBorder (e) {
  const el = document.getElementById('data-border')
  el.style.display = 'block'
  el.style.top = e.target.offsetTop - 1
  el.style.left = e.target.offsetLeft - 1
  el.style.width = e.target.offsetWidth - 1
  el.style.height = e.target.offsetHeight
}

function hideDataBorder (e) {
  const el = document.getElementById('data-border')
  el.style.display = 'none'
}
