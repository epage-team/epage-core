import Vue from 'vue'
import Vuex from 'vuex'
import Rule from '../rule'
import Store from '../store'
import {
  isArray,
  isFunction,
  isPlainObject,
  usePlugins
} from '../helper'

export default class Render {
  constructor (option) {
    const {
      el,
      store,
      widgets = [],
      mode,
      schema,
      component,
      Rule: CustomRule,
      callPlugin
    } = option

    this.el = el
    this.mode = mode || 'edit'
    this.$$origin = null
    this.store = null
    // 优先自定义组件渲染
    this.component = component || null
    this.callPlugin = callPlugin || (() => 0)
    usePlugins(Vue, [Vuex])
    this.callPlugin('render', 'init', { Vue, ctx: this })
    // 设计模式下，状态共享epage设计器内store
    if (store) {
      this.store = store
      this.$$origin = this.render()
      this.callPlugin('render', 'created', { ctx: this })
    } else {
      this.store = new Store({ Rule: CustomRule || Rule })
      if (isArray(widgets)) {
        this.store.initWidgets(widgets)
        if (isPlainObject(schema)) {
          this.store.initRootSchema(schema)
        }
        this.$$origin = this.render()
        this.callPlugin('render', 'created', { ctx: this })
      } else {
        console.error('widgets must be an array')
      }
    }
    this.on = component.on
    this.off = component.off
  }

  validateFields () {
    const { $children } = this.$$origin

    if (isArray($children) && $children[0]) {
      return $children[0].validateFields(...arguments)
    }
  }

  resetFields () {
    const { $children } = this.$$origin

    if (isArray($children) && $children[0]) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve($children[0].resetFields())
        }, 0)
      })
    }
  }

  render (option = {}) {
    const { el, store, mode, component } = this
    const extension = { store, $render: this, mode: option.mode || mode }
    const root = document.createElement('div')

    el.appendChild(root)
    this.callPlugin('render', 'beforeCreate', { ctx: this })

    const ins = new Vue({
      extension,
      el: root,
      render: h => h(component)
    })

    return ins
  }

  destroy () {
    if (this.$$origin && isFunction(this.$$origin.$destroy)) {
      this.callPlugin('render', 'beforeDestroy', { ctx: this })
      this.$$origin.$destroy()
      this.$$origin.$off()
      if (!this.el.contains(this.$$origin.$el)) return
      this.el.removeChild(this.$$origin.$el)
      this.callPlugin('render', 'destroyed', { ctx: this })
    }
  }
}
