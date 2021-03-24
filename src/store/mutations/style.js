import types from '../types'

export default {
  // 更新style
  [types.$STYLE_UPDATE] ({ rootSchema, flatSchemas }, { key, style }) {
    let schema = null
    if (key) { // update widget
      if (key in flatSchemas) schema = flatSchemas[key]
    } else { // update root
      schema = rootSchema
    }
    if (!schema) return
    const originStyle = { ...schema.style }
    schema.style = Object.assign(originStyle, style)
  }
}
