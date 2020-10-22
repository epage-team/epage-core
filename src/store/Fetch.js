export default class Fetch {
  constructor (props) {
    const {
      name = '',
      desc = '',
      headers = {},
      body = {},
      query = {},
      params = {},
      url = '',
      method = 'GET',
      adapter = ''
    } = props || {}

    this.name = name
    this.desc = desc
    this.headers = headers
    this.body = body
    this.query = query
    this.params = params
    // /:userId/test 其中userId为 form name
    this.url = url
    this.method =method
    this.adapter = adapter
    this.source = []
    this.data = []
    this.format = 'array'
  }
  getData () {
    const { url, body, headers, method, adapter } = this
    if (!url) return Promise.reject(new Error('invalid url!'))

    const urlObj = this.resolveURL(url, this.params)
    if (!urlObj.valid) return Promise.reject(urlObj.message)

    let queryString = this.joinQuery()
    let resolvedURL = urlObj.url
    const option = { headers, method }
    const METHOD = method.toUpperCase()
    const withBodyMethods = ['POST', 'PUT']
    if (withBodyMethods.indexOf(METHOD) > -1) {
      option.body = JSON.stringify(body)
    }
    if (urlObj.widthQuery) {
      resolvedURL += queryString
    } else  {
      queryString = queryString.slice(1)
      resolvedURL += `?${queryString}`
    }

    return fetch(resolvedURL, option).then(res => {
      try {
        return res.json()
      } catch(err) {
        throw err
      }
    }).then(res => {
      const data = adapter ? new Function('data', adapter)(res) : res
      this.source = res
      this.data = data
      this.format = this.getFormat(data)
      return res
    })
  }

  resolveURL (url = '', model = {}) {
    const names = (url.match(/\/\:[^:\s\/\?\&]+/g) || []).map(_ => _.split(':')[1])
    const result = {
      valid: true,
      message: '',
      widthQuery: false,
      url
    }
    let isValidURL = names.filter(name => {
      const type = typeof model[name]
      return name in model
        && (type === 'string' || type === 'number' || type === 'boolean')
        && model[name] !== ''
    }).length === names.length

    if (!isValidURL) {
      result.valid = false
      result.message = 'invalid url params!'
      return result
    }
    names.forEach(name => {
      result.url = result.url.replace(new RegExp(`\B?:${name}\B?`, 'g'), model[name])
    })
    result.url = result.url.replace(/(&|\?)+$/, '')
    result.widthQuery = !!(result.url.indexOf('?') > -1)
    return result
  }

  joinQuery () {
    const keys = Object.keys(this.query || {})
    return keys.map(key => `&${key}=${this.query[key]}`).join('') 
  }

  getFormat (data, num = 2, loop = 1) {
    let type = Object.prototype.toString.call(data).split(' ')[1].split(']')[0].toLowerCase()
    let format = ''
    const space = new Array(num * loop + 1).join(' ')

    switch (type) {
      case 'number':
      case 'boolean':
      case 'string':
        format = type
        break
      case 'object':
        format = type
        const keys = Object.keys(data)
        if (keys.length) {
          format += '{\n'
          const len = keys.length
          loop++
          keys.forEach((k, index) => {
            const sub = this.getFormat(data[k], num, loop)
            const isLast = index === len - 1
            const indentSpace = space.substr(0, space.length -2)
            format += `${space}${k}: ${sub}`
            format += isLast ? `\n${indentSpace}}` : ',\n'
          })
        }
        break
      case 'array':
        format = type
        const sub = this.getFormat(data[0], num, loop)
        if (sub !== 'undefined') {
          format = `${format}<${sub}>`
        }
        break
      default:
        break
    }
    return format
  }
}
