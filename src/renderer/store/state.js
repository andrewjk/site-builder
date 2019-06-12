import { writable } from 'svelte/store'

export const sites = writable([])
export const sitesExist = writable(false)
export const creatingSite = writable(false)
export const activeSite = writable(null)
export const definitions = writable(null)
// export const infoDefinition = writable({})
// export const appearanceDefinition = writable({})
// export const pageDefinition = writable({})

// TODO: Fold this into each site
// TODO: How to have a store with an object?
// export const info = writable({})
// export const name = writable('')
// export const title = writable('')
// export const description = writable('')
// export const icon = writable(null)
// etc

// export const appearance = writable({})

// // TODO: Fold this into each site
// export const collections = writable([])
// export const pages = writable([])
// export const blocks = writable([])

export const sections = writable([])
export const activeSection = writable(null)
export const renamingSection = writable(null)

/*
export function getTemplatesFolder () {
  return path.join(__static, '/templates/')
}

export function getSitesFolder () {
  return path.join(remote.app.getPath('documents'), 'Site Builder')
}
*/
