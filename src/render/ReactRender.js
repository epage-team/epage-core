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
    this.component = component
    this.callPlugin = callPlugin || (() => 0)

    const React = require('react').default
    this.formRef = React.createRef()

    usePlugins(Vue, [Vuex])
    this.callPlugin('render', 'init', { Vue, ctx: this })

    if (store) {
      this.store = store
      this.$$origin = this.render()
    } else {
      this.store = new Store({ Rule: CustomRule || Rule })
      if (isArray(widgets)) {
        this.store.initWidgets(widgets)
        if (isPlainObject(schema)) {
          this.store.initRootSchema(schema)
        }
        this.$$origin = this.render()
      } else {
        console.error('widgets must be an array')
      }
    }
    this.on = component.on
    this.off = component.off
  }

  validateFields () {
    return new Promise((resolve, reject) => {
      return this.formRef.current
        .validateFields(...arguments)
        .then(values => {
          resolve(true)
        })
        .catch(err => {
          resolve({ err })
        })
    })
  }

  resetFields () {
    return new Promise((resolve, reject) => {
      this.formRef.current.resetFields()
      resolve(true)
    })
  }

  render (option = {}) {
    const { el, store, mode, formRef, component } = this
    const props = {
      store,
      mode: option.mode || mode,
      formRef,
      onSubmit: this.onSubmit
    }
    this.callPlugin('render', 'beforeCreate', { ctx: this })
    const ReactDOM = require('react-dom').default
    const React = require('react').default
    const ins = ReactDOM.render(
      React.createElement(component, { ...props }),
      el
    )
    this.callPlugin('render', 'created', { ctx: this, ins })
    return ins
  }

  destrory () {
    const ReactDOM = require('react-dom').default
    if (this.$$origin && isFunction(this.$$origin.$destroy)) {
      this.callPlugin('render', 'beforeDestroy', { ctx: this })
      ReactDOM.unmountComponentAtNode(this.el)
      // this.$$origin.$off()
      // if(!this.el.contains(this.$$origin.$el)) return
      // this.el.removeChild(this.$$origin.$el)
      this.callPlugin('render', 'destroyed', { ctx: this })
    }
  }
}
