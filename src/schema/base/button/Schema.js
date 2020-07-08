import BaseSchema from '../../BaseSchema'

export default class ButtonSchema extends BaseSchema {
  constructor (props) {
    super()
    this.disabled = false
    this.option = {
      text: '提交',
      // 按钮类型：primary、dashed、text、default
      type: 'primary',
      // 按钮图标
      icon: '',
      // 是否通栏
      long: false,
      // 是否幽灵按钮
      ghost: false,
      // 形状，可选 'square': 方角；'circle': 圆角
      shape: 'square'
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(ButtonSchema, {
  title: '按钮',
  widget: 'button',
  icon: 'social-youtube-outline',
  logic: {
    value: null,
    event: ['click']
  }
})
