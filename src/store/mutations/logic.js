import types from '../types'
import {
  isArray
} from '../../helper'

export default {
  // 逻辑模式添加一个逻辑规则
  [types.$LOGIC_ADD] ({ rootSchema }, { logic }) {
    if (isArray(rootSchema.logics)) {
      rootSchema.logics.push(logic)
    } else {
      rootSchema.logics = [logic]
    }
  },

  // 逻辑模式更新一个逻辑规则
  [types.$LOGIC_UPDATE] ({ rootSchema }, { logic, index }) {
    rootSchema.logics.splice(index, 1, logic)
  },

  // 逻辑模式删除一个逻辑规则
  [types.$LOGIC_DELETE] ({ rootSchema }, { index }) {
    rootSchema.logics.splice(index, 1)
  }
}
