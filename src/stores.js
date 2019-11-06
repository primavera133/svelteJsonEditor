import { writable } from 'svelte/store'

function createJsonStore () {
  const { subscribe, set, update } = writable({})

  return {
    subscribe,
    set,
    update,
    // setField: ({ key, value }) => {
    //   update(j => console.log('j', j) && (j[key] = value))
    // }
  }
}

export const json = createJsonStore()
