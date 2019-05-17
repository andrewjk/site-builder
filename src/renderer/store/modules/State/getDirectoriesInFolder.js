import walk from 'klaw'

export default function getDirectoriesInFolder (root) {
  return new Promise((resolve, reject) => {
    let first = true
    const result = []
    walk(root)
      .on('data', dir => {
        if (dir.stats.isDirectory()) {
          // Skip the root folder
          if (first) {
            first = false
            return
          }
          result.push(dir.path)
        }
      })
      .on('end', () => resolve(result))
  })
}
