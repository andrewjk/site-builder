import walk from 'klaw'

export default function getFilesInFolder (root) {
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
