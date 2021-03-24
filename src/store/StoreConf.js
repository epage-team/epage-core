import types from './types'
import { defaultSchema } from '../constant'
import RootSchema from '../schema/RootSchema'
import {
  isFunction,
  isArray
} from '../helper'
/* eslint no-unused-vars: 0 */
import Rule from '../rule'
import mutations from './mutations'

const rootSchema = new RootSchema()
const selectedSchema = defaultSchema()

export default class StoreConf {
  constructor (option) {
    const { Rule } = option || {}
    return {
      state: {
        // 设计模式下当前tab，可选 design | preview
        tab: '',
        mode: 'edit',
        selectedSchema,
        rootSchema,
        model: {},
        widgets: [],
        // 拍平所有schema
        flatSchemas: {},
        // 拍平所有规则
        flatRules: {},
        // 运行时状态
        // { [key]: { hide: false, readonly: false }}
        defaults: {},
        store: {
          baseURL: '',
          current: {
            // 当前 new | static | dynamic
            // type: 'static',
            type: '', // dict | api 表示当前选择的类型
            dict: {
              index: -1, // selected dict index
              value: {}
            },
            api: {
              index: -1, // selected api index
              value: {}
            }
          },
          dicts: [],
          apis: []
        }
      },
      getters: {
        isSelected: state => !!state.selectedSchema.key,
        flatWidgets: ({ widgets }) => {
          const serialized = {}
          if (!isArray(widgets)) {
            return serialized
          }
          widgets.forEach(item => {
            if (!isArray(item.widgets)) {
              return
            }
            item.widgets.forEach(w => {
              if (isFunction(w.Schema)) {
                serialized[w.Schema.widget] = w
              }
            })
          })
          return serialized
        },

        settingWidget: (state, getters) => {
          const { widget: widgetName, key } = state.selectedSchema
          const widget = getters.flatWidgets[widgetName] || null

          if (!key || !widget || !widget.Setting) return null

          return isArray(widget.Setting)
            ? [...widget.Setting]
            : { ...widget.Setting }
        },

        // widget schema 声明需要哪些规则validator
        widgetsValidators: (state, { flatWidgets }) => {
          const map = {}
          for (const i in flatWidgets) {
            const { Schema } = flatWidgets[i]
            if (!isFunction(Schema) || !isArray(Schema.validators)) {
              continue
            }
            map[i] = []
            Schema.validators.forEach(validator => {
              const val = Rule.rules[validator]

              if (!val) {
                return console.log(`validator ${validator} is not exist`)
              }
              map[i].push(val)
            })
          }
          return map
        }
      },
      mutations: {
        [types.$TAB_UPDATE] (state, { tab }) {
          if (tab && typeof tab === 'string') {
            state.tab = tab
          }
        },

        // 添加表单展示模式
        [types.$MODE_CHANGE] (state, { mode }) {
          state.mode = mode
        },

        ...mutations.model,
        ...mutations.schema,
        ...mutations.widget,
        ...mutations.rule,
        ...mutations.logic,
        ...mutations.store,
        ...mutations.style
      },
      actions: {},
      modules: {}
    }
  }
}
