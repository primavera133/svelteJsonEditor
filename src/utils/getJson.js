import config from '../config'
import axios from 'axios'
import initialJson from './initial.json'

function normalize (data) {
  const strKeys = [
    'behaviour',
    'description',
    'distribution',
    'habitat',
    'flight_period'
  ]
  strKeys.forEach(key => {
    if (!data[key]) data[key] = ''
  })

  if (!data.size) {
    data.size = {
      length: 'mm',
      wingspan: 'mm'
    }
  }

  if (!data.similar_species) {
    data.similar_species = []
  }

  if (!data.red_list) {
    data.red_list = {
      habitats_directive: '',
      red_list_EU27: '',
      red_list_europe: '',
      red_list_mediterranean: '',
      EU27_endemic: '',
      red_list_europe_endemic: '',
      trend_europe: ''
    }
  }

  return data
}

export const getJson = ({ family, species }) => {
  return new Promise((resolve, reject) => {
    if (!family || !species || !family.length || !species.length) {
      return
    }

    try {
      const url = `${config.baseUrl}${family}/${species}.json`
      axios
        .get(url)
        .then(response => resolve(normalize(response.data)))
        .catch(e => resolve(initialJson))
    } catch (error) {
      resolve(initialJson)
    }
  })
}
