/**
 * 解析背景样式
 */
export default class Background {
  constructor(background) {
    const {
      position,
      repeat,
      size,
      image,
      attachment
    } = background || {}

    this.position = position || 'top'
    this.repeat = repeat || 'no-repeat' // 'no-repeat' | 'repeat-x' | 'repeat-y'
    this.size = size || 'contain' // 'cover' | 'contain'
    // this.color = color || '' // 'cover' | ''
    this.image = image || '' // 'cover' | ''
    this.attachment = attachment || 'scroll' // 'scroll' | 'fixed'
  }
  toString() {
    const {
      position,
      repeat,
      size,
      image,
      attachment
    } = this
    const img = image ? ` ${repeat} ${position} /${size} ${attachment} url(${image})` : ''

    return `${img}`
  }
}
