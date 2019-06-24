export default function (fontFamily, fontSize, backgroundColor, color) {
  let style = ''
  style = style + (backgroundColor ? `background-color: ${backgroundColor}; ` : '')
  style = style + (color ? `color: ${color}; ` : '')
  style = style + (fontFamily ? `font-family: '${fontFamily}'; ` : '')
  style = style + (fontSize ? `font-size: ${fontSize}; ` : '')
  if (style) {
    style = `style="${style.trim()}"`
  }
  return style
}
