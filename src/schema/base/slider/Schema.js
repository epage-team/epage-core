import FormSchema from '../../FormSchema'

export default class SliderSchema extends FormSchema {
  constructor (props) {
    super()
    this.label = '滑块'
    this.default = 0
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(SliderSchema, {
  title: '滑块',
  widget: 'slider',
  preview: '',
  type: 'number',
  validators: 'number',
  logic: {
    value: ['=', '!='],
    // event: ['change']
    event: []
  }
})
