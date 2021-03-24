import types from '../types'
import { defaultSchema, defaultProps } from '../../constant'
import Logic from '../../logic'
import Rule from '../../rule'
import TypeBuilder from '../TypeBuilder'
import {
  flattenSchema,
  isFunction,
  isArray,
  include,
  getParentListByKey,
  getIndexByKey,
  getRootSchemaChildren,
  getWidgetType,
  isNotEmptyString,
  getWidgetModel,
  updateRequiredRule,
  convertNameModelToKeyModel,
  getDefaults
} from '../../helper'

const typeBuilder = new TypeBuilder()

export default {
  // 配置供展示的所有widget列表
  [types.$WIDGETS_SET] (state, { widgets }) {
    state.widgets = widgets
  },

  // 更新所有widget默认属性，在new Render时调用
  [types.$WIDGET_DEFAULT_PROPS_UPDATE] (state) {
    state.defaults = getDefaults(state.flatSchemas, defaultProps())
  },

  // value logic改变影响 widget 属性改变
  [types.$WIDGET_UPDATE_BY_VALUE_LOGIC] (state, { model, callback }) {
    const { flatSchemas } = state
    const valueTypes = {}
    Object.keys(model || {}).forEach(k => { valueTypes[k] = flatSchemas[k].type })
    const valueLogics = state.rootSchema.logics.filter(logic => logic.key && logic.type === 'value')
    const logic = new Logic(state.defaults)
    const { patches, scripts } = logic.diffValueLogics(valueLogics, model, valueTypes)
    const controlledKeys = []

    for (const key in model) {
      valueLogics.filter(logic => logic.key === key).map(logic => {
        logic.effects.forEach(effect => {
          if (controlledKeys.indexOf(effect.key) === -1) {
            controlledKeys.push(effect.key)
          }
        })
      })
    }

    logic.applyPatches(state.flatSchemas, patches, controlledKeys)
    isFunction(callback) && callback(scripts)
  },

  // event logic改变影响 widget 属性改变
  [types.$WIDGET_UPDATE_BY_EVENT_LOGIC] (state, { key, eventType, callback }) {
    // key 为当前触发的widget key
    const eventLogics = state.rootSchema.logics.filter(logic => logic.key === key && logic.type === 'event')
    const logic = new Logic(state.defaults)
    const { patches, scripts } = logic.diffEventLogics(eventLogics, eventType)
    const controlledKeys = []
    eventLogics.forEach(logic => {
      if (logic.key === key) {
        logic.effects.forEach(effect => {
          if (controlledKeys.indexOf(effect.key) === -1) {
            controlledKeys.push(effect.key)
          }
        })
      }
    })

    logic.applyPatches(state.flatSchemas, patches, controlledKeys)
    isFunction(callback) && callback(scripts)
  },

  // 设计模式向表单添加一个widget，schema为此widget对应的默认schema
  // 目前默认添加到整个表单最后
  [types.$WIDGET_ADD] (state, { widget }) {
    const { selectedSchema, rootSchema } = state
    const { flatWidgets, isSelected } = this.getters
    const WidgetSchema = flatWidgets[widget].Schema

    if (!isFunction(WidgetSchema)) {
      return console.error('Schema should be a constructor')
    }

    let childrenSchema = []
    const newSchema = new WidgetSchema({ widgets: flatWidgets })
    if (isSelected) {
      childrenSchema = getParentListByKey(selectedSchema.key, rootSchema)
      const index = getIndexByKey(selectedSchema.key, childrenSchema)
      childrenSchema.splice(index + 1, 0, newSchema)
    } else {
      childrenSchema = getRootSchemaChildren(rootSchema)
      childrenSchema.push(newSchema)
    }
    this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: Object.assign({}, rootSchema) })
    this.commit(types.$RULE_INIT, { rootSchema: Object.assign({}, rootSchema) })

    const type = getWidgetType(flatWidgets, newSchema.widget)
    const model = getWidgetModel(type, newSchema, typeBuilder)
    this.commit(types.$MODEL_SET, { model })
    state.selectedSchema = newSchema
  },

  [types.$WIDGET_DYNAMIC_ADD] (state, { key }) {
    const widgets = this.getters.flatWidgets
    const { flatSchemas } = state
    const currentSchema = flatSchemas[key]
    const WidgetSchema = widgets[currentSchema.widget].Schema
    const schema = Object.assign({}, currentSchema, { list: [], dynamic: false })
    const newSchema = new WidgetSchema({ schema, widgets, clone: true, dynamic: true })
    // 动态添加的子schema不能为dynamic
    newSchema.dynamic = false
    const flatedSchema = flattenSchema(newSchema)
    const flatedRules = new Rule(newSchema).rules

    currentSchema.list.push(newSchema)
    const newSchemas = {
      [newSchema.key]: newSchema,
      ...flatedSchema
    }
    state.flatSchemas = Object.assign({}, state.flatSchemas, newSchemas)
    state.flatRules = Object.assign({}, state.flatRules, { ...flatedRules, [newSchema.key]: newSchema.rules })

    // 初始默认值即可，获取表单数据通过方法组装嵌套格式
    const model = {}
    if (!isArray(state.model[key])) {
      model[key] = []
    }
    // 新建的schema及可能的子孙schema
    for (const k in newSchemas) {
      const { type, key } = newSchemas[k]
      const builder = typeBuilder.types[type]
      if (type && isFunction(builder)) {
        model[key] = builder()
      }
    }
    state.model = Object.assign({}, state.model, model)
  },

  [types.$WIDGET_DYNAMIC_REMOVE] (state, { key, index }) {
    const { flatSchemas, flatRules, model } = state
    const currentSchema = flatSchemas[key]
    const removedSchema = currentSchema.list.splice(index, 1)[0]
    const { key: skey } = removedSchema

    delete flatSchemas[skey]
    delete flatRules[skey]
    delete model[skey]
    state.flatSchemas = Object.assign({}, flatSchemas)
    state.flatRules = Object.assign({}, flatRules)
    state.model = Object.assign({}, model)
  },

  // 设计模式复制一个widget
  [types.$WIDGET_COPY] (state, { key }) {
    const { flatSchemas, rootSchema } = state
    const schema = flatSchemas[key]
    const { flatWidgets } = this.getters
    const WidgetSchema = flatWidgets[schema.widget].Schema
    const parentList = getParentListByKey(key, rootSchema)
    const index = getIndexByKey(key, parentList)
    const newSchema = new WidgetSchema({ schema, widgets: flatWidgets, clone: true })

    parentList.splice(index + 1, 0, newSchema)
    this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: Object.assign({}, rootSchema) })
    this.commit(types.$RULE_INIT, { rootSchema: Object.assign({}, rootSchema) })

    // set default value
    const type = getWidgetType(flatWidgets, newSchema.widget)
    const model = getWidgetModel(type, newSchema, typeBuilder)
    this.commit(types.$MODEL_SET, { model })

    // set selectedSchema
    state.selectedSchema = newSchema
  },

  // 设计模式删除一个widget
  [types.$WIDGET_REMOVE] (state, { key }) {
    const parentList = getParentListByKey(key, state.rootSchema)
    const index = getIndexByKey(key, parentList)
    const model = Object.assign({}, state.model)

    if (isNotEmptyString(key)) {
      delete model[key]
      state.model = model
    }
    parentList.splice(index, 1)
    this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: Object.assign({}, state.rootSchema) })
    this.commit(types.$RULE_INIT, { rootSchema: Object.assign({}, state.rootSchema) })
    this.commit(types.$WIDGET_DESELECT)
  },

  // 设计模式修改选中一个widget的type(返回值类型)
  [types.$WIDGET_TYPE_UPDATE] ({ model, flatSchemas }, { key, type }) {
    const schema = flatSchemas[key]
    const { widget } = schema
    const { flatWidgets } = this.getters
    const widgetType = getWidgetType(flatWidgets, widget)
    const WidgetSchema = flatWidgets[widget].Schema

    if (!widgetType || !type) {
      return
    }

    updateRequiredRule(schema, WidgetSchema, { type: TypeBuilder.resolve(type, true) })
    if (!isArray(widgetType)) {
      schema.type = type
      return
    }
    if (!include(widgetType, type)) {
      return console.warn(`${type}不是widget(${widget})值类型`)
    }

    schema.type = type
    const value = model[key]
    if (include(type, 'array')) {
      if (isArray(value)) {
        return
      }
      // model[key] = [value]
      model[key] = []
    } else {
      const builder = typeBuilder.types[type]
      if (isArray(value) && isFunction(builder)) {
        model[key] = builder()
      }
    }
  },

  // 修改widget的option
  [types.$WIDGET_OPTION_UPDATE] ({ flatSchemas }, { key, option }) {
    const schema = flatSchemas[key]

    if (!schema || !option) {
      return
    }
    schema.option = Object.assign({ ...schema.option }, option)
  },

  // 修改表单类型widget默认值
  [types.$WIDGET_DEFAULT_UPDATE] ({ flatSchemas }, { defaults, useName }) {
    let keyModel = defaults
    if (useName) {
      keyModel = convertNameModelToKeyModel(defaults, flatSchemas)
    }
    const keys = Object.keys(keyModel).filter(key => !!flatSchemas[key])
    keys.forEach(key => {
      flatSchemas[key].default = keyModel[key]
    })
  },

  // 设计模式选中一个widget
  [types.$WIDGET_SELECT] (state, { key }) {
    const schema = state.flatSchemas[key]
    const isSameWidget = state.selectedSchema.key === key

    if (state.tab !== 'design' || isSameWidget || !schema) {
      return
    }
    state.selectedSchema = schema
  },

  // 设计模式取消选中一个widget
  [types.$WIDGET_DESELECT] (state) {
    state.selectedSchema = defaultSchema()
  },

  // 设计模式为选中widget的可变列表属性，执行添加操作
  [types.$WIDGET_CHILD_ADD] ({ flatSchemas }, { key, index, child }) {
    const schema = flatSchemas[key]

    schema.children.splice(index + 1, 0, child)
  },

  // 设计模式为选中widget的可变列表属性，执行删除操作
  [types.$WIDGET_CHILD_REMOVE] ({ flatSchemas }, { key, index }) {
    const schema = flatSchemas[key]

    schema.children.splice(index, 1)
  },

  // 设计模式为选中widget的可变列表属性，执行移动操作
  [types.$WIDGET_CHILD_MOVE] ({ flatSchemas }, { key, preIndex, index }) {
    const schema = flatSchemas[key]
    const children = [...schema.children]

    children.splice(preIndex, 1, ...children.splice(index, 1, children[preIndex]))
    schema.children = children
  }
}
