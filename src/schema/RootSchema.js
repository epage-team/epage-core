import Schema from './base/grid/Schema'

/**
 * root schema
 */
export default class RootSchema extends Schema {
  constructor (props) {
    super()
    this.title = ''
    this.description = ''
    this.size = 'default'
    this.container = true
    this.children = [{
      span: 24,
      list: []
    }]
    this.logics = []
    // global setting for label
    this.label = {
      width: 80,
      position: 'right',
      colon: false
    }
    this.style = {
      'margin-top': '0%',
      'margin-right': 'auto',
      'margin-bottom': '0%',
      'margin-left': 'auto',
      'padding-top': '0%',
      'padding-right': '0%',
      'padding-bottom': '0%',
      'padding-left': '0%',
      'background-color': '',
      'background-image': '',
      'background-size': '',
      'background-repeat': '',
      'background-position': '',
      'max-width': '1600px',
      'min-width': '800px'
    }

    this.create(props)
    this.createChildren(props)
  }
}
