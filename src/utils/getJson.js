import config from '../config'
import axios from 'axios'
import initialJson from './initial.json'

function normalize (data) {
  return Object.assign(initialJson, data)
}

export const getJson = ({ config, specie }) => {
  return new Promise((resolve, reject) => {
    if (!config || !specie || !specie.length) {
      return
    }

    const family = Object.keys(config.dataTree).find(family => {
      const species = Object.keys(config.dataTree[family]).reduce(
        (acc, genus) => {
          return acc.concat(config.dataTree[family][genus])
        },
        []
      )
      return species.includes(specie)
    })

    const genus = Object.keys(config.dataTree[family]).find(genus => {
      return config.dataTree[family][genus].includes(specie)
    })

    const url = `${config.baseUrl}${family}/${genus}/${specie}.json`
    axios
      .get(url)
      .then(response => resolve(normalize(response.data)))
      .catch(e => {
        resolve(initialJson)
      })
  })
}
