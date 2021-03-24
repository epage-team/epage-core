
export default class JSONRule {
  static get type () {
    return 'json'
  }

  static get name () {
    return 'JSON'
  }

  constructor (rule = {}) {
    const defaultRule = {
      type: 'string',
      message: '非法的json格式!'
    }
    this.origin = Object.assign({}, defaultRule, rule)
    this.rule = {
      type: 'string',
      trigger: 'blur',
      validator: function (rule, value, callback) {
        if (!value || !(value + '').trim()) {
          return callback()
        }
        try {
          JSON.parse(value)
          callback()
        } catch (e) {
          return callback(new Error(rule.message))
        }
      },
      message: '非法的json格式!'
    }
    this.update(this.origin)
  }

  update (rule) {
    if (rule) {
      this.rule.message = rule.message
      Object.assign(this.origin, rule)
    }
  }
}
