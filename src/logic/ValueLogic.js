import Effect from './Effect'

export default class ValueLogic {
  constructor () {
    const booleanMap = { true: true, false: false }
    function isSameArray (arr1, arr2, matchedType) {
      if (!Array.isArray(arr1)) return false
      if (!Array.isArray(arr2)) return false
      const _arr1 = arr1.map(v => matchedType === 'number' ? parseFloat(v) : v)
      const _arr2 = arr2.map(v => matchedType === 'number' ? parseFloat(v) : v)

      if (_arr1.length !== _arr2.length) return false

      let result = true
      for (let i = 0; i < _arr1.length; i++) {
        if (_arr1[i] !== _arr2[i]) {
          result = false
          break
        }
      }
      return result
    }
    const resolveArrayType = type => {
      const matched = (type || '').match(/^array(?:<(.+)>)?/)
      if (matched && matched[1]) {
        return matched[1]
      }
    }
    const resolveValue = (value, type) => {
      return (value || '')
        .split(',')
        .map(v => v.trim())
        .filter(_ => _)
        .map(v => {
          if (type === 'number') {
            v = parseFloat(v)
          } else if (type === 'boolean') {
            v = booleanMap[v]
          }
          return v
        })
    }
    const include = (arr = [], v) => arr.indexOf(v) > -1
    const relationFn = {
      or: (arr1, arr2, action) => {
        let result = false
        for (let i = 0; i < arr2.length; i++) {
          // 包含
          if (action === '<>') {
            if (include(arr1, arr2[i])) {
              result = true
              break
            }
          // 不包含
          } else if (action === '><') {
            if (!include(arr1, arr2[i])) {
              result = true
              break
            }
          }
        }
        return result
      },
      and: (arr1, arr2, action) => {
        let result = true
        for (let i = 0; i < arr2.length; i++) {
          // 包含
          if (action === '<>') {
            if (!include(arr1, arr2[i])) {
              result = false
              break
            }
          // 不包含
          } else if (action === '><') {
            if (include(arr1, arr2[i])) {
              result = false
              break
            }
          }
        }
        return result
      }
    }
    this.type = 'value'
    this.title = '逻辑'
    this.map = {
      '=': {
        key: '=',
        value: '等于',
        validator: (left, right, { valueType }) => {
          let leftValue = left
          let rightValue = right
          const matchedType = resolveArrayType(valueType)

          if (valueType === 'number') {
            leftValue = parseFloat(left)
            rightValue = parseFloat(right)

            return (isNaN(leftValue) || isNaN(leftValue)) ? false : leftValue === rightValue
          } else if (valueType === 'boolean') {
            if (right in booleanMap) {
              rightValue = booleanMap[right]
            }
          } else if (matchedType) {
            const values = resolveValue(right, matchedType)

            return isSameArray(left, values, matchedType)
          }
          return leftValue === rightValue
        }
      },
      '!=': {
        key: '!=',
        value: '不等于',
        validator: (left, right, { valueType }) => {
          let leftValue = left
          let rightValue = right
          const matchedType = resolveArrayType(valueType)

          if (valueType === 'number') {
            leftValue = parseFloat(left)
            rightValue = parseFloat(right)
            return (isNaN(leftValue) || isNaN(leftValue)) ? true : leftValue !== rightValue
          } else if (valueType === 'boolean') {
            if (right in booleanMap) {
              rightValue = booleanMap[right]
            }
          } else if (matchedType) {
            const values = resolveValue(right, matchedType)

            return !isSameArray(left, values, matchedType)
          }
          return leftValue !== rightValue
        }
      },
      '>': {
        key: '>',
        value: '大于',
        validator: (left, right) => {
          const leftValue = parseFloat(left)
          const rightValue = parseFloat(right)

          return (isNaN(leftValue) || isNaN(leftValue)) ? false : leftValue > rightValue
        }
      },
      '<': {
        key: '<',
        value: '小于',
        validator: (left, right) => {
          const leftValue = parseFloat(left)
          const rightValue = parseFloat(right)

          return (isNaN(leftValue) || isNaN(leftValue)) ? false : leftValue < rightValue
        }
      },
      '<>': {
        key: '<>',
        value: '包含',
        validator: (left, right, { logic, valueType }) => {
          let result = false
          const matchedType = resolveArrayType(valueType)
          const { relation } = logic
          const values = resolveValue(right, matchedType)

          if (relation in relationFn) {
            result = relationFn[relation](left, values, '<>')
          }
          return result
        }
      },
      '><': {
        key: '><',
        value: '不包含',
        validator: (left, right, { logic, valueType }) => {
          let result = false
          const matchedType = resolveArrayType(valueType)
          const { relation } = logic
          const values = resolveValue(right, matchedType)

          if (relation in relationFn) {
            result = relationFn[relation](left, values, '><')
          }
          return result
        }
      }
    }
  }

  get () {
    return {
      type: 'value',
      key: '',
      action: '',
      value: '',
      relation: 'or', // or | and 或关系 | 且关系
      trigger: 'prop', // prop | script
      script: '',
      effects: [new Effect()]
    }
  }
}
