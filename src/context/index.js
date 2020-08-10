import { isPlainObject } from '../helper'

export default class Context {
  constructor (props = {}) {
    this.store = props.store
    this.state = Object.assign({}, props.state)
    this.$el = props.$el
    this.$render = props.$render
    this.instance = props.instance
  }

  setState (state) {
    return new Promise((resolve, reject) => {
      if (isPlainObject(state)) {
        const newState = {}
        for (const i in state) {
          if (i in this.state) {
            newState[i] = state[i]
          }
        }
        Object.assign(this.instance, newState)
        resolve()
      } else {
        reject(new Error('state should be plain object!'))
      }
    })
  }
}
