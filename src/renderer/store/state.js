import { writable } from 'svelte/store'

export const sites = writable([])
export const sitesExist = writable(false)
export const creatingSite = writable(false)
export const activeSite = writable(null)
export const definitions = writable(null)

export const sections = writable([])
export const activeSection = writable(null)
export const renamingSection = writable(null)
