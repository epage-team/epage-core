import types from '../types'
import Rule from '../../rule'
import {
  isFunction,
  isArray,
  updateRequiredRule
} from '../../helper'

export default {
  [types.$RULE_INIT] (state, { rootSchema }) {
    state.flatRules = new Rule(rootSchema).rules
  },
  // 设计模式为选中widget修改规则类型
  [types.$RULE_TYPE_UPDATE] ({ flatRules, flatSchemas }, { key, type, index }) {
    const schema = flatSchemas[key]
    const { widgetsValidators } = this.getters
    const widgetValidators = widgetsValidators[schema.widget]

    if (!isArray(widgetValidators)) {
      return
    }
    const Rule = widgetValidators.find(v => v.type === type)
    if (!isFunction(Rule)) {
      return
    }
    const newRule = new Rule().rule
    const currentRules = flatRules[key]
    const originRules = [...schema.rules]

    currentRules.splice(index, 1, newRule)
    originRules.splice(index, 1, { message: newRule.message, type })
    schema.rules = originRules
  },

  [types.$RULE_REQUIRED_RULE_UPDATE] ({ flatRules, flatSchemas }, { key, rule }) {
    const schema = flatSchemas[key]
    const WidgetSchema = this.getters.flatWidgets[schema.widget].Schema

    updateRequiredRule(schema, WidgetSchema, rule)
  },

  // 设计模式为选中widget修改规则错误消息
  [types.$RULE_MESSAGE_UPDATE] ({ flatRules }, { key, index, message }) {
    const currentRules = flatRules[key]

    if (!isArray(currentRules)) {
      return
    }
    currentRules[index].message = message
  },

  // 设计模式为选中widget添加规则
  [types.$RULE_ADD] ({ flatSchemas }, { key }) {
    const schema = flatSchemas[key]
    const defaultRule = { type: '', message: '' }

    schema.rules.push(defaultRule)
  },

  // 设计模式为选中widget删除规则
  [types.$RULE_REMOVE] ({ flatRules, flatSchemas }, { key, index }) {
    const schema = flatSchemas[key]
    const rules = flatRules[key]

    schema.rules.splice(index, 1)
    if (!rules) {
      return
    }
    rules.splice(index, 1)
  }
}
