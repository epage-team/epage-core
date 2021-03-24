import BaseSchema from '../../BaseSchema'

export default class TextSchema extends BaseSchema {
  constructor (props) {
    super()
    this.option = {
      content: ''
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(TextSchema, {
  title: '文本',
  widget: 'text',
  preview: ''
})
