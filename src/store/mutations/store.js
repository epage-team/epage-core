import types from '../types'
import Dict from '../Dict'
import API from '../API'
import {
  jsonClone,
  storeFetchClean
} from '../../helper'

export default {
  // 选中STORE中dict
  [types.$STORE_DICT_SELECT] ({ store }, { dict, index, action }) {
    store.current.dict.value = jsonClone(dict)
    store.current.dict.index = index
    store.current.dict.action = action
    store.current.type = 'dict'
    store.current.api = {}
  },

  // 更新dict
  [types.$STORE_DICT_UPDATE] ({ store, rootSchema }, { dict, index }) {
    const instance = new Dict(jsonClone(dict))
    instance.getData()
    store.dicts.splice(index, 1, instance)
    rootSchema.store.dicts = storeFetchClean(store.dicts)
  },

  // 添加dict
  [types.$STORE_DICT_ADD] ({ store, rootSchema }, { dict }) {
    const matched = store.dicts.filter(item => item.name === dict.name)
    if (matched.length === 0) {
      const instance = new Dict(jsonClone(dict))
      instance.getData()
      store.dicts.push(instance)
      store.current.dict.index = store.dicts.length - 1
      store.current.dict.action = 'update'
      rootSchema.store.dicts = storeFetchClean(store.dicts)
    }
  },

  // 更新dict
  [types.$STORE_DICT_DELETE] ({ store, rootSchema }, { index }) {
    const currentIndex = store.current.dict.index
    if (currentIndex === index) {
      store.current.type = ''
      store.current.dict = {
        index: -1,
        value: {},
        action: ''
      }
    } else if (currentIndex > index) {
      store.current.dict.index--
    }
    store.dicts.splice(index, 1)
    rootSchema.store.dicts = storeFetchClean(store.dicts)
  },
  // 复制dict
  [types.$STORE_DICT_COPY] ({ store, rootSchema }, { index }) {
    const dict = jsonClone(store.dicts[index] || {})
    do {
      dict.name += '_copy'
    } while (store.dicts.filter(item => item.name === dict.name).length > 0)

    const newDict = new Dict(dict)
    newDict.getData()
    store.dicts.splice(index + 1, 0, newDict)
    rootSchema.store.dicts = storeFetchClean(store.dicts)
  },
  // 选中STORE中api
  [types.$STORE_API_SELECT] ({ store }, { api, index, dictIndex }) {
    const action = dictIndex >= 0
      ? ''
      : (
        index >= 0
          ? 'update'
          : 'create'
      )
    store.current.api = {
      value: jsonClone(api),
      index,
      action
    }
    store.current.type = 'api'
    store.current.dict = { index: dictIndex }
  },

  // 更新api
  [types.$STORE_API_UPDATE] ({ store, rootSchema }, { api, index }) {
    const instance = new API(jsonClone(api))
    instance.getData()
    store.apis.splice(index, 1, instance)
    rootSchema.store.apis = storeFetchClean(store.apis)
  },

  // 添加api
  [types.$STORE_API_ADD] ({ store, rootSchema }, { api }) {
    const matched = store.apis.filter(item => item.name === api.name)
    if (matched.length === 0) {
      const instance = new API(jsonClone(api))
      instance.getData()
      store.apis.push(instance)
      store.current.api.index = store.apis.length - 1
      store.current.api.action = 'update'
      store.current.dict = {
        index: -1,
        value: {},
        action: ''
      }
      rootSchema.store.apis = storeFetchClean(store.apis)
    }
  },

  // 删除api
  [types.$STORE_API_DELETE] ({ store, rootSchema }, { index }) {
    const currentIndex = store.current.api.index
    if (currentIndex === index) {
      store.current.type = ''
      store.current.api = {
        index: -1,
        value: {},
        action: ''
      }
    } else if (currentIndex > index) {
      store.current.api.index--
    }
    store.apis.splice(index, 1)
    rootSchema.store.apis = storeFetchClean(store.apis)
  },
  // 复制api
  [types.$STORE_API_COPY] ({ store, rootSchema }, { index }) {
    const api = jsonClone(store.apis[index] || {})
    do {
      api.name += '_copy'
    } while (store.apis.filter(item => item.name === api.name).length > 0)

    const newAPI = new API(api)
    newAPI.getData()
    store.apis.splice(index + 1, 0, newAPI)
    rootSchema.store.apis = storeFetchClean(store.apis)
  }
}
