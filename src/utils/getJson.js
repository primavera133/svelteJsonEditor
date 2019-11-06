import config from '../config'
import axios from 'axios'

export const getJson = ({ family, species }) => {
  return new Promise((resolve, reject) => {
    const url = `${config.baseUrl}${family}/${species}.json`
    axios.get(url).then(response => {
      resolve(response.data)
    })
    .catch(reject)
  })
}
