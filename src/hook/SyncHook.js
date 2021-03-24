import Hook from './Hook'
// 串行同步
export default class SyncHook extends Hook {
  constructor () {
    super()
    this.tasks = []
  }

  call (...args) {
    this.tasks.forEach(hook => hook(...args))
  }
}
