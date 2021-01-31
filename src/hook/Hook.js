// Hook基础类
export default class Hook {
  constructor () {
    this.tasks = []
  }
  call () {}
  tap (cb) {
    if (typeof cb !== 'function') return
    this.tasks.push(cb)
  }
}
