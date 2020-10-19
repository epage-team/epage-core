import EventLogic from './EventLogic'
import ValueLogic from './ValueLogic'

export default class Logic {
  constructor (defaults) {
    this.defaults = defaults || {}
    this.map = {
      event: new EventLogic(),
      value: new ValueLogic()
    }
  }

  /**
   * compare the difference between logic value and model value
   * @param {Array} valueLogics list for value logics
   * @param {Object} model form data
   */
  diffValueLogics (valueLogics, model, valueTypes) {
    const patches = []
    const scripts = []

    for (let j = 0; j < valueLogics.length; j++) {
      const logic = valueLogics[j]
      const valueType = valueTypes[logic.key]
      const valueValidator = this.map.value.map[logic.action]
      const validation = valueValidator.validator(model[logic.key], logic.value, { logic, valueType })

      if (!valueValidator) continue
      if (!validation) continue
      // should be the same key
      if (!(logic.key in model)) continue
      
      switch (logic.trigger) {
        case 'script':
          logic.script && scripts.push(logic.script)
          break
        case 'prop':
          const patch = {}

          for (let k = 0; k < logic.effects.length; k++) {
            const effect = logic.effects[k]
            const props = {}

            if (!this.checkEffect(effect, logic.key)) continue

            effect.properties.forEach(_ => {
              props[_.key] = _.value
            })
            patch[effect.key] = props
          }
          Object.keys(patch).length && patches.push(patch)
          break
        default:
          break
      }

    }
    return { patches, scripts }
  }

  /**
   * compare the difference between logic event and real event
   * @param {Array} eventLogics list for value logics
   * @param {String} eventType event type like on-click. should start with on-
   */
  diffEventLogics (eventLogics, eventType) {
    const patches = []
    const scripts = []

    for (let i = 0; i < eventLogics.length; i++) {
      const logic = eventLogics[i]

      switch (logic.trigger) {
        case 'script':
          logic.script && scripts.push(logic.script)
          break
        case 'prop':
          const patch = {}
          // get event type: on-click => click
          if (logic.action !== eventType.slice(3)) continue

          for (let j = 0; j < logic.effects.length; j++) {
            const effect = logic.effects[j]
            const props = {}

            if (!this.checkEffect(effect, logic.key)) continue

            effect.properties.forEach(_ => {
              props[_.key] = _.value
            })
            patch[effect.key] = props
          }

          Object.keys(patch).length && patches.push(patch)
          break
        default:
          break
      }
    }

    return { patches, scripts }
  }

  /**
   * apply properties to schema
   * @param {Object} flatSchemas flated schema like { 'ksddf': { widget: 'input', ...}}
   * @param {Array} patches properties that should be updated
   */
  applyPatches (flatSchemas, patches = []) {
    const propsMerged = {}
    patches.forEach(patch => {
      for (const key in patch) {
        if (!(key in flatSchemas)) continue
        propsMerged[key] = propsMerged[key] || {}
        Object.assign(propsMerged[key], patch[key])
      }
    })

    const result = Object.assign({}, this.defaults, propsMerged)
    for (const key in result) {
      Object.assign(flatSchemas[key], this.defaults[key], result[key])
    }
  }

  /**
   * check the validity of the effect
   * @param {Object} effect affected properties
   * @param {String} key schema key
   */
  checkEffect (effect, key) {
    return effect.key && key !== effect.key && Array.isArray(effect.properties)
  }
}
