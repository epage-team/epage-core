import types from '../types'
import {
  isFunction,
  isString,
  checkValueType,
  convertNameModelToKeyModel
} from '../../helper'

export default {
  // 设置表单model，即用户填写的表单数据
  [types.$MODEL_SET] (state, { model, useName }) {
    const { flatSchemas } = state
    const { flatWidgets } = this.getters
    const _model = {}
    let keyModel = model // 以schema.key为key组成的model对象

    if (useName) {
      keyModel = convertNameModelToKeyModel(model, flatSchemas)
    }
    const conbinedModel = Object.assign({}, state.model, keyModel)

    for (const i in conbinedModel) {
      const schema = flatSchemas[i]

      if (!schema) {
        continue
      }

      const Widget = flatWidgets[schema.widget]

      if (!Widget || !isFunction(Widget.Schema)) {
        continue
      }

      if (schema.type === 'json' && !isString(conbinedModel[i])) {
        conbinedModel[i] = JSON.stringify(conbinedModel[i])
      }

      if (checkValueType(conbinedModel[i], Widget.Schema.type, schema.dynamic)) {
        _model[i] = conbinedModel[i]
      }
    }
    state.model = _model
  }
}
