import types from '../types'
import RootSchema from '../../schema/RootSchema'
import API from '../API'
import Dict from '../Dict'
import TypeBuilder from '../TypeBuilder'
import {
  flattenSchema,
  jsonClone,
  cleanDefaultValue,
  isArray,
  getWidgetType,
  getWidgetModel
} from '../../helper'
const typeBuilder = new TypeBuilder()

export default {
  [types.$ROOT_SCHEMA_FLAT] (state, { rootSchema }) {
    state.flatSchemas = flattenSchema(rootSchema)
  },

  // 添加全局schema，会重新修改store中model数据
  [types.$ROOT_SCHEMA_SET] (state, { rootSchema }) {
    const { flatWidgets } = this.getters
    const model = {} // 最终值
    const defaultModel = {} // 根据schema实例定义的默认值
    const _rootSchema = new RootSchema({ schema: rootSchema, widgets: flatWidgets })

    // fix logic field
    _rootSchema.logics.map(logic => {
      logic.trigger = logic.trigger || 'prop'
      logic.script = logic.script || ''
      logic.relation = logic.relation || 'or'
    })

    // 初始化 model
    state.rootSchema = Object.assign({}, state.rootSchema, _rootSchema)
    this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: state.rootSchema })

    // 初始化必要的api数据
    const usedDictAPI = {}
    for (const key in state.flatSchemas) {
      const opt = state.flatSchemas[key].option || {}
      if (
        opt.type === 'dict' &&
        opt.dict &&
        opt.dict.dict &&
        opt.dict.type === 'dict' &&
        opt.dict.dictAPI
      ) {
        const dictName = opt.dict.dict
        if (usedDictAPI[dictName]) {
          if (usedDictAPI[dictName].indexOf(opt.dict.dictAPI) === -1) {
            usedDictAPI[dictName].push(opt.dict.dictAPI)
          }
        } else {
          usedDictAPI[dictName] = [opt.dict.dictAPI]
        }
      }
    }

    // 初始化schema store
    const schemaStore = jsonClone(rootSchema.store || {})
    schemaStore.current = { type: '', dict: {}, api: {} }
    schemaStore.apis = (schemaStore.apis || []).map(api => {
      const ins = new API(api)
      ins.getData()
      return ins
    })
    schemaStore.dicts = (schemaStore.dicts || []).map(dict => {
      const ins = new Dict(dict)
      ins.getData().then(() => {
        if (!isArray(usedDictAPI[ins.name])) return
        usedDictAPI[ins.name].forEach(dictAPI => {
          for (let i = 0; i < ins.data.length; i++) {
            const item = ins.data[i]
            if (item.name !== dictAPI) continue
            const apiIns = item instanceof API ? item : new API(item)
            apiIns.getData()
            ins.data.splice(i, 1, apiIns)
          }
        })
      })
      return ins
    })

    state.store = schemaStore

    this.commit(types.$RULE_INIT, { rootSchema: state.rootSchema })

    // 遍历schema获取model默认值
    for (const i in state.flatSchemas) {
      const schema = state.flatSchemas[i]
      // 特殊默认值需要处理，尤其动态时间值
      defaultModel[i] = cleanDefaultValue(schema)
      if (!(i in state.model)) {
        // 容器widget不保留model值
        if (schema.container) {
          continue
        }
        const type = getWidgetType(flatWidgets, schema.widget)
        const widgetModel = getWidgetModel(type, schema, typeBuilder) // 缺省值

        Object.assign(model, widgetModel, defaultModel)
      }
    }
    this.commit(types.$MODEL_SET, { model })
    this.commit(types.$WIDGET_DEFAULT_PROPS_UPDATE)
  }
}
