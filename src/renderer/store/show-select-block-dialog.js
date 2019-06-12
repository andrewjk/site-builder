import SelectBlockDialog from '../components/SelectBlockDialog'

export default function showSelectBlockDialog (props) {
  return new Promise((resolve) => {
    const propsWithCallback = Object.assign({}, props, { callback: resolve })
    // eslint-disable-next-line no-unused-vars
    const dialog = new SelectBlockDialog({
      target: document.body,
      props: propsWithCallback,
      intro: true
    })
  })
}
