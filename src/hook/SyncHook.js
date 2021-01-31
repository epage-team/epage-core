import Hook from './Hook'
// 串行同步
export default class SyncHook extends Hook {
  constructor () {
    super()
  }
  call (...args) {
    this.tasks.forEach(hook => hook(...args))
  }
}
