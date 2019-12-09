import config from '../config'
import axios from 'axios'
import initialJson from './initial.json'

function normalize (data) {
  return Object.assign(initialJson, data)
}

export const getJson = ({ family, species }) => {
  return new Promise((resolve, reject) => {
    if (!family || !species || !family.length || !species.length) {
      return
    }

    const url = `${config.baseUrl}${family}/${species}.json`
    axios
      .get(url)
      .then(response => resolve(normalize(response.data)))
      .catch(e => {
        console.log(555, initialJson)
        resolve(initialJson)
      })
  })
}
